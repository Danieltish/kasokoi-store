import { NextResponse, type NextRequest } from "next/server";

import { getBrands } from "@/lib/catalog";
import { parseTextFilter } from "@/lib/params";

export async function GET(request: NextRequest) {
  const categorySlug = parseTextFilter(
    request.nextUrl.searchParams.get("category") ?? undefined,
  );
  const brands = await getBrands(categorySlug);

  return NextResponse.json({ brands });
}
