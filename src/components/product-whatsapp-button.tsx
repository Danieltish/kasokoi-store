"use client";

import { useSyncExternalStore } from "react";

import { SITE, formatKes, whatsappUrl } from "@/lib/site";

import { WhatsAppIcon } from "./icons";

type ProductWhatsAppButtonProps = {
  slug: string;
  name: string;
  brand: string;
  priceKes: number;
  inStock: boolean;
};

function buildMessage(
  origin: string,
  product: ProductWhatsAppButtonProps,
) {
  const productUrl = `${origin}/product/${product.slug}`;

  return `Hi ${SITE.name}, I'd like to order:\n\n${product.name} (${product.brand})\nPrice: ${formatKes(product.priceKes)}\nLink: ${productUrl}`;
}

const subscribe = () => () => {};

export function ProductWhatsAppButton(product: ProductWhatsAppButtonProps) {
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => SITE.url,
  );
  const href = whatsappUrl(buildMessage(origin, product));

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
