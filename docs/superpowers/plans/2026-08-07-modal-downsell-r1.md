# Modal de Resgate (Downsell R$ 1,00) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ao tentar sair do checkout (botão voltar em qualquer device; mouse saindo pelo topo no desktop), mostrar 1x por sessão um modal com oferta de R$ 1,00 hoje (mesma assinatura R$ 39,90/mês, trial 3 dias), rastreável na planilha pelo valor "1,00".

**Architecture:** Backend: `CheckoutInput` ganha `offer?: 'downsell'` que troca o preço avulso (`STRIPE_PRICE_DOWNSELL` em vez de `STRIPE_PRICE_ACCESS_FEE`); `buildSaleRow` passa a ler o valor real da sessão. Frontend: hook `useExitIntent` (sentinela `pushState` + `popstate` + `mouseleave`, flag 1x/sessão) + componente `ExitOfferModal`, integrados na página do checkout via um `startCheckout(offer?)` interno.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, `stripe`, vitest.

## Global Constraints

- Copy do modal (exata): título `Espera! 🎁 Oferta exclusiva de saída`; texto `Seu plano personalizado já está pronto. Comece hoje por apenas`; âncora riscada `R$ 4,90`; destaque `R$ 1,00`; botão `QUERO POR R$ 1,00`; recorrência `Depois de 3 dias, R$ 39,90/mês. Cancele quando quiser.` em `text-[7px] leading-tight text-gray-400`; declínio `Não, obrigado`.
- Flag de sessão: chave exata `exitOfferShown` no `sessionStorage`; modal aparece no máximo 1x por sessão; após dispensa, a próxima ação de voltar sai de verdade (sem loop de aprisionamento).
- `offer` só tem um valor válido: `'downsell'`. Qualquer outro valor no body da API é tratado como ausente (fluxo padrão R$ 4,90).
- Env var nova: `STRIPE_PRICE_DOWNSELL`. Se ausente e a oferta downsell for pedida, o builder lança `Error('STRIPE_PRICE_DOWNSELL não configurada')`. Fluxo padrão nunca depende dela.
- `buildSaleRow` ("Trial iniciado"): valor = `session.amount_total` em centavos → BRL com vírgula; fallback exato `"4,90"` quando `amount_total` ausente/null.
- Não tocar: webhook, grantAccess, portal, funis oferta/oferta-v2, os 7 call sites `onClick={handleCheckout}` (a função `handleCheckout` mantém a assinatura sem argumentos).
- Typecheck: `npx tsc --noEmit` (`npm run lint` quebrado no Next 16). Testes: `npx vitest run`.
- Spec: `docs/superpowers/specs/2026-08-07-modal-downsell-r1-design.md`.

---

## File Structure

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/stripe/config.ts` (mod) | `getStripePriceIds()` retorna também `downsell?: string` |
| `lib/stripe/checkout.ts` (mod) | `CheckoutInput.offer?: 'downsell'`; escolhe o preço avulso |
| `app/api/stripe/checkout/route.ts` (mod) | repassa `offer` sanitizado |
| `lib/stripe/saleFromEvent.ts` (mod) | valor dinâmico no "Trial iniciado" |
| `lib/hooks/useExitIntent.ts` (novo) | gatilhos voltar/exit-intent + flag sessão |
| `components/ExitOfferModal.tsx` (novo) | UI do modal |
| `app/quiz-v3/checkout/page.tsx` (mod) | integra hook + modal + `startCheckout(offer?)` |

---

## Task 1: Backend — oferta downsell no checkout + valor dinâmico no tracking

**Files:**
- Modify: `lib/stripe/config.ts`
- Modify: `lib/stripe/checkout.ts`
- Modify: `app/api/stripe/checkout/route.ts`
- Modify: `lib/stripe/saleFromEvent.ts`
- Test: `lib/stripe/checkout.test.ts` (casos novos), `lib/stripe/saleFromEvent.test.ts` (caso novo)

**Interfaces:**
- Consumes: `getStripePriceIds()`, `TRIAL_DAYS` (config atual); `SaleRow`/`buildSaleRow` atuais.
- Produces:
  ```ts
  // config.ts
  function getStripePriceIds(): { accessFee: string; subscription: string; downsell?: string }
  // checkout.ts
  interface CheckoutInput { name?: string; email?: string; src?: string | null; origin: string; offer?: 'downsell' }
  ```
  A rota aceita `offer` no body JSON; só `'downsell'` é repassado.

- [ ] **Step 1: Adicionar os testes que falham**

Em `lib/stripe/checkout.test.ts`, dentro do `describe('buildCheckoutSessionParams', ...)` existente, adicionar (o `beforeEach` atual já seta `STRIPE_PRICE_ACCESS_FEE` e `STRIPE_PRICE_SUBSCRIPTION`):

```ts
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
```

Em `lib/stripe/saleFromEvent.test.ts`, dentro do `describe('buildSaleRow', ...)`, adicionar:

```ts
  it('checkout.session.completed com amount_total 100 → valor "1,00" (downsell)', () => {
    const r = buildSaleRow(evt('checkout.session.completed', {
      metadata: { src: 'whats-jan', name: 'Maria', email: 'maria@x.com' },
      customer_details: { email: 'maria@x.com', name: 'Maria' },
      subscription: 'sub_123',
      amount_total: 100,
    }));
    expect(r?.valor).toBe('1,00');
  });
