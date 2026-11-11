import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/catalog-skeleton";
import { CategoryCard } from "@/components/category-card";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import {
  getBrands,
  getProducts,
  getTopLevelCategories,
} from "@/lib/catalog";
import {
  first,
  parseCondition,
  parseMaxPrice,
  parseSort,
  parseTextFilter,
} from "@/lib/params";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse phones, computers, networking, home essentials, solar, fashion, farm supplies and more in Kenya.",
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const brand = parseTextFilter(first(params.brand));
  const condition = parseCondition(first(params.condition));
  const maxPrice = parseMaxPrice(first(params.maxPrice));
  const sort = parseSort(first(params.sort));
  const q = parseTextFilter(first(params.q));

  const [products, brands, categories] = await Promise.all([
    getProducts({ brand, condition, maxPrice, sort, q }),
    getBrands(),
    getTopLevelCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Products</span>
      </nav>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Products
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse by category or shop all products.
        </p>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Product categories
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a category to see the products inside it.
            </p>
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            {categories.length} categories
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              All products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {products.length} product{products.length === 1 ? "" : "s"}{" "}
              available.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProductFilters
            action="/products"
            brands={brands}
            values={{
              brand,
              condition: first(params.condition),
              maxPrice: maxPrice ? String(maxPrice) : undefined,
              sort,
              q,
            }}
          />
        </div>

        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
