import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { AdminRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "kasokoi_admin";
const SESSION_DAYS = 30;

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession(session: AdminSession) {
  const token = await new SignJWT({
    name: session.name,
    email: session.email,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    expires: new Date(
      Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    ),
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = payload.sub;

    if (!id) {
      return null;
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin?.isActive) {
      return null;
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();

  if (session.role !== AdminRole.ADMIN) {
    redirect("/admin");
  }

  return session;
}
