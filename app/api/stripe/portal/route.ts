import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_for_build');
    let email: string;
    try {
      const { payload } = await jwtVerify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
        select: { email: true },
      });
      if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
      email = user.email;
    } catch {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

    const origin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/membros`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('❌ Erro ao criar Portal Session:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
