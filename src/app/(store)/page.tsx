import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { WhatsAppIcon } from "@/components/icons";
import { ProductGrid } from "@/components/product-grid";
import { getCategories, getProducts } from "@/lib/catalog";
import { SITE, whatsappUrl } from "@/lib/site";

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
  ]);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-brand-50 to-background dark:from-brand-950/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">
              Delivering across Kenya
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:mt-6 sm:text-4xl lg:text-5xl">
              Rare networking gear &amp; premium beauty tech,{" "}
              <span className="text-primary">delivered.</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Hard-to-find WiFi tools, MikroTik and Ubiquiti equipment, Yeastar
              VoIP systems and beauty electronics — with honest KES pricing and
              WhatsApp-first ordering.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="inline-flex justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Shop all products
              </Link>
              <a
                href={whatsappUrl(
                  `Hi ${SITE.name}, I would like help finding a product.`,
                )}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="size-4" />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Shop by category
          </h2>
          <Link
            href="/products"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            New arrivals
          </h2>
          <Link
            href="/products?sort=newest"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            See more
          </Link>
        </div>
        <div className="mt-4 sm:mt-5">
          <ProductGrid
            products={products}
            emptyMessage="No products yet — check back soon."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3 sm:p-8">
          <div>
            <h3 className="font-semibold">Genuine stock only</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Sourced from trusted suppliers and checked before delivery.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Nairobi &amp; nationwide</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Same-day where possible; courier delivery to all counties.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Talk to a human</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Order, ask questions or request a rare item on WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
