"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import { LogoMark } from "@/components/logo";
import { formatKes } from "@/lib/site";

export default function CartPage() {
  const { items, subtotalKes, hydrated, setQuantity, removeItem } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <LogoMark className="size-14" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse the catalog and add products to your cart.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} product{items.length === 1 ? "" : "s"} in your cart
      </p>

      <div className="mt-6 grid gap-6 sm:gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {items.map((item) => (
            <li key={item.slug} className="flex gap-3 p-4 sm:gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:size-24">
                {item.image ? (
                  <Image draggable={false}
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.brand}
                </span>
                <Link
                  href={`/product/${item.slug}`}
                  className="line-clamp-2 text-sm font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatKes(item.priceKes)} each
                </span>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="size-9 text-lg leading-none disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      disabled={item.quantity >= Math.max(1, item.stock)}
                      aria-label="Increase quantity"
                      className="size-9 text-lg leading-none disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="text-sm text-muted-foreground underline-offset-2 hover:text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="shrink-0 whitespace-nowrap text-right text-xs font-semibold sm:text-sm">
                {formatKes(item.priceKes * item.quantity)}
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatKes(subtotalKes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-muted-foreground">
                Calculated at checkout
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatKes(subtotalKes)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-5 flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
