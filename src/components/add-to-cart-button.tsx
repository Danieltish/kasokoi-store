"use client";

import { useEffect, useRef, useState } from "react";

import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  slug: string;
  name: string;
  brand: string;
  priceKes: number;
  image: string | null;
  stock: number;
  className?: string;
};

export function AddToCartButton({
  className = "",
  ...product
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold text-muted-foreground ${className}`}
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem({
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          priceKes: product.priceKes,
          image: product.image,
          stock: product.stock,
        });

        setAdded(true);

        if (timer.current) {
          window.clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => setAdded(false), 2000);
      }}
      className={`inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 ${className}`}
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
