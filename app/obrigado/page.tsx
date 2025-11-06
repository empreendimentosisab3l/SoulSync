'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import Image from 'next/image'

export default function ThankYouPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedTip, setSelectedTip] = useState<number | null>(null)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  // Pegar email do sessionStorage se disponível
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('userEmail')
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    setIsCreatingAccount(true)

    // Salvar credenciais no localStorage
    const userData = {
      name: email.split('@')[0], // Usa a primeira parte do email como nome temporário
      email: email,
      password: password,
      createdAt: new Date().toISOString(),
      isLocalUser: true // Flag para indicar que é usuário local (não precisa validar API)
    }

    console.log('=== DEBUG CRIAÇÃO DE CONTA ===');
    console.log('Salvando userData:', userData);

    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('userEmail', email)
    localStorage.setItem('accessToken', 'local-' + Date.now()) // Token local para usuários que criaram conta diretamente

    console.log('userData salvo no localStorage:', localStorage.getItem('userData'));
    console.log('accessToken salvo:', localStorage.getItem('accessToken'));

    // Simular criação de conta e redirecionar
    setTimeout(() => {
      setIsCreatingAccount(false)
      // Redirecionar para área de membros
      router.push('/membros')
    }, 1500)
  }

  const planPrice = 359.58
  const discount = -182.80
  const total = 176.78

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f5f5] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">SoulSync</h1>
        </div>

        {/* Confirmação do Pedido */}
        <div className="relative mb-12">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white shadow-lg">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-white rounded-full p-3 shadow-xl">
                <div className="bg-teal-600 rounded-full p-4">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-3">Seu pedido foi confirmado.</h2>
              <p className="text-teal-50">
                Obrigado pelo seu pedido! Enviamos um e-<br />mail de confirmação para você.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de Criação de Senha */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Crie uma senha para sua conta.
          </h2>

          {/* Mockup do Laptop */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-gray-800 rounded-t-xl p-1">
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-t-lg aspect-video flex items-center justify-center">
                  <div className="text-white text-xs text-center">
                    <p className="font-semibold">Plataforma SoulSync</p>
                    <p className="text-teal-100 mt-1">Acesse suas sessões de hipnoterapia</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-300 h-2 rounded-b-xl"></div>
              <div className="bg-gray-400 h-1 mx-auto w-32"></div>
            </div>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Endereço de email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Confirme sua senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isCreatingAccount}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isCreatingAccount ? 'Criando...' : 'Acesse minha primeira sessão!'}
            </button>
          </form>
        </div>

        {/* Seção de Gorjeta */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
            Obrigado pela sua<br />compra!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Seu apoio significa muito para nós. Gostaria de<br />
            contribuir com uma pequena gorjeta?
          </p>

          <p className="text-center text-gray-700 font-semibold mb-4">
            Escolha o valor da gorjeta (opcional):
          </p>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => setSelectedTip(15)}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedTip === 15
                  ? 'bg-red-500 text-white'
                  : 'bg-red-400 hover:bg-red-500 text-white'
              }`}
            >
              R$ 15,00
            </button>
            <button
              onClick={() => setSelectedTip(26)}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedTip === 26
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              R$ 26,00
            </button>
            <button
              onClick={() => setSelectedTip(53)}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedTip === 53
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              R$ 53,00
            </button>
            <button
              onClick={() => setSelectedTip(null)}
              className={`py-4 rounded-lg font-bold transition-all ${
                selectedTip === null
                  ? 'bg-gray-400 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              }`}
            >
              Sem<br />gorjeta,<br />obrigado
            </button>
          </div>

          <p className="text-center text-red-500 text-sm font-semibold">
            ❤️ Por que isto importa?
          </p>
        </div>

        {/* Resumo do Pedido */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Resumo do seu pedido
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Plano de 2 meses</span>
              <span className="text-gray-900 font-semibold">
                R$ {planPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-teal-600">Desconto</span>
              <span className="text-teal-600 font-semibold">
                -R$ {Math.abs(discount).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total geral</span>
              <span className="text-xl font-bold text-gray-900">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Tem alguma dúvida? Envie-nos uma mensagem.<br />
            <a
              href="mailto:suporte@SoulSync.com"
              className="text-teal-600 hover:underline"
            >
              suporte@SoulSync.com
            </a>
          </p>
        </div>

        {/* Espaçamento final */}
        <div className="h-12"></div>
      </div>
    </div>
  )
}
