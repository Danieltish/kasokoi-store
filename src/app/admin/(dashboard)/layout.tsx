import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminRole } from "@/generated/prisma/client";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo, LogoMark } from "@/components/logo";
import { requireAdmin } from "@/lib/auth";

import { logoutAction } from "../actions";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <aside className="border-b border-border bg-card md:flex md:w-64 md:shrink-0 md:flex-col md:gap-6 md:border-b-0 md:border-r md:p-4">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 md:block md:p-0">
          <div>
            <Link
              href="/admin"
              aria-label="Kasokoi admin home"
              className="inline-flex items-center gap-2"
            >
              <Logo showWordmark={false} />
              <span className="text-lg font-semibold tracking-tight">
                Kasokoi <span className="text-primary">Admin</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">Manage your store</p>
          </div>
          <form action={logoutAction} className="md:hidden">
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-danger"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-3 px-2 pb-2 md:mt-0 md:px-0 md:pb-0">
          <AdminNav isSuperAdmin={session.role === AdminRole.ADMIN} />
        </div>

        <div className="mt-auto hidden space-y-3 border-t border-border pt-4 text-sm md:block">
          <div>
            <p className="font-medium">{session.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {session.email}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {session.role}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-muted-foreground hover:text-danger"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
          <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <LogoMark className="size-5 shrink-0" />
            <span className="truncate">Admin console</span>
          </span>
          <Link
            href="/"
            target="_blank"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View store ↗
          </Link>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
