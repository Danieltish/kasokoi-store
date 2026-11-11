import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import {
  PrismaClient,
  ProductCondition,
  type Prisma,
} from "../src/generated/prisma/client";
import { BROAD_CATEGORIES } from "../src/lib/categories";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or DIRECT_URL) is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const categories = BROAD_CATEGORIES;

type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  description: string;
  specs: Prisma.InputJsonValue;
  priceKes: number;
  compareAtPriceKes?: number;
  sku: string;
  stock: number;
  condition?: ProductCondition;
  categorySlug: string;
  image: string;
};

const products: SeedProduct[] = [
  {
    slug: "ubiquiti-unifi-u6-pro",
    name: "Ubiquiti UniFi U6 Pro Access Point",
    brand: "Ubiquiti",
    description:
      "Ceiling-mounted WiFi 6 access point with 4x4 MU-MIMO and PoE support. Ideal for busy homes and offices.",
    specs: {
      Standard: "WiFi 6 (802.11ax)",
      "Max throughput": "5.3 Gbps",
      Ports: "1x Gigabit Ethernet",
      Power: "802.3af PoE",
      Coverage: "Up to 140 m²",
    },
    priceKes: 28500,
    compareAtPriceKes: 32000,
    sku: "NET-UBI-U6P",
    stock: 8,
    categorySlug: "networking-security",
    image: "/products/networking.svg",
  },
  {
    slug: "mikrotik-hex-s",
    name: "MikroTik hEX S Gigabit Router",
    brand: "MikroTik",
    description:
      "Five-port Gigabit router with SFP and PoE-out. A dependable workhorse for ISPs and advanced home networks.",
    specs: {
      Ports: "5x Gigabit + 1x SFP",
      "PoE out": "Yes, port 5",
      CPU: "Dual-core 880 MHz",
      "RouterOS": "Level 4 included",
    },
    priceKes: 9800,
    sku: "NET-MTK-HEXS",
    stock: 15,
    categorySlug: "networking-security",
    image: "/products/networking.svg",
  },
  {
    slug: "tplink-tl-sg1024d",
    name: "TP-Link TL-SG1024D 24-Port Gigabit Switch",
    brand: "TP-Link",
    description:
      "Unmanaged 24-port rack-mount Gigabit switch for offices that need simple, reliable expansion.",
    specs: {
      Ports: "24x Gigabit Ethernet",
      Mounting: "Rack-mount (19 inch)",
      "Switching capacity": "48 Gbps",
      "Plug and play": "Yes",
    },
    priceKes: 12500,
    sku: "NET-TPL-SG1024D",
    stock: 6,
    categorySlug: "networking-security",
    image: "/products/networking.svg",
  },
  {
    slug: "ubiquiti-edgeswitch-8-150w",
    name: "Ubiquiti EdgeSwitch 8 PoE (150W)",
    brand: "Ubiquiti",
    description:
      "Eight-port managed PoE switch with a 150W power budget for access points, cameras and phones.",
    specs: {
      Ports: "8x Gigabit + 2x SFP",
      "PoE budget": "150W",
      Management: "EdgeOS",
      Mounting: "Desktop or wall",
    },
    priceKes: 24500,
    sku: "NET-UBI-ES8",
    stock: 4,
    categorySlug: "networking-security",
    image: "/products/networking.svg",
  },
  {
    slug: "mikrotik-crs326-24g-2s",
    name: "MikroTik CRS326-24G-2S+RM Switch",
    brand: "MikroTik",
    description:
      "24-port managed switch with two 10G SFP+ uplinks. Excellent for high-throughput office backbones.",
    specs: {
      Ports: "24x Gigabit + 2x SFP+",
      "Switching capacity": "64 Gbps",
      Management: "RouterOS / SwOS",
      Mounting: "Rack-mount",
    },
    priceKes: 31500,
    sku: "NET-MTK-CRS326",
    stock: 3,
    categorySlug: "networking-security",
    image: "/products/networking.svg",
  },
  {
    slug: "alfa-awus036ach",
    name: "Alfa AWUS036ACH Long-Range USB WiFi Adapter",
    brand: "Alfa Network",
    description:
      "Dual-band USB adapter with detachable antennas for long-range reception, field surveys and penetration testing.",
    specs: {
      Bands: "2.4 GHz / 5 GHz",
      Standard: "802.11ac",
      Antennas: "2x detachable 5 dBi",
      Interface: "USB 3.0",
    },
    priceKes: 6500,
    sku: "WFT-ALFA-036ACH",
    stock: 12,
    categorySlug: "networking-security",
    image: "/products/wifi.svg",
  },
  {
    slug: "tplink-re650",
    name: "TP-Link RE650 AC2600 WiFi Extender",
    brand: "TP-Link",
    description:
      "Four-antenna range extender with a dedicated backhaul band to extend coverage without halving speed.",
    specs: {
      Speed: "AC2600 (800 + 1733 Mbps)",
      "Ethernet": "1x Gigabit port",
      Bands: "Dual-band",
      Setup: "OneMesh / WPS",
    },
    priceKes: 8900,
    sku: "WFT-TPL-RE650",
    stock: 9,
    categorySlug: "networking-security",
    image: "/products/wifi.svg",
  },
  {
    slug: "ubiquiti-litebeam-5ac-gen2",
    name: "Ubiquiti LiteBeam 5AC Gen2",
    brand: "Ubiquiti",
    description:
      "Compact 5 GHz airMAX AC CPE for point-to-point links over long distances. Popular with WISPs.",
    specs: {
      Frequency: "5 GHz",
      Gain: "23 dBi",
      Range: "Up to 30 km",
      Interface: "Gigabit Ethernet",
    },
    priceKes: 11500,
    sku: "WFT-UBI-LBE5AC",
    stock: 7,
    categorySlug: "networking-security",
    image: "/products/wifi.svg",
  },
  {
    slug: "netgear-ex8000",
    name: "Netgear Nighthawk EX8000 Mesh Extender",
    brand: "Netgear",
    description:
      "Tri-band mesh extender with four Gigabit ports. Certified refurbished unit in excellent condition.",
    specs: {
      Speed: "AC3000",
      Bands: "Tri-band",
      Ports: "4x Gigabit Ethernet",
      Condition: "Certified refurbished",
    },
    priceKes: 16500,
    compareAtPriceKes: 21000,
    sku: "WFT-NGR-EX8000",
    stock: 4,
    condition: ProductCondition.REFURBISHED,
    categorySlug: "networking-security",
    image: "/products/wifi.svg",
  },
  {
    slug: "pocket-network-tester",
    name: "Pocket RJ45 / PoE Network Tester",
    brand: "Generic",
    description:
      "Handheld cable tester for RJ45, RJ11 and PoE. A must-have tool for installers and support technicians.",
    specs: {
      Tests: "RJ45, RJ11, PoE",
      Display: "LCD",
      Battery: "9V (included)",
      "Carry case": "Included",
    },
    priceKes: 3500,
    sku: "WFT-TESTER-PKT",
    stock: 20,
    categorySlug: "networking-security",
    image: "/products/wifi.svg",
  },
  {
    slug: "yeastar-s20",
    name: "Yeastar S20 VoIP PBX",
    brand: "Yeastar",
    description:
      "Compact IP PBX for small offices supporting up to 20 users, SIP trunks and analogue lines.",
    specs: {
      Users: "Up to 20",
      "FXS/FXO": "2/2",
      "SIP trunks": "5",
      "Call recording": "Yes",
    },
    priceKes: 32000,
    sku: "VOIP-YST-S20",
    stock: 3,
    categorySlug: "networking-security",
    image: "/products/voip.svg",
  },
  {
    slug: "yeastar-tg100",
    name: "Yeastar TG100 GSM VoIP Gateway",
    brand: "Yeastar",
    description:
      "Single-channel GSM gateway that bridges mobile calls into your VoIP PBX. Ideal for reducing call costs.",
    specs: {
      Channels: "1 GSM",
      "SIP accounts": "1",
      Network: "10/100 Mbps",
      "SIM": "Standard SIM",
    },
    priceKes: 26500,
    sku: "VOIP-YST-TG100",
    stock: 4,
    categorySlug: "networking-security",
    image: "/products/voip.svg",
  },
  {
    slug: "yeastar-p570",
    name: "Yeastar P570 IP Phone",
    brand: "Yeastar",
    description:
      "Enterprise IP phone with a colour display, Bluetooth and HD voice. Pairs with Yeastar PBX systems.",
    specs: {
      Lines: "6 SIP accounts",
      Display: "4.3 inch colour",
      "HD voice": "Yes",
      Bluetooth: "Yes",
    },
    priceKes: 14500,
    sku: "VOIP-YST-P570",
    stock: 8,
    categorySlug: "networking-security",
    image: "/products/voip.svg",
  },
  {
    slug: "fanvil-x4u",
    name: "Fanvil X4U Enterprise IP Phone",
    brand: "Fanvil",
    description:
      "Colour-screen IP phone with dual Gigabit ports and PoE. A cost-effective desk phone for growing teams.",
    specs: {
      Lines: "4 SIP accounts",
      Ports: "2x Gigabit",
      PoE: "Yes",
      Display: "2.8 inch colour",
    },
    priceKes: 9800,
    sku: "VOIP-FAN-X4U",
    stock: 10,
    categorySlug: "networking-security",
    image: "/products/voip.svg",
  },
  {
    slug: "dyson-supersonic",
    name: "Dyson Supersonic Hair Dryer",
    brand: "Dyson",
    description:
      "Fast-drying, intelligent heat control and a magnetic attachment system. Refurbished unit with accessories.",
    specs: {
      Power: "1600W",
      "Heat settings": "4",
      "Speed settings": "3",
      Attachments: "3 included",
    },
    priceKes: 42000,
    compareAtPriceKes: 47000,
    sku: "BTY-DYS-SUP",
    stock: 5,
    condition: ProductCondition.REFURBISHED,
    categorySlug: "fashion-beauty-health",
    image: "/products/beauty.svg",
  },
  {
    slug: "philips-hp8320-straightener",
    name: "Philips HP8320 Hair Straightener",
    brand: "Philips",
    description:
      "Ceramic-plated plates with fast heat-up and adjustable temperature for everyday styling.",
    specs: {
      Plates: "Ceramic",
      "Heat-up": "60 seconds",
      "Temperature": "Up to 230°C",
      Swivel: "1.8 m cord",
    },
    priceKes: 4500,
    sku: "BTY-PHL-HP8320",
    stock: 18,
    categorySlug: "fashion-beauty-health",
    image: "/products/beauty.svg",
  },
  {
    slug: "led-facial-mask",
    name: "LED Light Therapy Facial Mask",
    brand: "Generic",
    description:
      "Seven-colour LED mask for at-home skin therapy. Rechargeable and lightweight.",
    specs: {
      "Light modes": "7 colours",
      Power: "USB rechargeable",
      "Session timer": "15 minutes",
      Weight: "320 g",
    },
    priceKes: 8500,
    sku: "BTY-LED-MASK",
    stock: 10,
    categorySlug: "fashion-beauty-health",
    image: "/products/beauty.svg",
  },
  {
    slug: "massage-gun-pro",
    name: "Deep Tissue Massage Gun Pro",
    brand: "Generic",
    description:
      "Percussion massage device with six heads and adjustable intensity for recovery and relaxation.",
    specs: {
      Speeds: "6 levels",
      Heads: "6 attachments",
      Battery: "Up to 6 hours",
      Noise: "Under 45 dB",
    },
    priceKes: 6900,
    sku: "BTY-MASSAGE-PRO",
    stock: 14,
    categorySlug: "fashion-beauty-health",
    image: "/products/beauty.svg",
  },
];

