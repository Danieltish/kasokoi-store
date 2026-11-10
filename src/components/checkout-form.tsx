"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { useCart } from "@/components/cart-provider";
import type { DeliveryZoneOption } from "@/lib/delivery";
import { deliveryFeeFor } from "@/lib/pricing";
import { normalizeKenyanPhone } from "@/lib/phone";
import { formatKes } from "@/lib/site";

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

export function CheckoutForm({ zones }: { zones: DeliveryZoneOption[] }) {
  const { items, subtotalKes, hydrated, clear } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [county, setCounty] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickupZone = zones.find((zone) => zone.isPickup);

  const countyOptions = useMemo(() => {
    const map = new Map<string, DeliveryZoneOption>();

    for (const zone of zones) {
      if (zone.isPickup) {
        continue;
      }

      for (const name of zone.counties) {
        if (!map.has(name)) {
          map.set(name, zone);
        }
      }
    }

    return [...map.entries()]
      .map(([name, zone]) => ({ county: name, zone }))
      .sort((a, b) => a.county.localeCompare(b.county));
  }, [zones]);

  const zone =
    method === "pickup"
      ? pickupZone
      : countyOptions.find((option) => option.county === county)?.zone;

  const deliveryFee = zone ? deliveryFeeFor(zone, subtotalKes) : 0;
  const totalKes = subtotalKes + deliveryFee;

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-xl bg-muted" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a product before checking out.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!normalizeKenyanPhone(phone)) {
      setError("Enter a valid Kenyan phone number, e.g. 0712 345 678.");
      return;
    }

    if (!zone) {
      setError(
        method === "pickup"
          ? "Pickup is currently unavailable. Choose delivery instead."
          : "Select the county we should deliver to.",
      );
      return;
    }

    if (method === "delivery" && address.trim().length < 4) {
      setError("Enter a delivery address or landmark.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email: email || undefined,
          county: method === "pickup" ? undefined : county,
          address: method === "pickup" ? undefined : address,
          notes: notes || undefined,
          deliveryZoneId: zone.id,
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { orderNumber?: string; error?: string }
        | null;

      if (!response.ok || !result?.orderNumber) {
        setError(result?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/order/${result.orderNumber}`);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-8 lg:grid-cols-[1fr_360px]"
    >
      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">1. Contact details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Full name
              <input
                required
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                autoComplete="name"
                placeholder="Jane Wanjiku"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Phone (M-Pesa)
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="0712 345 678"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
              Email (optional)
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">2. Delivery</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label
              className={`cursor-pointer rounded-lg border p-4 text-sm ${
                method === "delivery"
                  ? "border-primary bg-brand-50 dark:bg-brand-950/30"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="method"
                value="delivery"
                checked={method === "delivery"}
                onChange={() => setMethod("delivery")}
                className="mr-2"
              />
              <span className="font-medium">Courier delivery</span>
              <span className="mt-1 block text-muted-foreground">
                Nairobi same-day where possible; nationwide courier.
              </span>
            </label>
            <label
              className={`cursor-pointer rounded-lg border p-4 text-sm ${
                method === "pickup"
                  ? "border-primary bg-brand-50 dark:bg-brand-950/30"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="method"
                value="pickup"
                checked={method === "pickup"}
                onChange={() => setMethod("pickup")}
                className="mr-2"
              />
              <span className="font-medium">Pickup in Nairobi</span>
              <span className="mt-1 block text-muted-foreground">
                We&apos;ll share the pickup point on WhatsApp.
              </span>
            </label>
          </div>

          {method === "delivery" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium">
                County
                <select
                  required
                  value={county}
                  onChange={(event) => setCounty(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select county</option>
                  {countyOptions.map((option) => (
                    <option key={option.county} value={option.county}>
                      {option.county}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
                Delivery address / landmark
                <textarea
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows={3}
                  placeholder="Estate, street, building, landmark"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </label>
            </div>
          ) : null}

          <label className="mt-4 flex flex-col gap-1 text-sm font-medium">
            Order notes (optional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              placeholder="Anything we should know?"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-28">
        <h2 className="font-semibold">Order summary</h2>

        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.slug} className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium">
                {formatKes(item.priceKes * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatKes(subtotalKes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Delivery
              {zone ? ` (${zone.name})` : ""}
            </span>
            <span className="font-medium">
              {zone
                ? deliveryFee === 0
                  ? "Free"
                  : formatKes(deliveryFee)
                : "—"}
            </span>
          </div>
          {zone?.freeOverKes ? (
            <p className="text-xs text-muted-foreground">
              Free delivery over {formatKes(zone.freeOverKes)}.
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatKes(totalKes)}</span>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Place order on WhatsApp"}
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          You&apos;ll confirm and arrange payment on WhatsApp. No payment is
          taken on this site yet.
        </p>
      </aside>
    </form>
  );
}
