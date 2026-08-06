import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });

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