const deliveryZones = [
  {
    name: "Nairobi Delivery",
    counties: ["Nairobi"],
    feeKes: 300,
    freeOverKes: 50000,
    isPickup: false,
  },
  {
    name: "Nairobi Pickup",
    counties: [] as string[],
    feeKes: 0,
    freeOverKes: null as number | null,
    isPickup: true,
  },
  {
    name: "Central Kenya",
    counties: ["Kiambu", "Murang'a", "Nyeri", "Kirinyaga", "Nyandarua"],
    feeKes: 500,
    freeOverKes: 70000,
    isPickup: false,
  },
  {
    name: "Rift Valley",
    counties: [
      "Nakuru",
      "Uasin Gishu",
      "Nandi",
      "Kericho",
      "Bomet",
      "Narok",
      "Kajiado",
      "Laikipia",
      "Baringo",
      "Elgeyo-Marakwet",
      "West Pokot",
      "Samburu",
      "Trans Nzoia",
      "Turkana",
    ],
    feeKes: 600,
    freeOverKes: 70000,
    isPickup: false,
  },
  {
    name: "Western Kenya",
    counties: ["Kakamega", "Bungoma", "Busia", "Vihiga"],
    feeKes: 650,
    freeOverKes: 70000,
    isPickup: false,
  },
  {
    name: "Nyanza",
    counties: ["Kisumu", "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira"],
    feeKes: 650,
    freeOverKes: 70000,
    isPickup: false,
  },
  {
    name: "Coast",
    counties: [
      "Mombasa",
      "Kilifi",
      "Kwale",
      "Lamu",
      "Taita-Taveta",
      "Tana River",
    ],
    feeKes: 700,
    freeOverKes: 70000,
    isPickup: false,
  },
  {
    name: "Eastern Kenya",
    counties: [
      "Machakos",
      "Kitui",
      "Makueni",
      "Meru",
      "Embu",
      "Tharaka-Nithi",
      "Isiolo",
      "Marsabit",
    ],
    feeKes: 600,
    freeOverKes: 70000,
    isPickup: false,
  },
  {
    name: "North Eastern",
    counties: ["Garissa", "Wajir", "Mandera"],
    feeKes: 800,
    freeOverKes: 90000,
    isPickup: false,
  },
];

