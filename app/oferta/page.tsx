'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, Lock, Timer, ArrowRight, Play } from 'lucide-react';

export default function SalesPage() {
    const router = useRouter();

    const handleCheckout = () => {
        // Direct link to PayT checkout (R$ 14,97)
        window.location.href = 'https://checkout.payt.com.br/32addda23f51e6c2b5607e9d1b66a366';
    };

    const faqs = [
        {
            question: "Principais dúvidas sobre o SoulSync",
            answer: "O SoulSync é um programa de reprogramação mental baseado em neurociência. Diferente de dietas que focam apenas no que você come, nós focamos em tratar a causa raiz: a ansiedade, os hábitos automáticos e a relação emocional com a comida."
        },
        {
            question: "Como funciona na prática?",
            answer: "Você receberá acesso ao nosso aplicativo com sessões diárias de áudio (15-20 min). Basta ouvir uma vez por dia, preferencialmente antes de dormir. O método trabalha seu subconsciente para reduzir a vontade de doces e comer por ansiedade."
        },
        {
            question: "E se não funcionar para mim?",
            answer: "Você tem 30 dias de garantia incondicional. Se não sentir mudanças na sua relação com a comida, nós devolvemos 100% do seu dinheiro. O risco é todo nosso."
        },
        {
            question: "Preciso fazer dieta junto?",
            answer: "Não é obrigatório. O objetivo do SoulSync é fazer com que você faça escolhas saudáveis naturalmente, sem sofrimento. Muitos usuários relatam perder interesse por 'besteiras' logo na primeira semana."
        }
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* 1. HERO SECTION */}
            <header className="bg-[#0f172a] text-white pt-10 pb-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
                    <div className="inline-block bg-teal-900/50 border border-teal-500/30 text-teal-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                        ✨ Nova Descoberta da Neurociência
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Reprograme sua mente para <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                            emagrecer em 4 semanas
                        </span>
                        <br />sem dietas restritivas.
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Elimine a ansiedade e a compulsão alimentar na raiz. <br />
                        Basta ouvir 15 minutos por dia.
                    </p>

                    {/* VSL Placeholder / Hero Image */}
                    <div className="relative aspect-video max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 mb-10 flex items-center justify-center group cursor-pointer overflow-hidden">
                        {/* Image representing the app interface */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                        <img
                            src="/images/checkout-hero-bg.jpg" // Placeholder path, browser will ignore if missing, showing color
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x675/1e293b/white?text=Apresenta%C3%A7%C3%A3o+do+M%C3%A9todo+SoulSync'; }}
                        />

                        {/* Play Button */}
                        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center pl-1 shadow-lg shadow-teal-500/20 z-20 group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white fill-current" />
                        </div>

                        <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
                            <p className="text-sm font-medium text-gray-300">Assista ao vídeo explicativo (2min)</p>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full sm:w-auto bg-teal-500 text-white px-8 py-5 rounded-full font-bold text-xl shadow-lg shadow-teal-500/25 hover:bg-teal-400 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto"
                    >
                        QUERO REPROGRAMAR MINHA MENTE
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                        <span>4.9/5 baseado em 12.400+ alunas</span>
                    </div>
                </div>
            </header>

            {/* 2. THE PROBLEM (Agitation) */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                        Por que 95% das dietas falham?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mb-4">🚫</div>
                            <h3 className="font-bold text-xl mb-3">Fome Emocional</h3>
                            <p className="text-gray-600">Você come não por fome, mas para aliviar o estresse, a tristeza ou o tédio. Nenhuma dieta resolve isso.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-4">🍩</div>
                            <h3 className="font-bold text-xl mb-3">Hábitos Automáticos</h3>
                            <p className="text-gray-600">Seu cérebro está programado para buscar açúcar e gordura. Lutar contra isso com "força de vontade" é exaustivo e insustentável.</p>
                        </div>
                    </div>

                    <div className="text-center p-8 bg-white rounded-3xl border-l-4 border-teal-500 shadow-lg">
                        <p className="text-xl font-medium text-gray-700 italic">
                            "Não adianta mudar o que está no seu prato se você não mudar o que está na sua mente."
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. THE SOLUTION (How it works) */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-teal-600 font-bold uppercase tracking-wider text-sm">O Método SoulSync</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-gray-900">
                            A Neurociência a seu favor
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3">1. Relaxamento Profundo</h3>
                            <p className="text-gray-600">Nossas sessões de áudio induzem um estado de onda cerebral Theta, onde sua mente subconsciente está mais receptiva.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3">2. Reprogramação</h3>
                            <p className="text-gray-600">Substituímos os padrões neurais de "comer por ansiedade" por novos caminhos de autocontrole e calma.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3">3. Resultados Naturais</h3>
                            <p className="text-gray-600">Você começa a rejeitar doces e excessos naturalmente, sem sentir que está se privando de nada.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SOCIAL PROOF (Static Transformation) */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Resultados Reais</h2>

                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden mb-12">
                        <div className="flex gap-2 mb-6 text-sm font-semibold">
                            <div className="flex-1 bg-gray-100 rounded-xl py-3 text-center text-gray-600">Antes</div>
                            <div className="flex-1 bg-teal-600 rounded-xl py-3 text-center text-white shadow-lg shadow-teal-600/20">Depois</div>
                        </div>

                        {/* Static Before/After Simulation */}
                        <div className="grid grid-cols-2 gap-8 px-4">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Peso</div>
                                    <div className="text-2xl font-bold text-gray-800">82 kg</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Ansiedade</div>
                                    <div className="flex gap-1 h-2"><div className="w-full bg-red-400 rounded-full"></div><div className="w-full bg-red-400 rounded-full"></div><div className="w-full bg-red-400 rounded-full"></div></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-teal-600 text-xs font-bold uppercase mb-1">Peso Atual</div>
                                    <div className="text-2xl font-bold text-teal-600">68 kg</div>
                                </div>
                                <div>
                                    <div className="text-teal-600 text-xs font-bold uppercase mb-1">Controle</div>
                                    <div className="flex gap-1 h-2"><div className="w-full bg-teal-500 rounded-full"></div><div className="w-full bg-teal-500 rounded-full"></div><div className="w-full bg-teal-500 rounded-full"></div></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center bg-teal-50 rounded-xl p-4">
                            <p className="text-teal-800 text-sm font-medium">"Eu tentei de tudo por 10 anos. O SoulSync foi a primeira coisa que me fez parar de pensar em comida o dia todo."</p>
                            <p className="text-teal-600 text-xs mt-2 font-bold uppercase">- Mariana S., 34 anos</p>
                        </div>
                    </div>

                    {/* Media Logos */}
                    <div className="text-center opacity-60 grayscale">
                        <p className="text-xs font-bold uppercase tracking-widest mb-4">Visto Em</p>
                        <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763608547/soulsync/authority/featured-in-logos.png" alt="Logos" className="h-10 mx-auto object-contain" />
                    </div>
                </div>
            </section>

            {/* 5. THE OFFER */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">O que você recebe hoje</h2>
                        <p className="text-gray-500">Acesso imediato ao aplicativo e todo o conteúdo</p>
                    </div>

                    <div className="bg-white rounded-3xl border-2 border-teal-600 shadow-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-teal-600 text-white px-6 py-2 rounded-bl-2xl font-bold uppercase text-sm">
                            Oferta Especial
                        </div>

                        <div className="space-y-6 mb-8 mt-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 mt-1"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h3 className="font-bold text-lg">App SoulSync Completo</h3>
                                    <p className="text-gray-500 text-sm">Acesso a todas as sessões de hipnose e meditações.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 mt-1"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Programa de 4 Semanas</h3>
                                    <p className="text-gray-500 text-sm">Cronograma passo a passo para seguir.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-1"><Check className="w-4 h-4" /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Bônus: Acelerador Mental</h3>
                                    <p className="text-gray-500 text-sm">Protocolo de emergência de 7 dias.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-gray-400 line-through text-lg font-medium">De R$ 99,90</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-5xl font-extrabold text-gray-900">R$ 14,97</p>
                                    <p className="text-gray-500 mb-2">/ pagamento único</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                GARANTIR ACESSO AGORA
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 uppercase font-bold tracking-wide">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra Segura</span>
                            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Acesso Imediato</span>
                        </div>
                    </div>

                    {/* Guarantee */}
                    <div className="mt-12 flex items-center gap-6 bg-gray-50 p-6 rounded-2xl">
                        <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768476408/soulsync/seals/garantia-30-dias.png" alt="Garantia" className="w-20 object-contain" />
                        <div>
                            <h3 className="font-bold text-lg">Garantia Blindada de 30 Dias</h3>
                            <p className="text-sm text-gray-600">Teste por 30 dias. Se não amar, devolvemos 100% do seu dinheiro. Sem perguntas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-2xl font-bold text-center mb-10">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-gray-800"
                                >
                                    {faq.question}
                                    <span className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100 text-center text-sm text-gray-400">
                <p className="mb-2">© 2024 SoulSync. Todos os direitos reservados.</p>
                <p>Este site não faz parte do site do Facebook ou Facebook Inc.</p>
            </footer>
        </div>
    );
}
