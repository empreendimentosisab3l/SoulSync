import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sendAccessEmail } from '@/lib/email/sendAccessEmail';

// Chave de acesso Payt (configurada no postback)
const PAYT_ACCESS_KEY = 'f630b87e16e6a6364027dcb2b465b9d4';

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

// Validar chave de acesso Payt
function validatePaytKey(requestKey: string): boolean {
  return requestKey === PAYT_ACCESS_KEY;
}

// Salvar token
async function saveAccessToken(data: any) {
  await ensureDataDir();

  const tokens = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));

  const token = generateToken();
  const accessData = {
    token,
    email: data.customer_email || data.email,
    name: data.customer_name || data.name,
    planType: data.product_name || data.offer_name || 'SoulSync',
    orderId: data.transaction_id || data.order_id,
    customerId: data.customer_id,
    subscriptionId: data.subscription_id,
    createdAt: new Date().toISOString(),
    expiresAt: null, // Payt não envia data de expiração
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

// Reativar acesso
async function reactivateAccess(email: string) {
  await ensureDataDir();

  let tokens = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));
  tokens = tokens.map((t: any) =>
    t.email === email ? { ...t, isActive: true } : t
  );

  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// Endpoint principal do webhook Payt
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('📩 Webhook Payt recebido:', {
      event: data.event,
      customer: data.customer_email,
      product: data.product_name || data.offer_name
    });

    // Validar chave de acesso se enviada
    if (data.access_key && !validatePaytKey(data.access_key)) {
      console.error('❌ Chave de acesso inválida');
      return NextResponse.json({
        error: 'Invalid access key'
      }, { status: 401 });
    }

    const eventType = data.event;

    switch (eventType) {
      // Eventos de venda
      case 'Venda':
      case 'Recorrência':
      case 'Assinatura Reativada':
      case 'Pedido Confirmado':
      case 'Aguardando Confirmação':
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
          message: 'Acesso liberado e email enviado',
          token: accessData.token,
          emailSent: emailResult.success
        });

      // Eventos de cancelamento
      case 'Assinatura Cancelada':
      case 'Assinatura Renovada':
      case 'Assinatura Ativada':
      case 'Pedido Frustrado':
        // Remover acesso
        const email = data.customer_email || data.email;
        await removeAccess(email);
        console.log('❌ Acesso removido para:', email);

        return NextResponse.json({
          success: true,
          message: 'Acesso removido'
        });

      // Evento de reativação
      case 'Assinatura em Atraso':
        // Manter acesso temporariamente (você pode decidir remover)
        console.log('⚠️ Assinatura em atraso:', data.customer_email);
        return NextResponse.json({
          success: true,
          message: 'Assinatura em atraso notificada'
        });

      default:
        console.log('ℹ️ Evento Payt não tratado:', eventType);
        return NextResponse.json({
          success: true,
          message: 'Evento recebido'
        });
    }
  } catch (error) {
    console.error('❌ Erro no webhook Payt:', error);
    return NextResponse.json({
      error: 'Internal error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Endpoint para testar (GET)
export async function GET() {
  return NextResponse.json({
    status: 'Webhook Payt ativo',
    provider: 'Payt',
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhook/payt'
  });
}
