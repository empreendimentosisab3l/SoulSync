// Mock do Prisma para permitir o Build da Vercel sem chaves de banco
// Isso evita que o sistema tente conectar no banco durante a compilação

export const prismaMock = {
    user: {
        findUnique: async () => null,
        upsert: async () => ({ id: 'mock', email: 'mock@email.com' }),
        create: async () => ({ id: 'mock', email: 'mock@email.com' }),
        update: async () => ({ id: 'mock', email: 'mock@email.com' }),
    },
    $connect: async () => { },
    $disconnect: async () => { },
};