```

(O teste existente do "Trial iniciado" não passa `amount_total` e espera `"4,90"` — vira o teste do fallback, sem alteração.)

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npx vitest run lib/stripe/checkout.test.ts lib/stripe/saleFromEvent.test.ts`
Expected: FAIL — os 3 casos de downsell (propriedade `offer` inexistente/type error e comportamento ausente) e o caso do `amount_total` (recebe "4,90").

- [ ] **Step 3: Implementar `lib/stripe/config.ts`**

Substituir a função `getStripePriceIds` por:

```ts
export function getStripePriceIds(): { accessFee: string; subscription: string; downsell?: string } {
  const accessFee = process.env.STRIPE_PRICE_ACCESS_FEE;
  const subscription = process.env.STRIPE_PRICE_SUBSCRIPTION;
  if (!accessFee || !subscription) {
    throw new Error('STRIPE_PRICE_ACCESS_FEE e STRIPE_PRICE_SUBSCRIPTION devem estar configuradas');
  }
  return { accessFee, subscription, downsell: process.env.STRIPE_PRICE_DOWNSELL || undefined };
}
```

- [ ] **Step 4: Implementar `lib/stripe/checkout.ts`**

Na interface, adicionar o campo:

```ts
export interface CheckoutInput {
  name?: string;
  email?: string;
  src?: string | null;
  origin: string;
  offer?: 'downsell';
}
```

No corpo de `buildCheckoutSessionParams`, substituir a desestruturação e o line_item da taxa:

```ts
  const { accessFee, subscription, downsell } = getStripePriceIds();
  let fee = accessFee;
  if (input.offer === 'downsell') {
    if (!downsell) throw new Error('STRIPE_PRICE_DOWNSELL não configurada');
    fee = downsell;
  }
```

E em `line_items`, trocar `{ price: accessFee, quantity: 1 }` por `{ price: fee, quantity: 1 }`. Nada mais muda (metadata, trial, URLs iguais).

- [ ] **Step 5: Implementar `app/api/stripe/checkout/route.ts`**

Trocar as duas linhas do parse/build por:

```ts
    const { name, email, src, offer } = await req.json().catch(() => ({}));
    const origin = getPublicOrigin(req);

    const params = buildCheckoutSessionParams({
      name,
      email,
      src,
      origin,
      offer: offer === 'downsell' ? 'downsell' : undefined,
    });
```

- [ ] **Step 6: Implementar `lib/stripe/saleFromEvent.ts`**

No case `checkout.session.completed`, trocar `valor: '4,90',` por:

```ts
        valor: (s as any).amount_total != null ? brl((s as any).amount_total) : '4,90',
```

- [ ] **Step 7: Rodar testes e typecheck**

Run: `npx vitest run && npx tsc --noEmit`
Expected: todos os testes passam (24 = 20 + 4 novos); tsc sem novos erros.

- [ ] **Step 8: Commit**

