import type { Metadata } from "next";
import Link from "next/link";

import {
  ChatIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Kasokoi Store is a Kenyan online store for everyday essentials — phones, electronics, home appliances, fashion, beauty, groceries and farm supplies.",
};

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Genuine products",
    text: "We source from trusted suppliers and check stock before confirming your order.",
  },
  {
    icon: TruckIcon,
    title: "Nairobi & nationwide",
    text: "Same-day delivery where possible, with courier delivery to all counties.",
  },
  {
    icon: ChatIcon,
    title: "A real person on WhatsApp",
    text: "Ask questions, confirm stock and arrange delivery or payment with our team.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center gap-3">
        <LogoMark className="size-12" />
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">
          {SITE.name}
        </span>
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
        About us
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {SITE.name} is a Kenyan online store built for everyday shopping. We
        bring together phones, electronics, home appliances, fashion, beauty,
        groceries, farm supplies and livestock essentials — with honest KES
        prices and WhatsApp-first ordering.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-primary dark:bg-brand-950/40">
              <value.icon className="size-5" />
            </span>
            <h2 className="mt-3 font-semibold">{value.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{value.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          What you can buy
        </h2>
        <p className="mt-2 text-muted-foreground">
          Our catalog keeps growing. Popular categories include:
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            "Phones & tablets",
            "Computers & accessories",
            "TV, audio & cameras",
            "Home appliances",
            "Solar & power",
            "Fashion & accessories",
            "Beauty & personal care",
            "Groceries & household",
            "Agriculture & farm produce",
            "Livestock & animal care",
            "Building, tools & hardware",
            "Automotive & motorbike",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">
          How ordering works
        </h2>
        <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1. Browse</span> the
            catalog or search for what you need.
          </li>
          <li>
            <span className="font-medium text-foreground">2. Add to cart</span>{" "}
            and check out with your delivery details.
          </li>
          <li>
            <span className="font-medium text-foreground">3. Confirm</span> on
            WhatsApp — we check stock, delivery fee and payment before dispatch.
          </li>
        </ol>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Browse products
          </Link>
          <a
            href={whatsappUrl(`Hi ${SITE.name}, I would like to know more.`)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground hover:opacity-90"
          >
            <WhatsAppIcon className="size-4" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
