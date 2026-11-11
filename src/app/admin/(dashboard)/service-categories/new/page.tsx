import Link from "next/link";

import { requireAdmin } from "@/lib/auth";

import { ServiceCategoryForm } from "../category-form";

export const instant = false;

export default async function NewServiceCategoryPage() {
  await requireAdmin();

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/service-categories"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Service categories
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Add service category
        </h1>
      </div>
      <ServiceCategoryForm />
    </div>
  );
}
