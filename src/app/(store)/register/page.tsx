import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { getSessionUser } from "@/lib/auth";

import { CustomerRegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Kasokoi Store account.",
};

export const instant = false;

export default async function RegisterPage() {
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
            Create an account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional — you can always shop and check out as a guest.
          </p>
          <div className="mt-6">
            <CustomerRegisterForm />
          </div>
        </div>
        <div className="mt-4 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
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
