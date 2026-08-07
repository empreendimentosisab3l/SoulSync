// lib/stripe/verifySession.ts
import type Stripe from 'stripe';

export type SessionVerification =
  | { status: 'paid'; email: string }
  | { status: 'unpaid' }
  | { status: 'not_found' }
  | { status: 'error' };

type RetrieveFn = (id: string) => Promise<Stripe.Checkout.Session>;

export async function verifyPaidSession(sessionId: string, retrieve: RetrieveFn): Promise<SessionVerification> {
  if (!sessionId) return { status: 'not_found' };
  try {
    const session = await retrieve(sessionId);
    if (session.status === 'complete') {
      const email = session.customer_details?.email || session.customer_email || '';
      return { status: 'paid', email };
    }
    return { status: 'unpaid' };
  } catch (err: any) {
    if (err?.type === 'StripeInvalidRequestError') return { status: 'not_found' };
    return { status: 'error' };
  }
}
