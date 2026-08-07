# Design: Tracking de passagem do quiz-v3 (GA4)

**Data:** 2026-08-07
**Status:** Aprovado pelo Lucas (caminho GA4 recomendado e aceito)

## Objetivo

Ver onde as pessoas abandonam o funil quiz-v3 (23 etapas → email → result → checkout →
compra), por campanha (`src`), gastando R$ 0 e sem ferramenta nova: ligar o GA4 que já
está instalado preenchendo o stub `lib/analytics.ts`.

## Contexto (verificado no código)

- GA4 `G-ZRBSTXNX5F` carregado globalmente via `components/GoogleAnalytics.tsx` (gtag.js).
- `lib/analytics.ts` é stub: todas as funções são no-ops.
- As chamadas já existem no funil: `trackQuizV3Start` (landing), `trackQuizV3Step`/`Answer`/
  `Complete` ([step]), `trackQuizV3CheckoutView`/`PurchaseIntent`/`FreeTrialStart` (checkout),
  `pageview` em todas as páginas do funil.
- **Gap:** `app/quiz-v3/email/page.tsx` não chama `trackQuizV3EmailCapture` (função órfã).
- `lib/trafficSource.ts` → `getTrafficSource()` disponível client-side.

## Decisões

| Tema | Decisão |
|------|---------|
| Ferramenta | GA4 existente (R$ 0, sem conta nova). Alternativas (PostHog, Sheets, Vercel) descartadas no brainstorm. |
| Escopo | Só funções V3 + `pageview`. Funções V2 permanecem no-ops (funis antigos, fora de escopo). |
| Campanha | Todo evento leva o parâmetro `src` (de `getTrafficSource()`, fallback `"(sem origem)"`). |
| SPA pageviews | `pageview(path)` envia `page_view` manual via gtag — as páginas do funil já chamam; isso cobre a navegação SPA sem depender do enhanced measurement. |
| Gap do email | Adicionar chamada `trackQuizV3EmailCapture()` no submit do form de email. |
| GA4 UI | Via extensão: registrar dimensão personalizada `src` (escopo evento), verificar eventos no DebugView/Tempo real, montar exploração de funil. |

## Eventos GA4 (nomes exatos)

| Função | Evento GA4 | Parâmetros |
|--------|-----------|------------|
| `pageview(path)` | `page_view` | `page_path`, `src` |
| `trackQuizV3Start()` | `quiz_v3_start` | `src` |
| `trackQuizV3Step(step, type)` | `quiz_v3_step` | `step` (number), `question_type`, `src` |
| `trackQuizV3Answer(step, value)` | `quiz_v3_answer` | `step`, `answer` (String(value) truncada a 100 chars), `src` |
| `trackQuizV3Complete(step)` | `quiz_v3_complete` | `step`, `src` |
| `trackQuizV3EmailCapture()` | `quiz_v3_email_capture` | `src` |
| `trackQuizV3CheckoutView()` | `quiz_v3_checkout_view` | `src` |
| `trackQuizV3PurchaseIntent(plan, value)` | `quiz_v3_purchase_intent` | `plan`, `value` (number), `currency: 'BRL'`, `src` |
| `trackQuizV3FreeTrialStart()` | `quiz_v3_free_trial_start` | `src` |

Implementação central: helper `gaEvent(name, params)` que:
- No-op no servidor (`typeof window === 'undefined'`) e quando `window.gtag` não existe
  (adblock/GA não carregado) — nunca lança.
- Injeta `src` automaticamente em todos os eventos.

Assinaturas públicas mantidas compatíveis com os call sites atuais (`(...args: any[])`
vira assinaturas tipadas equivalentes; nenhuma alteração nos call sites além do gap do email).

## Funil esperado no GA4 (exploração montada via extensão)

`quiz_v3_start` → `quiz_v3_step (step=5)` → `quiz_v3_step (step=12)` → `quiz_v3_step (step=20)`
→ `quiz_v3_email_capture` → `quiz_v3_checkout_view` → `quiz_v3_purchase_intent`

Quebra por `src` (dimensão personalizada) para comparar campanhas.
A venda real continua na planilha (webhook Stripe) — o GA4 mede o funil até a intenção;
o fechamento fica na aba "Vendas Stripe".

## Testes

- `lib/analytics.test.ts` (vitest): mock de `window.gtag`; verifica que cada função V3
  dispara o evento com nome/params certos, que `src` é injetado, e que sem `gtag` nada lança.

## Fora de escopo

- Eventos server-side (Measurement Protocol), funis V2/oferta, migração para PostHog,
  dashboards além da exploração de funil no GA4.
