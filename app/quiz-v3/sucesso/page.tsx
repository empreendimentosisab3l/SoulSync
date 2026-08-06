export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Pagamento confirmado!</h1>
        <p className="text-gray-600 mb-6">
          Enviamos o seu acesso ao <strong>SoulSync</strong> para o seu email.
          Verifique a caixa de entrada (e o spam) nos próximos minutos.
        </p>
        <p className="text-sm text-gray-400">
          Seu teste de 3 dias começou. Após esse período, a assinatura de R$ 39,90/mês é renovada
          automaticamente — você pode cancelar quando quiser.
        </p>
      </div>
    </div>
  );
}
