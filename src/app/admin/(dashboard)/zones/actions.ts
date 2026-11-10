"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { DELIVERY_TAG } from "@/lib/delivery";
import { prisma } from "@/lib/prisma";

export async function updateZoneAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const feeKes = Math.max(0, Math.round(Number(formData.get("feeKes") ?? 0)));
  const freeOverRaw = String(formData.get("freeOverKes") ?? "").trim();
  const freeOverKes =
    freeOverRaw === "" ? null : Math.max(0, Math.round(Number(freeOverRaw)));
  const isActive = formData.get("isActive") === "on";

  if (!id || !Number.isFinite(feeKes)) {
    return;
  }

  if (freeOverKes !== null && !Number.isFinite(freeOverKes)) {
    return;
  }

  await prisma.deliveryZone.update({
    where: { id },
    data: { feeKes, freeOverKes, isActive },
  });

  revalidateTag(DELIVERY_TAG, { expire: 0 });
  revalidatePath("/admin/zones");
  revalidatePath("/checkout");
}
