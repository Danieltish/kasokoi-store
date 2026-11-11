import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceCategoryCard } from "@/components/services/service-category-card";
import { getServiceCategories, getServices } from "@/lib/services";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Beauty, cleaning, repairs, technology, delivery and errand services across Kenya. Request a quote on WhatsApp.",
};

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-brand-50 to-card p-6 sm:p-8 dark:from-brand-950/30">
        <div className="flex flex-wrap items-center gap-3">
          <LogoMark className="size-10" />
          <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary ring-1 ring-border">
            Kasokoi services
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Our services
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Professional help for your home, business and everyday life — from
          beauty and cleaning to repairs, tech and deliveries. Tell us what you
          need and we&apos;ll send a quote on WhatsApp.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappUrl(
              `Hi ${SITE.name}, I would like help choosing a service.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground hover:opacity-90"
          >
            <WhatsAppIcon className="size-4" />
            Ask about a service
          </a>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-muted"
          >
            Shop products
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Service categories
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              All services
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {services.length} service{services.length === 1 ? "" : "s"}{" "}
              available.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
