import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";
import { getDeliveryZones } from "@/lib/delivery";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const zones = await getDeliveryZones();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your delivery details. We&apos;ll confirm the order on WhatsApp.
      </p>
      <div className="mt-6">
        <CheckoutForm zones={zones} />
      </div>
    </div>
  );
}
