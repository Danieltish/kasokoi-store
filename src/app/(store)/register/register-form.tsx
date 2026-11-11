"use client";

import { useActionState } from "react";

import {
  customerRegisterAction,
  type AuthFormState,
} from "@/app/(store)/account/actions";

const initialState: AuthFormState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

export function CustomerRegisterForm() {
  const [state, formAction, pending] = useActionState(
    customerRegisterAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Full name
        <input
          name="name"
          required
          autoComplete="name"
          placeholder="Jane Wanjiku"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Phone (optional)
        <input
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0712 345 678"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Confirm password
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Repeat your password"
          className={fieldClass}
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
