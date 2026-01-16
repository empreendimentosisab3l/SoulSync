'use client';

interface PreSessionModalProps {
  onStart: () => void;
  onClose: () => void;
}

export default function PreSessionModal({ onStart, onClose }: PreSessionModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg sm:text-xl font-bold text-gray-900">SoulSync</span>
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">
          {/* Header Image */}
          <div className="relative h-32 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-5xl sm:text-7xl">🎧</div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            Como usar suas sessões de hipnoterapia
          </h2>

          {/* Instruções */}
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8">
            <ul className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Encontre um ambiente tranquilo e sem distrações.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Não ouça enquanto estiver dirigindo ou operando máquinas pesadas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>É altamente recomendável usar fones de ouvido para obter nitidez de áudio ideal.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Seja paciente. Várias sessões podem ser necessárias antes de perceber resultados.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Reserve um momento para reflexão após cada sessão.</span>
              </li>
            </ul>
          </div>

          {/* Botão Iniciar */}
          <button
            onClick={onStart}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-all duration-300 active:scale-95 sm:hover:scale-105 text-base sm:text-lg shadow-lg"
          >
            Iniciar hipnoterapia
          </button>
        </div>
      </div>
    </div>
  );
}
