import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ServiceCard } from "@/components/services/service-card";
import {
  getServiceCategories,
  getServiceCategoryBySlug,
  getServices,
} from "@/lib/services";

type Params = Promise<{ category: string }>;

export async function generateStaticParams() {
  const categories = await getServiceCategories();

  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getServiceCategoryBySlug(slug);

  if (!category) {
    return { title: "Service category not found" };
  }

  return {
    title: category.name,
    description:
      category.description ??
      `Book ${category.name.toLowerCase()} services in Kenya with Kasokoi Store.`,
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Params;
}) {
  const { category: slug } = await params;
  const category = await getServiceCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const services = await getServices(slug);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/services" className="hover:text-foreground">
          Services
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted-foreground">
          {services.length} service{services.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
