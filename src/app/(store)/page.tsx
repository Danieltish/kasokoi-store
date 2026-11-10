import Link from "next/link";

import { ProductGrid } from "@/components/product-grid";
import { getPopularProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getPopularProducts(12);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Most popular
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Best-selling products at Kasokoi Store.
          </p>
        </div>
        <Link
          href="/products"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-6">
        <ProductGrid
          products={products}
          emptyMessage="No products yet — check back soon."
        />
      </div>
    </div>
  );
}
