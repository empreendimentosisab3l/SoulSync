'use client';

interface UnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
}

export default function UnavailableModal({ isOpen, onClose, moduleName }: UnavailableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="max-w-sm w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com ícone */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg sm:text-xl">Em breve!</h3>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 text-center">
          <p className="text-gray-700 text-sm sm:text-base mb-2">
            O módulo
          </p>
          <p className="text-gray-900 font-semibold text-base sm:text-lg mb-4">
            "{moduleName}"
          </p>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            ainda não está disponível. Estamos trabalhando para disponibilizá-lo em breve!
          </p>

          {/* Badge de interesse */}
          <div className="bg-teal-50 rounded-full px-4 py-2 inline-flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-teal-700 text-xs sm:text-sm font-medium">Seu interesse foi registrado!</span>
          </div>

          {/* Botão */}
          <button
            onClick={onClose}
            className="w-full py-3 sm:py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base rounded-full transition-all duration-300 active:scale-95 shadow-lg"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
