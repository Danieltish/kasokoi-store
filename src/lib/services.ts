import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const SERVICE_TAGS = {
  categories: "service-categories",
  services: "services",
} as const;

export type ServiceCategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  serviceCount: number;
};

export type ServiceSummary = {
  id: string;
  name: string;
  slug: string;
  category: { slug: string; name: string };
  description: string;
  priceFromKes: number | null;
  priceNote: string | null;
  duration: string | null;
  coverage: string | null;
  image: string | null;
};

type ServiceWithCategory = Prisma.ServiceGetPayload<{
  include: { category: { select: { slug: true; name: true } } };
}>;

function toServiceSummary(row: ServiceWithCategory): ServiceSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    description: row.description,
    priceFromKes: row.priceFromKes,
    priceNote: row.priceNote,
    duration: row.duration,
    coverage: row.coverage,
    image: row.image,
  };
}

export async function getServiceCategories(): Promise<
  ServiceCategorySummary[]
> {
  "use cache";
  cacheTag(SERVICE_TAGS.categories);
  cacheLife("days");

  const rows = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { services: { where: { isActive: true } } },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    serviceCount: row._count.services,
  }));
}

export async function getServiceCategoryBySlug(
  slug: string,
): Promise<ServiceCategorySummary | null> {
  "use cache";
  cacheTag(SERVICE_TAGS.categories);
  cacheLife("days");

  const row = await prisma.serviceCategory.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: {
        select: { services: { where: { isActive: true } } },
      },
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
    serviceCount: row._count.services,
  };
}

export async function getServices(categorySlug?: string): Promise<
  ServiceSummary[]
> {
  "use cache";
  cacheTag(SERVICE_TAGS.services);
  cacheLife("hours");

  const rows = await prisma.service.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
        ...(categorySlug ? { slug: categorySlug } : {}),
      },
    },
    orderBy: [
      { category: { position: "asc" } },
      { position: "asc" },
      { name: "asc" },
    ],
    include: {
      category: { select: { slug: true, name: true } },
    },
  });

  return rows.map(toServiceSummary);
}

export async function getServiceBySlug(
  categorySlug: string,
  serviceSlug: string,
): Promise<ServiceSummary | null> {
  "use cache";
  cacheTag(SERVICE_TAGS.services);
  cacheLife("hours");

  const row = await prisma.service.findFirst({
    where: {
      slug: serviceSlug,
      isActive: true,
      category: { slug: categorySlug, isActive: true },
    },
    include: {
      category: { select: { slug: true, name: true } },
    },
  });

  if (!row) {
    return null;
  }

  return toServiceSummary(row);
}

export async function getFeaturedServices(
  limit = 6,
): Promise<ServiceSummary[]> {
  "use cache";
  cacheTag(SERVICE_TAGS.services);
  cacheLife("hours");

  const rows = await prisma.service.findMany({
    where: { isActive: true, category: { isActive: true } },
    orderBy: [
      { category: { position: "asc" } },
      { position: "asc" },
      { name: "asc" },
    ],
    include: {
      category: { select: { slug: true, name: true } },
    },
  });

  const groups = new Map<string, ServiceSummary[]>();

  for (const row of rows) {
    const summary = toServiceSummary(row);
    const group = groups.get(summary.category.slug) ?? [];
    group.push(summary);
    groups.set(summary.category.slug, group);
  }

  const featured: ServiceSummary[] = [];
  let round = 0;

  while (featured.length < limit) {
    let added = false;

    for (const group of groups.values()) {
      const item = group[round];

      if (item) {
        featured.push(item);
        added = true;

        if (featured.length >= limit) {
          break;
        }
      }
    }

    if (!added) {
      break;
    }

    round += 1;
  }

  return featured;
}

export async function getRelatedServices(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<ServiceSummary[]> {
  "use cache";
  cacheTag(SERVICE_TAGS.services);
  cacheLife("hours");

  const rows = await prisma.service.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug, isActive: true },
      slug: { not: excludeSlug },
    },
    take: limit,
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: {
      category: { select: { slug: true, name: true } },
    },
  });

  return rows.map(toServiceSummary);
}