async function main() {
  for (const category of categories) {
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
  const categoryIdBySlug = new Map(rows.map((row) => [row.slug, row.id]));

  for (const { categorySlug, image, ...product } of products) {
    const categoryId = categoryIdBySlug.get(categorySlug);

    if (!categoryId) {
      throw new Error(`Unknown category: ${categorySlug}`);
    }

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId },
      create: { ...product, categoryId },
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productImage.create({
      data: {
        productId: saved.id,
        url: image,
        alt: product.name,
        position: 0,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "whatsapp_number" },
    update: { value: "254717376964" },
    create: { key: "whatsapp_number", value: "254717376964" },
  });

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.upsert({
      where: { name: zone.name },
      update: zone,
      create: zone,
    });
  }

  const superadminEmail = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  const superadminPassword = process.env.SUPERADMIN_PASSWORD;

  if (superadminEmail && superadminPassword) {
    const passwordHash = await bcrypt.hash(superadminPassword, 12);

    await prisma.user.upsert({
      where: { email: superadminEmail },
      update: { role: "ADMIN", isActive: true, passwordHash },
      create: {
        email: superadminEmail,
        name: "Superadmin",
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log(`Superadmin ready: ${superadminEmail}`);
  } else {
    console.warn(
      "Skipping superadmin seed: set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD.",
    );
  }

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products and ${deliveryZones.length} delivery zones.`,
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
