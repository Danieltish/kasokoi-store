"use client";

import { useEffect, useState } from "react";

import {
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { whatsappUrl } from "@/lib/site";

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
            <LogoMark className="size-5 shrink-0 sm:size-6" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-white sm:text-sm">
              KASOKOI
            </span>
            <span className="h-4 w-px bg-white/25" />
            <span className="rounded-full bg-accent-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-300 ring-1 ring-accent-400/40 sm:px-2.5 sm:text-xs">
              Black Friday
            </span>
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-2 text-xs font-semibold sm:text-sm">
            <span className="text-brand-400">Kila Kitu</span>
            <span className="text-white">Iko</span>
            <span className="size-1.5 rounded-full bg-accent-400" />
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-2 text-xs font-semibold sm:text-sm">
            <TruckIcon className="size-4 shrink-0 text-brand-400 sm:size-5" />
            <span className="text-white">Door to door delivery</span>
            <span className="text-accent-300">across Kenya</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-2 text-xs font-semibold sm:text-sm">
            <ShieldCheckIcon className="size-4 shrink-0 text-accent-400 sm:size-5" />
            <span className="text-white">Lipa after</span>
            <span className="text-brand-400">umepata</span>
          </span>
        );
      default:
        return (
          <a
            href={whatsappUrl(
              "Hi Kasokoi Store, I would like to place an order.",
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline sm:gap-2 sm:text-sm"
          >
            <WhatsAppIcon className="size-4 shrink-0 text-[#25D366] sm:size-5" />
            <span className="whitespace-nowrap text-white">
              Call/WhatsApp
            </span>
            <span className="whitespace-nowrap font-bold text-accent-300">
              0717376964
            </span>
            <span className="whitespace-nowrap text-white">to order</span>
          </a>
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
        className="pointer-events-none absolute -left-16 top-1/2 size-40 -translate-y-1/2 rounded-full bg-brand-600/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 size-40 -translate-y-1/2 rounded-full bg-accent-500/25 blur-3xl"
      />

      <div
        key={index}
        className="relative z-10 mx-auto flex min-h-11 w-full max-w-6xl animate-[promo-slide_350ms_ease-out] items-center justify-center px-4 py-2 pr-14 text-center motion-reduce:animate-none sm:min-h-12 sm:px-6 sm:pr-20"
      >
        {slide()}
      </div>

      <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center gap-1.5 sm:right-6">
        {Array.from({ length: SLIDE_COUNT }).map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`Show promotion ${dotIndex + 1}`}
            aria-current={dotIndex === index ? "true" : undefined}
            onClick={() => setIndex(dotIndex)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              dotIndex === index
                ? "w-5 bg-accent-400"
                : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="h-0.5 w-full bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600"
      />
    </section>
  );
}
