# Tracking do Funil Quiz-v3 no GA4 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ligar o GA4 já instalado preenchendo o stub `lib/analytics.ts` com eventos reais (com `src` de campanha em todos), fechar o gap do email capture, e montar o funil no GA4 via extensão.

**Architecture:** Um helper `gaEvent(name, params)` seguro (no-op sem `window.gtag`, injeta `src` via `getTrafficSource()`) alimenta as funções V3 já chamadas pelo funil. Funções V2 continuam no-ops. GA4 UI (dimensão `src`, verificação, exploração de funil) é configurada pelo controller via extensão.

**Tech Stack:** Next.js 16, TypeScript 5, GA4 gtag.js (já carregado, `G-ZRBSTXNX5F`), vitest.

## Global Constraints

- Nomes de evento exatos: `page_view`, `quiz_v3_start`, `quiz_v3_step`, `quiz_v3_answer`, `quiz_v3_complete`, `quiz_v3_email_capture`, `quiz_v3_checkout_view`, `quiz_v3_purchase_intent`, `quiz_v3_free_trial_start`.
- Todo evento leva `src` (de `getTrafficSource()`, fallback exato `"(sem origem)"`).
- `gaEvent` NUNCA lança: no-op se `typeof window === 'undefined'` ou `!window.gtag`.
- Funções V2 (`trackQuizStart` etc.) e `trackConversion` permanecem no-ops intocadas; o `export default` continua exportando todas.
- Assinaturas V3 tipadas mas compatíveis com os call sites atuais: `trackQuizV3Step(step: number | string, questionType?: string)`, `trackQuizV3Answer(step: number | string, value: unknown)`, `trackQuizV3Complete(step: number | string)`, `trackQuizV3PurchaseIntent(plan: string, value: number)`, demais sem argumentos. `pageview(path: string)`.
- `answer` no `quiz_v3_answer`: `String(value)` truncado a 100 chars.
- `quiz_v3_purchase_intent` inclui `currency: 'BRL'`.
- Não tocar em: `components/GoogleAnalytics.tsx`, call sites existentes (exceto adicionar o email capture), funis V2/oferta.
- Typecheck `npx tsc --noEmit`; testes `npx vitest run` (`npm run lint` quebrado no Next 16).
- Spec: `docs/superpowers/specs/2026-08-07-tracking-funil-quiz-ga4-design.md`.

---

## Task 1: `lib/analytics.ts` real + teste + gap do email capture

**Files:**
- Modify: `lib/analytics.ts` (substituir conteúdo)
- Modify: `app/quiz-v3/email/page.tsx` (adicionar chamada no submit)
- Test: `lib/analytics.test.ts` (novo)

**Interfaces:**
- Consumes: `getTrafficSource()` de `@/lib/trafficSource` (retorna `string | null`).
- Produces: mesmas exports nomeadas + default de hoje (compatibilidade), agora funcionais para V3.

- [ ] **Step 1: Escrever o teste que falha — `lib/analytics.test.ts`**

```ts
// @vitest-environment jsdom → NÃO usar; simular window manualmente em ambiente node:
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// O módulo usa `window` e `localStorage` (via getTrafficSource). Simulamos globals mínimos.
function setupWindow(withGtag = true) {
  const calls: any[] = [];
  const gtag = withGtag ? (...args: any[]) => calls.push(args) : undefined;
  (globalThis as any).window = { gtag };
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(k: string) { return this.store[k] ?? null; },
    setItem(k: string, v: string) { this.store[k] = v; },
    removeItem(k: string) { delete this.store[k]; },
  };
  return calls;
}

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
  vi.resetModules();
});

async function loadAnalytics() {
  return await import('./analytics');
}

describe('analytics GA4', () => {
  it('quiz_v3_start dispara com src do trafficSource', async () => {
    const calls = setupWindow();
    (globalThis as any).localStorage.setItem('trafficSourceV3', 'whats-m1');
    const a = await loadAnalytics();
    a.trackQuizV3Start();
    expect(calls).toContainEqual(['event', 'quiz_v3_start', { src: 'whats-m1' }]);
  });

  it('src ausente vira "(sem origem)"', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3CheckoutView();
    expect(calls).toContainEqual(['event', 'quiz_v3_checkout_view', { src: '(sem origem)' }]);
  });

  it('quiz_v3_step leva step e question_type', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3Step(7, 'choice');
    expect(calls).toContainEqual(['event', 'quiz_v3_step', { step: 7, question_type: 'choice', src: '(sem origem)' }]);
  });

  it('quiz_v3_answer trunca a resposta a 100 chars', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3Answer(3, 'x'.repeat(150));
    const call = calls.find(c => c[1] === 'quiz_v3_answer');
    expect(call[2].answer).toHaveLength(100);
    expect(call[2].step).toBe(3);
  });

  it('quiz_v3_purchase_intent leva plan, value e currency BRL', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3PurchaseIntent('trial 3 dias', 4.9);
    expect(calls).toContainEqual(['event', 'quiz_v3_purchase_intent', { plan: 'trial 3 dias', value: 4.9, currency: 'BRL', src: '(sem origem)' }]);
  });

  it('pageview dispara page_view com page_path', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.pageview('/quiz-v3/5');
    expect(calls).toContainEqual(['event', 'page_view', { page_path: '/quiz-v3/5', src: '(sem origem)' }]);
  });

  it('sem window.gtag nada lança', async () => {
    setupWindow(false);
    const a = await loadAnalytics();
    expect(() => a.trackQuizV3Start()).not.toThrow();
    expect(() => a.pageview('/x')).not.toThrow();
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run lib/analytics.test.ts`
Expected: FAIL — os stubs não chamam gtag.

