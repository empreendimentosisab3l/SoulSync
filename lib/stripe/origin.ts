import type { NextRequest } from 'next/server';

/**
 * Origem pública (protocolo + host, SEM path) para montar URLs de retorno da Stripe.
 * Normaliza NEXT_PUBLIC_BASE_URL mesmo quando ela contém um caminho
 * (ex: "https://site.com/quiz-v3" -> "https://site.com"), evitando URLs
 * duplicadas como ".../quiz-v3/quiz-v3/sucesso".
 */
export function getPublicOrigin(req: NextRequest): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  try {
    return new URL(base).origin;
  } catch {
    return req.nextUrl.origin;
  }
}
