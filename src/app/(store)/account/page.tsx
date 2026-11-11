import type { Metadata } from "next";
import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { isAdminRole, requireUser } from "@/lib/auth";
import { displayKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/site";
import { ORDER_STATUS_LABELS } from "@/lib/status";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  dateStyle: "medium",
});

export default async function AccountPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { email: user.email },
        ...(user.phone ? [{ phone: user.phone }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      orderNumber: true,
      totalKes: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex items-center gap-3">
        <LogoMark className="size-12" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My account
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Profile</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-right font-medium">{user.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-right font-medium">{user.email}</dd>
          </div>
          {user.phone ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-right font-medium">
                {displayKenyanPhone(user.phone)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {isAdminRole(user.role) ? (
            <Link
              href="/admin"
              className="inline-flex justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Admin dashboard
            </Link>
          ) : null}
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted sm:w-auto"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            Shop again
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No orders yet. Orders placed with this email or phone will appear
            here.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((order) => (
              <li key={order.orderNumber}>
                <Link
                  href={`/order/${order.orderNumber}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm hover:bg-muted/40"
                >
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {dateFormatter.format(order.createdAt)}
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