- [ ] **Step 3: Reescrever `lib/analytics.ts`**

```ts
/**
 * Analytics GA4 (gtag.js carregado em components/GoogleAnalytics.tsx).
 * Eventos do funil quiz-v3, todos com o parâmetro `src` (campanha).
 * Funções V2 permanecem no-ops (funis antigos).
 */

import { getTrafficSource } from './trafficSource';

type GaParams = Record<string, string | number>;

function gaEvent(name: string, params: GaParams = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('event', name, { ...params, src: getTrafficSource() || '(sem origem)' });
  } catch {
    // analytics nunca quebra a página
  }
}

export const pageview = (path: string) => gaEvent('page_view', { page_path: path });

// Quiz V2 (no-ops — funis antigos)
export const trackQuizStart = (...args: any[]) => {};
export const trackQuizStep = (...args: any[]) => {};
export const trackQuizAnswer = (...args: any[]) => {};
export const trackQuizComplete = (...args: any[]) => {};
export const trackEmailCapture = (...args: any[]) => {};
export const trackCheckoutView = (...args: any[]) => {};
export const trackPurchaseIntent = (...args: any[]) => {};
export const trackFreeTrialStart = (...args: any[]) => {};
export const trackConversion = (...args: any[]) => {};

// Quiz V3
export const trackQuizV3Start = () => gaEvent('quiz_v3_start');
export const trackQuizV3Step = (step: number | string, questionType?: string) =>
  gaEvent('quiz_v3_step', { step: Number(step), question_type: questionType ?? '' });
export const trackQuizV3Answer = (step: number | string, value: unknown) =>
  gaEvent('quiz_v3_answer', { step: Number(step), answer: String(value).slice(0, 100) });
export const trackQuizV3Complete = (step: number | string) =>
  gaEvent('quiz_v3_complete', { step: Number(step) });
export const trackQuizV3EmailCapture = () => gaEvent('quiz_v3_email_capture');
export const trackQuizV3CheckoutView = () => gaEvent('quiz_v3_checkout_view');
export const trackQuizV3PurchaseIntent = (plan: string, value: number) =>
  gaEvent('quiz_v3_purchase_intent', { plan, value, currency: 'BRL' });
export const trackQuizV3FreeTrialStart = () => gaEvent('quiz_v3_free_trial_start');

export default {
  pageview,
  trackQuizStart,
  trackQuizStep,
  trackQuizAnswer,
  trackQuizComplete,
  trackEmailCapture,
  trackCheckoutView,
  trackPurchaseIntent,
  trackFreeTrialStart,
  trackConversion,
  trackQuizV3Start,
  trackQuizV3Step,
  trackQuizV3Answer,
  trackQuizV3Complete,
  trackQuizV3EmailCapture,
  trackQuizV3CheckoutView,
  trackQuizV3PurchaseIntent,
  trackQuizV3FreeTrialStart,
};
```

- [ ] **Step 4: Fechar o gap do email — `app/quiz-v3/email/page.tsx`**

Ler o arquivo. No import de analytics, incluir `trackQuizV3EmailCapture`. Na função de submit
(a que valida nome/email, salva em `localStorage`/`userDataV3` e navega para `/quiz-v3/result`),
adicionar `trackQuizV3EmailCapture();` imediatamente antes da navegação (`router.push`).
Nenhuma outra mudança na página.

- [ ] **Step 5: Rodar testes e typecheck**

Run: `npx vitest run && npx tsc --noEmit`
Expected: novos testes + 24 existentes passam; tsc sem novos erros.

- [ ] **Step 6: Commit**

```bash
git add lib/analytics.ts lib/analytics.test.ts app/quiz-v3/email/page.tsx
git commit -m "feat(analytics): eventos GA4 reais no funil quiz-v3 com src de campanha"
```

---

## Task 2: Deploy + GA4 via extensão (controller)

Feita pelo controller (aprovação do Lucas: "você vai fazer tudo através da extensão").

- [ ] **Step 1: Deploy** — merge/push na main; aguardar produção.
- [ ] **Step 2: Verificar eventos chegando** — abrir `soul-sync-brown.vercel.app/quiz-v3?src=teste-ga4` no browser, avançar 2–3 etapas do quiz; no GA4 (analytics.google.com, propriedade do `G-ZRBSTXNX5F`) → Relatórios → Tempo real: confirmar `quiz_v3_start` e `quiz_v3_step` com o parâmetro `src`.
- [ ] **Step 3: Dimensão personalizada `src`** — GA4 → Administrador → Definições personalizadas → Criar dimensão: nome `src`, escopo Evento, parâmetro `src`. (Sem isso o `src` não aparece em relatórios/funis.)
- [ ] **Step 4: Exploração de funil** — GA4 → Explorar → Análise de funil, etapas: `quiz_v3_start` → `quiz_v3_step (step=5)` → `quiz_v3_step (step=12)` → `quiz_v3_step (step=20)` → `quiz_v3_email_capture` → `quiz_v3_checkout_view` → `quiz_v3_purchase_intent`; detalhamento pela dimensão `src`. Salvar como "Funil Quiz V3".
- [ ] **Step 5: Reportar ao Lucas** — link/da exploração + o que cada etapa mostra + lembrete de que dados de dimensão nova só aparecem daí pra frente (não retroativos).

## Self-Review (coberto)

- Spec → tarefas: helper seguro + eventos + src (T1), gap email (T1 Step 4), dimensão src + funil + verificação (T2). ✅
- Constraint de compatibilidade: exports e default mantidos; V2 no-ops. ✅
- Sem placeholders; código completo nos steps. ✅
