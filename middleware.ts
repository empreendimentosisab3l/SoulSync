import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('session_token')?.value;

    // Se não tiver token, redireciona para login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        // Verifica se o token é válido e não expirou
        await jwtVerify(token, secret);

        // Token válido, permite acesso
        return NextResponse.next();

    } catch (error) {
        // Token inválido ou expirado
        console.error('Middleware Auth Error:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Configuração: Protege apenas rotas que começam com /membros
export const config = {
    matcher: '/membros/:path*',
};
