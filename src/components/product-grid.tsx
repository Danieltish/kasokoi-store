import type { ProductSummary } from "@/lib/catalog";

import { LogoMark } from "./logo";
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
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <LogoMark className="size-10" />
        <p className="mt-4 font-medium">{emptyMessage}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search or browse all products.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
