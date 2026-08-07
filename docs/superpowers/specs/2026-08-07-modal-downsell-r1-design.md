# Design: Modal de resgate (downsell R$ 1,00) no checkout quiz-v3

**Data:** 2026-08-07
**Status:** Aprovado pelo Lucas

## Objetivo

Recuperar visitantes que tentam abandonar o checkout: ao apertar o botão voltar
(mobile/desktop) ou mover o mouse para fora da página (desktop), mostrar um modal
com oferta de resgate — **R$ 1,00 hoje** (em vez de R$ 4,90) → mesma assinatura
R$ 39,90/mês após trial de 3 dias.

## Decisões (brainstorming)

| Tema | Decisão |
|------|---------|
| Formato | Modal na própria página do checkout (não página separada) |
| Gatilhos | Botão voltar (popstate + sentinela pushState) em todos os devices; exit-intent (mouseleave pelo topo) só desktop |
| Frequência | 1x por sessão (`sessionStorage`); segunda tentativa de sair → sai de verdade |
| Preço | R$ 1,00 avulso (novo price live) + assinatura R$ 39,90/mês trial 3 dias (mesma) |
| Texto recorrência no modal | **7px** (`text-[7px] leading-tight`), igual ao padrão atual do checkout |
| Tracking | `src` da campanha intacto; distinção do downsell pela coluna Valor = "1,00" na planilha (buildSaleRow lê o valor real da sessão em vez de 4,90 fixo) |

## Componentes

### Novos

| Arquivo | Responsabilidade |
|---------|------------------|
| `components/ExitOfferModal.tsx` | Modal client-side: overlay + card com a oferta R$ 1. Props: `open`, `onAccept`, `onDecline`. |
| `lib/hooks/useExitIntent.ts` | Hook client-side: arma sentinela no history (pushState), escuta `popstate` e `mouseleave` (topo, desktop), respeita flag 1x/sessão (`sessionStorage.exitOfferShown`), expõe `{ showOffer, dismiss, allowLeave }`. Ao dismiss, re-arma nada: próxima ação de voltar sai de verdade. |

### Alterados

| Arquivo | Alteração |
|---------|-----------|
| `app/quiz-v3/checkout/page.tsx` | Usa o hook + renderiza o modal. `onAccept` → chama o checkout com `offer: 'downsell'`. `onDecline` → fecha e libera saída (history.back real). |
| `app/api/stripe/checkout/route.ts` | Aceita campo opcional `offer` no body; repassa ao builder. |
| `lib/stripe/checkout.ts` | `CheckoutInput.offer?: 'downsell'`; quando `'downsell'`, usa `STRIPE_PRICE_DOWNSELL` como taxa avulsa (senão `STRIPE_PRICE_ACCESS_FEE`). Qualquer outro valor de `offer` é ignorado (fluxo padrão) — impossível manipular preço via request para algo não previsto. |
| `lib/stripe/config.ts` | `getStripePriceIds()` ganha `downsell` (lido de `STRIPE_PRICE_DOWNSELL`; se ausente e oferta downsell for pedida, erro claro). |
| `lib/stripe/saleFromEvent.ts` | "Trial iniciado": valor deixa de ser "4,90" fixo → lê `session.amount_total` (centavos → BRL com vírgula); fallback "4,90" se ausente. |

## Modal — conteúdo (copy aprovada)

```
Espera! 🎁 Oferta exclusiva de saída
Seu plano personalizado já está pronto. Comece hoje por apenas
R$ 4,90 (riscado) → R$ 1,00 (destaque grande teal)
[ QUERO POR R$ 1,00 ]  ← botão grande teal, chama onAccept
Depois de 3 dias, R$ 39,90/mês. Cancele quando quiser.  ← text-[7px] leading-tight text-gray-400
[ Não, obrigado ]  ← link discreto, onDecline
```

Estilo: overlay `bg-black/60`, card branco `rounded-3xl`, mobile-first, padrão visual do funil (teal-600).

## Comportamento dos gatilhos

1. Mount do checkout: `history.pushState(null, '', location.href)` (sentinela).
2. `popstate`: se modal ainda não mostrado na sessão → `preventDefault` implícito
   (re-push da sentinela) + abre modal + marca `sessionStorage.exitOfferShown=1`.
   Se já mostrado → não interfere (a navegação de volta acontece normalmente).
3. `mouseleave` no `document` com `clientY <= 0` (desktop): mesmo comportamento,
   mesma flag (o primeiro gatilho que disparar consome a vez da sessão).
4. `onDecline`: fecha modal; `history.back()` NÃO é forçado — a pessoa decide
   (clicar em voltar de novo agora sai de verdade). Sem loops de aprisionamento.
5. `onAccept`: mesmo fluxo do handleCheckout atual com `offer: 'downsell'`
   (salva email no sessionStorage, POST, redirect à Stripe).

## Config externa (via extensão, com aprovação já dada)

- Stripe live: criar preço avulso R$ 1,00 (one-time, BRL) no produto SoulSync Premium → `STRIPE_PRICE_DOWNSELL`
- Vercel: env var `STRIPE_PRICE_DOWNSELL` (Production+Preview) + redeploy
- Modo teste da Stripe: criar equivalente para manter paridade (opcional, mas barato)

## Tracking

- `src` (campanha) intocado — atribuição preservada.
- Linha "Trial iniciado" na aba Vendas Stripe passa a mostrar o valor real pago
  ("1,00" no downsell, "4,90" no padrão). Filtro Valor="1,00" = vendas do modal.

## Testes

- `lib/stripe/checkout.test.ts`: caso novo — `offer: 'downsell'` usa `STRIPE_PRICE_DOWNSELL`;
  `offer` ausente/inválido usa `STRIPE_PRICE_ACCESS_FEE`.
- `lib/stripe/saleFromEvent.test.ts`: "Trial iniciado" com `amount_total: 100` → valor "1,00";
  sem `amount_total` → fallback "4,90".
- Hook/modal: verificação manual no preview (gatilhos de browser não valem teste unitário aqui).

## Riscos aceitos (registrados)

- Downsell atrai o público de maior risco de disputa; mitigado por manter cobrança
  imediata de R$ 1,00 (transação autorizada e lembrável) + disclosure na tela da Stripe
  + portal de cancelamento ativo.
- Texto de recorrência em 7px no modal: decisão de conversão do Lucas; a tela da
  Stripe continua mostrando a recorrência de forma clara (obrigatório da Stripe).

## Fora de escopo

- Página separada de back-redirect; downsell no funil oferta-v2/Payt; e-mail pré-cobrança
  (depende de domínio no Resend).
