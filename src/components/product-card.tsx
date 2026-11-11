import Image from "next/image";
import Link from "next/link";

import type { ProductSummary } from "@/lib/catalog";

import { Price } from "./price";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.image ? (
          <Image draggable={false}
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <span className="line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
          {product.brand}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
        <div className="mt-auto pt-2">
          <Price
            amountKes={product.priceKes}
            compareAtKes={product.compareAtPriceKes}
          />
        </div>
        <span
          className={
            product.stock > 0
              ? "text-xs font-medium text-success"
              : "text-xs font-medium text-danger"
          }
        >
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </span>
      </div>
    </Link>
  );
}
