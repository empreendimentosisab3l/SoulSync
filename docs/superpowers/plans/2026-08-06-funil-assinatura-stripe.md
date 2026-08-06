# Funil de Assinatura Stripe (Trial Pago) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o checkout Payt de compra única do quiz-v3 por uma assinatura Stripe com trial pago (R$ 4,90 hoje → R$ 39,90/mês após 3 dias), mantendo os funis legados intactos.

**Architecture:** Stripe Checkout hospedado em `mode=subscription`. A página de vendas chama uma rota interna que cria a Checkout Session com dois itens (taxa avulsa R$ 4,90 + assinatura R$ 39,90/mês com `trial_period_days=3`). A lógica de negócio fica em funções **puras** (`lib/stripe/*`) testadas com vitest; as rotas são wrappers finos. Um webhook espelha o pipeline do webhook Payt existente (upsert Prisma `active` → email de acesso via Resend).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, `stripe` (SDK Node), Prisma 5.10 (PostgreSQL), Resend, vitest.

## Global Constraints

- Moeda: `brl`. Valores em centavos: taxa de acesso = `490`, assinatura = `3990`.
- Trial: `3` dias (constante `TRIAL_DAYS = 3`).
- Rotas Stripe que usam o SDK ou verificam webhook: `export const runtime = 'nodejs'` e `export const dynamic = 'force-dynamic'` (SDK Stripe não roda em edge; verificação de assinatura exige body cru).
- **Nunca** hardcodar chaves — todas via `process.env`. (O webhook Payt tem chaves hardcoded; **não** replicar esse padrão.)
- Não tocar em: `app/api/webhook/payt/route.ts`, funis `/oferta`, `/oferta-v2`, `app/quiz-v3/result/5/page.tsx`, login JWT (`app/api/auth/me`, `contexts/AuthContext.tsx`), `app/membros/page.tsx`.
- Metadata do Stripe: todos os valores devem ser `string` (coagir `undefined` → `''`).
- Cliente Stripe instanciado como `new Stripe(process.env.STRIPE_SECRET_KEY!)` **sem** fixar `apiVersion` (deixar o default do SDK; evitar chutar string de versão).
- Spec de referência: `docs/superpowers/specs/2026-08-06-funil-assinatura-stripe-design.md`.

---

## File Structure

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/stripe/config.ts` | Constantes: price IDs (env), valores, `TRIAL_DAYS`, moeda |
| `lib/stripe/client.ts` | Singleton do cliente Stripe (server-side) |
| `lib/stripe/checkout.ts` | `buildCheckoutSessionParams()` — pura, monta params da Session |
| `lib/stripe/webhookResolver.ts` | `resolveStripeEvent()` — pura, mapeia evento → ação |
| `lib/access/grantAccess.ts` | `grantAccess()` — upsert Prisma `active` + email de acesso |
| `app/api/stripe/checkout/route.ts` | POST → cria Session, retorna `{ url }` |
| `app/api/stripe/webhook/route.ts` | POST → verifica assinatura, executa grant/revoke |
| `app/api/stripe/portal/route.ts` | POST → cria sessão do Customer Portal |
| `app/quiz-v3/sucesso/page.tsx` | Página de retorno pós-pagamento |
| `app/quiz-v3/checkout/page.tsx` | (Modificar) herói R$ 4,90 + `handleCheckout` chama a nova API |
| `vitest.config.ts`, `package.json` | Setup de testes |
| `.env.example` | Documentar novas env vars |

---

## Task 1: Setup de dependências, testes e config Stripe

**Files:**
- Modify: `package.json` (deps + script de teste)
- Create: `vitest.config.ts`
- Create: `lib/stripe/config.ts`
- Create: `lib/stripe/client.ts`
- Create: `.env.example` (ou modificar, se existir)
- Test: `lib/stripe/config.test.ts`

**Interfaces:**
- Produces:
  - `lib/stripe/config.ts` exporta: `TRIAL_DAYS: number`, `CURRENCY: 'brl'`, `ACCESS_FEE_AMOUNT: number`, `SUBSCRIPTION_AMOUNT: number`, `getStripePriceIds(): { accessFee: string; subscription: string }`
  - `lib/stripe/client.ts` exporta: `stripe` (instância `Stripe`)

- [ ] **Step 1: Instalar dependências**

```bash
cd "C:/Users/Lucas/Documents/Soulsync"
npm install stripe
npm install -D vitest
```

- [ ] **Step 2: Adicionar script de teste ao `package.json`**

Em `"scripts"`, adicionar:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Criar `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Escrever o teste que falha — `lib/stripe/config.test.ts`**

