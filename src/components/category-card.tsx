import Image from "next/image";
import Link from "next/link";

import type { CategorySummary } from "@/lib/catalog";

import { LogoMark } from "./logo";

export function CategoryCard({ category }: { category: CategorySummary }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex min-h-32 flex-col justify-end overflow-hidden rounded-xl border border-border bg-muted p-4 sm:min-h-40 sm:p-5"
    >
      {category.image ? (
        <Image
          draggable={false}
          src={category.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500" />
          <LogoMark className="absolute right-3 top-3 size-8 opacity-90" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="relative">
        <h3 className="text-base font-semibold text-white drop-shadow-sm">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-white/85 drop-shadow-sm">
          {category.productCount} product{category.productCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
