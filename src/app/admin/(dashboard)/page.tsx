import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/site";
import { ORDER_STATUS_LABELS } from "@/lib/status";

export const instant = false;

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    productCount,
    activeProductCount,
    lowStockCount,
    orderCount,
    pendingOrderCount,
    adminCount,
    revenue,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.adminUser.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      _sum: { totalKes: true },
      where: { status: { notIn: ["CANCELLED", "RETURNED"] } },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { deliveryZone: true },
    }),
  ]);

  const cards = [
    { label: "Orders", value: orderCount, hint: `${pendingOrderCount} pending` },
    { label: "Order value", value: formatKes(revenue._sum.totalKes ?? 0), hint: "Excludes cancelled/returned" },
    { label: "Active products", value: activeProductCount, hint: `${productCount} total` },
    { label: "Low stock", value: lowStockCount, hint: "5 units or fewer" },
    { label: "Active admins", value: adminCount, hint: "Team members" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot of orders, catalog and stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="text-muted-foreground">
                    {order.customerName} · {order.phone}
                  </span>
                  <span className="text-muted-foreground">
                    {order.deliveryZone?.name ?? "Delivery"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="font-semibold">
                    {formatKes(order.totalKes)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
