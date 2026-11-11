"use client";

import { useActionState } from "react";

import { updateProfileAction, type ProfileState } from "./actions";

const initialState: ProfileState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

export function ProfileForm({
  initialName,
  initialPhone,
  email,
}: {
  initialName: string;
  initialPhone: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input
            name="name"
            required
            defaultValue={initialName}
            autoComplete="name"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Phone
          <input
            name="phone"
            defaultValue={initialPhone}
            inputMode="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Email
          <input
            value={email}
            readOnly
            className={`${fieldClass} cursor-not-allowed bg-muted text-muted-foreground`}
          />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        Your name and phone are used to prefill orders and WhatsApp messages.
      </p>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
        >
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          Profile updated.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
