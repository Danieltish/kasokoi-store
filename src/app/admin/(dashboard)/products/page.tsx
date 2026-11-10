import Image from "next/image";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/site";

import { toggleProductActiveAction } from "./actions";

export const instant = false;

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { position: "asc" } },
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"} in the
            catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      <>
      <ul className="space-y-3 md:hidden">
        {products.map((product) => (
          <li
            key={product.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium">{product.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {product.sku} · {product.brand} · {product.category.name}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatKes(product.priceKes)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 font-medium ${
                    product.stock <= 5
                      ? "bg-danger/10 text-danger"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Stock {product.stock}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-medium ${
                    product.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {product.isActive ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
                <form action={toggleProductActiveAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {product.isActive ? "Hide" : "Show"}
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sku} · {product.brand}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category.name}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatKes(product.priceKes)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock <= 5
                        ? "font-medium text-danger"
                        : "text-muted-foreground"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={toggleProductActiveAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {product.isActive ? "Hide" : "Show"}
                      </button>
                    </form>
                  </div>
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
