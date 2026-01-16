'use client';

interface ExitConfirmationModalProps {
  onContinue: () => void;
  onExit: () => void;
}

export default function ExitConfirmationModal({ onContinue, onExit }: ExitConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Card de confirmação */}
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header com imagem */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-teal-500 to-teal-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-5xl sm:text-6xl">🎧</div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
            Tem certeza de que deseja parar?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            Sua sessão de hipnoterapia ainda não foi concluída.
          </p>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="w-full py-3 sm:py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base rounded-full transition-all duration-300 active:scale-95 sm:hover:scale-105 shadow-lg"
            >
              Continuar ouvindo
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base rounded-full transition-all duration-300 active:scale-95"
            >
              Finalizar sessão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
