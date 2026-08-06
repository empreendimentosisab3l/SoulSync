import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { buildCheckoutSessionParams } from '@/lib/stripe/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, src } = await req.json().catch(() => ({}));
    const origin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    const params = buildCheckoutSessionParams({ name, email, src, origin });
    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Erro ao criar Checkout Session:', error);
    return NextResponse.json({ error: 'Falha ao iniciar o checkout' }, { status: 500 });
  }
}
