import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CATALOG_TAGS } from "@/lib/catalog";
import { createOrder } from "@/lib/orders";

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
