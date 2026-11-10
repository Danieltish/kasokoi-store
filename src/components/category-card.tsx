import Image from "next/image";
import Link from "next/link";

import type { CategorySummary } from "@/lib/catalog";

export function CategoryCard({ category }: { category: CategorySummary }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex min-h-32 flex-col justify-end overflow-hidden rounded-xl border border-border bg-muted p-4 sm:min-h-40 sm:p-5"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative">
        <h3 className="text-base font-semibold text-white">{category.name}</h3>
        <p className="mt-1 text-sm text-white/80">
          {category.productCount} product{category.productCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
