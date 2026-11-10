"use client";

import Link from "next/link";

import { useCart } from "./cart-provider";
import { CartIcon } from "./icons";

export function CartLink() {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
    >
      <CartIcon className="size-5" />
      {hydrated && count > 0 ? (
        <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1.5 text-center text-xs font-semibold leading-5 text-primary-foreground">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
