import { describe, it, expect, beforeEach } from 'vitest';
import { buildCheckoutSessionParams } from './checkout';

describe('buildCheckoutSessionParams', () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_ACCESS_FEE = 'price_access_test';
    process.env.STRIPE_PRICE_SUBSCRIPTION = 'price_sub_test';
  });

  it('monta uma assinatura com taxa avulsa e trial de 3 dias', () => {
    const params = buildCheckoutSessionParams({
      name: 'Maria',
      email: 'maria@example.com',
      src: 'ig-bio',
      origin: 'https://soulsync.com',
    });

    expect(params.mode).toBe('subscription');
    expect(params.payment_method_collection).toBe('always');
    expect(params.customer_email).toBe('maria@example.com');
    expect(params.line_items).toEqual([
      { price: 'price_sub_test', quantity: 1 },
      { price: 'price_access_test', quantity: 1 },
    ]);
    expect(params.subscription_data?.trial_period_days).toBe(3);
    expect(params.subscription_data?.metadata).toEqual({ email: 'maria@example.com', name: 'Maria', src: 'ig-bio' });
    expect(params.success_url).toBe('https://soulsync.com/obrigado');
    expect(params.cancel_url).toBe('https://soulsync.com/quiz-v3/checkout');
  });

  it('coage valores ausentes para string vazia nos metadados', () => {
    const params = buildCheckoutSessionParams({ origin: 'https://soulsync.com' });
    expect(params.subscription_data?.metadata).toEqual({ email: '', name: '', src: '' });
    expect(params.customer_email).toBeUndefined();
  });

  it('offer downsell usa STRIPE_PRICE_DOWNSELL como taxa avulsa', () => {
    process.env.STRIPE_PRICE_DOWNSELL = 'price_downsell_test';
    const params = buildCheckoutSessionParams({ origin: 'https://soulsync.com', offer: 'downsell' });
    expect(params.line_items).toEqual([
      { price: 'price_sub_test', quantity: 1 },
      { price: 'price_downsell_test', quantity: 1 },
    ]);
  });

  it('sem offer usa a taxa padrão mesmo com downsell configurado', () => {
    process.env.STRIPE_PRICE_DOWNSELL = 'price_downsell_test';
    const params = buildCheckoutSessionParams({ origin: 'https://soulsync.com' });
    expect(params.line_items).toEqual([
      { price: 'price_sub_test', quantity: 1 },
      { price: 'price_access_test', quantity: 1 },
    ]);
  });

  it('offer downsell sem STRIPE_PRICE_DOWNSELL lança erro claro', () => {
    delete process.env.STRIPE_PRICE_DOWNSELL;
    expect(() => buildCheckoutSessionParams({ origin: 'https://soulsync.com', offer: 'downsell' }))
      .toThrow('STRIPE_PRICE_DOWNSELL não configurada');
  });
});
