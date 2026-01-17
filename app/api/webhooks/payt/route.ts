import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const dynamic = 'force-dynamic';

// Simple type definition for PayT payload
interface PayTPayload {
    email: string;
    customer_name?: string;
    status?: string;
    prod_name?: string;
}

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

// PayT verification handler
export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
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
                // Autenticação
                const auth = new JWT({
                    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: GOOGLE_PRIVATE_KEY,
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

        // 3. (Legado/Backup) Salvar em CSV
        try {
            const fs = await import('fs');
            const path = await import('path');
            const csvFilePath = path.join(process.cwd(), 'clientes_marketing.csv');
            const date = new Date().toLocaleString('pt-BR');
            const csvLine = `${date},${user.name || 'N/A'},${user.email},${user.status},${user.plan}\n`;

            if (!fs.existsSync(csvFilePath)) fs.writeFileSync(csvFilePath, 'DATA,NOME,EMAIL,STATUS,PLANO\n');
            fs.appendFileSync(csvFilePath, csvLine);
        } catch (csvError) {
            console.error('Erro ao salvar no CSV:', csvError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
