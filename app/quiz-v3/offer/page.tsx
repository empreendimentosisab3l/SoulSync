"use client";

import { useRouter } from "next/navigation";

export default function OfferPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz-v3/checkout");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in pb-32">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Seu Plano de Hipnoterapia Inclui:
          </h1>
        </div>

        {/* Benefits Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="space-y-6 text-gray-700">
            {/* Benefit 1 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Sessões de hipnose personalizadas</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• 30+ sessões de áudio (15-25 min cada)</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Reprogramação mental profunda</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• Técnicas de visualização</p>
                <p>• Sugestões pós-hipnóticas</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Meditações anti-ansiedade</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• 15+ meditações guiadas</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Técnicas de autocontrole</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• Protocolo de 60 segundos</p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Acompanhamento de progresso</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• Gráficos visuais</p>
                <p>• Celebração de marcos</p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Comunidade exclusiva</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• Grupos de apoio</p>
                <p>• Desafios semanais</p>
              </div>
            </div>

            {/* Benefit 7 */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg text-gray-900">Acesso vitalício</h3>
              </div>
              <div className="ml-11 space-y-1 text-gray-600">
                <p>• Pague uma vez, use para sempre</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t-2 border-dashed border-gray-300 my-8"></div>

            {/* Bonus */}
            <div className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-200">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <h3 className="font-bold text-lg text-teal-900">BÔNUS EXCLUSIVO: Acelerador Mental</h3>
                  <p className="text-gray-700 mt-2">
                    Protocolo intensivo dos primeiros 7 dias
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    (Valor: R$ 97,00) - <span className="font-bold text-green-600">GRÁTIS</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Junte-se a</p>
          <p className="text-3xl font-bold text-teal-600">187.432 pessoas</p>
          <p className="text-sm text-gray-600 mt-2">que já transformaram suas vidas</p>
          <div className="flex justify-center items-center gap-1 mt-3">
            <span className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</span>
            <span className="text-gray-700 font-semibold ml-2">4.9/5</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Baseado em 42.891 avaliações verificadas</p>
        </div>

        {/* Continue Button - Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
          <div className="w-full max-w-md">
            <button
              onClick={handleContinue}
              className="w-full bg-teal-600 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300"
            >
              🚀 Quero começar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
