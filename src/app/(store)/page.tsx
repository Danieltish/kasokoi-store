import Link from "next/link";

import {
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { ProductGrid } from "@/components/product-grid";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceCategoryCard } from "@/components/services/service-category-card";
import { getPopularProducts, getTopLevelCategories } from "@/lib/catalog";
import {
  getFeaturedServices,
  getServiceCategories,
} from "@/lib/services";
import { callUrl, SITE, whatsappUrl } from "@/lib/site";

const sectionLinkClass =
  "text-sm font-medium text-primary hover:underline";

export default async function Home() {
  const [products, categories, services, serviceCategories] =
    await Promise.all([
      getPopularProducts(8),
      getTopLevelCategories(),
      getFeaturedServices(8),
      getServiceCategories(),
    ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="grid gap-4 lg:grid-cols-2">
        <Link
          href="/products"
          className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-50 to-card p-5 sm:p-6 dark:from-brand-950/30"
        >
          <span className="inline-flex rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-border">
            Products
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Shop products
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
            Phones, computers, networking, home essentials, solar, fashion,
            farm supplies and more.
          </p>
          <span className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground group-hover:opacity-90">
            Browse products →
          </span>
          <LogoMark className="pointer-events-none absolute -bottom-6 -right-4 size-32 opacity-10" />
        </Link>

        <Link
          href="/services"
          className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-50 to-card p-5 sm:p-6 dark:from-brand-950/30"
        >
          <span className="inline-flex rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-700 ring-1 ring-border dark:text-accent-300">
            Services
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Book a service
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
            Beauty, cleaning, repairs, technology, deliveries and errands —
            request a quote on WhatsApp.
          </p>
          <span className="mt-5 inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold group-hover:bg-muted">
            Browse services →
          </span>
          <LogoMark className="pointer-events-none absolute -bottom-6 -right-4 size-32 opacity-10" />
        </Link>
      </section>

      <nav
        aria-label="Home sections"
        className="no-scrollbar mt-6 flex gap-2 overflow-x-auto rounded-xl border border-border bg-card p-2"
      >
        <a
          href="#popular-products"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Popular products
        </a>
        <a
          href="#product-categories"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Product categories
        </a>
        <a
          href="#popular-services"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Popular services
        </a>
        <a
          href="#service-categories"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Service categories
        </a>
      </nav>

      <section id="popular-products" className="scroll-mt-28 pt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Popular products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Best-selling products at Kasokoi Store.
            </p>
          </div>
          <Link href="/products" className={`shrink-0 ${sectionLinkClass}`}>
            View all products
          </Link>
        </div>
        <div className="mt-5">
          <ProductGrid
            products={products}
            emptyMessage="No products yet — check back soon."
          />
        </div>
      </section>

      <section id="product-categories" className="scroll-mt-28 pt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Shop by product category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump straight to the type of product you need.
            </p>
          </div>
          <Link href="/products" className={`shrink-0 ${sectionLinkClass}`}>
            All products
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-full border border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary hover:bg-muted"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section id="popular-services" className="scroll-mt-28 pt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Popular services
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Trusted help for your home, business and everyday life.
            </p>
          </div>
          <Link href="/services" className={`shrink-0 ${sectionLinkClass}`}>
            View all services
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section id="service-categories" className="scroll-mt-28 pt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Browse service categories
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Beauty, home, repairs, technology, deliveries and errands.
            </p>
          </div>
          <Link href="/services" className={`shrink-0 ${sectionLinkClass}`}>
            All services
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {serviceCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">How to buy a product</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Browse or search for what you need.</li>
            <li>2. Add it to your cart and check out.</li>
            <li>3. Confirm the order on WhatsApp.</li>
            <li>
              4. Pay via M-Pesa Till {SITE.mpesaTill} or arrange delivery
              payment.
            </li>
          </ol>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Start shopping
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">How to book a service</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Choose the service you need.</li>
            <li>2. Send your details and request a quote.</li>
            <li>3. Confirm the price and booking on WhatsApp.</li>
          </ol>
          <Link
            href="/services"
            className="mt-4 inline-flex rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Browse services
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold">Genuine stock</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Checked before delivery.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <TruckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold">Delivery across Kenya</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Nairobi and nationwide courier.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <PhoneIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-sm font-semibold">Order by call or WhatsApp</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <a
                href={callUrl()}
                className="font-medium text-foreground hover:text-primary"
              >
                Call {SITE.whatsappDisplay}
              </a>
              {" · "}
              <a
                href={whatsappUrl(
                  `Hi ${SITE.name}, I would like to place an order.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
              >
                <WhatsAppIcon className="size-3.5 text-whatsapp" />
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
