'use client';

interface ExitConfirmationModalProps {
  onContinue: () => void;
  onExit: () => void;
}

export default function ExitConfirmationModal({ onContinue, onExit }: ExitConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
      {/* Botão X no canto */}
      <button
        onClick={onContinue}
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Logo no topo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-3xl font-bold text-white">SoulSync</h1>
      </div>

      {/* Card de confirmação */}
      <div className="max-w-xl w-full">
        <div className="relative rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl">
          {/* Imagem de fundo (lago com montanhas) */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-400 to-teal-600">
              {/* Placeholder para imagem de natureza */}
            </div>
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Conteúdo */}
          <div className="relative p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              Tem certeza de que<br />
              deseja parar a<br />
              reprodução?
            </h2>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onContinue}
                className="px-8 py-3 bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Continuar ouvindo
              </button>
              <button
                onClick={onExit}
                className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-300 border border-white/30"
              >
                Finalizar sessão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
