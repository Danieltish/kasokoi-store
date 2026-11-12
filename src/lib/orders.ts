import { z } from "zod";

import { deliveryFeeFor } from "@/lib/pricing";
import { normalizeKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

export const ORDER_RATE_LIMIT = 10;
export const ORDER_RATE_WINDOW_MS = 10 * 60 * 1000;

export type OrderSource = "WHATSAPP" | "ONLINE";

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().min(9, "Enter a valid phone number").max(20),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  county: z.string().trim().max(60).optional(),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(500).optional(),
  deliveryZoneId: z.string().min(1, "Choose a delivery option"),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
});

export type OrderPayload = z.infer<typeof orderSchema>;

export type CreateOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; status: number; error: string };

const MAX_INT = 2_147_483_647;
const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOrderNumber() {
  let suffix = "";

  for (let index = 0; index < 6; index += 1) {
    suffix += ORDER_ALPHABET[Math.floor(Math.random() * ORDER_ALPHABET.length)];
  }

  return `KS-${suffix}`;
}

export async function recentOrderCount(phone: string) {
  return prisma.order.count({
    where: {
      phone,
      createdAt: { gte: new Date(Date.now() - ORDER_RATE_WINDOW_MS) },
    },
  });
}

export async function createOrder(
  payload: unknown,
  options: { source: OrderSource },
): Promise<CreateOrderResult> {
  const parsed = orderSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: parsed.error.issues[0]?.message ?? "Invalid order details.",
    };
  }

  const data = parsed.data;
  const phone = normalizeKenyanPhone(data.phone);

  if (!phone) {
    return {
      ok: false,
      status: 400,
      error: "Enter a valid Kenyan phone number, e.g. 0712 345 678.",
    };
  }

  const recentOrders = await recentOrderCount(phone);

  if (recentOrders >= ORDER_RATE_LIMIT) {
    return {
      ok: false,
      status: 429,
      error:
        "Too many orders from this phone number. Wait a few minutes or contact us on WhatsApp.",
    };
  }

  const quantities = new Map<string, number>();

  for (const item of data.items) {
    quantities.set(item.slug, (quantities.get(item.slug) ?? 0) + item.quantity);
  }

  for (const quantity of quantities.values()) {
    if (quantity > 99) {
      return {
        ok: false,
        status: 400,
        error: "Maximum quantity per product is 99.",
      };
    }
  }

  const slugs = [...quantities.keys()];

  const [products, zone] = await Promise.all([
    prisma.product.findMany({
      where: { slug: { in: slugs }, isActive: true },
      select: { id: true, slug: true, name: true, priceKes: true, stock: true },
    }),
    prisma.deliveryZone.findUnique({ where: { id: data.deliveryZoneId } }),
  ]);

  if (!zone || !zone.isActive) {
    return {
      ok: false,
      status: 400,
      error: "The selected delivery option is unavailable.",
    };
  }

  if (products.length !== slugs.length) {
    return {
      ok: false,
      status: 409,
      error: "Some products are no longer available. Refresh your cart.",
    };
  }

  const productBySlug = new Map(
    products.map((product) => [product.slug, product]),
  );

  const orderItems: {
    productId: string;
    name: string;
    unitPriceKes: number;
    quantity: number;
    lineTotalKes: number;
  }[] = [];

  for (const [slug, quantity] of quantities) {
    const product = productBySlug.get(slug);

    if (!product) {
      return {
        ok: false,
        status: 409,
        error: "Some products are no longer available. Refresh your cart.",
      };
    }

    if (quantity > product.stock) {
      return {
        ok: false,
        status: 409,
        error:
          product.stock > 0
            ? `Only ${product.stock} of ${product.name} left in stock.`
            : `${product.name} is out of stock.`,
      };
    }

    const lineTotalKes = product.priceKes * quantity;

    if (lineTotalKes > MAX_INT) {
      return {
        ok: false,
        status: 400,
        error: "Order total is too large. Please contact us on WhatsApp.",
      };
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      unitPriceKes: product.priceKes,
      quantity,
      lineTotalKes,
    });
  }

  const county = data.county?.trim();

  if (!zone.isPickup) {
    if (!county) {
      return {
        ok: false,
        status: 400,
        error: "Choose the county for delivery.",
      };
    }

    if (!zone.counties.includes(county)) {
      return {
        ok: false,
        status: 400,
        error: "That county is not covered by the selected delivery zone.",
      };
    }
  }

  const subtotalKes = orderItems.reduce(
    (total, item) => total + item.lineTotalKes,
    0,
  );

  if (subtotalKes > MAX_INT) {
    return {
      ok: false,
      status: 400,
      error: "Order total is too large. Please contact us on WhatsApp.",
    };
  }

  const deliveryFeeKes = deliveryFeeFor(zone, subtotalKes);
  const totalKes = subtotalKes + deliveryFeeKes;

  if (totalKes > MAX_INT) {
    return {
      ok: false,
      status: 400,
      error: "Order total is too large. Please contact us on WhatsApp.",
    };
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: data.customerName,
          phone,
          email: data.email ? data.email : null,
          county: zone.isPickup ? "Nairobi (Pickup)" : (county ?? null),
          address: zone.isPickup ? null : (data.address ?? null),
          notes: data.notes ? data.notes : null,
          deliveryZoneId: zone.id,
          subtotalKes,
          deliveryFeeKes,
          totalKes,
          status: "PENDING",
          paymentStatus: "UNPAID",
          paymentMethod: "WHATSAPP",
          channel: options.source,
          items: { create: orderItems },
        },
        select: { orderNumber: true },
      });

      return { ok: true, orderNumber: order.orderNumber };
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        continue;
      }

      console.error("Failed to create order", error);

      return {
        ok: false,
        status: 500,
        error: "Could not place the order. Please try again.",
      };
    }
  }

  return {
    ok: false,
    status: 500,
    error: "Could not place the order. Please try again.",
  };
}
