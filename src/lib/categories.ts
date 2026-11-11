export type BroadCategory = {
  slug: string;
  name: string;
  description: string;
  image: string | null;
};

export const BROAD_CATEGORIES: BroadCategory[] = [
  {
    slug: "phones-tablets",
    name: "Phones & Tablets",
    description:
      "Smartphones, tablets, chargers, cases, power banks and mobile accessories.",
    image: null,
  },
  {
    slug: "computers-accessories",
    name: "Computers & Accessories",
    description:
      "Laptops, desktops, monitors, printers, storage and computer accessories.",
    image: null,
  },
  {
    slug: "tv-audio-cameras",
    name: "TV, Audio & Cameras",
    description:
      "TVs, soundbars, speakers, cameras and home entertainment.",
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
    slug: "fashion-accessories",
    name: "Fashion & Accessories",
    description:
      "Clothing, shoes, bags, watches, sunglasses and everyday accessories.",
    image: null,
  },
  {
    slug: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description:
      "Skincare, haircare, wigs, makeup, grooming and personal care devices.",
    image: "/products/beauty.svg",
  },
  {
    slug: "health-wellness",
    name: "Health & Wellness",
    description:
      "Supplements, massagers, thermometers, first aid and fitness equipment.",
    image: null,
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
  "phones-electronics": "phones-tablets",
  "fashion-beauty-health": "fashion-accessories",
  "networking-equipment": "networking-security",
  "wifi-tools-testers": "networking-security",
  "voip-pbx-systems": "networking-security",
  "beauty-electronics": "beauty-personal-care",
  laptops: "computers-accessories",
  "home-appliances": "home-kitchen",
  "home-furniture-decor": "home-kitchen",
  "groceries-household": "home-kitchen",
  "agriculture-farm-produce": "farm-livestock",
  "livestock-animal-care": "farm-livestock",
  "building-tools-hardware": "building-auto",
  "automotive-motorbike": "building-auto",
};

export const PRODUCT_CATEGORY_OVERRIDES: Record<string, string> = {
  "hp-elite-book-840-g3": "computers-accessories",
  "hp-elitebook-830-g5-8th-gen-core-i5-8gb-ram-256gb-ssd":
    "computers-accessories",
  "hp-probook-650-g4": "computers-accessories",
  "dyson-supersonic": "beauty-personal-care",
  "led-facial-mask": "beauty-personal-care",
  "philips-hp8320-straightener": "beauty-personal-care",
  "massage-gun-pro": "health-wellness",
};
