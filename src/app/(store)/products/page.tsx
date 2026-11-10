import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/catalog-skeleton";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { getBrands, getProducts } from "@/lib/catalog";
import {
  first,
  parseCondition,
  parseMaxPrice,
  parseSort,
} from "@/lib/params";

export const metadata: Metadata = {
  title: "All products",
  description:
    "Browse networking equipment, WiFi tools, VoIP systems and beauty electronics in Kenya.",
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
  const brand = first(params.brand) || undefined;
  const condition = parseCondition(first(params.condition));
  const maxPrice = parseMaxPrice(first(params.maxPrice));
  const sort = parseSort(first(params.sort));
  const q = first(params.q) || undefined;

  const [products, brands] = await Promise.all([
    getProducts({ brand, condition, maxPrice, sort, q }),
    getBrands(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">All products</span>
      </nav>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          All products
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="mt-6">
        <ProductFilters
          action="/products"
          brands={brands}
          values={{
            brand,
            condition: first(params.condition),
            maxPrice: first(params.maxPrice),
            sort,
            q,
          }}
        />
      </div>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
