import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or DIRECT_URL) is not set");
}

const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD;

if (!email || !password) {
  throw new Error(
    "Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD before running seed:admin",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const passwordHash = await bcrypt.hash(password as string, 12);

  await prisma.user.upsert({
    where: { email: email as string },
    update: { role: "ADMIN", isActive: true, passwordHash },
    create: {
      email: email as string,
      name: "Superadmin",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Superadmin ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
