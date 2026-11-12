import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getRequestUser } from "@/lib/auth";
import { CATALOG_TAGS } from "@/lib/catalog";
import { createOrder } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getRequestUser(request);

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { email: user.email },
        ...(user.phone ? [{ phone: user.phone }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      orderNumber: true,
      totalKes: true,
      status: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      orderNumber: order.orderNumber,
      totalKes: order.totalKes,
      status: order.status,
      createdAt: order.createdAt,
      itemCount: order._count.items,
    })),
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await createOrder(payload, { source: "ONLINE" });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  revalidateTag(CATALOG_TAGS.products, { expire: 0 });

  return NextResponse.json(
    { orderNumber: result.orderNumber },
    { status: 201 },
  );
}
