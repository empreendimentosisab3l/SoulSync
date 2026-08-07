import { describe, it, expect } from 'vitest';
import { buildSaleRow } from './saleFromEvent';
import type Stripe from 'stripe';

function evt(type: string, object: any): Stripe.Event {
  return { id: 'evt_1', type, data: { object } } as unknown as Stripe.Event;
}

describe('buildSaleRow', () => {
  it('checkout.session.completed → Trial iniciado com src', () => {
    const r = buildSaleRow(evt('checkout.session.completed', {
      metadata: { src: 'whats-jan', name: 'Maria', email: 'maria@x.com' },
      customer_details: { email: 'maria@x.com', name: 'Maria' },
      subscription: 'sub_123',
    }));
    expect(r).toEqual({
      origem: 'whats-jan',
      nome: 'Maria',
      email: 'maria@x.com',
      evento: 'Trial iniciado',
      valor: '4,90',
      subscriptionId: 'sub_123',
    });
  });

  it('checkout.session.completed sem src → "(sem origem)"', () => {
    const r = buildSaleRow(evt('checkout.session.completed', {
      metadata: {},
      customer_details: { email: 'x@x.com', name: 'X' },
      subscription: 'sub_9',
    }));
    expect(r?.origem).toBe('(sem origem)');
  });

  it('invoice.paid subscription_cycle → Assinatura paga (src da subscription)', () => {
    const sub = { id: 'sub_123', metadata: { src: 'whats-jan', name: 'Maria', email: 'maria@x.com' } } as any;
    const r = buildSaleRow(
      evt('invoice.paid', { billing_reason: 'subscription_cycle', amount_paid: 3990, customer_email: 'maria@x.com', subscription: 'sub_123' }),
      sub,
    );
    expect(r).toEqual({
      origem: 'whats-jan',
      nome: 'Maria',
      email: 'maria@x.com',
      evento: 'Assinatura paga',
      valor: '39,90',
      subscriptionId: 'sub_123',
    });
  });

  it('invoice.paid subscription_create → null (evita duplicar o R$4,90)', () => {
    const r = buildSaleRow(evt('invoice.paid', { billing_reason: 'subscription_create', amount_paid: 490 }), null);
    expect(r).toBeNull();
  });

  it('customer.subscription.deleted → Cancelado', () => {
    const r = buildSaleRow(evt('customer.subscription.deleted', {
      id: 'sub_123',
      metadata: { src: 'whats-jan', name: 'Maria', email: 'maria@x.com' },
    }));
    expect(r).toEqual({
      origem: 'whats-jan',
      nome: 'Maria',
      email: 'maria@x.com',
      evento: 'Cancelado',
      valor: '',
      subscriptionId: 'sub_123',
    });
  });

  it('evento não rastreado → null', () => {
    expect(buildSaleRow(evt('customer.created', {}))).toBeNull();
  });

  it('checkout.session.completed com amount_total 100 → valor "1,00" (downsell)', () => {
    const r = buildSaleRow(evt('checkout.session.completed', {
      metadata: { src: 'whats-jan', name: 'Maria', email: 'maria@x.com' },
      customer_details: { email: 'maria@x.com', name: 'Maria' },
      subscription: 'sub_123',
      amount_total: 100,
    }));
    expect(r?.valor).toBe('1,00');
  });
});
