// lib/stripe/verifySession.test.ts
import { describe, it, expect } from 'vitest';
import { verifyPaidSession } from './verifySession';
import type Stripe from 'stripe';

const ok = (obj: any) => async () => obj as Stripe.Checkout.Session;
const throws = (err: any) => async () => { throw err; };

describe('verifyPaidSession', () => {
  it('sessão complete → paid + email de customer_details', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'complete', customer_details: { email: 'a@x.com' }, customer_email: null }));
    expect(r).toEqual({ status: 'paid', email: 'a@x.com' });
  });

  it('usa customer_email quando customer_details.email ausente', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'complete', customer_details: { email: null }, customer_email: 'b@x.com' }));
    expect(r).toEqual({ status: 'paid', email: 'b@x.com' });
  });

  it('email vazio quando a sessão não tem email', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'complete', customer_details: null, customer_email: null }));
    expect(r).toEqual({ status: 'paid', email: '' });
  });

  it('status diferente de complete → unpaid', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'open', customer_details: { email: 'a@x.com' } }));
    expect(r).toEqual({ status: 'unpaid' });
  });

  it('sessionId vazio → not_found (sem chamar Stripe)', async () => {
    let called = false;
    const r = await verifyPaidSession('', async () => { called = true; return {} as any; });
    expect(r).toEqual({ status: 'not_found' });
    expect(called).toBe(false);
  });

  it('StripeInvalidRequestError → not_found', async () => {
    const r = await verifyPaidSession('cs_bad', throws({ type: 'StripeInvalidRequestError' }));
    expect(r).toEqual({ status: 'not_found' });
  });

  it('erro genérico de rede/API → error', async () => {
    const r = await verifyPaidSession('cs_1', throws({ type: 'StripeConnectionError' }));
    expect(r).toEqual({ status: 'error' });
  });
});
