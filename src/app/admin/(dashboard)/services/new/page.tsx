import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ServiceForm } from "../service-form";

export const instant = false;

export default async function NewServicePage() {
  await requireAdmin();

  const categories = await prisma.serviceCategory.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/services"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Services
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Add service
        </h1>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Create a service category first.
        </p>
      ) : (
        <ServiceForm categories={categories} />
      )}
    </div>
  );
}
