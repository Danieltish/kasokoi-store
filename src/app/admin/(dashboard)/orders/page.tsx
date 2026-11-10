import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { first } from "@/lib/params";
import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/site";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/status";

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  dateStyle: "medium",
  timeStyle: "short",
});

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  const params = await searchParams;
  const requestedStatus = first(params.status);
  const status = ORDER_STATUS_OPTIONS.find(
    (option) => option === requestedStatus,
  );

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      deliveryZone: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          WhatsApp orders placed through the store.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            !status
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          All
        </Link>
        {ORDER_STATUS_OPTIONS.map((option) => (
          <Link
            key={option}
            href={`/admin/orders?status=${option}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              status === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {ORDER_STATUS_LABELS[option]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No orders{status ? " with this status" : ""} yet.
        </p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.customerName} · {order.phone}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold">
                    {formatKes(order.totalKes)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</span>
                  <span>
                    · {order._count.items} item
                    {order._count.items === 1 ? "" : "s"}
                  </span>
                  <span>· {dateFormatter.format(order.createdAt)}</span>
                  <span>· {order.deliveryZone?.name ?? "Delivery"}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {order.deliveryZone?.name ?? "Delivery"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order._count.items}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatKes(order.totalKes)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {dateFormatter.format(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}
