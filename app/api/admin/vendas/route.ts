import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { mapSubscriptionToSale } from '@/lib/stripe/salesList';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: 'admin_token_nao_configurado' }, { status: 500 });
  }

  const provided = req.headers.get('x-admin-token') ?? '';
  if (provided !== adminToken) {
    return NextResponse.json({ error: 'nao_autorizado' }, { status: 401 });
  }

  try {
    const res = await stripe.subscriptions.list({
      limit: 100,
      status: 'all',
      expand: ['data.customer'],
    });

    const sales = res.data
      .map(mapSubscriptionToSale)
      .sort((a, b) => b.createdTs - a.createdTs);

    return NextResponse.json({ sales, count: sales.length, hasMore: res.has_more });
  } catch (error) {
    console.error('❌ Erro ao listar vendas (admin):', error);
    return NextResponse.json({ error: 'falha_ao_listar' }, { status: 500 });
  }
}
