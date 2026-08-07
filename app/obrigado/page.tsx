'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Phase = 'verifying' | 'verified' | 'blocked' | 'stripe_error'

export default function ThankYouPage() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [phase, setPhase] = useState<Phase>('verifying')
  const [sessionId, setSessionId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  const verify = useCallback(async (sid: string) => {
    setPhase('verifying')
    try {
      const res = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sid)}`)
      if (res.ok) {
        const data = await res.json()
        setEmail(data.email || '')
        setPhase('verified')
      } else if (res.status === 503) {
        setPhase('stripe_error')
      } else {
        setPhase('blocked')
      }
    } catch {
      setPhase('stripe_error')
    }
  }, [])

  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get('session_id') || ''
    setSessionId(sid)
    if (!sid) {
      setPhase('blocked')
      return
    }
    verify(sid)
  }, [verify])

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error === 'payment_not_confirmed'
          ? 'Não localizamos seu pagamento. Fale com o suporte.'
          : (data.error || 'Erro ao criar conta'))
      }
      localStorage.setItem('userEmail', email)
      localStorage.setItem('hasCreatedAccount', 'true')
      await refreshAuth()
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">SoulSync</h1>
        </div>

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
                Obrigado pelo seu pedido! Crie sua senha abaixo para acessar.
              </p>
            </div>
          </div>
        </div>

        {phase === 'verifying' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center text-gray-600">
            Verificando seu pagamento…
          </div>
        )}

        {phase === 'stripe_error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <p className="text-gray-700 mb-4">Não conseguimos verificar seu pagamento agora.</p>
            <button
              onClick={() => verify(sessionId)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {phase === 'blocked' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Não localizamos seu pagamento</h2>
            <p className="text-gray-600">
              Se você acabou de pagar, aguarde alguns segundos e recarregue esta página.
              Se o problema continuar, fale com o suporte no WhatsApp.
            </p>
          </div>
        )}

        {phase === 'verified' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Crie uma senha para sua conta.
            </h2>

            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-gray-800 rounded-t-xl p-1">
                  <div className="bg-gray-900 rounded-t-lg aspect-video overflow-hidden relative">
                    <img
                      src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768790347/soulsync/obrigado/ptc9bcaystjz2djef9qe.png"
                      alt="Plataforma SoulSync"
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div className="bg-gray-300 h-2 rounded-b-xl"></div>
                <div className="bg-gray-400 h-1 mx-auto w-32"></div>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Endereço de email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Senha</label>
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
                <label className="block text-sm text-gray-600 mb-2">Confirme sua senha</label>
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
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCreatingAccount ? 'Criando...' : 'Acesse minha primeira sessão!'}
              </button>
            </form>
          </div>
        )}

        <div className="h-12"></div>
      </div>
    </div>
  )
}
