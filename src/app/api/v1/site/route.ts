import { NextResponse } from "next/server";

import { SITE } from "@/lib/site";

export async function GET() {
  return NextResponse.json({
    site: {
      name: SITE.name,
      tagline: SITE.tagline,
      description: SITE.description,
      url: SITE.url,
      whatsappNumber: SITE.whatsappNumber,
      whatsappDisplay: SITE.whatsappDisplay,
      mpesaTill: SITE.mpesaTill,
      currency: SITE.currency,
    },
  });
}
