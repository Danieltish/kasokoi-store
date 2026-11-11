import { AdminRole } from "@/generated/prisma/client";
import { isOwner, requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { toggleAdminActiveAction } from "./actions";
import { CreateAdminForm } from "./admin-form";

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  dateStyle: "medium",
});

export default async function AdminAdminsPage() {
  const session = await requireSuperAdmin();

  const admins = await prisma.user.findMany({
    where: { role: { not: AdminRole.CUSTOMER } },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admins</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add team members or promote an existing customer account. Only
          superadmins can manage admins, and only the store owner can create
          another superadmin.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Add an admin</h2>
        <div className="mt-4">
          <CreateAdminForm canCreateSuperAdmin={isOwner(session.email)} />
        </div>
      </section>

      <>
      <ul className="space-y-3 md:hidden">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {admin.name}
                  {admin.id === session.id ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (you)
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {admin.email}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {admin.role === AdminRole.ADMIN ? "Superadmin" : "Staff"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-medium ${
                  admin.isActive
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {admin.isActive ? "Active" : "Disabled"}
              </span>
              {admin.id === session.id ? (
                <span className="text-muted-foreground">
                  Current session
                </span>
              ) : (
                <form action={toggleAdminActiveAction}>
                  <input type="hidden" name="id" value={admin.id} />
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {admin.isActive ? "Disable" : "Enable"}
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-4 py-3 font-medium">
                  {admin.name}
                  {admin.id === session.id ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (you)
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {admin.email}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {admin.role === AdminRole.ADMIN ? "Superadmin" : "Staff"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      admin.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {dateFormatter.format(admin.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {admin.id === session.id ? (
                    <span className="text-xs text-muted-foreground">
                      Current session
                    </span>
                  ) : (
                    <form action={toggleAdminActiveAction}>
                      <input type="hidden" name="id" value={admin.id} />
                      <button
                        type="submit"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {admin.isActive ? "Disable" : "Enable"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
    </div>
  );
}
