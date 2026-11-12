import { NextResponse } from "next/server";

import {
  getRelatedServices,
  getServiceBySlug,
} from "@/lib/services";

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ category: string; service: string }> },
) {
  const { category, service: serviceSlug } = await params;
  const service = await getServiceBySlug(category, serviceSlug);

  if (!service) {
    return NextResponse.json(
      { error: "Service not found." },
      { status: 404 },
    );
  }

  const related = await getRelatedServices(category, serviceSlug);

  return NextResponse.json({ service, related });
}
