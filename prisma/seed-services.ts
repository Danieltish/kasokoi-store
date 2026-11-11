import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or DIRECT_URL) is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const serviceCategories = [
  {
    slug: "beauty-grooming",
    name: "Beauty & Grooming",
    description:
      "Professional beauty and grooming services at home, in salons or on location.",
    position: 1,
  },
  {
    slug: "home-cleaning-outdoor",
    name: "Home, Cleaning & Outdoor",
    description:
      "Cleaning, laundry, pest control and outdoor maintenance for homes and offices.",
    position: 2,
  },
  {
    slug: "repairs-maintenance",
    name: "Repairs & Maintenance",
    description:
      "Plumbing, electrical and appliance repair services from trusted technicians.",
    position: 3,
  },
  {
    slug: "technology-security",
    name: "Technology & Security",
    description:
      "CCTV, alarms, networking and software development services.",
    position: 4,
  },
  {
    slug: "delivery-errands",
    name: "Delivery & Errands",
    description:
      "Gas, water, groceries and errand services delivered to your door.",
    position: 5,
  },
];

type SeedService = {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  priceFromKes?: number;
  priceNote?: string;
  duration?: string;
  coverage?: string;
  position: number;
};

const services: SeedService[] = [
  {
    slug: "nail-tech",
    name: "Nail Tech Services",
    categorySlug: "beauty-grooming",
    description:
      "Manicures, pedicures, gel polish, acrylics and nail art by experienced nail technicians.",
    duration: "45–90 min",
    coverage: "Nairobi & surrounding areas",
    position: 1,
  },
  {
    slug: "makeup-artistry",
    name: "Makeup Artistry",
    categorySlug: "beauty-grooming",
    description:
      "Professional makeup for weddings, photo shoots, graduations, parties and corporate events.",
    duration: "45–90 min",
    coverage: "Nairobi & surrounding areas",
    position: 2,
  },
  {
    slug: "barber-services",
    name: "Barber Services",
    categorySlug: "beauty-grooming",
    description:
      "Mobile barbering for clean fades, beard trims, shaves and kids' haircuts at your home or office.",
    duration: "30–60 min",
    coverage: "Nairobi & surrounding areas",
    position: 3,
  },
  {
    slug: "massage-services",
    name: "Massage Services",
    categorySlug: "beauty-grooming",
    description:
      "Relaxation, deep tissue and wellness massage sessions at your home, office or hotel.",
    duration: "45–90 min",
    coverage: "Nairobi & surrounding areas",
    position: 4,
  },
  {
    slug: "mobile-beauty-grooming",
    name: "Mobile Beauty & Grooming",
    categorySlug: "beauty-grooming",
    description:
      "Beauty and grooming treatments brought to your door — ideal for busy professionals and events.",
    duration: "Varies",
    coverage: "Nairobi & surrounding areas",
    position: 5,
  },

  {
    slug: "house-cleaning",
    name: "House Cleaning Services",
    categorySlug: "home-cleaning-outdoor",
    description:
      "Deep cleaning, routine cleaning and post-party cleaning for homes, apartments and offices.",
    duration: "2–6 hrs",
    coverage: "Nairobi & surrounding areas",
    position: 1,
  },
  {
    slug: "laundry-ironing",
    name: "Laundry & Ironing Services",
    categorySlug: "home-cleaning-outdoor",
    description:
      "Wash, dry, fold and ironing services with convenient pickup and delivery.",
    duration: "24–48 hrs",
    coverage: "Nairobi & surrounding areas",
    position: 2,
  },
  {
    slug: "pest-control-fumigation",
    name: "Pest Control & Fumigation",
    categorySlug: "home-cleaning-outdoor",
    description:
      "Safe, professional pest control for cockroaches, rodents, bedbugs, termites and mosquitoes.",
    duration: "1–3 hrs",
    coverage: "Nairobi & surrounding areas",
    position: 3,
  },
  {
    slug: "waste-collection",
    name: "Waste Collection",
    categorySlug: "home-cleaning-outdoor",
    description:
      "Scheduled household and commercial waste collection with responsible disposal.",
    duration: "Scheduled",
    coverage: "Nairobi",
    position: 4,
  },
  {
    slug: "gardening-compound-maintenance",
    name: "Gardening & Compound Maintenance",
    categorySlug: "home-cleaning-outdoor",
    description:
      "Lawn care, hedge trimming, landscaping and general compound upkeep.",
    duration: "Varies",
    coverage: "Nairobi & surrounding areas",
    position: 5,
  },
  {
    slug: "mobile-car-washing",
    name: "Mobile Car Washing",
    categorySlug: "home-cleaning-outdoor",
    description:
      "Convenient car washing and interior cleaning at your home or office.",
    duration: "45–90 min",
    coverage: "Nairobi & surrounding areas",
    position: 6,
  },

  {
    slug: "plumbing",
    name: "Plumbing Services",
    categorySlug: "repairs-maintenance",
    description:
      "Leak repairs, pipe installation, blocked drains, water tanks and bathroom fittings.",
    duration: "Varies",
    coverage: "Nairobi & surrounding areas",
    position: 1,
  },
  {
    slug: "electrical-repair",
    name: "Electrical Repair Services",
    categorySlug: "repairs-maintenance",
    description:
      "Fault finding, wiring, sockets, lighting, fuse boards and electrical installations.",
    duration: "Varies",
    coverage: "Nairobi & surrounding areas",
    position: 2,
  },
  {
    slug: "appliance-repair",
    name: "Appliance Repair Services",
    categorySlug: "repairs-maintenance",
    description:
      "Repairs for fridges, washing machines, cookers, microwaves, kettles and small appliances.",
    duration: "Varies",
    coverage: "Nairobi & surrounding areas",
    position: 3,
  },

  {
    slug: "cctv-alarms-networking",
    name: "CCTV, Alarms & Networking",
    categorySlug: "technology-security",
    description:
      "CCTV installation, alarm systems, WiFi setup, structured cabling and network support.",
    duration: "Varies",
    coverage: "Nairobi & surrounding areas",
    position: 1,
  },
  {
    slug: "software-development",
    name: "Software Development Services",
    categorySlug: "technology-security",
    description:
      "Websites, e-commerce, mobile apps, dashboards and custom business software.",
    duration: "Project-based",
    coverage: "Kenya & remote",
    position: 2,
  },

  {
    slug: "gas-delivery",
    name: "Gas Delivery Services",
    categorySlug: "delivery-errands",
    description:
      "Fast delivery of cooking gas cylinders and refills to your home or business.",
    duration: "Same day",
    coverage: "Nairobi & surrounding areas",
    position: 1,
  },
  {
    slug: "drinking-water-delivery",
    name: "Drinking Water Delivery",
    categorySlug: "delivery-errands",
    description:
      "Clean drinking water delivered in bottles, jerricans or dispensers.",
    duration: "Same day",
    coverage: "Nairobi & surrounding areas",
    position: 2,
  },
  {
    slug: "grocery-shopping-delivery",
    name: "Grocery Shopping & Delivery",
    categorySlug: "delivery-errands",
    description:
      "We shop for your groceries and household essentials and deliver them to your door.",
    duration: "Same day",
    coverage: "Nairobi & surrounding areas",
    position: 3,
  },
  {
    slug: "errands-parcel-services",
    name: "Errands & Parcel Services",
    categorySlug: "delivery-errands",
    description:
      "Pickups, drop-offs, document delivery and everyday errands across Nairobi.",
    duration: "Same day",
    coverage: "Nairobi",
    position: 4,
  },
];

async function main() {
  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        position: category.position,
        isActive: true,
      },
      create: category,
    });
  }

  const rows = await prisma.serviceCategory.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(
    rows.map((row) => [row.slug, row.id] as const),
  );

  for (const { categorySlug, ...service } of services) {
    const categoryId = categoryIdBySlug.get(categorySlug);

    if (!categoryId) {
      throw new Error(`Unknown service category: ${categorySlug}`);
    }

    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, categoryId, isActive: true },
      create: { ...service, categoryId },
    });
  }

  console.log(
    `Services ready: ${serviceCategories.length} categories, ${services.length} services.`,
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
