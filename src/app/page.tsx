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
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">
              Delivering across Kenya
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Rare networking gear &amp; premium beauty tech,{" "}
              <span className="text-primary">delivered.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Hard-to-find WiFi tools, MikroTik and Ubiquiti equipment, Yeastar
              VoIP systems and beauty electronics — with honest KES pricing and
              WhatsApp-first ordering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Shop all products
              </Link>
              <a
                href={whatsappUrl(
                  `Hi ${SITE.name}, I would like help finding a product.`,
                )}
                className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="size-4" />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shop by category
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            New arrivals
          </h2>
          <Link
            href="/products?sort=newest"
            className="text-sm font-medium text-primary hover:underline"
          >
            See more
          </Link>
        </div>
        <div className="mt-5">
          <ProductGrid
            products={products}
            emptyMessage="No products yet — check back soon."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3 sm:p-8">
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
