import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { updateZoneAction } from "./actions";

export const instant = false;

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:h-10 sm:text-sm";

export default async function AdminZonesPage() {
  await requireAdmin();

  const zones = await prisma.deliveryZone.findMany({
    orderBy: [{ isPickup: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Delivery zones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the courier fee and free-delivery threshold per zone.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {zones.map((zone) => (
          <form
            key={zone.id}
            action={updateZoneAction}
            className="rounded-xl border border-border bg-card p-5"
          >
            <input type="hidden" name="id" value={zone.id} />

            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{zone.name}</h2>
              {zone.isPickup ? (
                <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent-700">
                  Pickup
                </span>
              ) : null}
              {!zone.isActive ? (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  Disabled
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {zone.isPickup
                ? "Customer collects from the Nairobi pickup point."
                : zone.counties.join(", ")}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Fee (KES)
                <input
                  type="number"
                  name="feeKes"
                  min={0}
                  step={50}
                  defaultValue={zone.feeKes}
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Free over (KES)
                <input
                  type="number"
                  name="freeOverKes"
                  min={0}
                  step={1000}
                  defaultValue={zone.freeOverKes ?? ""}
                  placeholder="No free delivery"
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={zone.isActive}
                  className="size-4"
                />
                Active
              </label>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Save
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
