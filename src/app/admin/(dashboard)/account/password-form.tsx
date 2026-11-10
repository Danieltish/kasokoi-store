"use client";

import { useActionState } from "react";

import { changePasswordAction, type PasswordState } from "./actions";

const initialState: PasswordState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Current password
        <input
          required
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        New password
        <input
          required
          type="password"
          name="newPassword"
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Confirm new password
        <input
          required
          type="password"
          name="confirmPassword"
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
        />
      </label>

      {state.error ? (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          Password updated.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
