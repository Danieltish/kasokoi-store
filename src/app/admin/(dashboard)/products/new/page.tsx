import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ProductForm } from "../product-form";

export const instant = false;

export default async function NewProductPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Products
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Add product
        </h1>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Create a category first.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
