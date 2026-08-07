'use client';

import { useCallback, useEffect, useState } from 'react';

const FLAG = 'exitOfferShown';

/**
 * Detecta intenção de saída no checkout:
 * - Botão voltar (qualquer device): sentinela no history + popstate.
 * - Exit-intent (desktop): mouse saindo pelo topo da janela.
 * Mostra no máximo 1x por sessão (sessionStorage). Após dispensado,
 * a próxima ação de voltar navega de verdade (sem aprisionar).
 */
export function useExitIntent(): { showOffer: boolean; dismiss: () => void } {
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(FLAG)) return;

    // Sentinela: a primeira ação de "voltar" consome esta entrada
    history.pushState({ exitGuard: true }, '', window.location.href);

    const trigger = () => {
      if (sessionStorage.getItem(FLAG)) return;
      sessionStorage.setItem(FLAG, '1');
      setShowOffer(true);
    };

    const onPopState = () => {
      if (!sessionStorage.getItem(FLAG)) {
        // Re-arma a sentinela e mostra a oferta em vez de sair
        history.pushState({ exitGuard: true }, '', window.location.href);
        trigger();
      }
      // Já mostrado: não interfere — navegação segue normalmente
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    window.addEventListener('popstate', onPopState);
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const dismiss = useCallback(() => setShowOffer(false), []);

  return { showOffer, dismiss };
}
