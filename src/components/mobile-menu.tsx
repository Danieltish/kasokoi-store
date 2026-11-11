"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { CategorySummary } from "@/lib/catalog";
import type { ServiceCategorySummary } from "@/lib/services";

import { CloseIcon, MenuIcon } from "./icons";
import { Logo } from "./logo";

export function MobileMenu({
  categories,
  serviceCategories,
}: {
  categories: CategorySummary[];
  serviceCategories: ServiceCategorySummary[];
}) {
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
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
            className="absolute left-0 top-full z-50 mt-2 max-h-[calc(100dvh-6rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Logo />
            </div>

            <div className="py-2">
              <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Our Categories
              </p>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-left text-sm hover:bg-muted"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="mx-4 mt-2 flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                All products
              </Link>
            </div>

            <div className="border-t border-border py-2">
              <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Our Services
              </p>
              <ul>
                {serviceCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/services/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-left text-sm hover:bg-muted"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="mx-4 mt-2 flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                All services
              </Link>
            </div>

            <div className="border-t border-border">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-left text-sm font-semibold hover:bg-muted"
              >
                My account
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="block border-t border-border px-4 py-3 text-left text-sm font-semibold hover:bg-muted"
              >
                About us
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block border-t border-border px-4 py-3 text-left text-sm font-semibold hover:bg-muted"
              >
                View cart
              </Link>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
