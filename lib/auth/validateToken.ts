import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'access-tokens.json');

export interface AccessToken {
  token: string;
  email: string;
  name: string;
  planType: string;
  orderId: string;
  customerId: string;
  subscriptionId: string | null;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

export async function validateToken(token: string): Promise<AccessToken | null> {
  try {
    if (!existsSync(TOKENS_FILE)) {
      return null;
    }

    const tokens: AccessToken[] = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));

    const accessToken = tokens.find(t => t.token === token && t.isActive);

    if (!accessToken) {
      return null;
    }

    // Verificar se o token expirou (se houver data de expiração)
    if (accessToken.expiresAt) {
      const expiryDate = new Date(accessToken.expiresAt);
      const now = new Date();

      if (now > expiryDate) {
        return null; // Token expirado
      }
    }

    return accessToken;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return null;
  }
}

export async function getAllActiveTokens(): Promise<AccessToken[]> {
  try {
    if (!existsSync(TOKENS_FILE)) {
      return [];
    }

    const tokens: AccessToken[] = JSON.parse(await readFile(TOKENS_FILE, 'utf-8'));
    return tokens.filter(t => t.isActive);
  } catch (error) {
    console.error('Erro ao buscar tokens:', error);
    return [];
  }
}
