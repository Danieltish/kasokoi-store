import Image from "next/image";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { toggleServiceCategoryActiveAction } from "./actions";

export const instant = false;

export default async function AdminServiceCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.serviceCategory.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { services: true } } },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Service categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}.
          </p>
        </div>
        <Link
          href="/admin/service-categories/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Add category
        </Link>
      </div>

      <ul className="space-y-3 md:hidden">
        {categories.map((category) => (
          <li
            key={category.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{category.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {category.slug} · {category._count.services} service
                  {category._count.services === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-medium ${
                  category.isActive
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {category.isActive ? "Active" : "Hidden"}
              </span>
              <div className="flex items-center gap-3">
                <form action={toggleServiceCategoryActiveAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {category.isActive ? "Hide" : "Show"}
                  </button>
                </form>
                <Link
                  href={`/admin/service-categories/${category.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Services</th>
              <th className="px-4 py-3 font-medium">Status</th>
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
                    <p className="font-medium">{category.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.slug}
                </td>
                <td className="px-4 py-3">{category._count.services}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {category.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/service-categories/${category.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={toggleServiceCategoryActiveAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {category.isActive ? "Hide" : "Show"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
