import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { CategoryForm } from "../category-form";

export const instant = false;

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

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
          Edit category
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
      </div>
      <CategoryForm
        category={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image ?? "",
        }}
      />
    </div>
  );
}
