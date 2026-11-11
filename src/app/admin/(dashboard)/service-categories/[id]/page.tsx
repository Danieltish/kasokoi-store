import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ServiceCategoryForm } from "../category-form";

export const instant = false;

export default async function EditServiceCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const category = await prisma.serviceCategory.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

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
          Edit service category
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
      </div>
      <ServiceCategoryForm
        category={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image ?? "",
          isActive: category.isActive,
        }}
      />
    </div>
  );
}
