import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { AdminRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "kasokoi_admin";
const SESSION_DAYS = 30;

export const OWNER_EMAIL = (
  process.env.OWNER_EMAIL ?? "tishtitoh@gmail.com"
)
  .trim()
  .toLowerCase();

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: AdminRole;
};

export function isAdminRole(role: AdminRole) {
  return role === AdminRole.ADMIN || role === AdminRole.STAFF;
}

export function isOwner(email: string) {
  return email.trim().toLowerCase() === OWNER_EMAIL;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  return new TextEncoder().encode(secret);
}

export async function createUserToken(user: SessionUser) {
  return new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function createSession(user: SessionUser) {
  const token = await createUserToken(user);

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

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getTokenUser(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = payload.sub;

    if (!id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    if (!user?.isActive) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function getRequestUser(
  request: Request,
): Promise<SessionUser | null> {
  const header = request.headers.get("authorization") ?? "";

  if (!header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return null;
  }

  return getTokenUser(token);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getTokenUser(token);
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSessionUser();

  if (!session) {
    redirect("/admin/login");
  }

  if (!isAdminRole(session.role)) {
    redirect("/account");
  }

  return session;
}

export async function requireSuperAdmin(): Promise<SessionUser> {
  const session = await requireAdmin();

  if (session.role !== AdminRole.ADMIN) {
    redirect("/admin");
  }

  return session;
}
