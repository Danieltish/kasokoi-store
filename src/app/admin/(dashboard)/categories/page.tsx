import Image from "next/image";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Add category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      {category.description ? (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.slug}
                </td>
                <td className="px-4 py-3">{category._count.products}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
