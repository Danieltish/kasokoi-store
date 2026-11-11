import Link from "next/link";

import {
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
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
      <h1 className="sr-only">
        Kasokoi Store — shop products and book trusted services in Kenya
      </h1>

      <div className="flex gap-2">
        <Link
          href="/products"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:h-10 sm:flex-none"
        >
          Our products
        </Link>
        <Link
          href="/services"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-muted sm:h-10 sm:flex-none"
        >
          Our services
        </Link>
      </div>

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
