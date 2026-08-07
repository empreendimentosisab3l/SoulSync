# Tracking de Vendas Stripe por Campanha (Google Sheets) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Registrar cada venda do funil Stripe (trial R$ 4,90, assinatura R$ 39,90, cancelamento) numa aba "Vendas Stripe" do Google Sheets existente, com a origem da campanha (`src`), para atribuição por disparo de e-mail/WhatsApp.

**Architecture:** Uma função pura `buildSaleRow(event, subscription?)` mapeia um evento Stripe para uma linha de venda (testada com vitest). Um writer `appendSaleRow(row)` grava na aba "Vendas Stripe" reusando a auth Google via env vars. O webhook `/api/stripe/webhook` chama os dois após o grant/revoke, sem nunca quebrar o fluxo de acesso.

**Tech Stack:** Next.js 16 (App Router), TypeScript 5, `stripe`, `google-spreadsheet` 5.0.2 + `google-auth-library` 10.5.0 (já instaladas), vitest.

## Global Constraints

- Aba de destino: título exato `"Vendas Stripe"`; cabeçalhos exatos: `Data`, `Origem`, `Nome`, `Email`, `Evento`, `Valor (R$)`, `Assinatura ID`.
- Rótulos de evento exatos: `"Trial iniciado"`, `"Assinatura paga"`, `"Cancelado"`.
- `src` ausente → gravar a string exata `"(sem origem)"`.
- Anti-duplicidade: `invoice.paid` com `billing_reason === 'subscription_create'` **não** é gravado (o R$ 4,90 já vem via `checkout.session.completed`). Só `subscription_cycle` (recorrente) é gravado.
- Valor formatado em BRL com vírgula: `(amount/100).toFixed(2).replace('.', ',')` → ex. `"39,90"`.
- Env vars (já existentes na Vercel): `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`. Ler `GOOGLE_PRIVATE_KEY` com `.replace(/\\n/g, '\n')`. **Nunca** hardcodar a chave.
- Falha ao gravar no Sheets **nunca** lança para fora / nunca quebra o webhook (retorna 200).
- `npm run lint` está quebrado no Next 16 — usar `npx tsc --noEmit` para typecheck.
- Rodar testes com `npx vitest run` (o script `npm test` pode retornar código não-zero por um aviso do vitest; `npx vitest run` mostra o resultado real).
- Spec de referência: `docs/superpowers/specs/2026-08-07-tracking-vendas-stripe-sheets-design.md`.

---

## File Structure

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/stripe/saleFromEvent.ts` | `SaleRow` (tipo) + `buildSaleRow()` — pura, evento → linha (ou null) |
| `lib/stripe/saleFromEvent.test.ts` | Testes vitest da função pura |
| `lib/sheets/salesSheet.ts` | `appendSaleRow()` — grava na aba "Vendas Stripe" |
| `app/api/stripe/webhook/route.ts` | (Modificar) chama build+append após grant/revoke |

---

## Task 1: `buildSaleRow` (função pura) + testes

**Files:**
- Create: `lib/stripe/saleFromEvent.ts`
- Test: `lib/stripe/saleFromEvent.test.ts`

**Interfaces:**
- Produces:
  ```ts
  interface SaleRow {
    origem: string;
    nome: string;
    email: string;
    evento: 'Trial iniciado' | 'Assinatura paga' | 'Cancelado';
    valor: string;         // "4,90" | "39,90" | ""
    subscriptionId: string;
  }
  function buildSaleRow(event: Stripe.Event, subscription?: Stripe.Subscription | null): SaleRow | null
  ```
  Para `invoice.paid`, o `src`/nome vêm do `subscription` passado pelo webhook (o invoice não carrega). Para os outros eventos, `subscription` é ignorado.

- [ ] **Step 1: Escrever o teste que falha — `lib/stripe/saleFromEvent.test.ts`**

```ts
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
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run lib/stripe/saleFromEvent.test.ts`
Expected: FAIL — `./saleFromEvent` não existe.

- [ ] **Step 3: Implementar `lib/stripe/saleFromEvent.ts`**

```ts
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
        valor: '4,90',
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
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npx vitest run lib/stripe/saleFromEvent.test.ts`
Expected: PASS (6 testes).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem novos erros.

- [ ] **Step 6: Commit**

```bash
git add lib/stripe/saleFromEvent.ts lib/stripe/saleFromEvent.test.ts
git commit -m "feat(tracking): buildSaleRow - mapeia evento Stripe para linha de venda"
```

---

## Task 2: Writer do Google Sheets + integração no webhook

**Files:**
- Create: `lib/sheets/salesSheet.ts`
- Modify: `app/api/stripe/webhook/route.ts`

**Interfaces:**
- Consumes: `SaleRow` e `buildSaleRow` de `@/lib/stripe/saleFromEvent`; `stripe` de `@/lib/stripe/client`.
- Produces: `appendSaleRow(row: SaleRow): Promise<void>` — nunca lança.

- [ ] **Step 1: Implementar `lib/sheets/salesSheet.ts`**

Espelha o padrão de auth do webhook Payt (`app/api/webhook/payt/route.ts` `saveToGoogleSheets`), mas lê a chave de env (com normalização de `\n`) e grava numa aba dedicada, criando-a com cabeçalhos se não existir. Captura os próprios erros — nunca lança.

```ts
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { SaleRow } from '@/lib/stripe/saleFromEvent';

