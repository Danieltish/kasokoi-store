import Link from "next/link";

import { getTopLevelCategories } from "@/lib/catalog";
import { SITE, whatsappUrl } from "@/lib/site";

import { SearchIcon, WhatsAppIcon } from "./icons";
import { CartLink } from "./cart-link";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";

export async function SiteHeader() {
  const categories = await getTopLevelCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        <Link
          href="/"
          aria-label={`${SITE.name} home`}
          className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <Logo />
        </Link>

        <form action="/search" className="ml-auto hidden min-w-0 flex-1 sm:block">
          <div className="relative max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              placeholder="Search products"
              aria-label="Search products"
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
            />
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <UserMenu />
          <CartLink />
          <a
            href={whatsappUrl(`Hi ${SITE.name}, I have a question.`)}
            aria-label="Chat on WhatsApp"
            className="inline-flex size-10 items-center justify-center gap-2 rounded-lg bg-whatsapp px-0 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90 sm:size-auto sm:px-3 sm:py-2"
          >
            <WhatsAppIcon className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <MobileMenu categories={categories} />
        </div>
      </div>

      <nav className="no-scrollbar mx-auto hidden w-full max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:flex sm:px-6">
        <Link
          href="/products"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          All products
        </Link>
        {categories.slice(0, 6).map((category) => (
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
            className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </form>
    </header>
  );
}
