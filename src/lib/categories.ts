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
      "TVs, soundbars, speakers, cameras, CCTV and home entertainment.",
    image: null,
  },
  {
    slug: "home-appliances",
    name: "Home Appliances",
    description:
      "Fridges, cookers, microwaves, blenders, fans, irons and kitchen appliances.",
    image: null,
  },
  {
    slug: "solar-power",
    name: "Solar & Power",
    description:
      "Solar panels, inverters, batteries, generators, bulbs and power backup.",
    image: null,
  },
  {
    slug: "agriculture-farm-produce",
    name: "Agriculture & Farm Produce",
    description:
      "Seeds, fertilizers, irrigation, farm tools and fresh produce.",
    image: null,
  },
  {
    slug: "livestock-animal-care",
    name: "Livestock & Animal Care",
    description:
      "Animal feed, poultry, dairy supplies, vet products and livestock equipment.",
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
    slug: "groceries-household",
    name: "Groceries & Household",
    description:
      "Everyday foods, snacks, cleaning supplies and household essentials.",
    image: null,
  },
  {
    slug: "health-wellness",
    name: "Health & Wellness",
    description:
      "Supplements, massagers, thermometers, first aid and fitness equipment.",
    image: null,
  },
  {
    slug: "networking-security",
    name: "Networking & Security",
    description:
      "Routers, switches, WiFi tools, VoIP, CCTV and smart home security.",
    image: "/products/networking.svg",
  },
  {
    slug: "building-tools-hardware",
    name: "Building, Tools & Hardware",
    description:
      "Power tools, hand tools, plumbing, electrical and building supplies.",
    image: null,
  },
  {
    slug: "automotive-motorbike",
    name: "Automotive & Motorbike",
    description:
      "Car and motorbike parts, accessories, tyres, tools and car care.",
    image: null,
  },
  {
    slug: "baby-kids",
    name: "Baby & Kids",
    description:
      "Diapers, feeding, toys, strollers, clothing and school essentials.",
    image: null,
  },
  {
    slug: "home-furniture-decor",
    name: "Home, Furniture & Decor",
    description: "Furniture, bedding, kitchenware, storage and home decor.",
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
  "beauty-electronics": "beauty-personal-care",
  laptops: "computers-accessories",
};
