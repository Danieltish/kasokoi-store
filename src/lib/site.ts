const DEFAULT_SITE_URL = "https://kasokoi.co.ke";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl =
  configuredSiteUrl &&
  !/^https?:\/\/localhost(:\d+)?$/i.test(configuredSiteUrl)
    ? configuredSiteUrl.replace(/\/+$/, "")
    : DEFAULT_SITE_URL;

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254717376964";

export const SITE = {
  name: "Kasokoi Store",
  tagline: "Everyday essentials and trusted services, delivered across Kenya",
  description:
    "Shop phones, electronics, home appliances, fashion, beauty and farm supplies, or book trusted services — cleaning, beauty, repairs, tech, delivery and more. Order or request a quote on WhatsApp with delivery in Nairobi and nationwide.",
  url: siteUrl,
  whatsappNumber,
  whatsappDisplay: `+${whatsappNumber.slice(0, 3)} ${whatsappNumber.slice(3, 6)} ${whatsappNumber.slice(6)}`,
  currency: "KES",
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;

  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}
