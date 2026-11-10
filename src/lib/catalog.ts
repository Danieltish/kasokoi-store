import { cacheLife, cacheTag } from "next/cache";

import type { ProductCondition } from "@/generated/prisma/client";
import { CATEGORY_ORDER } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

export const CATALOG_TAGS = {
  categories: "categories",
  products: "products",
} as const;

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  priceKes: number;
  compareAtPriceKes: number | null;
  condition: ProductCondition;
  stock: number;
  image: string | null;
  category: { slug: string; name: string };
};

export type ProductDetail = ProductSummary & {
  description: string;
  specs: Record<string, string> | null;
  images: { url: string; alt: string | null }[];
};

export type ProductFilters = {
  categorySlug?: string;
  brand?: string;
  condition?: ProductCondition;
  maxPrice?: number;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name";
  limit?: number;
};

function toSpecs(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      key,
      String(val),
    ]),
  );
}

export async function getCategories(): Promise<CategorySummary[]> {
  "use cache";
  cacheTag(CATALOG_TAGS.categories);
  cacheLife("days");

  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    productCount: row._count.products,
  }));
}

export async function getTopLevelCategories(
  limit?: number,
): Promise<CategorySummary[]> {
  "use cache";
  cacheTag(CATALOG_TAGS.categories);
  cacheLife("days");

  const rows = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  const order = new Map(
    CATEGORY_ORDER.map((slug, index) => [slug, index] as const),
  );

  const sorted = rows.sort((a, b) => {
    const aIndex = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;

    return aIndex - bIndex || a.name.localeCompare(b.name);
  });

  const visible = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  return visible.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    productCount: row._count.products,
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategorySummary | null> {
  "use cache";
  cacheTag(CATALOG_TAGS.categories);
  cacheLife("days");

  const row = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    productCount: row._count.products,
  };
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductSummary[]> {
  "use cache";
  cacheTag(CATALOG_TAGS.products);
  cacheLife("hours");

  const where = {
    isActive: true,
    ...(filters.categorySlug
      ? { category: { slug: filters.categorySlug } }
      : {}),
    ...(filters.brand ? { brand: filters.brand } : {}),
    ...(filters.condition ? { condition: filters.condition } : {}),
    ...(filters.maxPrice ? { priceKes: { lte: filters.maxPrice } } : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" as const } },
            { brand: { contains: filters.q, mode: "insensitive" as const } },
            {
              description: {
                contains: filters.q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const orderBy = (() => {
    switch (filters.sort) {
      case "price-asc":
        return { priceKes: "asc" as const };
      case "price-desc":
        return { priceKes: "desc" as const };
      case "name":
        return { name: "asc" as const };
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const rows = await prisma.product.findMany({
    where,
    orderBy,
    take: filters.limit,
    include: {
      category: { select: { slug: true, name: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    priceKes: row.priceKes,
    compareAtPriceKes: row.compareAtPriceKes,
    condition: row.condition,
    stock: row.stock,
    image: row.images[0]?.url ?? null,
    category: row.category,
  }));
}

export async function getPopularProducts(
  limit = 12,
): Promise<ProductSummary[]> {
  "use cache";
  cacheTag(CATALOG_TAGS.products);
  cacheLife("hours");

  const rows = await prisma.product.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: [{ orderItems: { _count: "desc" } }, { createdAt: "desc" }],
    include: {
      category: { select: { slug: true, name: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    priceKes: row.priceKes,
    compareAtPriceKes: row.compareAtPriceKes,
    condition: row.condition,
    stock: row.stock,
    image: row.images[0]?.url ?? null,
    category: row.category,
  }));
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  "use cache";
  cacheTag(CATALOG_TAGS.products);
  cacheLife("hours");

  const row = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { slug: true, name: true } },
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: row.description,
    specs: toSpecs(row.specs),
    priceKes: row.priceKes,
    compareAtPriceKes: row.compareAtPriceKes,
    condition: row.condition,
    stock: row.stock,
    image: row.images[0]?.url ?? null,
    images: row.images.map((image) => ({ url: image.url, alt: image.alt })),
    category: row.category,
  };
}

export async function getBrands(categorySlug?: string): Promise<string[]> {
  "use cache";
  cacheTag(CATALOG_TAGS.products);
  cacheLife("days");

  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });

  return rows.map((row) => row.brand);
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<ProductSummary[]> {
  "use cache";
  cacheTag(CATALOG_TAGS.products);
  cacheLife("hours");

  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
      slug: { not: excludeSlug },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { slug: true, name: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    priceKes: row.priceKes,
    compareAtPriceKes: row.compareAtPriceKes,
    condition: row.condition,
    stock: row.stock,
    image: row.images[0]?.url ?? null,
    category: row.category,
  }));
}
