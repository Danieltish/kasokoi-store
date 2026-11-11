import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LogoMark } from "@/components/logo";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceQuoteForm } from "@/components/services/service-quote-form";
import {
  getRelatedServices,
  getServiceBySlug,
  getServiceCategories,
  getServices,
} from "@/lib/services";
import { formatKes, SITE } from "@/lib/site";

type Params = Promise<{ category: string; service: string }>;

export async function generateStaticParams() {
  const categories = await getServiceCategories();
  const params: { category: string; service: string }[] = [];

  for (const category of categories) {
    const services = await getServices(category.slug);

    for (const service of services) {
      params.push({ category: category.slug, service: service.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category, service } = await params;
  const item = await getServiceBySlug(category, service);

  if (!item) {
    return { title: "Service not found" };
  }

  return {
    title: `${item.name} — ${item.category.name}`,
    description: item.description,
    openGraph: {
      type: "website",
      title: `${item.name} — ${SITE.name}`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { category, service: serviceSlug } = await params;
  const service = await getServiceBySlug(category, serviceSlug);

  if (!service) {
    notFound();
  }

  const related = await getRelatedServices(category, serviceSlug);
  const serviceUrl = `${SITE.url}/services/${service.category.slug}/${service.slug}`;
  const priceLabel = service.priceFromKes
    ? `From ${formatKes(service.priceFromKes)}`
    : (service.priceNote ?? "Request a quote");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.category.name,
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: `+${SITE.whatsappNumber}`,
    },
    areaServed: service.coverage ?? "Kenya",
    url: serviceUrl,
    ...(service.image
      ? {
          image: service.image.startsWith("http")
            ? service.image
            : `${SITE.url}${service.image}`,
        }
      : {}),
    ...(service.priceFromKes
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "KES",
            price: service.priceFromKes,
            availability: "https://schema.org/InStock",
            url: serviceUrl,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/services" className="hover:text-foreground">
          Services
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/services/${service.category.slug}`}
          className="hover:text-foreground"
        >
          {service.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{service.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted lg:aspect-square">
          {service.image ? (
            <Image
              draggable={false}
              src={service.image}
              alt={service.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500">
              <LogoMark className="size-24" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
                Kasokoi Service
              </span>
            </div>
          )}
        </div>

        <div>
          <span className="inline-flex rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {service.category.name}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {service.name}
          </h1>
          <p className="mt-3 text-muted-foreground">{service.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Price
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {priceLabel}
              </p>
            </div>
            {service.duration ? (
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Duration
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {service.duration}
                </p>
              </div>
            ) : null}
            {service.coverage ? (
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Coverage
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {service.coverage}
                </p>
              </div>
            ) : null}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Final price depends on the scope of work, your location and any
            materials needed. We confirm everything on WhatsApp before booking.
          </p>

          <div className="mt-6">
            <ServiceQuoteForm
              serviceName={service.name}
              categoryName={service.category.name}
              categorySlug={service.category.slug}
              serviceSlug={service.slug}
              priceFromKes={service.priceFromKes}
              priceNote={service.priceNote}
            />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            More {service.category.name.toLowerCase()} services
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
