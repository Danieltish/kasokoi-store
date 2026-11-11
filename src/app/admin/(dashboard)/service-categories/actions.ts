"use server";

import { slugify } from "@/lib/slug";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { isAllowedImageUrl } from "@/lib/image-urls";
import { prisma } from "@/lib/prisma";
import { SERVICE_TAGS } from "@/lib/services";
import { deleteStorageImages } from "@/lib/storage";

export type ServiceCategoryFormState = { error?: string };

function revalidateServices() {
  revalidateTag(SERVICE_TAGS.categories, { expire: 0 });
  revalidateTag(SERVICE_TAGS.services, { expire: 0 });
  revalidatePath("/services");
  revalidatePath("/admin/service-categories");
}

export async function saveServiceCategoryAction(
  _previous: ServiceCategoryFormState,
  formData: FormData,
): Promise<ServiceCategoryFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2) {
    return { error: "Enter a service category name." };
  }

  if (image && !isAllowedImageUrl(image)) {
    return { error: "That image link is not supported." };
  }

  const data = {
    name,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    description: description || null,
    image: image || null,
    isActive,
  };

  try {
    if (id) {
      const existing = await prisma.serviceCategory.findUnique({
        where: { id },
        select: { image: true },
      });

      await prisma.serviceCategory.update({ where: { id }, data });

      if (existing?.image && existing.image !== data.image) {
        await deleteStorageImages([existing.image]);
      }
    } else {
      await prisma.serviceCategory.create({ data });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "That service category slug is already used." };
    }

    console.error("Failed to save service category", error);

    return { error: "Could not save the service category. Please try again." };
  }

  revalidateServices();
  redirect("/admin/service-categories");
}

export async function toggleServiceCategoryActiveAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const category = await prisma.serviceCategory.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!category) {
    return;
  }

  await prisma.serviceCategory.update({
    where: { id },
    data: { isActive: !category.isActive },
  });

  revalidateServices();
}
