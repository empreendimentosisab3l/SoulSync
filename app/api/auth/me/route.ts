import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('session_token')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_for_build');

        try {
            const { payload } = await jwtVerify(token, secret);

            // Opcional: Buscar dados atualizados do banco
            const user = await prisma.user.findUnique({
                where: { id: payload.userId as string },
                select: { id: true, name: true, email: true, plan: true, status: true }
            });

            if (!user) {
                return NextResponse.json({ authenticated: false }, { status: 401 });
            }

            return NextResponse.json({
                authenticated: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    planType: user.plan,
                    status: user.status
                }
            });

        } catch (e) {
            // Token inválido ou expirado
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
