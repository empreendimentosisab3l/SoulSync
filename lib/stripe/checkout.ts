import type Stripe from 'stripe';
import { getStripePriceIds, TRIAL_DAYS } from './config';

export interface CheckoutInput {
  name?: string;
  email?: string;
  src?: string | null;
  origin: string;
}

export function buildCheckoutSessionParams(input: CheckoutInput): Stripe.Checkout.SessionCreateParams {
  const { accessFee, subscription } = getStripePriceIds();
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
      { price: accessFee, quantity: 1 },
    ],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata,
    },
    metadata,
    success_url: `${input.origin}/quiz-v3/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/quiz-v3/checkout`,
  };
}