```ts
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
```

- [ ] **Step 5: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FAIL — módulo `./config` não existe.

- [ ] **Step 6: Implementar `lib/stripe/config.ts`**

```ts
export const TRIAL_DAYS = 3;
export const CURRENCY = 'brl' as const;
export const ACCESS_FEE_AMOUNT = 490;      // R$ 4,90 em centavos
export const SUBSCRIPTION_AMOUNT = 3990;   // R$ 39,90 em centavos

export function getStripePriceIds(): { accessFee: string; subscription: string } {
  const accessFee = process.env.STRIPE_PRICE_ACCESS_FEE;
  const subscription = process.env.STRIPE_PRICE_SUBSCRIPTION;
  if (!accessFee || !subscription) {
    throw new Error('STRIPE_PRICE_ACCESS_FEE e STRIPE_PRICE_SUBSCRIPTION devem estar configuradas');
  }
  return { accessFee, subscription };
}
```

- [ ] **Step 7: Implementar `lib/stripe/client.ts`**

```ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Não lançar no import de build; lançar no uso real evita quebrar `next build`.
  console.warn('⚠️ STRIPE_SECRET_KEY não configurada.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder');
```

- [ ] **Step 8: Documentar env vars em `.env.example`**

Adicionar (criar o arquivo se não existir):

```
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRICE_ACCESS_FEE=price_xxx        # R$ 4,90 avulso
STRIPE_PRICE_SUBSCRIPTION=price_xxx      # R$ 39,90/mês recorrente
```

