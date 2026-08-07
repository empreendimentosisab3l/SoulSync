# Conta Segura na /obrigado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Garantir que só quem pagou no Stripe crie conta, com o email já preenchido a partir da sessão de checkout, na página `/obrigado`.

**Architecture:** A verificação de pagamento vira uma função pura testável em `lib/stripe/verifySession.ts` que recebe a função `retrieve` do Stripe e o `session_id`, e devolve um resultado tipado. A rota `GET /api/stripe/verify-session` e o `pages/api/auth/register.ts` são wrappers finos que chamam essa função e mapeiam para HTTP. O `success_url` do Stripe passa a carregar `session_id`, e a `/obrigado` verifica no mount, trava o email e só pede a senha.

**Tech Stack:** Next.js 16 (App Router + Pages Router coexistindo), TypeScript, Stripe SDK (`lib/stripe/client.ts`), Prisma, jose (JWT), bcryptjs, zod, vitest.

## Global Constraints

- Fonte da verdade de "pagou" e do email é **sempre o Stripe server-side** (`stripe.checkout.sessions.retrieve`). Nunca confiar em email/flag vindos do cliente.
- Sinal de pagamento aprovado: `session.status === 'complete'`.
- Email da sessão: `session.customer_details?.email || session.customer_email || ''`.
- Client Stripe: importar `stripe` de `@/lib/stripe/client` (nunca instanciar outro).
- Testes vitest só rodam em `lib/**/*.test.ts` (config atual). Lógica testável vai em `lib/`.
- Rodar testes com `npx vitest run` (o `npm run lint` está quebrado no Next 16; typecheck com `npx tsc --noEmit`).
- Não tocar no funil Payt antigo, no webhook, nem em emails de boas-vindas.

---

### Task 1: Função pura de verificação de sessão (`lib/stripe/verifySession.ts`)

**Files:**
- Create: `lib/stripe/verifySession.ts`
- Test: `lib/stripe/verifySession.test.ts`

**Interfaces:**
- Consumes: tipos do pacote `stripe`.
- Produces:
  - `type SessionVerification = { status: 'paid'; email: string } | { status: 'unpaid' } | { status: 'not_found' } | { status: 'error' }`
  - `verifyPaidSession(sessionId: string, retrieve: (id: string) => Promise<Stripe.Checkout.Session>): Promise<SessionVerification>`

- [ ] **Step 1: Write the failing test**

```ts
// lib/stripe/verifySession.test.ts
import { describe, it, expect } from 'vitest';
import { verifyPaidSession } from './verifySession';
import type Stripe from 'stripe';

const ok = (obj: any) => async () => obj as Stripe.Checkout.Session;
const throws = (err: any) => async () => { throw err; };

describe('verifyPaidSession', () => {
  it('sessão complete → paid + email de customer_details', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'complete', customer_details: { email: 'a@x.com' }, customer_email: null }));
    expect(r).toEqual({ status: 'paid', email: 'a@x.com' });
  });

  it('usa customer_email quando customer_details.email ausente', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'complete', customer_details: { email: null }, customer_email: 'b@x.com' }));
    expect(r).toEqual({ status: 'paid', email: 'b@x.com' });
  });

  it('email vazio quando a sessão não tem email', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'complete', customer_details: null, customer_email: null }));
    expect(r).toEqual({ status: 'paid', email: '' });
  });

  it('status diferente de complete → unpaid', async () => {
    const r = await verifyPaidSession('cs_1', ok({ status: 'open', customer_details: { email: 'a@x.com' } }));
    expect(r).toEqual({ status: 'unpaid' });
  });

  it('sessionId vazio → not_found (sem chamar Stripe)', async () => {
    let called = false;
    const r = await verifyPaidSession('', async () => { called = true; return {} as any; });
    expect(r).toEqual({ status: 'not_found' });
    expect(called).toBe(false);
  });

  it('StripeInvalidRequestError → not_found', async () => {
    const r = await verifyPaidSession('cs_bad', throws({ type: 'StripeInvalidRequestError' }));
    expect(r).toEqual({ status: 'not_found' });
  });

  it('erro genérico de rede/API → error', async () => {
    const r = await verifyPaidSession('cs_1', throws({ type: 'StripeConnectionError' }));
    expect(r).toEqual({ status: 'error' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/stripe/verifySession.test.ts`
