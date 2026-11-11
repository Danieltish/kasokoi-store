import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/catalog";
import { getServiceCategories, getServices } from "@/lib/services";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, serviceCategories, services] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getServiceCategories(),
      getServices(),
    ]);

  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE.url}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/services`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories.map((category) => ({
      url: `${SITE.url}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${SITE.url}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...serviceCategories.map((category) => ({
      url: `${SITE.url}/services/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...services.map((service) => ({
      url: `${SITE.url}/services/${service.category.slug}/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
