import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// PayT verification handler
export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
    // LAZY LOAD: Carrega Prisma somente se a rota for chamada
    const { default: prisma } = await import('@/lib/prisma');

    try {
        const body = await request.json();
        console.log('Webhook PayT received:', body);

        const { email, customer_name, status } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Salvar/Atualizar no Banco de Dados
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                status: 'active',
                name: customer_name || undefined,
            },
            create: {
                email,
                name: customer_name,
                status: 'pending_password',
                plan: 'standard',
                password: '',
            },
        });

        console.log(`User processed via webhook: ${user.email}`);

        // 2. Salvar no Google Sheets
        try {
            if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
                const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || ''; // Mover para env ou manter hardcoded se preferir

                // Autenticação
                const auth = new JWT({
                    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });

                const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
                await doc.loadInfo(); // Carregar info da planilha

                // Pegar a primeira aba
                const sheet = doc.sheetsByIndex[0];

                // Adicionar linha
                await sheet.addRow({
                    'Data': new Date().toLocaleString('pt-BR'),
                    'Nome': user.name || 'N/A',
                    'Email': user.email,
                    'Status': user.status,
                    'Plano': user.plan
                });

                console.log('✅ Cliente salvo no Google Sheets');
            }
        } catch (sheetError) {
            console.error('❌ Erro ao salvar no Google Sheets:', sheetError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
