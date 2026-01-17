import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Se não tiver DATABASE_URL (Build da Vercel), usa o Mock
    if (!process.env.DATABASE_URL) {
        const { prismaMock } = require('./prisma-mock');
        return prismaMock;
    }

    // Se tiver URL, usa o Cliente Real
    return new PrismaClient();
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