const SHEET_TITLE = 'Vendas Stripe';
const HEADERS = ['Data', 'Origem', 'Nome', 'Email', 'Evento', 'Valor (R$)', 'Assinatura ID'];

export async function appendSaleRow(row: SaleRow): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !serviceEmail || !rawKey) {
    console.warn('⚠️ Google Sheets não configurado — venda não registrada na planilha');
    return;
  }

  try {
    const auth = new JWT({
      email: serviceEmail,
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    let sheet = doc.sheetsByTitle[SHEET_TITLE];
    if (!sheet) {
      sheet = await doc.addSheet({ title: SHEET_TITLE, headerValues: HEADERS });
    }

    await sheet.addRow({
      'Data': new Date().toLocaleString('pt-BR'),
      'Origem': row.origem,
      'Nome': row.nome,
      'Email': row.email,
      'Evento': row.evento,
      'Valor (R$)': row.valor,
      'Assinatura ID': row.subscriptionId,
    });

    console.log('✅ Venda registrada (Vendas Stripe):', row.evento, '-', row.origem);
  } catch (error) {
    console.error('⚠️ Falha ao registrar venda no Google Sheets:', error);
  }
}
```

- [ ] **Step 2: Integrar no webhook — `app/api/stripe/webhook/route.ts`**

Adicionar os imports no topo (junto aos existentes):

```ts
import type Stripe from 'stripe';
import { buildSaleRow } from '@/lib/stripe/saleFromEvent';
import { appendSaleRow } from '@/lib/sheets/salesSheet';
```

Dentro do `try { ... }` principal, **após** o bloco `if (resolved.action === 'grant') { ... } else if (resolved.action === 'revoke') { ... }` e **antes** de `return NextResponse.json({ received: true });`, inserir:

```ts
    // Tracking de vendas na planilha (não bloqueia o webhook)
    try {
      let subForSale: Stripe.Subscription | null = null;
      if (event.type === 'invoice.paid') {
        const inv = event.data.object as Stripe.Invoice;
        const invSubId =
          typeof (inv as any).subscription === 'string'
            ? (inv as any).subscription
            : (inv as any).subscription?.id ??
              (inv as any).parent?.subscription_details?.subscription ??
              null;
        if (invSubId) {
          subForSale = await stripe.subscriptions.retrieve(invSubId);
        }
      }
      const saleRow = buildSaleRow(event, subForSale);
      if (saleRow) await appendSaleRow(saleRow);
    } catch (e) {
      console.error('⚠️ Falha no tracking de venda (não bloqueante):', e);
    }
```

- [ ] **Step 3: Typecheck e testes**

Run: `npx tsc --noEmit && npx vitest run`
Expected: tsc sem novos erros; todos os testes passam.

- [ ] **Step 4: Commit**

```bash
git add lib/sheets/salesSheet.ts app/api/stripe/webhook/route.ts
git commit -m "feat(tracking): grava vendas Stripe na aba Vendas Stripe do Google Sheets"
```

- [ ] **Step 5: Verificação (pós-deploy, manual)**

Após o merge/deploy em produção, a aba "Vendas Stripe" é criada automaticamente na primeira venda. Verificar na próxima venda real (ou numa venda de teste com `?src=teste`) que aparece uma linha com a origem correta. Como o endpoint de produção agora valida assinatura com a chave **live**, não é possível validar com eventos do modo teste da Stripe — a verificação acontece na primeira venda live (ou reative temporariamente as chaves de teste para um teste isolado).

---

## Notas

- **Fetch da subscription no `invoice.paid`:** a extração do id da subscription do invoice é defensiva (`inv.subscription` ou `inv.parent.subscription_details.subscription`) porque o formato varia entre versões da API Stripe (a conta usa `2026-07-29.dahlia`). Se em produção o `src` da linha "Assinatura paga" vier como "(sem origem)", investigar de onde o id da subscription deve ser lido nessa versão e ajustar essa extração.
- **`checkout.session.completed`** já é logado como "Trial iniciado" (R$ 4,90); o `invoice.paid` de `subscription_create` é ignorado para não duplicar.
- **Google Sheets deferido no grantAccess** (do webhook Payt-mirror) permanece deferido — esta feature usa uma aba separada e não mexe no fluxo de acesso.

## Self-Review (coberto)

- Spec → tarefas: buildSaleRow + mapeamento dos 3 eventos + anti-duplicidade (T1); writer na aba "Vendas Stripe" + reuso de auth Google + integração no webhook sem bloquear (T2). ✅
- Tipos consistentes: `SaleRow`/`buildSaleRow`/`appendSaleRow` com assinaturas idênticas entre T1 e T2. ✅
- Sem placeholders: todo passo de código tem implementação real. ✅
