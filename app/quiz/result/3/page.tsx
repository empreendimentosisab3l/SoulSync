"use client";

import { useRouter } from "next/navigation";

export default function Result3() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/quiz/result/4");
  };

  const handleBack = () => {
    router.push("/quiz/result/2");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900 text-center">SoulSync</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ALÉM DA PERDA DE PESO
            </h2>
            <p className="text-gray-600">Você verá melhorias nestas áreas:</p>
          </div>

          {/* Benefits Cards */}
          <div className="space-y-4">
            {/* Emotional Eating */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                  😊
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Comer emocionalmente</h3>
                  <p className="text-sm text-gray-600">
                    9 em cada 10 usuários relatam redução alimentar emocional após 6 semanas de hipnoterapia.
                  </p>
                </div>
              </div>
            </div>

            {/* Digestion */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                  🍔
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Má digestão</h3>
                  <p className="text-sm text-gray-600">
                    Oito em cada 10 usuários relataram redução nos níveis de estresse e melhora na digestão após usarem hipnoterapia.
                  </p>
                </div>
              </div>
            </div>

            {/* Willpower */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                  💪
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Força de vontade</h3>
                  <p className="text-sm text-gray-600">
                    9 em cada 10 usuários afirmam que reduziram seu desejo por comida e formaram hábitos saudáveis com a hipnoterapia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-700 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
