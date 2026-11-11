"use server";

import { slugify } from "@/lib/slug";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  Prisma,
  ProductCondition,
} from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { CATALOG_TAGS } from "@/lib/catalog";
import { isAllowedImageUrl } from "@/lib/image-urls";
import { prisma } from "@/lib/prisma";
import { deleteStorageImages } from "@/lib/storage";

export type ProductFormState = { error?: string };

const MAX_INT = 2_147_483_647;

function parsePrice(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") {
    return null;
  }

  const parsed = Math.round(Number(value));

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > MAX_INT) {
    return null;
  }

  return parsed;
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
  const rawImageUrls = formData
    .getAll("imageUrls")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const imageUrls = [...new Set(rawImageUrls)];
  const specsText = String(formData.get("specs") ?? "");
  const isActive = formData.get("isActive") === "on";

  const priceKes = parsePrice(formData.get("priceKes"));
  const compareAtPriceKes = parsePrice(formData.get("compareAtPriceKes"));
  const stock = Math.min(
    MAX_INT,
    Math.max(0, Math.round(Number(formData.get("stock") ?? 0))),
  );

  const condition = (
    [
      ProductCondition.NEW,
      ProductCondition.REFURBISHED,
      ProductCondition.USED,
      ProductCondition.EX_UK,
    ].find((value) => value === conditionValue) ?? ProductCondition.NEW
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

  if (rawImageUrls.some((url) => !isAllowedImageUrl(url))) {
    return { error: "One or more image links are not supported." };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, image: true },
  });

  if (!category) {
    return { error: "Choose a category." };
  }

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const existingImages = id
    ? await prisma.productImage.findMany({
        where: { productId: id },
        select: { url: true },
      })
    : [];
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

      await prisma.productImage.deleteMany({ where: { productId: id } });

      if (imageUrls.length > 0) {
        await prisma.productImage.createMany({
          data: imageUrls.map((url, position) => ({
            productId: id,
            url,
            alt: name,
            position,
          })),
        });
      }

      const removedImages = existingImages
        .map((image) => image.url)
        .filter((url) => !imageUrls.includes(url));

      await deleteStorageImages(removedImages);
    } else {
      const images =
        imageUrls.length > 0
          ? imageUrls
          : category.image
            ? [category.image]
            : [];

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
          ...(images.length > 0
            ? {
                images: {
                  create: images.map((url, position) => ({
                    url,
                    alt: name,
                    position,
                  })),
                },
              }
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
