import type { ProductSummary } from "@/lib/catalog";

import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: {
  products: ProductSummary[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-medium">{emptyMessage}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search or browse all products.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
