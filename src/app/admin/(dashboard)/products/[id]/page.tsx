import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ProductForm } from "../product-form";

export const instant = false;

function specsToText(specs: unknown) {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) {
    return "";
  }

  return Object.entries(specs as Record<string, unknown>)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

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
          Edit product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>

      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          description: product.description,
          categoryId: product.categoryId,
          sku: product.sku,
          condition: product.condition,
          priceKes: product.priceKes,
          compareAtPriceKes: product.compareAtPriceKes,
          stock: product.stock,
          isActive: product.isActive,
          images: product.images.map((image) => ({
            url: image.url,
            alt: image.alt,
          })),
          specsText: specsToText(product.specs),
        }}
      />
    </div>
  );
}
