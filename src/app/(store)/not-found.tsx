import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { SITE, whatsappUrl } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <LogoMark className="size-14" />
      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The product or page may have moved. Browse the catalog or ask us on
        WhatsApp and we&apos;ll help you find it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Browse products
        </Link>
        <a
          href={whatsappUrl(`Hi ${SITE.name}, I'm looking for a product.`)}
          className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
