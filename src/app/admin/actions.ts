"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { createAdminSession, destroyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string };

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !admin.isActive) {
    return { error: "Invalid email or password." };
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    return { error: "Invalid email or password." };
  }

  await createAdminSession({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
