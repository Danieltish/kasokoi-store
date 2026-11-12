import { NextResponse, type NextRequest } from "next/server";

import { getProductCount, getProducts } from "@/lib/catalog";
import {
  parseCondition,
  parseMaxPrice,
  parsePage,
  parsePerPage,
  parseSort,
  parseTextFilter,
} from "@/lib/params";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parsePage(searchParams.get("page") ?? undefined);
  const perPage = parsePerPage(searchParams.get("perPage") ?? undefined);

  const filters = {
    categorySlug: parseTextFilter(searchParams.get("category") ?? undefined),
    brand: parseTextFilter(searchParams.get("brand") ?? undefined),
    condition: parseCondition(searchParams.get("condition") ?? undefined),
    maxPrice: parseMaxPrice(searchParams.get("maxPrice") ?? undefined),
    q: parseTextFilter(searchParams.get("q") ?? undefined),
    sort: parseSort(searchParams.get("sort") ?? undefined),
  };

  const [products, total] = await Promise.all([
    getProducts({
      ...filters,
      limit: perPage,
      offset: (page - 1) * perPage,
    }),
    getProductCount(filters),
  ]);

  return NextResponse.json({
    products,
    page,
    perPage,
    total,
    hasMore: page * perPage < total,
  });
}
