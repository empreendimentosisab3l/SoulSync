import type Stripe from 'stripe';
import { getStripePriceIds, TRIAL_DAYS } from './config';

export interface CheckoutInput {
  name?: string;
  email?: string;
  src?: string | null;
  origin: string;
  offer?: 'downsell';
}

export function buildCheckoutSessionParams(input: CheckoutInput): Stripe.Checkout.SessionCreateParams {
  const { accessFee, subscription, downsell } = getStripePriceIds();
  let fee = accessFee;
  if (input.offer === 'downsell') {
    if (!downsell) throw new Error('STRIPE_PRICE_DOWNSELL não configurada');
    fee = downsell;
  }

  const metadata = {
    email: input.email ?? '',
    name: input.name ?? '',
    src: input.src ?? '',
  };

  return {
    mode: 'subscription',
    payment_method_collection: 'always',
    locale: 'pt-BR',
    customer_email: input.email || undefined,
    line_items: [
      { price: subscription, quantity: 1 },
      { price: fee, quantity: 1 },
    ],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata,
    },
    metadata,
    success_url: `${input.origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/quiz-v3/checkout`,
  };
}
