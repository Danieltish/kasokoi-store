import { NextResponse, type NextRequest } from "next/server";

import { parseTextFilter } from "@/lib/params";
import { getFeaturedServices, getServices } from "@/lib/services";

const MAX_LIMIT = 48;
const DEFAULT_LIMIT = 48;

function parseLimit(value: string | null, fallback: number) {
  const parsed = Math.floor(Number(value));

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, MAX_LIMIT);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = parseTextFilter(
    searchParams.get("category") ?? undefined,
  );
  const featured = searchParams.get("featured") === "1";
  const limit = parseLimit(searchParams.get("limit"), DEFAULT_LIMIT);

  const all = featured
    ? await getFeaturedServices(MAX_LIMIT)
    : await getServices(category);
  const scoped =
    featured && category
      ? all.filter((service) => service.category.slug === category)
      : all;
  const services = scoped.slice(0, limit);

  return NextResponse.json({ services, total: scoped.length });
}
