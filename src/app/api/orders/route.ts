import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { CATALOG_TAGS } from "@/lib/catalog";
import { deliveryFeeFor } from "@/lib/pricing";
import { normalizeKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
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

const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOrderNumber() {
  let suffix = "";

  for (let index = 0; index < 6; index += 1) {
    suffix += ORDER_ALPHABET[Math.floor(Math.random() * ORDER_ALPHABET.length)];
  }

  return `KS-${suffix}`;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order details." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const phone = normalizeKenyanPhone(data.phone);

  if (!phone) {
    return NextResponse.json(
      { error: "Enter a valid Kenyan phone number, e.g. 0712 345 678." },
      { status: 400 },
    );
  }

  const quantities = new Map<string, number>();

  for (const item of data.items) {
    quantities.set(item.slug, (quantities.get(item.slug) ?? 0) + item.quantity);
  }

  for (const quantity of quantities.values()) {
    if (quantity > 99) {
      return NextResponse.json(
        { error: "Maximum quantity per product is 99." },
        { status: 400 },
      );
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
    return NextResponse.json(
      { error: "The selected delivery option is unavailable." },
      { status: 400 },
    );
  }

  if (products.length !== slugs.length) {
    return NextResponse.json(
      { error: "Some products are no longer available. Refresh your cart." },
      { status: 409 },
    );
  }

  const productBySlug = new Map(products.map((product) => [product.slug, product]));

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
      return NextResponse.json(
        { error: "Some products are no longer available. Refresh your cart." },
        { status: 409 },
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        {
          error:
            product.stock > 0
              ? `Only ${product.stock} of ${product.name} left in stock.`
              : `${product.name} is out of stock.`,
        },
        { status: 409 },
      );
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      unitPriceKes: product.priceKes,
      quantity,
      lineTotalKes: product.priceKes * quantity,
    });
  }

  const county = data.county?.trim();

  if (!zone.isPickup) {
    if (!county) {
      return NextResponse.json(
        { error: "Choose the county for delivery." },
        { status: 400 },
      );
    }

    if (!zone.counties.includes(county)) {
      return NextResponse.json(
        { error: "That county is not covered by the selected delivery zone." },
        { status: 400 },
      );
    }
  }

  const subtotalKes = orderItems.reduce(
    (total, item) => total + item.lineTotalKes,
    0,
  );
  const deliveryFeeKes = deliveryFeeFor(zone, subtotalKes);
  const totalKes = subtotalKes + deliveryFeeKes;

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
          channel: "WHATSAPP",
          items: { create: orderItems },
        },
        select: { orderNumber: true },
      });

      revalidateTag(CATALOG_TAGS.products, { expire: 0 });

      return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        continue;
      }

      console.error("Failed to create order", error);

      return NextResponse.json(
        { error: "Could not place the order. Please try again." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { error: "Could not place the order. Please try again." },
    { status: 500 },
  );
}
