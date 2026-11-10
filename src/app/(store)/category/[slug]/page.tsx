import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/catalog-skeleton";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import {
  getBrands,
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/catalog";
import {
  first,
  parseCondition,
  parseMaxPrice,
  parseSort,
} from "@/lib/params";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.name,
    description:
      category.description ??
      `Shop ${category.name} at Kasokoi Store in Kenya.`,
  };
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const query = await searchParams;
  const brand = first(query.brand) || undefined;
  const condition = parseCondition(first(query.condition));
  const maxPrice = parseMaxPrice(first(query.maxPrice));
  const sort = parseSort(first(query.sort));

  const [products, brands] = await Promise.all([
    getProducts({ categorySlug: slug, brand, condition, maxPrice, sort }),
    getBrands(slug),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6">
        <ProductFilters
          action={`/category/${slug}`}
          brands={brands}
          values={{
            brand,
            condition: first(query.condition),
            maxPrice: first(query.maxPrice),
            sort,
          }}
        />
      </div>

      <div className="mt-6">
        <ProductGrid
          products={products}
          emptyMessage="No products match these filters."
        />
      </div>
    </div>
  );
}
