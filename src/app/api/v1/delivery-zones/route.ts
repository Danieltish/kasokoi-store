import { NextResponse } from "next/server";

import { getDeliveryZones } from "@/lib/delivery";

export async function GET() {
  const zones = await getDeliveryZones();

  return NextResponse.json({ zones });
}
