import { NextResponse } from "next/server";

import { getServiceCategories } from "@/lib/services";

export async function GET() {
  const categories = await getServiceCategories();

  return NextResponse.json({ categories });
}
