const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('\n=== LISTA DE CLIENTES (BANCO DE DADOS LOCAL) ===\n')
    users.forEach(u => {
        console.log(`👤 Nome:   ${u.name || 'Não informado'}`)
        console.log(`📧 Email:  ${u.email}`)
        console.log(`🔑 Senha:  ${u.password ? '🔒 [CRIPTOGRAFADA]' : '❌ SEM SENHA'}`)
        console.log(`📅 Criado: ${u.createdAt.toLocaleString()}`)
        console.log('-----------------------------------')
    })
    console.log(`\nTotal de usuários: ${users.length}\n`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
