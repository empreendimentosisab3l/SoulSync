import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Não lançar no import de build; lançar no uso real evita quebrar `next build`.
  console.warn('⚠️ STRIPE_SECRET_KEY não configurada.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder');
