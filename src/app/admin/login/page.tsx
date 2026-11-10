import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/logo";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Logo />
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Admin sign in
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage products, orders and delivery.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <Link
          href="/"
          className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
