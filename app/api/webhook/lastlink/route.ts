import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sendAccessEmail } from '@/lib/email/sendAccessEmail';

// Diretório para armazenar tokens
const DATA_DIR = path.join(process.cwd(), 'data');
const TOKENS_FILE = path.join(DATA_DIR, 'access-tokens.json');

// Garantir que diretório existe
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(TOKENS_FILE)) {
    await writeFile(TOKENS_FILE, JSON.stringify([]));
  }
}

// Gerar token único
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Salvar token
async function saveAccessToken(data: any) {
  await ensureDataDir();

  const tokens = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));

  const token = generateToken();
  const accessData = {
    token,
    email: data.customer?.email,
    name: data.customer?.name,
    planType: data.product?.name,
    orderId: data.order?.id,
    customerId: data.customer?.id,
    subscriptionId: data.subscription?.id,
    createdAt: new Date().toISOString(),
    expiresAt: data.subscription?.next_charge_date || null,
    isActive: true
  };

  tokens.push(accessData);
  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));

  return accessData;
}

// Remover acesso
async function removeAccess(email: string) {
  await ensureDataDir();

  let tokens = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));
  tokens = tokens.map((t: any) =>
    t.email === email ? { ...t, isActive: false } : t
  );

  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// Endpoint principal do webhook
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('📩 Webhook recebido:', {
      event: data.event_type,
      customer: data.customer?.email,
      product: data.product?.name
    });

    const eventType = data.event_type;

    switch (eventType) {
      case 'Purchase_Order_Confirmed':
        // Pagamento confirmado - gerar token e liberar acesso
        const accessData = await saveAccessToken(data);

        console.log('✅ Token gerado:', accessData.token);
        console.log('📧 Email do cliente:', accessData.email);
        console.log('🔗 Link de acesso:', `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/membros?token=${accessData.token}`);

        // Enviar email automático com link de acesso
        const emailResult = await sendAccessEmail(accessData);

        if (emailResult.success) {
          console.log('📨 Email de acesso enviado automaticamente!');
        } else {
          console.error('⚠️ Erro ao enviar email, mas token foi criado:', emailResult.error);
        }

        return NextResponse.json({
          success: true,
          message: 'Acesso liberado, email enviado e conversão registrada',
          token: accessData.token,
          emailSent: emailResult.success
        });

      case 'Product_access_ended':
      case 'Subscription_Canceled':
      case 'Subscription_Expired':
        // Remover acesso
        await removeAccess(data.customer?.email);
        console.log('❌ Acesso removido para:', data.customer?.email);

        return NextResponse.json({
          success: true,
          message: 'Acesso removido'
        });

      case 'Payment_Refund':
        // Processar reembolso
        await removeAccess(data.customer?.email);
        console.log('💰 Reembolso processado para:', data.customer?.email);

        return NextResponse.json({
          success: true,
          message: 'Reembolso processado'
        });

      default:
        console.log('ℹ️ Evento não tratado:', eventType);
        return NextResponse.json({
          success: true,
          message: 'Evento recebido'
        });
    }
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json({
      error: 'Internal error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Endpoint para testar (GET)
export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint ativo',
    timestamp: new Date().toISOString()
  });
}