Expected: FAIL (`verifyPaidSession` não existe / módulo não encontrado).

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/stripe/verifySession.ts
import type Stripe from 'stripe';

export type SessionVerification =
  | { status: 'paid'; email: string }
  | { status: 'unpaid' }
  | { status: 'not_found' }
  | { status: 'error' };

type RetrieveFn = (id: string) => Promise<Stripe.Checkout.Session>;

export async function verifyPaidSession(sessionId: string, retrieve: RetrieveFn): Promise<SessionVerification> {
  if (!sessionId) return { status: 'not_found' };
  try {
    const session = await retrieve(sessionId);
    if (session.status === 'complete') {
      const email = session.customer_details?.email || session.customer_email || '';
      return { status: 'paid', email };
    }
    return { status: 'unpaid' };
  } catch (err: any) {
    if (err?.type === 'StripeInvalidRequestError') return { status: 'not_found' };
    return { status: 'error' };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/stripe/verifySession.test.ts`
Expected: PASS (7 testes).

- [ ] **Step 5: Commit**

```bash
git add lib/stripe/verifySession.ts lib/stripe/verifySession.test.ts
git commit -m "feat(stripe): verifyPaidSession - verificacao pura de sessao de checkout paga"
```

---

### Task 2: `success_url` carrega o `session_id` (`lib/stripe/checkout.ts`)

**Files:**
- Modify: `lib/stripe/checkout.ts:40`
- Test: `lib/stripe/checkout.test.ts:27` (atualizar expectativa existente)

**Interfaces:**
- Consumes: nada novo.
- Produces: `success_url` no formato `${origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`. O literal `{CHECKOUT_SESSION_ID}` é um template do Stripe — NÃO usar template string do JS para ele.

- [ ] **Step 1: Update the failing test**

Em `lib/stripe/checkout.test.ts`, trocar a asserção da linha 27:

```ts
    expect(params.success_url).toBe('https://soulsync.com/obrigado?session_id={CHECKOUT_SESSION_ID}');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/stripe/checkout.test.ts`
Expected: FAIL (success_url ainda é `.../obrigado` sem query).

- [ ] **Step 3: Write minimal implementation**

Em `lib/stripe/checkout.ts`, trocar a linha do `success_url`:

```ts
    success_url: `${input.origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
```

(o `cancel_url` fica inalterado.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/stripe/checkout.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/stripe/checkout.ts lib/stripe/checkout.test.ts
git commit -m "feat(stripe): passa session_id no success_url do checkout"
```

---

### Task 3: Rota `GET /api/stripe/verify-session` (App Router)

**Files:**
- Create: `app/api/stripe/verify-session/route.ts`

**Interfaces:**
- Consumes: `verifyPaidSession` (Task 1); `stripe` de `@/lib/stripe/client`.
- Produces: endpoint HTTP `GET /api/stripe/verify-session?session_id=...`:
  - `200 { paid: true, email }` — sessão paga
  - `402 { paid: false }` — sessão não paga (unpaid)
  - `404 { paid: false }` — sessão inexistente (not_found)
  - `400 { error: 'missing_session_id' }` — sem query `session_id`
  - `503 { error: 'stripe_unavailable' }` — erro de API/rede

- [ ] **Step 1: Write the implementation**

Não há harness de teste HTTP no repo (vitest inclui só `lib/`); a lógica testável já está coberta em `verifySession.test.ts`. Esta rota é wrapper fino, verificada no E2E manual (Task 6).

```ts
// app/api/stripe/verify-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { verifyPaidSession } from '@/lib/stripe/verifySession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id') ?? '';
  if (!sessionId) {
    return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
  }

  const result = await verifyPaidSession(sessionId, (id) => stripe.checkout.sessions.retrieve(id));

  switch (result.status) {
    case 'paid':
      return NextResponse.json({ paid: true, email: result.email });
    case 'unpaid':
      return NextResponse.json({ paid: false }, { status: 402 });
    case 'not_found':
      return NextResponse.json({ paid: false }, { status: 404 });
    case 'error':
    default:
      return NextResponse.json({ error: 'stripe_unavailable' }, { status: 503 });
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros novos nesse arquivo.

- [ ] **Step 3: Commit**

```bash
git add app/api/stripe/verify-session/route.ts
git commit -m "feat(stripe): rota GET /api/stripe/verify-session"
```

---

### Task 4: `register` exige sessão paga e usa o email da sessão (`pages/api/auth/register.ts`)

**Files:**
- Modify: `pages/api/auth/register.ts`

**Interfaces:**
- Consumes: `verifyPaidSession` (Task 1); `stripe` de `@/lib/stripe/client`.
- Produces: `POST /api/auth/register` passa a aceitar body `{ sessionId: string, password: string }`. Retorna `402 { error: 'payment_not_confirmed' }` se não pago, `503 { error: 'stripe_unavailable' }` em erro de API, `422 { error: 'email_missing' }` se a sessão não tiver email, `400` em body inválido. Sucesso: `200 { success: true, user }` + cookie `session_token` (inalterado).

**Nota de teste:** o gate de segurança vive em `verifyPaidSession` (100% testado na Task 1). O register é wiring fino sobre prisma/bcrypt/jose — o repo não tem harness para testar handlers Pages API (vitest inclui só `lib/`), então esta parte é validada no E2E manual (Task 6). Isso é um desvio consciente do spec (que citava `register.test.ts`): a decisão de segurança está testada; só o encanamento fica para o E2E.

- [ ] **Step 1: Substituir o schema e a extração do body**

Trocar o `registerSchema` e o `parse`:

```ts
const registerSchema = z.object({
    sessionId: z.string().min(1),
    password: z.string().min(6),
});
```

Dentro do `try`, trocar `const { email, password, name } = registerSchema.parse(req.body);` por:

```ts
        const { sessionId, password } = registerSchema.parse(req.body);

        const verification = await verifyPaidSession(
            sessionId,
            (id) => stripe.checkout.sessions.retrieve(id),
        );
        if (verification.status === 'error') {
            return res.status(503).json({ error: 'stripe_unavailable' });
        }
        if (verification.status !== 'paid') {
            return res.status(402).json({ error: 'payment_not_confirmed' });
        }
        const email = verification.email;
        if (!email) {
            return res.status(422).json({ error: 'email_missing' });
        }
```

- [ ] **Step 2: Ajustar o upsert para o email verificado**

O `upsert` continua igual, mas sem `name` vindo do body (não é mais coletado). Trocar o bloco do upsert para:

```ts
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                status: 'active',
            },
            create: {
                email,
                password: hashedPassword,
                status: 'active',
                plan: 'standard',
            },
        });
```

- [ ] **Step 3: Adicionar os imports no topo**

```ts
import { stripe } from '@/lib/stripe/client';
import { verifyPaidSession } from '@/lib/stripe/verifySession';
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros. Conferir que nenhuma referência a `name` do body permaneceu.

- [ ] **Step 5: Commit**

```bash
git add pages/api/auth/register.ts
git commit -m "feat(auth): register exige sessao Stripe paga e usa email da sessao"
```

---

### Task 5: `/obrigado` verifica pagamento, trava email e só pede senha (`app/obrigado/page.tsx`)

**Files:**
- Modify: `app/obrigado/page.tsx`

**Interfaces:**
- Consumes: `GET /api/stripe/verify-session` (Task 3), `POST /api/auth/register` (Task 4).
- Produces: nenhuma interface para outras tasks.

- [ ] **Step 1: Reescrever o componente**

Substituir todo o conteúdo de `app/obrigado/page.tsx` por:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Phase = 'verifying' | 'verified' | 'blocked' | 'stripe_error'

export default function ThankYouPage() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [phase, setPhase] = useState<Phase>('verifying')
  const [sessionId, setSessionId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  const verify = useCallback(async (sid: string) => {
    setPhase('verifying')
    try {
      const res = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sid)}`)
      if (res.ok) {
        const data = await res.json()
        setEmail(data.email || '')
        setPhase('verified')
      } else if (res.status === 503) {
        setPhase('stripe_error')
      } else {
        setPhase('blocked')
      }
    } catch {
      setPhase('stripe_error')
    }
  }, [])

  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get('session_id') || ''
    setSessionId(sid)
    if (!sid) {
      setPhase('blocked')
      return
    }
    verify(sid)
  }, [verify])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setIsCreatingAccount(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error === 'payment_not_confirmed'
          ? 'Não localizamos seu pagamento. Fale com o suporte.'
          : (data.error || 'Erro ao criar conta'))
      }
      localStorage.setItem('userEmail', email)
      localStorage.setItem('hasCreatedAccount', 'true')
      await refreshAuth()
      router.push('/membros')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsCreatingAccount(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f5f5] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">SoulSync</h1>
        </div>

        <div className="relative mb-12">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white shadow-lg">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-white rounded-full p-3 shadow-xl">
                <div className="bg-teal-600 rounded-full p-4">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-3">Seu pedido foi confirmado.</h2>
              <p className="text-teal-50">
                Obrigado pelo seu pedido! Crie sua senha abaixo para acessar.
              </p>
            </div>
          </div>
        </div>

        {phase === 'verifying' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center text-gray-600">
            Verificando seu pagamento…
          </div>
        )}

        {phase === 'stripe_error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <p className="text-gray-700 mb-4">Não conseguimos verificar seu pagamento agora.</p>
            <button
              onClick={() => verify(sessionId)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {phase === 'blocked' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Não localizamos seu pagamento</h2>
            <p className="text-gray-600">
              Se você acabou de pagar, aguarde alguns segundos e recarregue esta página.
              Se o problema continuar, fale com o suporte no WhatsApp.
            </p>
          </div>
        )}

        {phase === 'verified' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Crie uma senha para sua conta.
            </h2>

            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-gray-800 rounded-t-xl p-1">
                  <div className="bg-gray-900 rounded-t-lg aspect-video overflow-hidden relative">
                    <img
                      src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768790347/soulsync/obrigado/ptc9bcaystjz2djef9qe.png"
                      alt="Plataforma SoulSync"
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div className="bg-gray-300 h-2 rounded-b-xl"></div>
                <div className="bg-gray-400 h-1 mx-auto w-32"></div>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Endereço de email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Confirme sua senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingAccount}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCreatingAccount ? 'Criando...' : 'Acesse minha primeira sessão!'}
              </button>
            </form>
          </div>
        )}

        <div className="h-12"></div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add app/obrigado/page.tsx
