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
