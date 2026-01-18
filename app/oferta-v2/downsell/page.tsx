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
            <Script src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js" strategy="lazyOnload" />

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
            <select {...{ 'payt_element': 'installment' } as any} style={{ display: 'none' }} data-object="LGZAK4-RB359G"></select>

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

                {/* 3. THE GIANT CLICKABLE CARD */}
                {/* Wrapped in 'a' tag for full clickability */}
                <a
                    href="#"
                    {...{ 'payt_action': 'oneclick_buy' } as any}
                    data-object="LGZAK4-RB359G"
                    className="group w-full block relative"
                >
                    {/* Card Container (Teal Border) */}
                    <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 border-4 border-teal-400 transform transition-transform group-hover:scale-[1.02] shadow-2xl relative overflow-hidden ring-4 ring-teal-50">

                        {/* Confetti Background Effect (CSS) */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#14b8a6 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                        {/* Discount Badge */}
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-sm z-10">
                            Desconto Aprovado
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col items-center text-center">

                            <div className="bg-teal-100 text-teal-700 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest mb-4 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Oportunidade Única
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 leading-none">
                                SoulSync <span className="text-teal-600">Lite</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase text-xs mb-6">
                                Sessões de Hipnose + Reprogramação
                            </p>

                            {/* Price Block */}
                            <div className="flex items-center gap-3 mb-6 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 w-full justify-center">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400 font-bold uppercase">De:</span>
                                    <span className="text-gray-400 line-through text-sm font-bold">R$ 14,97</span>
                                </div>
                                <div className="w-px h-8 bg-gray-200"></div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-teal-600 font-bold uppercase">Por apenas:</span>
                                    <span className="text-4xl font-black text-teal-600 leading-none">R$ 7,90</span>
                                </div>
                            </div>

                            {/* Fake Button Look */}
                            <div className="w-full bg-teal-600 text-white py-4 rounded-xl font-black text-xl uppercase tracking-wide shadow-lg group-hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 animate-bounce-slow">
                                Resgatar Oferta Agora
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            <p className="mt-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                Clique para ativar o desconto
                            </p>

                        </div>
                    </div>
                </a>

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