- [ ] **Step 9: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/stripe/config.ts lib/stripe/config.test.ts lib/stripe/client.ts .env.example
git commit -m "feat(stripe): setup de deps, testes e config base"
```

---

## Task 2: Builder puro da Checkout Session + rota de checkout

**Files:**
- Create: `lib/stripe/checkout.ts`
- Create: `app/api/stripe/checkout/route.ts`
- Test: `lib/stripe/checkout.test.ts`

**Interfaces:**
- Consumes: `getStripePriceIds()`, `TRIAL_DAYS` de `lib/stripe/config.ts`; `stripe` de `lib/stripe/client.ts`.
- Produces:
  - `lib/stripe/checkout.ts` exporta:
    ```ts
    interface CheckoutInput { name?: string; email?: string; src?: string | null; origin: string }
    function buildCheckoutSessionParams(input: CheckoutInput): Stripe.Checkout.SessionCreateParams
    ```
  - Rota `POST /api/stripe/checkout` recebe JSON `{ name?, email?, src? }`, responde `{ url: string }`.

- [ ] **Step 1: Escrever o teste que falha — `lib/stripe/checkout.test.ts`**

```ts
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
    expect(params.success_url).toBe('https://soulsync.com/quiz-v3/sucesso?session_id={CHECKOUT_SESSION_ID}');
    expect(params.cancel_url).toBe('https://soulsync.com/quiz-v3/checkout');
  });

  it('coage valores ausentes para string vazia nos metadados', () => {
    const params = buildCheckoutSessionParams({ origin: 'https://soulsync.com' });
    expect(params.subscription_data?.metadata).toEqual({ email: '', name: '', src: '' });
    expect(params.customer_email).toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FAIL — `./checkout` não existe.

- [ ] **Step 3: Implementar `lib/stripe/checkout.ts`**

```ts
import type Stripe from 'stripe';
import { getStripePriceIds, TRIAL_DAYS } from './config';

export interface CheckoutInput {
  name?: string;
  email?: string;
  src?: string | null;
  origin: string;
}

export function buildCheckoutSessionParams(input: CheckoutInput): Stripe.Checkout.SessionCreateParams {
  const { accessFee, subscription } = getStripePriceIds();
  const metadata = {
    email: input.email ?? '',
    name: input.name ?? '',
    src: input.src ?? '',
  };

  return {
    mode: 'subscription',
    payment_method_collection: 'always',
    locale: 'pt-BR',
    customer_email: input.email || undefined,
    line_items: [
      { price: subscription, quantity: 1 },
      { price: accessFee, quantity: 1 },
    ],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata,
    },
    metadata,
    success_url: `${input.origin}/quiz-v3/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/quiz-v3/checkout`,
  };
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Implementar a rota `app/api/stripe/checkout/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { buildCheckoutSessionParams } from '@/lib/stripe/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, src } = await req.json().catch(() => ({}));
    const origin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    const params = buildCheckoutSessionParams({ name, email, src, origin });
    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ Erro ao criar Checkout Session:', error);
    return NextResponse.json({ error: 'Falha ao iniciar o checkout' }, { status: 500 });
  }
}
```

- [ ] **Step 6: Verificar typecheck/lint**

Run: `npm run lint`
Expected: sem erros nos arquivos novos.

- [ ] **Step 7: Commit**

```bash
git add lib/stripe/checkout.ts lib/stripe/checkout.test.ts app/api/stripe/checkout/route.ts
git commit -m "feat(stripe): builder da Checkout Session + rota /api/stripe/checkout"
```

---

## Task 3: Resolver de webhook (puro) + concessão de acesso + rota de webhook

**Files:**
- Create: `lib/stripe/webhookResolver.ts`
- Create: `lib/access/grantAccess.ts`
- Create: `app/api/stripe/webhook/route.ts`
- Test: `lib/stripe/webhookResolver.test.ts`

**Interfaces:**
- Consumes: `sendAccessEmail` de `@/lib/email/sendAccessEmail`; `prisma` de `@/lib/prisma`; `stripe` de `@/lib/stripe/client`.
- Produces:
  - `lib/stripe/webhookResolver.ts` exporta:
    ```ts
    type StripeAction =
      | { action: 'grant'; email: string; name: string; planType: string }
      | { action: 'revoke'; email: string }
      | { action: 'noop' };
    function resolveStripeEvent(event: Stripe.Event): StripeAction
    ```
  - `lib/access/grantAccess.ts` exporta:
    ```ts
    function grantAccess(input: { email: string; name: string; planType: string }): Promise<void>
    ```

- [ ] **Step 1: Escrever o teste que falha — `lib/stripe/webhookResolver.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { resolveStripeEvent } from './webhookResolver';
import type Stripe from 'stripe';

function evt(type: string, object: any): Stripe.Event {
  return { id: 'evt_1', type, data: { object } } as unknown as Stripe.Event;
}