git commit -m "feat(obrigado): verifica pagamento Stripe, trava email e so pede senha"
```

---

### Task 6: Verificação E2E manual (modo teste, cartão 4242)

**Files:** nenhum (validação).

- [ ] **Step 1: Rodar a suíte completa**

Run: `npx vitest run`
Expected: todos os testes passam (incluindo os novos de `verifySession` e o `checkout` atualizado).

- [ ] **Step 2: Typecheck geral**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: E2E no navegador (modo teste)**

Com chaves de teste do Stripe e cartão `4242 4242 4242 4242` (validade futura, CVC qualquer):
1. Percorrer o quiz-v3 até o checkout com `?src=teste-obrigado`.
2. Concluir o checkout no Stripe (test mode) → deve redirecionar para `/obrigado?session_id=cs_test_...`.
3. Confirmar que o email aparece **preenchido e travado** (o mesmo usado no checkout).
4. Criar a senha → deve entrar em `/membros` com acesso liberado.
5. Abrir `/obrigado` **sem** `session_id` (ou com um id inválido) → deve mostrar "Não localizamos seu pagamento" e **não** exibir o formulário.

- [ ] **Step 4: Registrar resultado**

Anotar no PR/ledger o `cs_test_...` usado e o print do email travado + acesso concedido.

---

## Self-Review

**Spec coverage:**
- success_url com session_id → Task 2 ✅
- verify-session (novo, verificação server-side) → Tasks 1+3 ✅
- register exige sessão paga + email da sessão → Task 4 ✅
- /obrigado email travado + estados de erro + envia sessionId → Task 5 ✅
- Casos de borda (não pago→bloqueia, erro API→retry, sem session_id→bloqueia) → Tasks 3+5 ✅
- Testes de verificação → Task 1 (unit) + Task 6 (E2E) ✅ — desvio documentado: register unit test substituído por lib-test + E2E por falta de harness HTTP no repo.
- Limitação (lead fecha antes da senha) → fora de escopo, registrada no spec ✅

**Placeholder scan:** sem TBD/TODO; todo código presente.

**Type consistency:** `verifyPaidSession(sessionId, retrieve)` e `SessionVerification` usados igualmente nas Tasks 1, 3, 4. Body `{ sessionId, password }` consistente entre Task 4 (schema) e Task 5 (fetch).
