import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { displayKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { formatKes, SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

const statusLabels = {
  PENDING: "Awaiting confirmation",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
} as const;

const paymentLabels = {
  UNPAID: "Not paid",
  PENDING: "Payment pending",
  PAID: "Paid",
  FAILED: "Payment failed",
  REFUNDED: "Refunded",
} as const;

export const instant = false;

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: { product: { select: { slug: true } } },
      },
      deliveryZone: true,
    },
  });

  if (!order) {
    notFound();
  }

  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  )
    .split(",")[0]
    .trim();
  const protocol = (requestHeaders.get("x-forwarded-proto") ?? "https")
    .split(",")[0]
    .trim();
  const origin = host ? `${protocol}://${host}` : SITE.url;

  const message = [
    `Hi ${SITE.name}, I placed order ${order.orderNumber}.`,
    "",
    "Items:",
    ...order.items.map((item) => {
      const link = item.product?.slug
        ? `\n   ${origin}/product/${item.product.slug}`
        : "";

      return `- ${item.name} x${item.quantity} — ${formatKes(item.lineTotalKes)}${link}`;
    }),
    "",
    `Subtotal: ${formatKes(order.subtotalKes)}`,
    `Delivery: ${
      order.deliveryFeeKes === 0 ? "Free" : formatKes(order.deliveryFeeKes)
    }${order.deliveryZone ? ` (${order.deliveryZone.name})` : ""}`,
    `Total: ${formatKes(order.totalKes)}`,
    `Payment: M-Pesa Buy Goods Till ${SITE.mpesaTill}`,
    "",
    `Name: ${order.customerName}`,
    `Phone: ${displayKenyanPhone(order.phone)}`,
    order.county ? `Delivery: ${order.county}` : "",
    order.address ? `Address: ${order.address}` : "",
    order.notes ? `Notes: ${order.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <LogoMark className="mb-4 size-12" />
      <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
        Order received
      </span>
      <h1 className="mt-3 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
        Thank you, {order.customerName.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-muted-foreground">
        Your order <span className="font-semibold">{order.orderNumber}</span>{" "}
        has been saved. Send it to us on WhatsApp so we can confirm stock,
        delivery and payment.
      </p>

      <a
        href={whatsappUrl(message)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90 sm:w-auto"
      >
        <WhatsAppIcon className="size-5" />
        Send order on WhatsApp
      </a>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 text-sm">
        <h2 className="font-semibold">Pay via M-Pesa</h2>
        <p className="mt-2 text-muted-foreground">
          Buy Goods Till{" "}
          <span className="font-mono text-base font-semibold text-foreground">
            {SITE.mpesaTill}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use your order number {order.orderNumber} as the reference if asked.
          Send the payment confirmation on WhatsApp.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4 text-sm">
          <span className="font-semibold">Order summary</span>
          <div className="flex gap-2">
            <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {statusLabels[order.status]}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {paymentLabels[order.paymentStatus]}
            </span>
          </div>
        </div>

        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between gap-3 px-5 py-3 text-sm"
            >
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium">
                {formatKes(item.lineTotalKes)}
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-border px-5 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatKes(order.subtotalKes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-medium">
              {order.deliveryFeeKes === 0
                ? "Free"
                : formatKes(order.deliveryFeeKes)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatKes(order.totalKes)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 text-sm">
        <h2 className="font-semibold">Delivery details</h2>
        <dl className="mt-3 space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-right font-medium">{order.customerName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="text-right font-medium">
              {displayKenyanPhone(order.phone)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Method</dt>
            <dd className="text-right font-medium">
              {order.deliveryZone?.name ?? "Delivery"}
            </dd>
          </div>
          {order.county ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">County</dt>
              <dd className="text-right font-medium">{order.county}</dd>
            </div>
          ) : null}
          {order.address ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-right font-medium">{order.address}</dd>
            </div>
          ) : null}
          {order.notes ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Notes</dt>
              <dd className="text-right font-medium">{order.notes}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <Link
        href="/products"
        className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
      >
        Continue shopping
      </Link>
    </div>
  );
}
