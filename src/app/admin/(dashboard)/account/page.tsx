import { requireAdmin } from "@/lib/auth";

import { ChangePasswordForm } from "./password-form";

export const instant = false;

export default async function AdminAccountPage() {
  const session = await requireAdmin();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {session.email} · {session.role}
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use at least 8 characters.
        </p>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
