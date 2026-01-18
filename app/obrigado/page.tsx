'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ThankYouPage() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  useEffect(() => {
    // Tenta pegar email da URL primeiro
    const params = new URLSearchParams(window.location.search)
    const emailFromUrl = params.get('email')

    if (emailFromUrl) {
      setEmail(emailFromUrl)
    } else {
      // Fallback para sessionStorage
      const savedEmail = sessionStorage.getItem('userEmail')
      if (savedEmail) {
        setEmail(savedEmail)
      }
    }
  }, [])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsCreatingAccount(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      // Sucesso!
      // Salvar flag local apenas para UX imediata
      localStorage.setItem('userEmail', email)
      localStorage.setItem('hasCreatedAccount', 'true')

      // Force session sync
      await refreshAuth()

      // Redirecionar
      router.push('/membros')

    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsCreatingAccount(false)
    }
  }

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

        {/* Espaçamento final */}
        <div className="h-12"></div>
      </div>
    </div>
  )
}
