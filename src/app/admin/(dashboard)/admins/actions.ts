"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { AdminRole } from "@/generated/prisma/client";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminFormState = { error?: string; success?: boolean };

export async function createAdminAction(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleValue = String(formData.get("role") ?? "STAFF");

  const role =
    Object.values(AdminRole).find((value) => value === roleValue) ??
    AdminRole.STAFF;

  if (name.length < 2) {
    return { error: "Enter the admin's name." };
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Use a password with at least 8 characters." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.adminUser.create({
      data: { name, email, passwordHash, role },
    });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "An admin with that email already exists." };
    }

    console.error("Failed to create admin", error);

    return { error: "Could not create the admin. Please try again." };
  }

  revalidatePath("/admin/admins");

  return { success: true };
}

export async function toggleAdminActiveAction(formData: FormData) {
  const session = await requireSuperAdmin();
  const id = String(formData.get("id") ?? "");

  if (!id || id === session.id) {
    return;
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id },
    select: { role: true, isActive: true },
  });

  if (!admin) {
    return;
  }

  if (admin.role === AdminRole.ADMIN && admin.isActive) {
    const activeSuperadmins = await prisma.adminUser.count({
      where: { role: AdminRole.ADMIN, isActive: true },
    });

    if (activeSuperadmins <= 1) {
      return;
    }
  }

  await prisma.adminUser.update({
    where: { id },
    data: { isActive: !admin.isActive },
  });

  revalidatePath("/admin/admins");
}
