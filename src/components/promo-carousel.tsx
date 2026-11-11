"use client";

import { useEffect, useState } from "react";

import {
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { callUrl, whatsappUrl } from "@/lib/site";

const SLIDE_COUNT = 5;
const ROTATE_MS = 2000;

export function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDE_COUNT);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  function slide() {
    switch (index) {
      case 0:
        return (
          <span className="inline-flex items-center gap-2 sm:gap-3">
            <LogoMark className="size-6 shrink-0 sm:size-7" />
            <span className="text-sm font-bold tracking-[0.22em] text-white sm:text-lg">
              KASOKOI
            </span>
            <span className="h-5 w-px bg-white/25 sm:h-6" />
            <span className="rounded-full bg-accent-400/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-300 ring-1 ring-accent-400/40 sm:px-3 sm:text-sm">
              Black Friday
            </span>
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-2.5 text-base font-bold sm:text-xl">
            <span className="text-brand-400">Kila Kitu</span>
            <span className="text-white">Iko</span>
            <span className="size-2 rounded-full bg-accent-400" />
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-2.5 text-sm font-semibold sm:text-lg">
            <TruckIcon className="size-5 shrink-0 text-brand-400 sm:size-6" />
            <span className="whitespace-nowrap text-white">
              Door to door delivery
            </span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-2.5 text-sm font-semibold sm:text-lg">
            <ShieldCheckIcon className="size-5 shrink-0 text-accent-400 sm:size-6" />
            <span className="text-white">Lipa after</span>
            <span className="text-brand-400">umepata</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
            <a
              href={callUrl()}
              className="inline-flex items-center gap-1.5 hover:opacity-90 sm:gap-2"
            >
              <PhoneIcon className="size-4 shrink-0 text-brand-400 sm:size-5" />
              <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-white/70 sm:text-xs">
                Call
              </span>
              <span className="whitespace-nowrap text-lg font-extrabold tracking-tight text-accent-300 sm:text-2xl">
                0717376964
              </span>
            </a>
            <span className="text-[11px] font-medium text-white/40 sm:text-xs">
              or
            </span>
            <a
              href={whatsappUrl(
                "Hi Kasokoi Store, I would like to place an order.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:opacity-90 sm:gap-2"
            >
              <WhatsAppIcon className="size-4 shrink-0 text-[#25D366] sm:size-5" />
              <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-white/70 sm:text-xs">
                WhatsApp
              </span>
              <span className="whitespace-nowrap text-[11px] font-medium text-white/70 sm:text-xs">
                to order
              </span>
            </a>
          </span>
        );
    }
  }

  return (
    <section
      aria-label="Kasokoi Store promotions"
      className="relative isolate overflow-hidden bg-black text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-1/2 size-48 -translate-y-1/2 rounded-full bg-brand-600/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 size-48 -translate-y-1/2 rounded-full bg-accent-500/25 blur-3xl"
      />

      <div
        key={index}
        className="relative z-10 mx-auto flex min-h-14 w-full max-w-6xl animate-[promo-slide_350ms_ease-out] items-center justify-center px-4 py-2.5 text-center font-display motion-reduce:animate-none sm:min-h-16 sm:px-6 sm:py-3"
      >
        {slide()}
      </div>

      <div
        aria-hidden="true"
        className="h-0.5 w-full bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600"
      />
    </section>
  );
}
