'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Star, Check, Timer } from 'lucide-react';
import Script from 'next/script';

/* 
  DOWNSELL PAGE - HYBRID
  Layout: Giant Clickable Card (First Fold)
  Theme: "Selected / Winner" (Confetti + Teal/Gold)
  Header: Red (Attention)
  Placeholder Price: R$ 9,90
  Placeholder ID: DOWNSELL_PAYT_ID (User must update)
*/

export default function DownsellPage() {
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Trigger Confetti on Load (300 particles)
        const triggerConfetti = () => {
            // @ts-ignore
            if (window.confetti) {
                // @ts-ignore
                window.confetti({
                    particleCount: 300,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#14b8a6', '#f59e0b', '#ec4899', '#ffffff'] // Teal, Gold, Pink, White
                });
            }
        };

        setTimeout(triggerConfetti, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pb-20 overflow-x-hidden">
            {/* Payt One-Click Script */}
            {/* Payt One-Click Script - Changed to afterInteractive */}
            <Script src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js" strategy="afterInteractive" />

            {/* Confetti Script */}
            <Script
                src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    // @ts-ignore
                    if (window.confetti) {
                        // @ts-ignore
                        window.confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
                    }
                }}
            />

            {/* HIDDEN SELECT - USER MUST UPDATE DATA-OBJECT */}


            {/* 1. COMPACT STICKY HEADER (Red Background) */}
            <div className="bg-red-600 sticky top-0 z-50 text-white shadow-lg border-b border-red-500">
                <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold animate-pulse text-xs sm:text-sm">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
                        <span className="uppercase tracking-widest">Você foi selecionada!</span>
                    </div>
                    <div className="font-mono text-lg font-bold bg-black/20 px-2 py-0.5 rounded text-white">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-6 pb-8 max-w-lg flex flex-col items-center">

                {/* 2. SUPER COMPACT HOOK (Teal/Selected Theme) */}
                <h1 className="text-2xl sm:text-3xl font-black text-center mb-6 uppercase leading-tight text-gray-800">
                    <span className="text-teal-600">Parabéns!</span> Hoje é o<br />
                    seu dia de sorte.
                </h1>

                {/* Payt Standard Snippet */}
                <div style={{ textAlign: 'center' }}>
                    <a href="#" {...{ 'payt_action': 'oneclick_buy' } as any} data-object="LGZAK4-RB359G" style={{ background: 'rgb(40, 167, 69)', color: 'rgb(255, 255, 255)', padding: '5px', textDecoration: 'none', fontSize: '16px', fontFamily: 'sans-serif', borderRadius: '0px', display: 'block', margin: '10px auto', width: 'max-content' }}> Comprar </a>
                    <select {...{ 'payt_element': 'installment' } as any} style={{ display: 'none' }} data-object='LGZAK4-RB359G'></select>
                    <script type="text/javascript" src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js"></script>
                </div>

                {/* 4. DECLINE LINK (Outside the card) */}
                <button
                    onClick={() => window.location.href = 'https://flylabs.com.br/obrigado/'}
                    className="mt-8 text-gray-400 text-xs sm:text-sm hover:text-gray-600 underline transition-colors"
                >
                    Não, eu prefiro continuar sem resultados
                </button>

                {/* 5. SECURITY FOOTER */}
                <div className="mt-8 flex items-center gap-2 text-gray-300 text-xs uppercase font-bold tracking-widest">
                    <Lock className="w-3 h-3" />
                    Ambiente Seguro & Criptografado
                </div>

            </div>
        </div>
    );
}
