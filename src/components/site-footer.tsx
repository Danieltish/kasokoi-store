import Link from "next/link";

import { getTopLevelCategories } from "@/lib/catalog";
import { SITE, whatsappUrl } from "@/lib/site";

import { WhatsAppIcon } from "./icons";
import { Logo, LogoMark } from "./logo";

export async function SiteFooter() {
  const categories = await getTopLevelCategories(8);

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="/" aria-label={`${SITE.name} home`} className="inline-block">
            <Logo />
          </Link>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {SITE.tagline}. Phones, electronics, home essentials, fashion,
            beauty, farm supplies and more — at honest prices in KES.
          </p>
          <a
            href={whatsappUrl(`Hi ${SITE.name}, I have a question.`)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            <WhatsAppIcon className="size-4 text-whatsapp" />
            {SITE.whatsappDisplay}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/products" className="hover:text-foreground">
                All products
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Help</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>Delivery in Nairobi &amp; nationwide</li>
            <li>Order on WhatsApp</li>
            <li>Prices in Kenyan Shillings</li>
            <li>
              <a
                href={whatsappUrl(`Hi ${SITE.name}, I need help with an order.`)}
                className="hover:text-foreground"
              >
                Chat with support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pr-24">
          <span className="inline-flex items-center gap-2">
            <LogoMark className="size-4" />
            &copy; {SITE.name}. All rights reserved.
          </span>
          <Link
            href="/admin/login"
            className="font-medium hover:text-foreground"
          >
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}
