"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import { WhatsAppIcon } from "@/components/icons";
import { formatKes, SITE, whatsappUrl } from "@/lib/site";

const subscribe = () => () => {};

type Customer = {
  name: string;
  email: string;
  phone: string | null;
};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

export function ServiceQuoteForm({
  serviceName,
  categoryName,
  categorySlug,
  serviceSlug,
  priceFromKes,
  priceNote,
}: {
  serviceName: string;
  categoryName: string;
  categorySlug: string;
  serviceSlug: string;
  priceFromKes: number | null;
  priceNote: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const preferred = String(form.get("preferred") ?? "").trim();
    const notes = String(form.get("notes") ?? "").trim();

    if (!name || !phone || !location) {
      setError("Enter your name, phone number and location.");
      return;
    }

    const price = priceFromKes
      ? `From ${formatKes(priceFromKes)}`
      : (priceNote ?? "Request a quote");
    const displayName =
      name.trim().toLowerCase() === "superadmin" ? "" : `Name: ${name}`;

    const message = [
      `Hi ${SITE.name}, I would like a quote for:`,
      "",
      `Service: ${serviceName}`,
      `Category: ${categoryName}`,
      `Price: ${price}`,
      `Link: ${origin}/services/${categorySlug}/${serviceSlug}`,
      "",
      displayName,
      `Phone: ${phone}`,
      `Location: ${location}`,
      preferred ? `Preferred date/time: ${preferred}` : "",
      notes ? `Details: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      key={customer?.email ?? "guest"}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-card p-5"
    >
      <div>
        <h2 className="font-semibold">Request a quote</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your details and we&apos;ll confirm pricing, availability and
          booking on WhatsApp.
        </p>
        {customer ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Prefilled from your account. You can change these details for this
            request.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Your name
          <input
            name="name"
            required
            defaultValue={customer?.name ?? ""}
            autoComplete="name"
            placeholder="Jane Wanjiku"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Phone
          <input
            name="phone"
            required
            defaultValue={customer?.phone ?? ""}
            inputMode="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Location
          <input
            name="location"
            required
            placeholder="Estate, area or town"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Preferred date / time (optional)
          <input
            name="preferred"
            placeholder="e.g. Saturday morning"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Details (optional)
          <textarea
            name="notes"
            rows={3}
            placeholder="Tell us anything useful about the job"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
          />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground hover:opacity-90"
      >
        <WhatsAppIcon className="size-5" />
        Request quote on WhatsApp
      </button>
      <p className="text-xs text-muted-foreground">
        No payment is taken on this site. We confirm the quote and booking on
        WhatsApp.
      </p>
    </form>
  );
}
