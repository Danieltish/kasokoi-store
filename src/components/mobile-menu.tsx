"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { CategorySummary } from "@/lib/catalog";

import { CloseIcon, MenuIcon } from "./icons";

export function MobileMenu({ categories }: { categories: CategorySummary[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative z-50 sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-store-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
      >
        {open ? (
          <CloseIcon className="size-5" />
        ) : (
          <MenuIcon className="size-5" />
        )}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default bg-black/30"
          />
          <nav
            id="mobile-store-menu"
            aria-label="Store menu"
            className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          >
            <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              <li>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-muted"
                >
                  All products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted"
                  >
                    <span className="truncate">{category.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {category.productCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="block border-t border-border px-4 py-3 text-sm font-semibold hover:bg-muted"
            >
              View cart
            </Link>
          </nav>
        </>
      ) : null}
    </div>
  );
}
