"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { SITE, formatKes, whatsappUrl } from "@/lib/site";

import { WhatsAppIcon } from "./icons";

type ProductWhatsAppButtonProps = {
  slug: string;
  name: string;
  brand: string;
  priceKes: number;
  inStock: boolean;
};

type Customer = {
  name: string;
  phone: string | null;
};

const subscribe = () => () => {};

function buildMessage(
  origin: string,
  product: ProductWhatsAppButtonProps,
  customer: Customer | null,
) {
  const productUrl = `${origin}/product/${product.slug}`;

  return [
    `Hi ${SITE.name}, I'd like to order:`,
    "",
    `${product.name} (${product.brand})`,
    `Price: ${formatKes(product.priceKes)}`,
    `Link: ${productUrl}`,
    "",
    ...(customer ? [`Name: ${customer.name}`] : []),
    ...(customer?.phone ? [`Phone: ${customer.phone}`] : []),
    `Payment: M-Pesa Buy Goods Till ${SITE.mpesaTill}`,
  ].join("\n");
}

export function ProductWhatsAppButton(product: ProductWhatsAppButtonProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => SITE.url,
  );

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user: Customer | null }) => {
        if (active) {
          setCustomer(data.user);
        }
      })
      .catch(() => {
        if (active) {
          setCustomer(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const href = whatsappUrl(buildMessage(origin, product, customer));

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90 sm:w-auto"
    >
      <WhatsAppIcon className="size-5" />
      {product.inStock ? "Order on WhatsApp" : "Ask about availability"}
    </a>
  );
}
