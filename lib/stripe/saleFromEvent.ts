import type Stripe from 'stripe';

export interface SaleRow {
  origem: string;
  nome: string;
  email: string;
  evento: 'Trial iniciado' | 'Assinatura paga' | 'Cancelado';
  valor: string;
  subscriptionId: string;
}

const SEM_ORIGEM = '(sem origem)';

function brl(amountCents: number): string {
  return (amountCents / 100).toFixed(2).replace('.', ',');
}

function subId(sub: string | { id?: string } | null | undefined): string {
  if (!sub) return '';
  return typeof sub === 'string' ? sub : sub.id ?? '';
}

export function buildSaleRow(
  event: Stripe.Event,
  subscription?: Stripe.Subscription | null,
): SaleRow | null {
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      return {
        origem: s.metadata?.src || SEM_ORIGEM,
        nome: s.metadata?.name || s.customer_details?.name || '',
        email: s.customer_details?.email || s.customer_email || s.metadata?.email || '',
        evento: 'Trial iniciado',
        valor: (s as any).amount_total != null ? brl((s as any).amount_total) : '4,90',
        subscriptionId: subId(s.subscription as any),
      };
    }
    case 'invoice.paid': {
      const inv = event.data.object as Stripe.Invoice;
      if ((inv as any).billing_reason !== 'subscription_cycle') return null;
      return {
        origem: subscription?.metadata?.src || SEM_ORIGEM,
        nome: subscription?.metadata?.name || '',
        email: inv.customer_email || subscription?.metadata?.email || '',
        evento: 'Assinatura paga',
        valor: brl(inv.amount_paid ?? 0),
        subscriptionId: subscription?.id || subId((inv as any).subscription),
      };
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      return {
        origem: sub.metadata?.src || SEM_ORIGEM,
        nome: sub.metadata?.name || '',
        email: sub.metadata?.email || '',
        evento: 'Cancelado',
        valor: '',
        subscriptionId: sub.id,
      };
    }
    default:
      return null;
  }
}
