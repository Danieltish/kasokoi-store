const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254717376964";

export const SITE = {
  name: "Kasokoi Store",
  tagline: "Genuine electronics, delivered across Kenya",
  description:
    "Shop genuine electronics in Kenya — phones, TVs, laptops, audio and accessories. Order on WhatsApp with delivery in Nairobi and nationwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
