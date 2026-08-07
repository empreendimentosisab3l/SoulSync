# Design: Tracking de vendas Stripe por campanha (Google Sheets)

**Data:** 2026-08-07
**Status:** Aprovado (aguardando revisão do spec)

## Objetivo

Fechar o loop de atribuição do funil de assinatura Stripe: cada venda cai numa aba
do Google Sheets já usado no projeto, com a **origem da campanha (`src`)**, para que o
Lucas veja quais disparos de e-mail/WhatsApp geram trials, assinaturas pagas e cancelamentos.

Tráfego é **orgânico/próprio** (e-mail e WhatsApp) — não há plataforma de anúncio para
reportar conversão. A necessidade é só atribuição por campanha via `?src=`.

## O que já existe (não muda)

- `lib/trafficSource.ts` captura `?src=` na entrada do quiz-v3 e guarda no localStorage.
- `app/quiz-v3/checkout/page.tsx` envia `src` no POST para `/api/stripe/checkout`.
- `lib/stripe/checkout.ts` grava `src` em `subscription_data.metadata.src` e `metadata.src`
  da Checkout Session. Ou seja, **o `src` já está no Stripe**, faltava só relatar.
- Integração Google Sheets já funciona no webhook Payt (`saveToGoogleSheets` em
  `app/api/webhook/payt/route.ts`), usando `GOOGLE_SHEET_ID` + `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
- Env vars Google já existem na Vercel: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
  `GOOGLE_PRIVATE_KEY`.

## Decisões (definidas no brainstorming)

| Tema | Decisão |
|------|---------|
| Onde gravar | Aba nova **"Vendas Stripe"** na planilha atual (mesma `GOOGLE_SHEET_ID`) |
| Eventos | Os 3: trial iniciado, assinatura paga, cancelamento |
| Origem do tráfego | E-mail / WhatsApp (orgânico) — atribuição por `?src=` |

## Arquitetura

### Componentes novos

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/stripe/saleFromEvent.ts` | `buildSaleRow(event, subscription?): SaleRow \| null` — **pura**, mapeia um evento Stripe (+ subscription opcional, quando o evento não carrega o `src`) → linha de venda, ou `null` se não deve ser logado. Testável passando um mock de subscription. |
| `lib/sheets/salesSheet.ts` | `appendSaleRow(row: SaleRow): Promise<void>` — escreve na aba "Vendas Stripe", criando-a com cabeçalhos se não existir. Reusa auth Google via env vars. |

### Componente alterado

| Arquivo | Alteração |
|---------|-----------|
| `app/api/stripe/webhook/route.ts` | Após grant/revoke: para `invoice.paid`/`customer.subscription.deleted` recupera a subscription (`stripe.subscriptions.retrieve`) e passa para `buildSaleRow(event, subscription)`; para `checkout.session.completed` chama `buildSaleRow(event)` (o `src` já está na session). Se não-nulo, `appendSaleRow(row)`. Falha ao gravar no Sheets **não** quebra o webhook (loga e retorna 200). |

## Estrutura da aba "Vendas Stripe"

Colunas (cabeçalho criado automaticamente na primeira escrita):

```
Data | Origem | Nome | Email | Evento | Valor (R$) | Assinatura ID
```

Exemplo:

```
07/08/2026 14:22 | whats-jan-promo | Maria | maria@x.com | Trial iniciado    | 4,90  | sub_123
10/08/2026 14:25 | whats-jan-promo | Maria | maria@x.com | Assinatura paga   | 39,90 | sub_123
15/08/2026 09:10 | whats-jan-promo | Maria | maria@x.com | Cancelado         |       | sub_123
```

## Mapeamento evento → linha (`buildSaleRow`)

| Evento Stripe | Condição | Evento na planilha | Valor | Fonte do `src` |
|---------------|----------|--------------------|-------|----------------|
| `checkout.session.completed` | sempre | "Trial iniciado" | 4,90 | `session.metadata.src` |
| `invoice.paid` | `billing_reason === 'subscription_cycle'` | "Assinatura paga" | `amount_paid/100` | `subscription.metadata.src` |
| `customer.subscription.deleted` | sempre | "Cancelado" | (vazio) | `subscription.metadata.src` |
| qualquer outro | — | (retorna `null`, não grava) | — | — |

Notas:
- **Evitar duplicidade do R$4,90:** o `invoice.paid` também dispara na criação da assinatura
  (`billing_reason === 'subscription_create'`, que cobra os R$4,90). Esse é ignorado
  (`buildSaleRow` retorna `null`) porque a venda inicial já é logada via
  `checkout.session.completed`. Só o ciclo recorrente (`subscription_cycle`, o R$39,90) é gravado.
- **`src` no `invoice.paid`:** o invoice não traz metadata da subscription diretamente de forma
  garantida entre versões de API. O webhook recupera a subscription
  (`stripe.subscriptions.retrieve(invoice.subscription)`) para ler `metadata.src`, nome e email.
- **`src` ausente:** grava a string `"(sem origem)"`.
- **Nome/email:** de `session.customer_details`/`metadata` (checkout) ou da subscription/customer
  (invoice, deleted).

## Dados / fluxo

```
Disparo e-mail/WhatsApp com link ?src=campanha
  → quiz-v3 captura src (localStorage)
  → checkout envia src → Stripe (subscription_data.metadata.src)
  → cliente paga → eventos de webhook
       checkout.session.completed → buildSaleRow → "Trial iniciado" → appendSaleRow
       invoice.paid (cycle, dia 3)  → buildSaleRow → "Assinatura paga" → appendSaleRow
       customer.subscription.deleted → buildSaleRow → "Cancelado" → appendSaleRow
  → aba "Vendas Stripe" atualizada em tempo real
```

## Tratamento de erros

- `appendSaleRow` é chamado dentro de try/catch no webhook; falha (Sheets indisponível, auth)
  é logada com `console.error` e o webhook ainda retorna 200 (não bloqueia o acesso do cliente
  nem causa reentrega infinita da Stripe).
- Se `GOOGLE_SHEET_ID`/credenciais ausentes, `appendSaleRow` loga aviso e retorna sem lançar
  (mesmo comportamento do `saveToGoogleSheets` atual do Payt).
- `GOOGLE_PRIVATE_KEY` lida de env com `.replace(/\\n/g, '\n')` para normalizar quebras de linha
  (evita a chave hardcoded que existe no webhook Payt).

## Testes

- `lib/stripe/saleFromEvent.test.ts` (vitest, padrão do projeto):
  - `checkout.session.completed` → linha "Trial iniciado" com src, valor 4,90.
  - `invoice.paid` com `billing_reason='subscription_cycle'` → "Assinatura paga" (mock do
    fetch da subscription para o src) ou src passado direto no teste da função pura.
  - `invoice.paid` com `billing_reason='subscription_create'` → `null` (não grava).
  - `customer.subscription.deleted` → "Cancelado".
  - evento sem `src` → origem "(sem origem)".
- `appendSaleRow` (escrita real no Sheets) é validada manualmente com um evento de teste da Stripe.

## Dependência operacional (o Lucas)

O tracking só é útil se os links de disparo forem etiquetados:
`https://soul-sync-brown.vercel.app/quiz-v3?src=<nome-da-campanha>`.
Sem `?src=`, a venda entra como "(sem origem)".

## Fora de escopo

- Dashboard visual no app (a planilha cobre a necessidade).
- Integração com Pixel/CAPI de plataformas de anúncio (não há tráfego pago).
- Reescrita do `lib/analytics.ts` (stub permanece).
- Backfill de vendas antigas.
