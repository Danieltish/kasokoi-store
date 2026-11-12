import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { AdminRole } from "@/generated/prisma/client";
import { createUserToken, type SessionUser } from "@/lib/auth";
import { normalizeKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().min(3).max(200),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8).max(200),
});

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function publicUser(user: SessionUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter your name, email and a password with 8+ characters." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const rawPhone = parsed.data.phone?.trim() ?? "";
  const phone = rawPhone ? normalizeKenyanPhone(rawPhone) : null;

  if (rawPhone && !phone) {
    return NextResponse.json(
      {
        error:
          "Enter a valid Kenyan phone number, e.g. 0712 345 678.",
      },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        phone,
        passwordHash,
        role: AdminRole.CUSTOMER,
      },
    });

    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    const token = await createUserToken(sessionUser);

    return NextResponse.json(
      { token, user: publicUser(sessionUser) },
      { status: 201 },
    );
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists. Please sign in.",
        },
        { status: 409 },
      );
    }

    console.error("Failed to register customer", error);

    return NextResponse.json(
      { error: "Could not create the account. Please try again." },
      { status: 500 },
    );
  }
}
