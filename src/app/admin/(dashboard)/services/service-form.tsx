"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ImageUploader } from "@/components/admin/image-uploader";

import { saveServiceAction, type ServiceFormState } from "./actions";

type CategoryOption = { id: string; name: string };

export type ServiceInitial = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  priceFromKes: number | null;
  priceNote: string;
  duration: string;
  coverage: string;
  image: string;
  isActive: boolean;
};

const initialState: ServiceFormState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

const labelClass = "flex flex-col gap-1 text-sm font-medium";

export function ServiceForm({
  categories,
  service,
}: {
  categories: CategoryOption[];
  service?: ServiceInitial;
}) {
  const [state, formAction, pending] = useActionState(
    saveServiceAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={service?.id ?? ""} />

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Service details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name
            <input
              required
              name="name"
              defaultValue={service?.name}
              placeholder="House Cleaning Services"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Slug (optional)
            <input
              name="slug"
              defaultValue={service?.slug}
              placeholder="auto-generated from name"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Category
            <select
              required
              name="categoryId"
              defaultValue={service?.categoryId ?? ""}
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
            Starting price (KES, optional)
            <input
              type="number"
              name="priceFromKes"
              min={0}
              step={1}
              defaultValue={service?.priceFromKes ?? undefined}
              placeholder="Leave blank for a quote"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Price note (optional)
            <input
              name="priceNote"
              defaultValue={service?.priceNote}
              placeholder="Request a quote"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Duration (optional)
            <input
              name="duration"
              defaultValue={service?.duration}
              placeholder="1–2 hrs"
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Coverage (optional)
            <input
              name="coverage"
              defaultValue={service?.coverage}
              placeholder="Nairobi & surrounding areas"
              className={fieldClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={service ? service.isActive : true}
              className="size-4"
            />
            Visible on the storefront
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Description
            <textarea
              required
              name="description"
              rows={4}
              defaultValue={service?.description}
              placeholder="What does this service include?"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
            />
          </label>
        </div>
      </section>

      <ImageUploader
        name="image"
        initialImages={service?.image ? [{ url: service.image }] : []}
        multiple={false}
        title="Service image"
        description="Optional. If empty, a branded gradient is shown."
      />

      {state.error ? (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Saving…" : service ? "Save changes" : "Create service"}
        </button>
        <Link
          href="/admin/services"
          className="text-center text-sm font-medium text-muted-foreground hover:text-foreground sm:text-left"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
