import Link from "next/link";

import { requireAdmin } from "@/lib/auth";

import { CategoryForm } from "../category-form";

export const instant = false;

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/categories"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Categories
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Add category
        </h1>
      </div>
      <CategoryForm />
    </div>
  );
}
