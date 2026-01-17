import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Fallback para evitar erro de build na Vercel se a chave não estiver configurada
    const url = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';
    return new PrismaClient({
        datasources: { db: { url } }
    });
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
