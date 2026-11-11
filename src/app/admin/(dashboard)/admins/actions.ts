"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { AdminRole } from "@/generated/prisma/client";
import { isAdminRole, isOwner, requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminFormState = { error?: string; success?: boolean };

export async function createAdminAction(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const session = await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleValue = String(formData.get("role") ?? "STAFF");
  const role = roleValue === "ADMIN" ? AdminRole.ADMIN : AdminRole.STAFF;

  if (role === AdminRole.ADMIN && !isOwner(session.email)) {
    return { error: "Only the store owner can create superadmins." };
  }

  if (name.length < 2) {
    return { error: "Enter the admin's name." };
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password && password.length < 8) {
    return { error: "Use a password with at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (existing && existing.role !== AdminRole.CUSTOMER) {
    return { error: "That email already belongs to an admin." };
  }

  if (!existing && !password) {
    return { error: "Set a password for the new admin." };
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  try {
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          role,
          isActive: true,
          ...(passwordHash ? { passwordHash } : {}),
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: passwordHash as string,
          role,
        },
      });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "An account with that email already exists." };
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

  const admin = await prisma.user.findUnique({
    where: { id },
    select: { role: true, isActive: true },
  });

  if (!admin || !isAdminRole(admin.role)) {
    return;
  }

  if (admin.role === AdminRole.ADMIN && admin.isActive) {
    const activeSuperadmins = await prisma.user.count({
      where: { role: AdminRole.ADMIN, isActive: true },
    });

    if (activeSuperadmins <= 1) {
      return;
    }
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: !admin.isActive },
  });

  revalidatePath("/admin/admins");
}
