import Link from "next/link";

import { getCategories } from "@/lib/catalog";
import { SITE, whatsappUrl } from "@/lib/site";

import { SearchIcon, WhatsAppIcon } from "./icons";
import { CartLink } from "./cart-link";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-primary"
        >
          {SITE.name}
        </Link>

        <form action="/search" className="ml-auto hidden flex-1 sm:block">
          <div className="relative max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              placeholder="Search products"
              aria-label="Search products"
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <CartLink />
          <a
            href={whatsappUrl(`Hi ${SITE.name}, I have a question.`)}
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-3 py-2 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
        <Link
          href="/products"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          All products
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <form action="/search" className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            placeholder="Search products"
            aria-label="Search products"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </form>
    </header>
  );
}
