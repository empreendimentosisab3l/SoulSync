'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Verificar se há token na URL (vindo do email)
  const tokenFromUrl = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Tenta fazer login com email e senha
      const success = await login(email, password);

      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/membros');
        }, 1000);
      } else {
        setError('Email ou senha incorretos. Verifique suas credenciais.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Realizado!</h2>
            <p className="text-gray-600">Redirecionando para sua área de membros...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SoulSync</h1>
          <p className="text-white/80">Bem-vindo de volta</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-soul-purple mb-6 text-center">
            Acessar Área de Membros
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-soul-purple focus:border-transparent transition"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-soul-purple focus:border-transparent transition"
                placeholder="Digite sua senha"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-soul-purple text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-soul-lavender hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-soul-cream rounded-xl">
            <p className="text-sm text-gray-600 text-center mb-3">
              <strong>Primeira vez?</strong> Verifique seu email para o link de acesso
            </p>
            <button
              onClick={() => window.location.href = 'https://lastlink.com/p/CDD3C0290/checkout-payment'}
              className="w-full py-3 bg-soul-purple text-white rounded-full font-bold text-sm transition-all duration-300 hover:bg-soul-lavender hover:scale-105"
            >
              Adquira seu plano
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não recebeu o email?{' '}
              <a href="#" className="text-soul-purple font-semibold hover:underline">
                Reenviar link de acesso
              </a>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-soul-cream transition-colors text-sm"
          >
            ← Voltar para home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Carregando...</h2>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
