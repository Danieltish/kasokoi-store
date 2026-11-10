"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { CATALOG_TAGS } from "@/lib/catalog";
import { isAllowedImageUrl } from "@/lib/image-urls";
import { prisma } from "@/lib/prisma";
import { deleteStorageImages } from "@/lib/storage";

export type CategoryFormState = { error?: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveCategoryAction(
  _previous: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (name.length < 2) {
    return { error: "Enter a category name." };
  }

  if (image && !isAllowedImageUrl(image)) {
    return { error: "That category image link is not supported." };
  }

  const data = {
    name,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    description: description || null,
    image: image || null,
  };

  try {
    if (id) {
      const existing = await prisma.category.findUnique({
        where: { id },
        select: { image: true },
      });

      await prisma.category.update({ where: { id }, data });

      if (existing?.image && existing.image !== data.image) {
        await deleteStorageImages([existing.image]);
      }
    } else {
      await prisma.category.create({ data });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "That category slug is already used." };
    }

    console.error("Failed to save category", error);

    return { error: "Could not save the category. Please try again." };
  }

  revalidateTag(CATALOG_TAGS.categories, { expire: 0 });
  revalidateTag(CATALOG_TAGS.products, { expire: 0 });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
