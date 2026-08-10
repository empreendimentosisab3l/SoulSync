import type Stripe from 'stripe';

export interface SaleListRow {
  /** Data de criação da assinatura (ISO, YYYY-MM-DD, UTC) */
  data: string;
  /** Timestamp unix (segundos) da criação — para ordenação */
  createdTs: number;
  /** Origem da campanha (metadata.src) */
  origem: string;
  /** Nome real do cliente (do cadastro do cartão), com fallback para metadata.name */
  nome: string;
  /** Email do cliente */
  email: string;
  /** Status traduzido: Trial / Ativa / Cancelada / Atrasada / ... */
  status: string;
  /** Valor recorrente formatado em BRL, ex: "39,90" */
  valor: string;
  /** Fim do trial (ISO YYYY-MM-DD) ou "" se não houver */
  fimTrial: string;
  /** ID da assinatura (sub_...) */
  subscriptionId: string;
}

const SEM_ORIGEM = '(sem origem)';

function brl(amountCents: number | null | undefined): string {
  if (amountCents == null) return '';
  return (amountCents / 100).toFixed(2).replace('.', ',');
}

function isoDate(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return '';
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

const STATUS_PT: Record<string, string> = {
  trialing: 'Trial',
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Atrasada',
  unpaid: 'Não paga',
  incomplete: 'Incompleta',
  incomplete_expired: 'Expirada',
  paused: 'Pausada',
};

function customerFields(customer: Stripe.Subscription['customer']): { nome: string; email: string } {
  if (customer && typeof customer === 'object' && !('deleted' in customer && customer.deleted)) {
    const c = customer as Stripe.Customer;
    return { nome: c.name || '', email: c.email || '' };
  }
  return { nome: '', email: '' };
}

export function mapSubscriptionToSale(sub: Stripe.Subscription): SaleListRow {
  const fromCustomer = customerFields(sub.customer);
  const price = sub.items?.data?.[0]?.price;

  return {
    data: isoDate(sub.created),
    createdTs: sub.created ?? 0,
    origem: sub.metadata?.src || SEM_ORIGEM,
    nome: fromCustomer.nome || sub.metadata?.name || '',
    email: fromCustomer.email || sub.metadata?.email || '',
    status: STATUS_PT[sub.status] ?? sub.status,
    valor: brl(price?.unit_amount),
    fimTrial: isoDate(sub.trial_end),
    subscriptionId: sub.id,
  };
}
