import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        // Skip during build time
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return NextResponse.json({ error: 'Build time' }, { status: 503 });
        }

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
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_for_build');
        const alg = 'HS256';

        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h') // 24 horas de sessão
            .sign(secret);

        // Definir Cookie Seguro via NextResponse
        const response = NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name }
        });

        const cookieValue = `session_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax${
            process.env.NODE_ENV === 'production' ? '; Secure' : ''
        }`;

        response.headers.set('Set-Cookie', cookieValue);

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            // Force redeploy
            return NextResponse.json({ error: 'Dados inválidos', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
    }
}
