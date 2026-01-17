import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sendAccessEmail } from '@/lib/email/sendAccessEmail';
import prisma from '@/lib/prisma';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const dynamic = 'force-dynamic';

// Chave de acesso Payt (configurada no postback)
const PAYT_ACCESS_KEY = 'f630b87e16e6a6364027dcb2b465b9d4';

// Diretório para armazenar tokens (backup/fallback)
const DATA_DIR = path.join(process.cwd(), 'data');
const TOKENS_FILE = path.join(DATA_DIR, 'access-tokens.json');

// Google Service Account Key (hardcoded - você deve mover para variável de ambiente)
const GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDte9X9sYHHbGmR
VaWMJQP5lSV4pR5K0t0AkndK8WtTEEMcCoZB5Im+M6qYD68oTyFb3wG9y9TkyYRx
igGEgOEOOOX6glPwrv6ohayQ/NkLKgMCIOmiPJB52dbX010j4HA5AxjlCStdebsH
0vMASjF1Nw26hnAwvEjiAcUOZ5clBzBDB8gc/OfsfjDzSceg7vmMvH3/+iRSuNqR
RCBKmFq2KsSyqLpn3vZBZT/A4lg913dD5FMlGUKhECvQbvmKM/ze3Ywg1Zd/+u0v
yWaAJjlT6VeRkIdlHbAEpz0d/EWHZ7TKSM9+y+qK0aSWiMWvThDyauk/mEqyDSbr
PsC+S2jDAgMBAAECggEAXltAl87KSKkLfMIxx3ABl02qGLhKQ+JqCssm+LDZOqSQ
dXi9BTs/e0Hd+xLoPjTKhU0izP1KtihXJiF2HuZyBQuYXKMhpNRyvBR4jxbXSbdE
gLkA+wPjR3bFBPWm4RVQoWZYos+02iv+osou4KOZ6P+Zxc2aj9KPhrS7TdDc3cms
cS4tZua5gvZ4TWqCUYG0rxJb5B33+KRx67MdXb1pdD7Q1nWb2DMn3qbFmPj+WK6I
fNSWABuSnJVibcxRUaCS9IQUpujZQ7BefwzGZ0yLB0khvkhgmOB3yzWRfXmn3AWD
LDany+mF/rQ8vJX+kHksC0unmV8rvgmzqJO2sm3s4QKBgQD5oOnBdHRieDavul3d
3vj+sBVgB7GgGndrGeck/gZlw0FTQNCp17Kmes+Sn5U4wuzUa4Z+TPmpNbrR8w1M
d0raxUHwf6f+nr3b6mQxbZu70e8HDkL6RDJCZjB+VgPiHGQip7o5JNY6MwhIBAkR
bGrpbhXw6dBorTp351bOUT7IkQKBgQDzi5FaPoKZRwQE9t29JIA1J47Qb0iz0UH4
ea7d5RE49MHuDhmZDfI/JJOR5kwT5GEVTwVjxrdZjYv24WAmq1P5pxnhgGKs3J8T
Lx/hsQiatWyJFqyuYDu29udT3729n9Wd73R8HZoAho/nDKMV/Z4pjCQZY1Sq4duu
sCYMnY0mEwKBgGrXdnU4dL/Yl/9qktZtosDPeLabVGkkKsyKT6ZDm1Ve1szdRvIK
wgoDMmidKO8cbuUUCIJyS8EioA1QK/b4b+9m0iwvVyXhp31CuxN0yF0BI38vmXco
TSKiPks0YYEbibhTdZ8TpyVNxlOcdo0gjDnQxk9Qo8TJr+a1+y9fErIhAoGBAJ5t
Q/h4gWxEDhFMpaHMhLoPKY/dVGXk0g1Y2q/tuu5aCW1aLrypndQFbxmRvhuSjLTX
2qG1OsA+m7XVlj6RZOcaFHPkmEvqmHBaT1r5VqeNLTVgUqR8ZVv38TNWcI9R0hwT
EKtMdkmxPxsF1XEQsjpEt5bsTr96fPV+EMJUGuWRAoGAFreEfiodpZDCVvjeHmad
Ef+Ggy5Kn43rCDxsUEicezZE+YWhT4EHyho/uckgRpuFMNx6ELx/8TKz8lyTi0/I
dzmqI2gba+2YmW+OlPdTPsmeHQXGeOjUCmbZx2s+ZZSodWe94GRExmloY/klCPw1
JWnO/pPW82o4SsM0QpXnOXU=
-----END PRIVATE KEY-----`;

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(TOKENS_FILE)) {
    await writeFile(TOKENS_FILE, JSON.stringify([]));
  }
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function validatePaytKey(requestKey: string): boolean {
  return requestKey === PAYT_ACCESS_KEY;
}

// =============================================================================
// SALVAR NO ARQUIVO JSON (backup/fallback)
// =============================================================================
async function saveAccessTokenToFile(data: any) {
  await ensureDataDir();

  const tokens = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));

  const token = generateToken();
  const accessData = {
    token,
    email: data.customer_email || data.email,
    name: data.customer_name || data.name,
    planType: data.product_name || data.offer_name || data.prod_name || 'SoulSync',
    orderId: data.transaction_id || data.order_id,
    customerId: data.customer_id,
    subscriptionId: data.subscription_id,
    createdAt: new Date().toISOString(),
    expiresAt: null,
    isActive: true
  };

  tokens.push(accessData);
  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));

  return accessData;
}

async function updateAccessStatusInFile(email: string, isActive: boolean) {
  await ensureDataDir();

  let tokens = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));
  tokens = tokens.map((t: any) =>
    t.email === email ? { ...t, isActive } : t
  );

  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// =============================================================================
// SALVAR NO BANCO DE DADOS (Prisma)
// =============================================================================
async function saveUserToDatabase(email: string, name: string, status: string) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        status,
        name: name || undefined,
      },
      create: {
        email,
        name: name || email.split('@')[0],
        status: 'pending_password', // Usuário ainda precisa definir senha
        plan: 'standard',
        password: '', // Vazio até o usuário definir
      },
    });

    console.log(`✅ Usuário salvo no banco de dados: ${user.email}`);
    return user;
  } catch (error) {
    console.error('❌ Erro ao salvar no banco de dados:', error);
    throw error;
  }
}

// =============================================================================
// SALVAR NO GOOGLE SHEETS
// =============================================================================
async function saveToGoogleSheets(user: any) {
  try {
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.log('⚠️ Google Sheets não configurado (variáveis de ambiente ausentes)');
      return;
    }

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      'Data': new Date().toLocaleString('pt-BR'),
      'Nome': user.name || 'N/A',
      'Email': user.email,
      'Status': user.status,
      'Plano': user.plan || 'standard'
    });

    console.log('✅ Cliente salvo no Google Sheets');
  } catch (error) {
    console.error('❌ Erro ao salvar no Google Sheets:', error);
  }
}

// =============================================================================
// WEBHOOK HANDLER PRINCIPAL
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('📩 Webhook Payt recebido:', {
      event: data.event,
      customer: data.customer_email || data.email,
      product: data.product_name || data.offer_name || data.prod_name
    });

    // Validar chave de acesso se enviada
    if (data.access_key && !validatePaytKey(data.access_key)) {
      console.error('❌ Chave de acesso inválida');
      return NextResponse.json({
        error: 'Invalid access key'
      }, { status: 401 });
    }

    const email = data.customer_email || data.email;
    const name = data.customer_name || data.name;
    const eventType = data.event || data.status;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // =============================================================================
    // EVENTOS QUE LIBERAM ACESSO
    // =============================================================================
    if (['Venda', 'Recorrência', 'Assinatura Reativada', 'Pedido Confirmado', 'Aguardando Confirmação'].includes(eventType)) {

      // 1. Salvar no arquivo JSON (para compatibilidade com sistema de tokens)
      const accessData = await saveAccessTokenToFile(data);
      console.log('✅ Token gerado:', accessData.token);

      // 2. Salvar no banco de dados
      const user = await saveUserToDatabase(email, name, 'active');

      // 3. Salvar no Google Sheets
      await saveToGoogleSheets(user);

      // 4. Enviar email com link de acesso
      const emailResult = await sendAccessEmail(accessData);

      if (emailResult.success) {
        console.log('📨 Email de acesso enviado automaticamente!');
      } else {
        console.error('⚠️ Erro ao enviar email, mas acesso foi liberado:', emailResult.error);
      }

      return NextResponse.json({
        success: true,
        message: 'Acesso liberado, email enviado e dados salvos',
        token: accessData.token,
        emailSent: emailResult.success
      });
    }

    // =============================================================================
    // EVENTOS QUE REMOVEM ACESSO
    // =============================================================================
    if (['Assinatura Cancelada', 'Pedido Frustrado', 'Assinatura Renovada', 'Assinatura Ativada'].includes(eventType)) {

      // 1. Desativar no arquivo JSON
      await updateAccessStatusInFile(email, false);
      console.log('❌ Acesso removido no arquivo JSON para:', email);

      // 2. Desativar no banco de dados
      try {
        await prisma.user.update({
          where: { email },
          data: { status: 'inactive' }
        });
        console.log('❌ Acesso removido no banco de dados para:', email);
      } catch (error) {
        console.error('⚠️ Erro ao remover acesso no banco:', error);
      }

      return NextResponse.json({
        success: true,
        message: 'Acesso removido'
      });
    }

    // =============================================================================
    // OUTROS EVENTOS
    // =============================================================================
    if (eventType === 'Assinatura em Atraso') {
      console.log('⚠️ Assinatura em atraso:', email);
      return NextResponse.json({
        success: true,
        message: 'Assinatura em atraso notificada'
      });
    }

    // Evento não reconhecido
    console.log('ℹ️ Evento Payt não tratado:', eventType);
    return NextResponse.json({
      success: true,
      message: 'Evento recebido'
    });

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
    status: 'Webhook Payt ativo (unificado)',
    provider: 'Payt',
    features: ['JSON tokens', 'Database', 'Google Sheets', 'Email'],
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhook/payt'
  });
}