```bash
git add lib/stripe/config.ts lib/stripe/checkout.ts lib/stripe/checkout.test.ts app/api/stripe/checkout/route.ts lib/stripe/saleFromEvent.ts lib/stripe/saleFromEvent.test.ts
git commit -m "feat(downsell): oferta R\$1 no checkout via offer=downsell + valor dinamico no tracking"
```

---

## Task 2: Frontend — hook de exit-intent + modal + integração no checkout

**Files:**
- Create: `lib/hooks/useExitIntent.ts`
- Create: `components/ExitOfferModal.tsx`
- Modify: `app/quiz-v3/checkout/page.tsx`

**Interfaces:**
- Consumes: `POST /api/stripe/checkout` com body `{ name, email, src, offer? }` → `{ url }` (Task 1); `getTrafficSource()` de `@/lib/trafficSource`.
- Produces:
  ```ts
  function useExitIntent(): { showOffer: boolean; dismiss: () => void }
  // ExitOfferModal props:
  interface ExitOfferModalProps { open: boolean; accepting: boolean; onAccept: () => void; onDecline: () => void }
  ```

- [ ] **Step 1: Criar `lib/hooks/useExitIntent.ts`**

```ts
'use client';

import { useCallback, useEffect, useState } from 'react';

const FLAG = 'exitOfferShown';

/**
 * Detecta intenção de saída no checkout:
 * - Botão voltar (qualquer device): sentinela no history + popstate.
 * - Exit-intent (desktop): mouse saindo pelo topo da janela.
 * Mostra no máximo 1x por sessão (sessionStorage). Após dispensado,
 * a próxima ação de voltar navega de verdade (sem aprisionar).
 */
export function useExitIntent(): { showOffer: boolean; dismiss: () => void } {
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(FLAG)) return;

    // Sentinela: a primeira ação de "voltar" consome esta entrada
    history.pushState({ exitGuard: true }, '', window.location.href);

    const trigger = () => {
      if (sessionStorage.getItem(FLAG)) return;
      sessionStorage.setItem(FLAG, '1');
      setShowOffer(true);
    };

    const onPopState = () => {
      if (!sessionStorage.getItem(FLAG)) {
        // Re-arma a sentinela e mostra a oferta em vez de sair
        history.pushState({ exitGuard: true }, '', window.location.href);
        trigger();
      }
      // Já mostrado: não interfere — navegação segue normalmente
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    window.addEventListener('popstate', onPopState);
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const dismiss = useCallback(() => setShowOffer(false), []);

  return { showOffer, dismiss };
}
```

- [ ] **Step 2: Criar `components/ExitOfferModal.tsx`**

```tsx
'use client';

interface ExitOfferModalProps {
  open: boolean;
  accepting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ExitOfferModal({ open, accepting, onAccept, onDecline }: ExitOfferModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          Espera! 🎁 Oferta exclusiva de saída
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Seu plano personalizado já está pronto. Comece hoje por apenas
        </p>
        <div className="mb-4">
          <div className="text-sm text-gray-500 line-through">R$ 4,90</div>
          <div className="text-5xl font-extrabold text-teal-600">R$ 1,00</div>
        </div>
        <button
          onClick={onAccept}
          disabled={accepting}
          className="w-full bg-teal-600 text-white py-4 rounded-full text-lg font-bold hover:bg-teal-700 active:scale-95 transition-all shadow-lg disabled:opacity-60"
        >
          {accepting ? 'Aguarde...' : 'QUERO POR R$ 1,00'}
        </button>
        <p className="text-[7px] leading-tight text-gray-400 mt-2">
          Depois de 3 dias, R$ 39,90/mês. Cancele quando quiser.
        </p>
        <button
          onClick={onDecline}
          className="mt-4 text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          Não, obrigado
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Integrar em `app/quiz-v3/checkout/page.tsx`**

3a. Imports (junto aos existentes no topo):

```tsx
import ExitOfferModal from '@/components/ExitOfferModal';
import { useExitIntent } from '@/lib/hooks/useExitIntent';
```

3b. Dentro do componente, junto aos outros hooks (perto do `const [isRedirecting, ...]`):

```tsx
  const { showOffer, dismiss } = useExitIntent();
