export type BroadCategory = {
  slug: string;
  name: string;
  description: string;
  image: string | null;
};

export const BROAD_CATEGORIES: BroadCategory[] = [
  {
    slug: "phones-electronics",
    name: "Phones & Electronics",
    description:
      "Phones, tablets, computers, TVs, audio, cameras and everyday electronics.",
    image: null,
  },
  {
    slug: "networking-security",
    name: "Networking & Security",
    description:
      "Routers, switches, WiFi tools, VoIP, CCTV and smart security.",
    image: "/products/networking.svg",
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    description:
      "Home appliances, furniture, decor, groceries, cleaning and household essentials.",
    image: null,
  },
  {
    slug: "solar-power",
    name: "Solar & Power",
    description:
      "Solar panels, inverters, batteries, generators and power backup.",
    image: null,
  },
  {
    slug: "fashion-beauty-health",
    name: "Fashion, Beauty & Health",
    description:
      "Clothing, shoes, bags, watches, beauty, personal care and wellness.",
    image: "/products/beauty.svg",
  },
  {
    slug: "baby-kids",
    name: "Baby & Kids",
    description:
      "Baby care, kids' clothing, toys, strollers and school essentials.",
    image: null,
  },
  {
    slug: "farm-livestock",
    name: "Farm & Livestock",
    description:
      "Farm produce, seeds, tools, animal feed, poultry and livestock supplies.",
    image: null,
  },
  {
    slug: "building-auto",
    name: "Building & Auto",
    description:
      "Building materials, tools, hardware, car and motorbike parts and accessories.",
    image: null,
  },
  {
    slug: "sports-outdoors",
    name: "Sports & Outdoors",
    description:
      "Gym equipment, bicycles, camping, fishing and outdoor gear.",
    image: null,
  },
  {
    slug: "stationery-office",
    name: "Stationery & Office",
    description:
      "School supplies, office stationery, printing and business essentials.",
    image: null,
  },
];

export const CATEGORY_ORDER = BROAD_CATEGORIES.map((category) => category.slug);

export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  "networking-equipment": "networking-security",
  "wifi-tools-testers": "networking-security",
  "voip-pbx-systems": "networking-security",
  "beauty-electronics": "fashion-beauty-health",
  laptops: "phones-electronics",
  "phones-tablets": "phones-electronics",
  "computers-accessories": "phones-electronics",
  "tv-audio-cameras": "phones-electronics",
  "home-appliances": "home-kitchen",
  "home-furniture-decor": "home-kitchen",
  "groceries-household": "home-kitchen",
  "fashion-accessories": "fashion-beauty-health",
  "beauty-personal-care": "fashion-beauty-health",
  "health-wellness": "fashion-beauty-health",
  "agriculture-farm-produce": "farm-livestock",
  "livestock-animal-care": "farm-livestock",
  "building-tools-hardware": "building-auto",
  "automotive-motorbike": "building-auto",
};
