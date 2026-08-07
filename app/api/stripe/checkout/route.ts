import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { buildCheckoutSessionParams } from '@/lib/stripe/checkout';
import { getPublicOrigin } from '@/lib/stripe/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, src, offer } = await req.json().catch(() => ({}));
    const origin = getPublicOrigin(req);

    const params = buildCheckoutSessionParams({
      name,
      email,
      src,
      origin,
      offer: offer === 'downsell' ? 'downsell' : undefined,
    });
    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Erro ao criar Checkout Session:', error);
    return NextResponse.json({ error: 'Falha ao iniciar o checkout' }, { status: 500 });
  }
}
