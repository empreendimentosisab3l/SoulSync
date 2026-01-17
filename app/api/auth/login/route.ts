import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        // Skip during build time
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return NextResponse.json({ error: 'Build time' }, { status: 503 });
        }

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Validar usuário e senha
        if (!user || !user.password) {
            // Simular delay para evitar timing attack
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        // Gerar JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_for_build');
        const alg = 'HS256';

        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h') // 24 horas de sessão
            .sign(secret);

        // Definir Cookie Seguro via NextResponse
        const response = NextResponse.json({ success: true });

        const cookieValue = `session_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax${
            process.env.NODE_ENV === 'production' ? '; Secure' : ''
        }`;

        response.headers.set('Set-Cookie', cookieValue);

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}
