'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Tracking do Mautic (flynow) para saber em qual etapa do quiz o contato parou.
 *
 * O snippet oficial dispara `pageview` só uma vez, no carregamento. Como o quiz
 * troca de etapa por navegação SPA (client-side), sem recarregar a página, a
 * primeira pageview cobriria apenas a etapa de entrada. Por isso, além do snippet,
 * disparamos um `pageview` a cada troca de rota — assim o Mautic registra a última
 * etapa que a pessoa alcançou (/quiz-v3/1 ... /quiz-v3/23).
 */
export default function MauticTracking() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // A pageview inicial é disparada pelo snippet inline (no carregamento).
    // Aqui tratamos apenas as trocas de etapa (navegação SPA).
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    const mt = (window as unknown as { mt?: (...args: unknown[]) => void }).mt;
    if (typeof mt !== 'function') return;
    try {
      mt('send', 'pageview', { url: window.location.href });
    } catch {
      /* nunca quebra a página por causa de tracking */
    }
  }, [pathname]);

  return (
    <Script
      id="mautic-tracking"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
            w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
            m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://backmtc3.flynow.digitalemaileld.com/mtc.js','mt');

          mt('send', 'pageview');
        `,
      }}
    />
  );
}
