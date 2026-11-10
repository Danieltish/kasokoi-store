import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`select 1`;

    return NextResponse.json({ status: "ok", database: "up" });
  } catch {
    return NextResponse.json(
      { status: "error", database: "down" },
      { status: 503 },
    );
  }
}
