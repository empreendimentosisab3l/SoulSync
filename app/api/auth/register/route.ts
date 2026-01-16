import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = registerSchema.parse(body);

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
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const alg = 'HS256';

        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h') // 24 horas de sessão
            .sign(secret);

        // Definir Cookie Seguro
        const cookieStore = await cookies();
        cookieStore.set('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 horas
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name }
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
    }
}
