import type { Metadata } from "next";
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
  title: "Search",
  description: "Search networking equipment, WiFi tools and electronics.",
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";
  const brand = first(params.brand) || undefined;
  const condition = parseCondition(first(params.condition));
  const maxPrice = parseMaxPrice(first(params.maxPrice));
  const sort = parseSort(first(params.sort));

  const brands = await getBrands();
  const products = q
    ? await getProducts({ q, brand, condition, maxPrice, sort })
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {q ? `Results for “${q}”` : "Search products"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {q
          ? `${products.length} product${products.length === 1 ? "" : "s"} found`
          : "Search by product name, brand or keyword."}
      </p>

      {q ? (
        <>
          <div className="mt-6">
            <ProductFilters
              action="/search"
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
            <ProductGrid
              products={products}
              emptyMessage={`No products found for “${q}”.`}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
