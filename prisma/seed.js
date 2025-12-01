// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verificar se usuário admin já existe
  const existingUser = await prisma.user.findUnique({
    where: { username: 'admin' }
  });

  if (existingUser) {
    console.log('⚠️  Usuário admin já existe!');
    console.log('Username: admin');
    console.log('Email:', existingUser.email);
    return;
  }

  // Criar hash da senha
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@hypnozio.com'
    }
  });

  console.log('✅ Usuário admin criado com sucesso!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email: admin@hypnozio.com');
  console.log('👤 Username: admin');
  console.log('🔑 Senha: admin123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  console.log('');
  console.log('🚀 Acesse: http://localhost:3002/login');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
