import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { resolveStripeEvent } from '@/lib/stripe/webhookResolver';
import { grantAccess } from '@/lib/access/grantAccess';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('❌ Assinatura de webhook inválida:', err);
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  try {
    const resolved = resolveStripeEvent(event);

    if (resolved.action === 'grant') {
      await grantAccess({ email: resolved.email, name: resolved.name, planType: resolved.planType });
      console.log('✅ Acesso concedido (Stripe):', resolved.email);
    } else if (resolved.action === 'revoke') {
      let email = resolved.email;
      if (!email && resolved.customerId) {
        try {
          const customer = await stripe.customers.retrieve(resolved.customerId);
          if (!customer.deleted) email = customer.email || '';
        } catch (e) {
          console.error('⚠️ Falha ao recuperar customer para revoke:', e);
        }
      }
      if (email) {
        await prisma.user.update({ where: { email }, data: { status: 'inactive' } }).catch((e: unknown) => {
          console.error('⚠️ Falha ao revogar acesso:', e);
        });
        console.log('❌ Acesso revogado (Stripe):', email);
      } else {
        console.error('⚠️ Revoke sem email resolvível para subscription/customer:', resolved.customerId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Erro ao processar webhook Stripe:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
