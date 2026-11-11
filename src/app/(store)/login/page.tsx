import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { getSessionUser } from "@/lib/auth";

import { CustomerLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Kasokoi Store account.",
};

export const instant = false;

export default async function LoginPage() {
  const session = await getSessionUser();

  if (session) {
    redirect("/account");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Logo />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your account. You can still shop without an
            account.
          </p>
          <div className="mt-6">
            <CustomerLoginForm />
          </div>
        </div>
        <div className="mt-4 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p>
            <Link href="/products" className="hover:text-foreground">
              Continue shopping as a guest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
