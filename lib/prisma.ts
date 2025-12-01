// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only create PrismaClient if DATABASE_URL is available
// This prevents build errors when environment variables are not set
export const prisma = globalForPrisma.prisma ??
  (process.env.DATABASE_URL ? new PrismaClient() : null as any);

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}
