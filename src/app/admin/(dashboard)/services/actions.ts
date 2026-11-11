"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { isAllowedImageUrl } from "@/lib/image-urls";
import { prisma } from "@/lib/prisma";
import { SERVICE_TAGS } from "@/lib/services";
import { deleteStorageImages } from "@/lib/storage";

export type ServiceFormState = { error?: string };

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

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function revalidateServices() {
  revalidateTag(SERVICE_TAGS.categories, { expire: 0 });
  revalidateTag(SERVICE_TAGS.services, { expire: 0 });
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function saveServiceAction(
  _previous: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const priceFromKes = parsePrice(formData.get("priceFromKes"));
  const priceNote = String(formData.get("priceNote") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const coverage = String(formData.get("coverage") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2) {
    return { error: "Enter a service name." };
  }

  if (description.length < 10) {
    return { error: "Add a short description (at least 10 characters)." };
  }

  if (image && !isAllowedImageUrl(image)) {
    return { error: "That image link is not supported." };
  }

  if (String(formData.get("priceFromKes") ?? "").trim() && !priceFromKes) {
    return { error: "Enter a valid starting price in KES, or leave it blank." };
  }

  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: "Choose a service category." };
  }

  const data = {
    name,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    categoryId: category.id,
    description,
    priceFromKes,
    priceNote: priceNote || null,
    duration: duration || null,
    coverage: coverage || null,
    image: image || null,
    isActive,
  };

  try {
    if (id) {
      const existing = await prisma.service.findUnique({
        where: { id },
        select: { image: true },
      });

      await prisma.service.update({ where: { id }, data });

      if (existing?.image && existing.image !== data.image) {
        await deleteStorageImages([existing.image]);
      }
    } else {
      await prisma.service.create({ data });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "That service slug is already used." };
    }

    console.error("Failed to save service", error);

    return { error: "Could not save the service. Please try again." };
  }

  revalidateServices();
  redirect("/admin/services");
}

export async function toggleServiceActiveAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const service = await prisma.service.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!service) {
    return;
  }

  await prisma.service.update({
    where: { id },
    data: { isActive: !service.isActive },
  });

  revalidateServices();
}
