import { describe, it, expect } from 'vitest';
import { resolveStripeEvent } from './webhookResolver';
import type Stripe from 'stripe';

function evt(type: string, object: any): Stripe.Event {
  return { id: 'evt_1', type, data: { object } } as unknown as Stripe.Event;
}

describe('resolveStripeEvent', () => {
  it('checkout.session.completed → grant', () => {
    const r = resolveStripeEvent(evt('checkout.session.completed', {
      customer_details: { email: 'maria@example.com' },
      metadata: { name: 'Maria', email: 'maria@example.com' },
    }));
    expect(r).toEqual({ action: 'grant', email: 'maria@example.com', name: 'Maria', planType: 'SoulSync Premium' });
  });

  it('customer.subscription.deleted → revoke usando metadata.email', () => {
    const r = resolveStripeEvent(evt('customer.subscription.deleted', {
      metadata: { email: 'maria@example.com' },
    }));
    expect(r).toEqual({ action: 'revoke', email: 'maria@example.com' });
  });

  it('customer.subscription.deleted sem email → noop', () => {
    const r = resolveStripeEvent(evt('customer.subscription.deleted', { metadata: {} }));
    expect(r).toEqual({ action: 'noop' });
  });

  it('invoice.payment_failed → noop (Stripe faz dunning)', () => {
    expect(resolveStripeEvent(evt('invoice.payment_failed', {}))).toEqual({ action: 'noop' });
  });

  it('invoice.paid → noop', () => {
    expect(resolveStripeEvent(evt('invoice.paid', {}))).toEqual({ action: 'noop' });
  });

  it('evento desconhecido → noop', () => {
    expect(resolveStripeEvent(evt('customer.created', {}))).toEqual({ action: 'noop' });
  });
});
