import { NextResponse, type NextRequest } from "next/server";

import { normalizeKenyanPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const phone = normalizeKenyanPhone(
    request.nextUrl.searchParams.get("phone") ?? "",
  );

  if (!phone) {
    return NextResponse.json(
      { error: "Enter the phone number used for the order." },
      { status: 400 },
    );
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: orderNumber.trim().toUpperCase(), phone },
    select: {
      orderNumber: true,
      status: true,
      paymentStatus: true,
      subtotalKes: true,
      deliveryFeeKes: true,
      totalKes: true,
      county: true,
      createdAt: true,
      items: {
        select: {
          name: true,
          quantity: true,
          lineTotalKes: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "No order found for that number and phone." },
      { status: 404 },
    );
  }

  return NextResponse.json({ order });
}
