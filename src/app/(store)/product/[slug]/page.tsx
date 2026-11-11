import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductSkeleton } from "@/components/catalog-skeleton";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Price } from "@/components/price";
import { ProductGallery } from "@/components/product-gallery";
import { ProductGrid } from "@/components/product-grid";
import { ProductWhatsAppButton } from "@/components/product-whatsapp-button";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalog";
import { SITE } from "@/lib/site";

const conditionLabels = {
  NEW: "New",
  REFURBISHED: "Refurbished",
  USED: "Second hand",
} as const;

const schemaConditions = {
  NEW: "https://schema.org/NewCondition",
  REFURBISHED: "https://schema.org/RefurbishedCondition",
  USED: "https://schema.org/UsedCondition",
} as const;

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
    openGraph: {
      type: "website",
      title: `${product.name} — ${product.brand}`,
      description: product.description,
      images: product.image
        ? [
            {
              url: product.image.startsWith("http")
                ? product.image
                : `${SITE.url}${product.image}`,
            },
          ]
        : undefined,
    },
  };
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.category.slug, product.slug);
  const productUrl = `${SITE.url}/product/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category.name,
    image:
      product.images.length > 0
        ? product.images.map((image) =>
            image.url.startsWith("http")
              ? image.url
              : `${SITE.url}${image.url}`,
          )
        : undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "KES",
      price: product.priceKes,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: schemaConditions[product.condition],
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/category/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="min-w-0 break-words text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Price
              amountKes={product.priceKes}
              compareAtKes={product.compareAtPriceKes}
              size="lg"
            />
            <span
              className={
                product.stock > 0
                  ? "text-sm font-medium text-success"
                  : "text-sm font-medium text-danger"
              }
            >
              {product.stock > 0
                ? `In stock (${product.stock})`
                : "Out of stock"}
            </span>
          </div>

          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Condition:</span>
            <span className="font-medium">
              {conditionLabels[product.condition]}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <AddToCartButton
              slug={product.slug}
              name={product.name}
              brand={product.brand}
              priceKes={product.priceKes}
              image={product.image}
              stock={product.stock}
              className="w-full sm:w-auto"
            />
            <ProductWhatsAppButton
              slug={product.slug}
              name={product.name}
              brand={product.brand}
              priceKes={product.priceKes}
              inStock={product.stock > 0}
            />
            <Link
              href={`/category/${product.category.slug}`}
              className="inline-flex w-full items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-muted sm:w-auto"
            >
              More {product.category.name.toLowerCase()}
            </Link>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Delivery in Nairobi and nationwide. We confirm stock, delivery fee
            and payment on WhatsApp.
          </p>

          {product.specs && Object.keys(product.specs).length > 0 ? (
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Specifications
              </h2>
              <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex gap-3 px-4 py-3 text-sm sm:gap-4"
                  >
                    <dt className="w-28 shrink-0 text-muted-foreground sm:w-40">
                      {key}
                    </dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            You may also like
          </h2>
          <div className="mt-5">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
