/**
 * Script para criar tokens de teste manualmente
 * Uso: node criar-token-teste.js "Nome do Cliente" "email@exemplo.com"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Pegar argumentos da linha de comando
const args = process.argv.slice(2);
const name = args[0] || 'Cliente Teste';
const email = args[1] || 'teste@exemplo.com';

// Diretórios
const DATA_DIR = path.join(process.cwd(), 'data');
const TOKENS_FILE = path.join(DATA_DIR, 'access-tokens.json');

// Garantir que diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify([], null, 2));
}

// Gerar token único
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Ler tokens existentes
const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));

// Criar novo token
const token = generateToken();
const accessData = {
  token,
  email,
  name,
  planType: 'SoulSync - Teste Gratuito',
  orderId: `TEST-${Date.now()}`,
  customerId: 'MANUAL-TEST',
  subscriptionId: null,
  createdAt: new Date().toISOString(),
  expiresAt: null, // Sem expiração
  isActive: true
};

// Adicionar aos tokens
tokens.push(accessData);

// Salvar arquivo
fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));

// Mostrar resultado
console.log('\n✅ TOKEN CRIADO COM SUCESSO!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`👤 Nome: ${name}`);
console.log(`📧 Email: ${email}`);
console.log(`🎟️ Token: ${token}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n🔗 LINK DE ACESSO:\n');
console.log(`http://localhost:3003/membros?token=${token}`);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('💡 Copie o link acima e cole no navegador!\n');
