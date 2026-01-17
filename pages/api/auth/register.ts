import type { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Helper simples para serializar cookies (copiado do login por praticidade)
const serializeCookie = (name: string, value: string, options: any = {}) => {
    const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    let cookieString = `${name}=${stringValue}`;

    if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
    if (options.domain) cookieString += `; Domain=${options.domain}`;
    if (options.path) cookieString += `; Path=${options.path}`;
    if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly) cookieString += '; HttpOnly';
    if (options.secure) cookieString += '; Secure';
    if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

    return cookieString;
};

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, name } = registerSchema.parse(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Upsert user: create if not exists, update if exists
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                status: 'active',
                name: name || undefined,
            },
            create: {
                email,
                password: hashedPassword,
                name,
                status: 'active',
                plan: 'standard',
            },
        });

        // Gerar JWT e Login Automático
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_for_build');
        const alg = 'HS256';

        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h') // 24 horas de sessão
            .sign(secret);

        // Definir Cookie manually
        const cookie = serializeCookie('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 60 * 60 * 24, // 24 horas
            path: '/',
        });

        res.setHeader('Set-Cookie', cookie);

        return res.status(200).json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name }
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Dados inválidos', details: (error as any).errors });
        }
        return res.status(500).json({ error: 'Erro ao criar conta' });
    }
}
