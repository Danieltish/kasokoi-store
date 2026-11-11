"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { CategorySummary } from "@/lib/catalog";
import type { ServiceCategorySummary } from "@/lib/services";

import { CloseIcon, MenuIcon } from "./icons";
import { Logo } from "./logo";

type MenuTab = "products" | "services";

export function SiteMenu({
  categories,
  serviceCategories,
}: {
  categories: CategorySummary[];
  serviceCategories: ServiceCategorySummary[];
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<MenuTab>("products");

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

  function close() {
    setOpen(false);
  }

  return (
    <div className="relative z-50">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-10"
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
            onClick={close}
            className="fixed inset-0 z-30 cursor-default bg-black/30"
          />
          <nav
            id="site-menu"
            aria-label="Store menu"
            className="absolute left-0 top-full z-50 mt-2 max-h-[calc(100dvh-6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-card shadow-lg md:w-[44rem] md:max-w-[calc(100vw-2rem)]"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Logo />
              <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                Browse
              </span>
            </div>

            <div className="p-3 md:hidden">
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setTab("products")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    tab === "products"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Products
                </button>
                <button
                  type="button"
                  onClick={() => setTab("services")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    tab === "services"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Services
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:p-3">
              <section
                className={`${tab === "products" ? "block" : "hidden"} p-2 md:block md:p-2`}
              >
                <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Our Products
                </p>
                <ul className="max-h-[48vh] space-y-0.5 overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={close}
                        className="block rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products"
                  onClick={close}
                  className="mx-2 mt-2 flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  All products
                </Link>
              </section>

              <section
                className={`${tab === "services" ? "block" : "hidden"} border-t border-border p-2 md:block md:border-t-0 md:border-l md:border-border md:pl-4`}
              >
                <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Our Services
                </p>
                <ul className="space-y-0.5">
                  {serviceCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/services/${category.slug}`}
                        onClick={close}
                        className="block rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  onClick={close}
                  className="mx-2 mt-2 flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  All services
                </Link>
              </section>
            </div>

            <div className="flex flex-col border-t border-border px-4 py-2 text-sm font-semibold md:flex-row md:items-center md:gap-6">
              <Link
                href="/account"
                onClick={close}
                className="py-2 text-left hover:text-primary"
              >
                My account
              </Link>
              <Link
                href="/about"
                onClick={close}
                className="py-2 text-left hover:text-primary"
              >
                About us
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="py-2 text-left hover:text-primary"
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
