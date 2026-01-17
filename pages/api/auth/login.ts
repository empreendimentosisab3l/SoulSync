import type { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Helper simples para serializar cookies
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Validar usuário e senha
        if (!user || user.password === null) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar JWT
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

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
}
