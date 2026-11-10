import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

type Prisma = ReturnType<typeof createPrismaClient>;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment variables.",
    );
  }

  const adapter = new PrismaPg({ connectionString, max: 3 });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: Prisma;
};

function getPrisma(): Prisma {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

// Lazily initialize so importing this module never throws at build time.
export const prisma = new Proxy({} as Prisma, {
  get(_target, property) {
    const client = getPrisma();
    const value = Reflect.get(client, property, client);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
