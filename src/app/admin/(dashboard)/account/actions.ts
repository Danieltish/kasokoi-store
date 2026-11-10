"use server";

import bcrypt from "bcryptjs";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type PasswordState = { error?: string; success?: boolean };

export async function changePasswordAction(
  _previous: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) {
    return { error: "Enter your current password." };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: { passwordHash: true },
  });

  if (!admin) {
    return { error: "Account not found." };
  }

  const matches = await bcrypt.compare(currentPassword, admin.passwordHash);

  if (!matches) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.adminUser.update({
    where: { id: session.id },
    data: { passwordHash },
  });

  return { success: true };
}
