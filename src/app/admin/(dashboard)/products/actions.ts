"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  Prisma,
  ProductCondition,
} from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { CATALOG_TAGS } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export type ProductFormState = { error?: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") {
    return null;
  }

  const parsed = Math.round(Number(value));

  return Number.isFinite(parsed) ? parsed : null;
}

function parseSpecs(value: string) {
  const entries: [string, string][] = [];

  for (const line of value.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    const separator = trimmed.indexOf(":");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const specValue = trimmed.slice(separator + 1).trim();

    if (key && specValue) {
      entries.push([key, specValue]);
    }
  }

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

function revalidateCatalog() {
  revalidateTag(CATALOG_TAGS.products, { expire: 0 });
  revalidateTag(CATALOG_TAGS.categories, { expire: 0 });
  revalidatePath("/admin/products");
}

export async function saveProductAction(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const sku = String(formData.get("sku") ?? "").trim();
  const conditionValue = String(formData.get("condition") ?? "NEW");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const specsText = String(formData.get("specs") ?? "");
  const isActive = formData.get("isActive") === "on";

  const priceKes = parsePrice(formData.get("priceKes"));
  const compareAtPriceKes = parsePrice(formData.get("compareAtPriceKes"));
  const stock = Math.max(0, Math.round(Number(formData.get("stock") ?? 0)));

  const condition = (
    [ProductCondition.NEW, ProductCondition.REFURBISHED, ProductCondition.USED]
      .find((value) => value === conditionValue) ?? ProductCondition.NEW
  ) as ProductCondition;

  if (name.length < 2) {
    return { error: "Enter a product name." };
  }

  if (!brand) {
    return { error: "Enter a brand." };
  }

  if (description.length < 10) {
    return { error: "Add a short description (at least 10 characters)." };
  }

  if (!sku) {
    return { error: "Enter a unique SKU." };
  }

  if (!priceKes || priceKes <= 0) {
    return { error: "Enter a valid price in KES." };
  }

  if (!Number.isFinite(stock)) {
    return { error: "Enter a valid stock quantity." };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, image: true },
  });

  if (!category) {
    return { error: "Choose a category." };
  }

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const specs = parseSpecs(specsText);
  const specsValue: Prisma.InputJsonValue | typeof Prisma.DbNull = specs
    ? specs
    : Prisma.DbNull;

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data: {
          name,
          slug,
          brand,
          description,
          categoryId: category.id,
          sku,
          condition,
          priceKes,
          compareAtPriceKes,
          stock,
          isActive,
          specs: specsValue,
        },
      });

      if (imageUrl) {
        await prisma.productImage.deleteMany({ where: { productId: id } });
        await prisma.productImage.create({
          data: { productId: id, url: imageUrl, alt: name, position: 0 },
        });
      }
    } else {
      const image = imageUrl || category.image;

      await prisma.product.create({
        data: {
          name,
          slug,
          brand,
          description,
          categoryId: category.id,
          sku,
          condition,
          priceKes,
          compareAtPriceKes,
          stock,
          isActive,
          specs: specsValue,
          ...(image
            ? { images: { create: { url: image, alt: name, position: 0 } } }
            : {}),
        },
      });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "That slug or SKU is already used by another product." };
    }

    console.error("Failed to save product", error);

    return { error: "Could not save the product. Please try again." };
  }

  revalidateCatalog();
  redirect("/admin/products");
}

export async function toggleProductActiveAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!product) {
    return;
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });

  revalidateCatalog();
}