```

3c. Renomear a lógica do checkout para aceitar a oferta SEM mudar a assinatura pública de `handleCheckout` (os 7 `onClick={handleCheckout}` receberiam um MouseEvent como 1º argumento — por isso `handleCheckout` continua sem parâmetros). Substituir a função `handleCheckout` atual por:

```tsx
  const startCheckout = async (offer?: 'downsell') => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    try {
      trackQuizV3PurchaseIntent(offer === 'downsell' ? 'downsell 3 dias' : 'trial 3 dias', offer === 'downsell' ? 1 : 4.9);
      // Guarda o email para a pagina /obrigado (pos-pagamento) pre-preencher o cadastro de acesso
      if (userData.email) sessionStorage.setItem('userEmail', userData.email);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          src: getTrafficSource(),
          ...(offer ? { offer } : {}),
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

  const handleCheckout = () => startCheckout();
```

3d. Renderizar o modal — logo após a abertura do JSX raiz (dentro do `<div className="min-h-screen ...">`, antes do header sticky):

```tsx
      <ExitOfferModal
        open={showOffer}
        accepting={isRedirecting}
        onAccept={() => startCheckout('downsell')}
        onDecline={dismiss}
      />
```

- [ ] **Step 4: Typecheck e testes**

Run: `npx tsc --noEmit && npx vitest run`
Expected: sem novos erros; todos os testes passam.

- [ ] **Step 5: Verificação manual no preview**

Iniciar o dev server e abrir `/quiz-v3/checkout`:
- Mover o mouse para fora pelo topo → modal aparece 1x (com riscado R$ 4,90, destaque R$ 1,00, recorrência minúscula 7px).
- "Não, obrigado" fecha; repetir o gesto → não reaparece; botão voltar → sai da página.
- Em nova aba (sessão nova), apertar o botão voltar do navegador → modal aparece em vez de sair.
- Clicar "QUERO POR R$ 1,00" → Network mostra `POST /api/stripe/checkout` com `"offer":"downsell"` no body (sem env local dá erro 500 — esperado; o que importa é o body).

- [ ] **Step 6: Commit**

```bash
git add lib/hooks/useExitIntent.ts components/ExitOfferModal.tsx app/quiz-v3/checkout/page.tsx
git commit -m "feat(downsell): modal de resgate R\$1 com exit-intent e intercept do voltar"
```

---

## Task 3: Config externa (Stripe live + Vercel) e verificação em produção

Feita pelo controller via extensão do Chrome (aprovação do Lucas já dada nesta sessão).

- [ ] **Step 1: Criar o preço live** — Stripe (modo live) → produto SoulSync Premium (`prod_V1bpWjc6rsW8Ab`) → novo preço **Avulso** R$ 1,00 BRL. Verificar `type: one_time` e anotar o `price_...`.
- [ ] **Step 2: (Opcional, paridade)** criar o mesmo preço avulso R$ 1,00 no modo teste, no produto `prod_V1a2nYK4srO9tc`.
- [ ] **Step 3: Vercel** — env var `STRIPE_PRICE_DOWNSELL` (Production + Preview, Sensitive) com o price live.
- [ ] **Step 4: Deploy** — merge/push na main + aguardar deploy.
- [ ] **Step 5: Verificar em produção** — `POST https://soul-sync-brown.vercel.app/api/stripe/checkout` com `{"offer":"downsell","email":"qa@example.com"}` → retorna `cs_live_...`; abrir a URL e conferir que a tela da Stripe mostra **R$ 1,00 hoje** + R$ 39,90/mês após 3 dias (sem pagar).
- [ ] **Step 6: Verificação visual** — abrir `/quiz-v3/checkout` em produção, acionar o modal (mouse pelo topo) e conferir copy/estilos.

## Self-Review (coberto)

- Spec → tarefas: offer/price/env (T1), valor dinâmico no tracking (T1), hook+modal+integração com copy e 7px (T2), config externa + verificação (T3). ✅
- Assinatura de `handleCheckout` preservada para os 7 call sites; `startCheckout(offer?)` é interno. ✅
- Tipos consistentes: `CheckoutInput.offer`, `getStripePriceIds().downsell`, props do modal. ✅
- Sem placeholders. ✅
