import { NextResponse } from "next/server";
import { z } from "zod";

import { getRequestUser } from "@/lib/auth";
import { normalizeKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(20).optional(),
});

export async function PATCH(request: Request) {
  const session = await getRequestUser(request);

  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter your full name." },
      { status: 400 },
    );
  }

  const rawPhone = parsed.data.phone?.trim() ?? "";
  const phone = rawPhone ? normalizeKenyanPhone(rawPhone) : null;

  if (rawPhone && !phone) {
    return NextResponse.json(
      { error: "Enter a valid Kenyan phone number, e.g. 0712 345 678." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: session.id },
    data: { name: parsed.data.name, phone },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return NextResponse.json({ user });
}
