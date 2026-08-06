import type Stripe from 'stripe';

export type StripeAction =
  | { action: 'grant'; email: string; name: string; planType: string }
  | { action: 'revoke'; email: string; customerId: string }
  | { action: 'noop' };

export function resolveStripeEvent(event: Stripe.Event): StripeAction {
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      const email = s.customer_details?.email || s.customer_email || s.metadata?.email || '';
      if (!email) return { action: 'noop' };
      return { action: 'grant', email, name: s.metadata?.name || '', planType: 'SoulSync Premium' };
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const email = sub.metadata?.email || '';
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id || '';
      if (!email && !customerId) return { action: 'noop' };
      return { action: 'revoke', email, customerId };
    }
    default:
      return { action: 'noop' };
  }
}
