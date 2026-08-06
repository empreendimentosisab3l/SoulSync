import { describe, it, expect, beforeEach } from 'vitest';
import { TRIAL_DAYS, CURRENCY, ACCESS_FEE_AMOUNT, SUBSCRIPTION_AMOUNT, getStripePriceIds } from './config';

describe('stripe config', () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_ACCESS_FEE = 'price_access_test';
    process.env.STRIPE_PRICE_SUBSCRIPTION = 'price_sub_test';
  });

  it('define as constantes de negócio', () => {
    expect(TRIAL_DAYS).toBe(3);
    expect(CURRENCY).toBe('brl');
    expect(ACCESS_FEE_AMOUNT).toBe(490);
    expect(SUBSCRIPTION_AMOUNT).toBe(3990);
  });

  it('lê os price IDs do ambiente', () => {
    expect(getStripePriceIds()).toEqual({
      accessFee: 'price_access_test',
      subscription: 'price_sub_test',
    });
  });
});
