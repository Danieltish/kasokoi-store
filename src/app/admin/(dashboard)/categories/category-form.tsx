"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ImageUploader } from "@/components/admin/image-uploader";

import { saveCategoryAction, type CategoryFormState } from "./actions";

export type CategoryInitial = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

const initialState: CategoryFormState = {};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

export function CategoryForm({ category }: { category?: CategoryInitial }) {
  const [state, formAction, pending] = useActionState(
    saveCategoryAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={category?.id ?? ""} />

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input
            required
            name="name"
            defaultValue={category?.name}
            placeholder="Networking Equipment"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Slug (optional)
          <input
            name="slug"
            defaultValue={category?.slug}
            placeholder="auto-generated"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Description
          <textarea
            name="description"
            rows={3}
            defaultValue={category?.description}
            placeholder="Short description shown on the category page."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
          />
        </label>
      </div>

      <ImageUploader
        name="image"
        initialImages={category?.image ? [{ url: category.image }] : []}
        multiple={false}
        title="Category image"
        description="Shown on category cards and used as a fallback image for products without photos."
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
          {pending ? "Saving…" : category ? "Save changes" : "Create category"}
        </button>
        <Link
          href="/admin/categories"
          className="text-center text-sm font-medium text-muted-foreground hover:text-foreground sm:text-left"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
