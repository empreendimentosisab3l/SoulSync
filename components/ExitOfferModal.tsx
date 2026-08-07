'use client';

interface ExitOfferModalProps {
  open: boolean;
  accepting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ExitOfferModal({ open, accepting, onAccept, onDecline }: ExitOfferModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          Espera! 🎁 Oferta exclusiva de saída
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Seu plano personalizado já está pronto. Comece hoje por apenas
        </p>
        <div className="mb-4">
          <div className="text-sm text-gray-500 line-through">R$ 4,90</div>
          <div className="text-5xl font-extrabold text-teal-600">R$ 1,00</div>
        </div>
        <button
          onClick={onAccept}
          disabled={accepting}
          className="w-full bg-teal-600 text-white py-4 rounded-full text-lg font-bold hover:bg-teal-700 active:scale-95 transition-all shadow-lg disabled:opacity-60"
        >
          {accepting ? 'Aguarde...' : 'QUERO POR R$ 1,00'}
        </button>
        <p className="text-[6px] leading-tight text-gray-200 mt-2">
          Depois de 3 dias, R$ 39,90/mês. Cancele quando quiser.
        </p>
        <button
          onClick={onDecline}
          className="mt-4 text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          Não, obrigado
        </button>
      </div>
    </div>
  );
}
