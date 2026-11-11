"use client";

import { useActionState } from "react";

import { createAdminAction, type AdminFormState } from "./actions";

const initialState: AdminFormState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

export function CreateAdminForm({
  canCreateSuperAdmin,
}: {
  canCreateSuperAdmin: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    createAdminAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Name
        <input
          required
          name="name"
          placeholder="Jane Wanjiku"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          required
          type="email"
          name="email"
          placeholder="jane@example.com"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          type="password"
          name="password"
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className={fieldClass}
        />
        <span className="text-xs font-normal text-muted-foreground">
          Required for a new email. Leave blank to keep an existing
          customer&apos;s password.
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Role
        <select
          name="role"
          defaultValue="STAFF"
          className={fieldClass}
        >
          <option value="STAFF">Admin (staff)</option>
          {canCreateSuperAdmin ? (
            <option value="ADMIN">Superadmin</option>
          ) : null}
        </select>
        {!canCreateSuperAdmin ? (
          <span className="text-xs font-normal text-muted-foreground">
            Only the store owner can create superadmins.
          </span>
        ) : null}
      </label>

      {state.error ? (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger sm:col-span-2">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success sm:col-span-2">
          Admin saved. If the email belonged to a customer, their account is now
          an admin.
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Saving…" : "Create / promote admin"}
        </button>
      </div>
    </form>
  );
}
