import Image from "next/image";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/site";

import { toggleServiceActiveAction } from "./actions";

export const instant = false;

function priceLabel(service: {
  priceFromKes: number | null;
  priceNote: string | null;
}) {
  if (service.priceFromKes) {
    return `From ${formatKes(service.priceFromKes)}`;
  }

  return service.priceNote ?? "Request a quote";
}

export default async function AdminServicesPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: [
      { category: { position: "asc" } },
      { position: "asc" },
      { name: "asc" },
    ],
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {services.length} service{services.length === 1 ? "" : "s"} in the
            catalog.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/service-categories"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Service categories
          </Link>
          <Link
            href="/admin/services/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Add service
          </Link>
        </div>
      </div>

      <ul className="space-y-3 md:hidden">
        {services.map((service) => (
          <li
            key={service.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium">{service.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {service.category.name} · {service.slug}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {priceLabel(service)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-medium ${
                  service.isActive
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {service.isActive ? "Active" : "Hidden"}
              </span>
              <div className="flex items-center gap-3">
                <form action={toggleServiceActiveAction}>
                  <input type="hidden" name="id" value={service.id} />
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {service.isActive ? "Hide" : "Show"}
                  </button>
                </form>
                <Link
                  href={`/admin/services/${service.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {service.category.name}
                </td>
                <td className="px-4 py-3 font-medium">
                  {priceLabel(service)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      service.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {service.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={toggleServiceActiveAction}>
                      <input type="hidden" name="id" value={service.id} />
                      <button
                        type="submit"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {service.isActive ? "Hide" : "Show"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
