import { describe, it, expect } from 'vitest';
import { mapSubscriptionToSale } from './salesList';
import type Stripe from 'stripe';

function sub(overrides: any = {}): Stripe.Subscription {
  return {
    id: 'sub_1',
    created: 1786390267, // 2026-08-10 (UTC)
    status: 'trialing',
    trial_end: 1786636800,
    metadata: { src: 'ia-whats-soulsync-m1', name: '61-70', email: 'meta@x.com' },
    customer: { id: 'cus_1', name: 'Rilza Maria', email: 'rilza@x.com', deleted: false },
    items: { data: [{ price: { unit_amount: 3990 } }] },
    ...overrides,
  } as unknown as Stripe.Subscription;
}

describe('mapSubscriptionToSale', () => {
  it('mapeia uma assinatura em trial com src, nome do cliente e valor', () => {
    const r = mapSubscriptionToSale(sub());
    expect(r.origem).toBe('ia-whats-soulsync-m1');
    expect(r.nome).toBe('Rilza Maria'); // prefere nome do cliente, não o metadata "61-70"
    expect(r.email).toBe('rilza@x.com');
    expect(r.status).toBe('Trial');
    expect(r.valor).toBe('39,90');
    expect(r.data).toBe('2026-08-10');
    expect(r.fimTrial).toBe('2026-08-13');
    expect(r.subscriptionId).toBe('sub_1');
    expect(r.createdTs).toBe(1786390267);
  });

  it('usa metadata.name quando o cliente não tem nome', () => {
    const r = mapSubscriptionToSale(sub({ customer: { id: 'cus_2', name: null, email: 'a@x.com', deleted: false } }));
    expect(r.nome).toBe('61-70');
    expect(r.email).toBe('a@x.com');
  });

  it('cliente como string (não expandido) → email cai no metadata', () => {
    const r = mapSubscriptionToSale(sub({ customer: 'cus_3' }));
    expect(r.nome).toBe('61-70');
    expect(r.email).toBe('meta@x.com');
  });

  it('src ausente → (sem origem)', () => {
    const r = mapSubscriptionToSale(sub({ metadata: {} }));
    expect(r.origem).toBe('(sem origem)');
    expect(r.nome).toBe('Rilza Maria');
  });

  it('traduz status active e canceled', () => {
    expect(mapSubscriptionToSale(sub({ status: 'active' })).status).toBe('Ativa');
    expect(mapSubscriptionToSale(sub({ status: 'canceled' })).status).toBe('Cancelada');
  });

  it('status desconhecido é repassado como veio', () => {
    expect(mapSubscriptionToSale(sub({ status: 'weird_state' })).status).toBe('weird_state');
  });

  it('sem trial_end → fimTrial vazio; sem preço → valor vazio', () => {
    const r = mapSubscriptionToSale(sub({ trial_end: null, items: { data: [] } }));
    expect(r.fimTrial).toBe('');
    expect(r.valor).toBe('');
  });
});
