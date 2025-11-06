'use client';

interface PreSessionModalProps {
  onStart: () => void;
  onClose: () => void;
}

export default function PreSessionModal({ onStart, onClose }: PreSessionModalProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 z-50 flex items-center justify-center p-6">
      {/* Botão Voltar */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="max-w-2xl w-full">
        {/* Card com imagem e instruções */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
          {/* Imagem */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400">
              {/* Placeholder para imagem de pessoa relaxada */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-6xl">🎧</div>
              </div>
            </div>
            {/* Overlay com título */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center px-6">
                Como usar suas sessões de<br />hipnoterapia
              </h2>
            </div>
          </div>

          {/* Instruções */}
          <div className="p-8 space-y-4">
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-teal-300 mt-1">•</span>
                <span>Encontre um ambiente tranquilo e sem distrações.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-300 mt-1">•</span>
                <span>Não ouça enquanto estiver dirigindo ou operando máquinas pesadas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-300 mt-1">•</span>
                <span>É altamente recomendável usar fones de ouvido para a obter nitidez de áudio ideal.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-300 mt-1">•</span>
                <span>Seja paciente. Várias sessões podem ser necessárias antes que a hipnose produza resultados perceptíveis.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-300 mt-1">•</span>
                <span>Reserve um momento para reflexão após cada sessão.</span>
              </li>
            </ul>

            {/* Botão Iniciar */}
            <button
              onClick={onStart}
              className="w-full mt-6 py-4 bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold rounded-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              Inicie a hipnoterapia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
