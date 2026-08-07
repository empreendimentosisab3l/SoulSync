import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { SaleRow } from '@/lib/stripe/saleFromEvent';

const SHEET_TITLE = 'Vendas Stripe';
const HEADERS = ['Data', 'Origem', 'Nome', 'Email', 'Evento', 'Valor (R$)', 'Assinatura ID'];

export async function appendSaleRow(row: SaleRow): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !serviceEmail || !rawKey) {
    console.warn('⚠️ Google Sheets não configurado — venda não registrada na planilha');
    return;
  }

  try {
    const auth = new JWT({
      email: serviceEmail,
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    let sheet = doc.sheetsByTitle[SHEET_TITLE];
    if (!sheet) {
      sheet = await doc.addSheet({ title: SHEET_TITLE, headerValues: HEADERS });
    }

    await sheet.addRow({
      'Data': new Date().toLocaleString('pt-BR'),
      'Origem': row.origem,
      'Nome': row.nome,
      'Email': row.email,
      'Evento': row.evento,
      'Valor (R$)': row.valor,
      'Assinatura ID': row.subscriptionId,
    });

    console.log('✅ Venda registrada (Vendas Stripe):', row.evento, '-', row.origem);
  } catch (error) {
    console.error('⚠️ Falha ao registrar venda no Google Sheets:', error);
  }
}