describe('resolveStripeEvent', () => {
  it('checkout.session.completed → grant', () => {
    const r = resolveStripeEvent(evt('checkout.session.completed', {
      customer_details: { email: 'maria@example.com' },
      metadata: { name: 'Maria', email: 'maria@example.com' },
    }));
    expect(r).toEqual({ action: 'grant', email: 'maria@example.com', name: 'Maria', planType: 'SoulSync Premium' });
  });

  it('customer.subscription.deleted → revoke usando metadata.email', () => {
    const r = resolveStripeEvent(evt('customer.subscription.deleted', {
      metadata: { email: 'maria@example.com' },
    }));
    expect(r).toEqual({ action: 'revoke', email: 'maria@example.com' });
  });

  it('customer.subscription.deleted sem email → noop', () => {
    const r = resolveStripeEvent(evt('customer.subscription.deleted', { metadata: {} }));
    expect(r).toEqual({ action: 'noop' });
  });

  it('invoice.payment_failed → noop (Stripe faz dunning)', () => {
    expect(resolveStripeEvent(evt('invoice.payment_failed', {}))).toEqual({ action: 'noop' });
  });

  it('invoice.paid → noop', () => {
    expect(resolveStripeEvent(evt('invoice.paid', {}))).toEqual({ action: 'noop' });
  });

  it('evento desconhecido → noop', () => {
    expect(resolveStripeEvent(evt('customer.created', {}))).toEqual({ action: 'noop' });
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npm test`
Expected: FAIL — `./webhookResolver` não existe.

- [ ] **Step 3: Implementar `lib/stripe/webhookResolver.ts`**

```ts
import type Stripe from 'stripe';

export type StripeAction =
  | { action: 'grant'; email: string; name: string; planType: string }
  | { action: 'revoke'; email: string }
  | { action: 'noop' };

export function resolveStripeEvent(event: Stripe.Event): StripeAction {
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      const email = s.customer_details?.email || s.customer_email || s.metadata?.email || '';
      if (!email) return { action: 'noop' };
      return { action: 'grant', email, name: s.metadata?.name || '', planType: 'SoulSync Premium' };
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const email = sub.metadata?.email || '';
      if (!email) return { action: 'noop' };
      return { action: 'revoke', email };
    }
    default:
      return { action: 'noop' };
  }
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Implementar `lib/access/grantAccess.ts`**

Espelha o pipeline de concessão do webhook Payt (`app/api/webhook/payt/route.ts:160-189`): gera token, faz upsert no Prisma com `status: 'active'`, envia email de acesso. (Google Sheets é intencionalmente deferido para não entrelaçar a chave hardcoded do Service Account; ver nota no fim do plano.)

```ts
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendAccessEmail } from '@/lib/email/sendAccessEmail';

export async function grantAccess(input: { email: string; name: string; planType: string }): Promise<void> {
  const { email, name, planType } = input;
  const token = crypto.randomBytes(32).toString('hex');

  await prisma.user.upsert({
    where: { email },
    update: { status: 'active', name: name || undefined },
    create: {
      email,
      name: name || email.split('@')[0],
      status: 'active',
      plan: 'standard',
      password: '',
    },
  });

  const result = await sendAccessEmail({ token, email, name: name || email.split('@')[0], planType });
  if (!result.success) {
    console.error('⚠️ Acesso concedido, mas falha ao enviar email:', result.error);
  }
}
```

- [ ] **Step 6: Implementar a rota `app/api/stripe/webhook/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { resolveStripeEvent } from '@/lib/stripe/webhookResolver';
import { grantAccess } from '@/lib/access/grantAccess';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('❌ Assinatura de webhook inválida:', err);
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  try {
    const resolved = resolveStripeEvent(event);

    if (resolved.action === 'grant') {
      await grantAccess({ email: resolved.email, name: resolved.name, planType: resolved.planType });
      console.log('✅ Acesso concedido (Stripe):', resolved.email);
    } else if (resolved.action === 'revoke') {
      await prisma.user.update({ where: { email: resolved.email }, data: { status: 'inactive' } }).catch((e) => {
        console.error('⚠️ Falha ao revogar acesso:', e);
      });
      console.log('❌ Acesso revogado (Stripe):', resolved.email);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Erro ao processar webhook Stripe:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

- [ ] **Step 7: Rodar toda a suíte e o lint**

Run: `npm test && npm run lint`
Expected: testes PASS; lint sem erros nos arquivos novos.

- [ ] **Step 8: Commit**

```bash
git add lib/stripe/webhookResolver.ts lib/stripe/webhookResolver.test.ts lib/access/grantAccess.ts app/api/stripe/webhook/route.ts
git commit -m "feat(stripe): webhook resolver + concessao de acesso + rota /api/stripe/webhook"
```

---

## Task 4: Página de vendas — herói R$ 4,90 e rewire do checkout

**Files:**
- Modify: `app/quiz-v3/checkout/page.tsx` (função `handleCheckout` em `:142-159`; bloco de preço)

**Interfaces:**
- Consumes: `POST /api/stripe/checkout` → `{ url }`; `getTrafficSource()` de `@/lib/trafficSource`.

- [ ] **Step 1: Reescrever `handleCheckout` para chamar a API Stripe**

Substituir o corpo de `handleCheckout` (`app/quiz-v3/checkout/page.tsx:142-159`) por:

```tsx
const [isRedirecting, setIsRedirecting] = useState(false);

const handleCheckout = async () => {
  if (isRedirecting) return;
  setIsRedirecting(true);
  try {
    trackQuizV3PurchaseIntent('trial 3 dias', 4.9);
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        src: getTrafficSource(),
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('Sem URL de checkout:', data);
      setIsRedirecting(false);
    }
  } catch (err) {
    console.error('Erro no checkout:', err);
    setIsRedirecting(false);
  }
};
```

(O `const [isRedirecting, setIsRedirecting] = useState(false);` deve ficar junto aos outros `useState` no topo do componente, não dentro da função — mover para lá durante a edição.)

- [ ] **Step 2: Ajustar o bloco de preço para herói R$ 4,90**

No card de plano (por volta de `:411-418`), trocar o destaque de preço para R$ 4,90 como herói, com a mensalidade em tamanho menor. Substituir o conteúdo de preço por:

```tsx
<div className="text-center">
  <div className="text-sm text-gray-500 line-through">R$ 39,90</div>
  <div className="text-5xl font-extrabold text-teal-600">R$ 4,90</div>
  <div className="text-sm text-gray-600 mt-1">para começar hoje</div>
  <div className="text-xs text-gray-400 mt-2">
    Depois de 3 dias, R$ 39,90/mês. Cancele quando quiser.
  </div>
</div>
```

- [ ] **Step 3: Verificar visualmente no preview**

Iniciar o dev server e abrir `/quiz-v3/checkout`:
- Confirmar que o herói mostra R$ 4,90 e a nota da recorrência aparece.
- Confirmar no DevTools/Network que o clique no CTA faz `POST /api/stripe/checkout` (vai falhar sem chaves reais — ok neste passo; validar que a requisição sai com `name`/`email`/`src` no corpo).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: sem erros no arquivo.

- [ ] **Step 5: Commit**

```bash
git add app/quiz-v3/checkout/page.tsx
git commit -m "feat(quiz-v3): checkout com heroi R$ 4,90 e redirect para Stripe"
```

---

## Task 5: Página de sucesso

**Files:**
- Create: `app/quiz-v3/sucesso/page.tsx`

- [ ] **Step 1: Criar a página**

```tsx
export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Pagamento confirmado!</h1>
        <p className="text-gray-600 mb-6">
          Enviamos o seu acesso ao <strong>SoulSync</strong> para o seu email.
          Verifique a caixa de entrada (e o spam) nos próximos minutos.
        </p>
        <p className="text-sm text-gray-400">
          Seu teste de 3 dias começou. Após esse período, a assinatura de R$ 39,90/mês é renovada
          automaticamente — você pode cancelar quando quiser.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar no preview**

Abrir `/quiz-v3/sucesso` e confirmar que renderiza sem erros de console.

- [ ] **Step 3: Commit**

```bash
git add app/quiz-v3/sucesso/page.tsx
git commit -m "feat(quiz-v3): pagina de sucesso pos-pagamento Stripe"
```

---

## Task 6: Customer Portal (cancelamento fácil)

**Files:**
- Create: `app/api/stripe/portal/route.ts`

**Interfaces:**
- Consumes: `stripe` de `@/lib/stripe/client`.
- Produces: `POST /api/stripe/portal` recebe `{ email }`, responde `{ url }` (sessão do Billing Portal) ou 404 se o cliente não existir.

- [ ] **Step 1: Implementar a rota**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

    const origin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/membros`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('❌ Erro ao criar Portal Session:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add app/api/stripe/portal/route.ts
git commit -m "feat(stripe): rota do Customer Portal para gerenciar/cancelar assinatura"
```

---

## Task 7: Configuração externa e teste ponta-a-ponta (modo test)

Esta task não gera código; é a configuração na Stripe/Resend e o teste do fluxo real em modo test. Requer os acessos que o Lucas fornecerá via extensão.

- [ ] **Step 1: Criar produto e preços na Stripe (modo test)**

Com a `STRIPE_SECRET_KEY` de test, criar via API (ou eu executo com a chave fornecida):
- Produto "SoulSync Premium"
- Preço recorrente: `unit_amount=3990`, `currency=brl`, `recurring[interval]=month` → anotar em `STRIPE_PRICE_SUBSCRIPTION`
- Preço avulso: `unit_amount=490`, `currency=brl` (sem `recurring`) → anotar em `STRIPE_PRICE_ACCESS_FEE`

- [ ] **Step 2: Preencher `.env.local`** com `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, os dois price IDs, e `NEXT_PUBLIC_BASE_URL`.

- [ ] **Step 3: Configurar o endpoint de webhook** no Dashboard Stripe (Developers > Webhooks) apontando para `/api/stripe/webhook`, assinando os eventos: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`. Copiar o signing secret para `STRIPE_WEBHOOK_SECRET`.

- [ ] **Step 4: Testar o fluxo em modo test**
  - Rodar `/quiz-v3/checkout`, clicar no CTA, completar o pagamento com cartão de teste `4242 4242 4242 4242`.
  - Confirmar redirect para `/quiz-v3/sucesso`.
  - Confirmar no Dashboard Stripe: cobrança de R$ 4,90 + assinatura em `trialing`.
  - Confirmar que o webhook `checkout.session.completed` chegou (200) e criou o usuário `active` no Prisma.

- [ ] **Step 5: Testar a conversão do trial** usando o relógio de teste da Stripe (Test Clock) para avançar 3 dias e confirmar a cobrança automática de R$ 39,90.

- [ ] **Step 6: Bloqueador Resend** — verificar o domínio de envio no Resend e trocar o remetente em `lib/email/sendAccessEmail.ts:27` de `onboarding@resend.dev` para o domínio verificado. Sem isso, clientes reais não recebem o email de acesso. (Confirmar com o Lucas antes de editar.)

---

## Notas e decisões

- **Google Sheets deferido no Stripe:** o webhook Payt grava no Sheets via `saveToGoogleSheets`, que é local e depende da chave privada hardcoded do Service Account. Para não entrelaçar essa chave num arquivo novo, `grantAccess` faz apenas Prisma + email. Registrar leads Stripe no Sheets pode ser um follow-up extraindo `saveToGoogleSheets` para `lib/` (toca o webhook Payt em produção — fazer com cuidado).
- **Magic link de acesso:** `grantAccess` gera um token e o email manda `/membros?token=`, espelhando o Payt. Esse token não é persistido (mesmo comportamento pré-existente do Payt); o acesso real é via login JWT/Prisma. Não é escopo deste plano corrigir o fluxo de magic link.
- **Sem migração no Prisma:** o mapeamento cancelamento → usuário usa `subscription.metadata.email` (setado em `subscription_data.metadata` no checkout), evitando adicionar `stripeCustomerId` ao schema e migrar o banco de produção.

## Self-Review (coberto)

- Spec → tarefas: trial pago (T2), webhook/eventos (T3), herói R$ 4,90 (T4), sucesso (T5), portal/cancelamento (T6), config Stripe + env vars (T1/T7), bloqueador Resend (T7 Step 6). ✅
- Tipos consistentes entre tarefas: `buildCheckoutSessionParams`/`CheckoutInput`, `resolveStripeEvent`/`StripeAction`, `grantAccess` — nomes e assinaturas idênticos onde consumidos. ✅
- Sem placeholders: todos os steps de código têm implementação real. ✅
