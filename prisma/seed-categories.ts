import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import {
  BROAD_CATEGORIES,
  LEGACY_CATEGORY_MAP,
  PRODUCT_CATEGORY_OVERRIDES,
} from "../src/lib/categories";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or DIRECT_URL) is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const category of BROAD_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        image: category.image,
      },
      create: category,
    });
  }

  const rows = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(
    rows.map((row) => [row.slug, row.id] as const),
  );

  for (const [legacySlug, targetSlug] of Object.entries(LEGACY_CATEGORY_MAP)) {
    const legacyId = categoryIdBySlug.get(legacySlug);
    const targetId = categoryIdBySlug.get(targetSlug);

    if (!legacyId || !targetId) {
      continue;
    }

    const moved = await prisma.product.updateMany({
      where: { categoryId: legacyId },
      data: { categoryId: targetId },
    });

    const remaining = await prisma.product.count({
      where: { categoryId: legacyId },
    });

    if (remaining === 0) {
      await prisma.category.delete({ where: { id: legacyId } });
      console.log(`Moved ${moved.count} products and removed "${legacySlug}".`);
    } else {
      console.log(
        `Moved ${moved.count} products; kept "${legacySlug}" (${remaining} left).`,
      );
    }
  }

  for (const [productSlug, targetSlug] of Object.entries(
    PRODUCT_CATEGORY_OVERRIDES,
  )) {
    const targetId = categoryIdBySlug.get(targetSlug);

    if (!targetId) {
      continue;
    }

    await prisma.product.updateMany({
      where: { slug: productSlug },
      data: { categoryId: targetId },
    });
  }

  console.log(
    `Categories ready: ${BROAD_CATEGORIES.length} broad categories available.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
