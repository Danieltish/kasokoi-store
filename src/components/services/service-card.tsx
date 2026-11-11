import Image from "next/image";
import Link from "next/link";

import { LogoMark } from "@/components/logo";
import type { ServiceSummary } from "@/lib/services";
import { formatKes } from "@/lib/site";

function priceLabel(service: ServiceSummary) {
  if (service.priceFromKes) {
    return `From ${formatKes(service.priceFromKes)}`;
  }

  return service.priceNote ?? "Request a quote";
}

export function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <Link
      href={`/services/${service.category.slug}/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {service.image ? (
          <Image
            draggable={false}
            src={service.image}
            alt={service.name}
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500">
            <LogoMark className="size-12 opacity-90 transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
          {service.category.name}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
          {service.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-xs">
          <span className="font-semibold text-primary">
            {priceLabel(service)}
          </span>
          {service.duration ? (
            <span className="text-muted-foreground">{service.duration}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
