"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveProductAction, type ProductFormState } from "./actions";
import { ProductImages, type ProductImageInput } from "./product-images";

type CategoryOption = { id: string; name: string };

export type ProductInitial = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  categoryId: string;
  sku: string;
  condition: string;
  priceKes: number;
  compareAtPriceKes: number | null;
  stock: number;
  isActive: boolean;
  images: ProductImageInput[];
  specsText: string;
};

const initialState: ProductFormState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

const labelClass = "flex flex-col gap-1 text-sm font-medium";

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductInitial;
}) {
  const [state, formAction, pending] = useActionState(
    saveProductAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={product?.id ?? ""} />

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Product details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name
            <input
              required
              name="name"
              defaultValue={product?.name}
              placeholder="Ubiquiti UniFi U6 Pro"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Slug (optional)
            <input
              name="slug"
              defaultValue={product?.slug}
              placeholder="auto-generated from name"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Brand
            <input
              required
              name="brand"
              defaultValue={product?.brand}
              placeholder="Ubiquiti"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            SKU
            <input
              required
              name="sku"
              defaultValue={product?.sku}
              placeholder="NET-UBI-U6P"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Category
            <select
              required
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              className={fieldClass}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Condition
            <select
              name="condition"
              defaultValue={product?.condition ?? "NEW"}
              className={fieldClass}
            >
              <option value="NEW">New</option>
              <option value="REFURBISHED">Refurbished</option>
              <option value="USED">Used</option>
            </select>
          </label>
          <label className={labelClass}>
            Price (KES)
            <input
              required
              type="number"
              name="priceKes"
              min={1}
              step={1}
              defaultValue={product?.priceKes}
              placeholder="28500"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Compare-at price (optional)
            <input
              type="number"
              name="compareAtPriceKes"
              min={0}
              step={1}
              defaultValue={product?.compareAtPriceKes ?? undefined}
              placeholder="32000"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Stock
            <input
              required
              type="number"
              name="stock"
              min={0}
              step={1}
              defaultValue={product?.stock ?? 0}
              className={fieldClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product ? product.isActive : true}
              className="size-4"
            />
            Visible in the store
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Description
            <textarea
              required
              name="description"
              rows={4}
              defaultValue={product?.description}
              placeholder="What makes this product special?"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Specifications (one per line, <code>Label: Value</code>)
            <textarea
              name="specs"
              rows={5}
              defaultValue={product?.specsText}
              placeholder={"Ports: 5x Gigabit\nPoE out: Yes\nRouterOS: Level 4"}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
            />
          </label>
        </div>
      </section>

      <ProductImages initialImages={product?.images ?? []} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <Link
          href="/admin/products"
          className="text-center text-sm font-medium text-muted-foreground hover:text-foreground sm:text-left"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
