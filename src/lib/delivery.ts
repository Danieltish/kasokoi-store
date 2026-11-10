import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

export type DeliveryZoneOption = {
  id: string;
  name: string;
  counties: string[];
  feeKes: number;
  freeOverKes: number | null;
  isPickup: boolean;
};

export const DELIVERY_TAG = "delivery-zones";

export async function getDeliveryZones(): Promise<DeliveryZoneOption[]> {
  "use cache";
  cacheTag(DELIVERY_TAG);
  cacheLife("days");

  const rows = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: [{ isPickup: "asc" }, { name: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    counties: row.counties,
    feeKes: row.feeKes,
    freeOverKes: row.freeOverKes,
    isPickup: row.isPickup,
  }));
}
