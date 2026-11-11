import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ServiceForm } from "../service-form";

export const instant = false;

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const [service, categories] = await Promise.all([
    prisma.service.findUnique({ where: { id } }),
    prisma.serviceCategory.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/services"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Services
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Edit service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{service.name}</p>
      </div>

      <ServiceForm
        categories={categories}
        service={{
          id: service.id,
          name: service.name,
          slug: service.slug,
          categoryId: service.categoryId,
          description: service.description,
          priceFromKes: service.priceFromKes,
          priceNote: service.priceNote ?? "",
          duration: service.duration ?? "",
          coverage: service.coverage ?? "",
          image: service.image ?? "",
          isActive: service.isActive,
        }}
      />
    </div>
  );
}
