import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { displayKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { formatKes, SITE } from "@/lib/site";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/status";

import { OrderStatusForm } from "../order-status-form";

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      deliveryZone: true,
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  const customerMessage = `Hi ${order.customerName}, this is ${SITE.name} about your order ${order.orderNumber}.`;
  const customerWhatsApp = `https://wa.me/${order.phone}?text=${encodeURIComponent(
    customerMessage,
  )}`;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/orders"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Orders
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {order.orderNumber}
          </h1>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Placed {dateFormatter.format(order.createdAt)}
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card">
            <h2 className="border-b border-border px-4 py-3 font-semibold">
              Items
            </h2>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-3 px-4 py-3 text-sm"
                >
                  <span>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      × {item.quantity} @ {formatKes(item.unitPriceKes)}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatKes(item.lineTotalKes)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-border px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatKes(order.subtotalKes)}
                </span>
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
          </section>

          {order.notes ? (
            <section className="rounded-xl border border-border bg-card p-4 text-sm">
              <h2 className="font-semibold">Customer notes</h2>
              <p className="mt-2 text-muted-foreground">{order.notes}</p>
            </section>
          ) : null}

          <section className="rounded-xl border border-border bg-card p-4 text-sm">
            <h2 className="font-semibold">Payments</h2>
            {order.payments.length === 0 ? (
              <p className="mt-2 text-muted-foreground">
                No payment recorded yet.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {order.payments.map((payment) => (
                  <li key={payment.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {payment.provider} · {payment.providerRef ?? "—"}
                    </span>
                    <span className="font-medium">
                      {formatKes(payment.amountKes)} ·{" "}
                      {PAYMENT_STATUS_LABELS[payment.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-4 text-sm">
            <h2 className="font-semibold">Customer</h2>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="text-right font-medium">
                  {order.customerName}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-right font-medium">
                  {displayKenyanPhone(order.phone)}
                </dd>
              </div>
              {order.email ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="truncate text-right font-medium">
                    {order.email}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="text-right font-medium">
                  {order.deliveryZone?.name ?? "—"}
                </dd>
              </div>
              {order.county ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">County</dt>
                  <dd className="text-right font-medium">{order.county}</dd>
                </div>
              ) : null}
              {order.address ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="text-right font-medium">{order.address}</dd>
                </div>
              ) : null}
            </dl>

            <a
              href={customerWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center rounded-lg bg-whatsapp px-4 py-2 text-sm font-semibold text-whatsapp-foreground hover:opacity-90"
            >
              Message customer
            </a>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold">Update status</h2>
            <div className="mt-3">
              <OrderStatusForm
                id={order.id}
                status={order.status}
                paymentStatus={order.paymentStatus}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
