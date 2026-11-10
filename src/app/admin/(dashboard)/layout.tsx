import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminRole } from "@/generated/prisma/client";
import { AdminNav } from "@/components/admin/admin-nav";
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
      <aside className="flex flex-col gap-6 border-b border-border bg-card p-4 md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div>
          <Link href="/admin" className="text-lg font-semibold text-primary">
            Kasokoi Admin
          </Link>
          <p className="text-xs text-muted-foreground">Manage your store</p>
        </div>

        <AdminNav isSuperAdmin={session.role === AdminRole.ADMIN} />

        <div className="mt-auto space-y-3 border-t border-border pt-4 text-sm md:mt-0">
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

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
          <span className="text-sm text-muted-foreground">Admin console</span>
          <Link
            href="/"
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            View store ↗
          </Link>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
