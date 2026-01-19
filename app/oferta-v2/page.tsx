'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, ArrowRight, Check, Lock, Star, AlertTriangle, Syringe, Brain, Leaf, Flame, Activity } from 'lucide-react';
import { pageview, trackQuizV3CheckoutView, trackQuizV3PurchaseIntent, trackQuizV3FreeTrialStart } from '@/lib/analytics';

interface UserData {
    name?: string;
    email?: string;
    weight?: number;
    height?: number;
    targetWeight?: number;
    couponCode?: string;
}

import Script from 'next/script';

// ... (imports remain the same, verify lines)

export default function OfertaPageV2() {
    const router = useRouter();
    // Standalone: Default static data to simulate a persistent user state
    const [userData, setUserData] = useState<UserData>({
        name: 'Visitante',
        email: '',
        weight: 82,    // Static example: 82kg
        height: 165,   // Static example: 165cm
        targetWeight: 68 // Static example: 68kg
    });

    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [openFaq, setOpenFaq] = useState<number | null>(null); // Nenhum FAQ aberto por padrão
    const [couponCode, setCouponCode] = useState<string>('VISITANTE50'); // Default coupon

    useEffect(() => {
        // Track page view
        pageview('/oferta-v2');
        // Using checkout tracking events since it's practically a checkout page
        trackQuizV3CheckoutView();

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const faqs = [
        {
            question: "O que acontece depois que eu faço o pedido?",
            answer: "Após você fazer seu pedido, começamos a trabalhar! Com base nas respostas que você deu no questionário, criaremos um programa personalizado de acordo com suas necessidades.",
        },
        {
            question: "Como posso cancelar minha assinatura?",
            answer: "Os cancelamentos são tratados diretamente com a Payt e podem ser solicitados seguindo as instruções aqui. Caso ainda tenha alguma dúvida sobre como cancelar sua assinatura, entre em contato conosco pelo e-mail suporte@soulsync.com.",
        },
        {
            question: "É seguro usar a auto-hipnose?",
            answer: "A auto-hipnoterapia é um procedimento completamente seguro.",
        },
        {
            question: "O que acontece se eu adormecer durante a sessão?",
            answer: "É perfeitamente normal e seguro adormecer durante uma sessão de hipnose. Na verdade, isso comprova que você entrou em uma fase de relaxamento profundo, na qual a hipnose é mais eficaz. Caso isso aconteça com você e você queira rever sua sessão de sono, poderá fazê-lo selecionando o dia anterior no aplicativo SoulSync.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Payt One-Click Script */}
            {/* Payt One-Click Script - Changed to lazyOnload to ensure DOM is ready */}
            <Script src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js" strategy="lazyOnload" />
            <select {...{ 'payt_element': 'installment' } as any} style={{ display: 'none' }} data-object="R2G93R-RB359G"></select>

            {/* 1. STICKY HEADER (Warning + Nav) */}
            <div className="bg-[#8B0000] sticky top-0 z-50 border-b border-white/10 shadow-lg">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="relative bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Timer className="w-4 h-4 text-white animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-white/80 text-[10px] uppercase tracking-wider font-semibold">Oferta expira em</p>
                                    <div className="text-lg font-bold text-white font-mono leading-none">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Message - Centered */}
                    <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <p>
                            <span className="text-yellow-400 font-bold">AVISO:</span> Não feche nem atualize esta página!
                        </p>
                    </div>

                    {/* Payt Premium Snippet */}
                    {/* Payt Premium Snippet - Raw HTML Injection to bypass React Event System */}
                    <div
                        style={{ textAlign: 'center' }}
                        dangerouslySetInnerHTML={{
                            __html: `
                            <a
                                href="#"
                                payt_action="oneclick_buy"
                                data-object="R2G93R-RB359G"
                                style="
                                    background: linear-gradient(135deg, #28a745, #1e7e34);
                                    color: #ffffff;
                                    padding: 18px 36px;
                                    text-decoration: none;
                                    font-size: 26px;
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-weight: bold;
                                    border-radius: 999px;
                                    display: inline-block;
                                    margin: 20px auto;
                                    box-shadow: 0 8px 20px rgba(40, 167, 69, 0.45);
                                    transition: all 0.25s ease;
                                    letter-spacing: 0.5px;
                                    cursor: pointer;
                                "
                                onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 12px 28px rgba(40, 167, 69, 0.6)';"
                                onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.45)';"
                            >
                                ✅ COMPRAR AGORA
                            </a>
                            <select payt_element="installment" style="display: none;" data-object="R2G93R-RB359G"></select>
                        `
                        }}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">

                {/* 2. HERO SECTION */}
                <div className="text-center mb-10">
                    <div className="inline-block bg-teal-50 border border-teal-100 px-4 py-1.5 rounded-full text-sm font-semibold text-teal-700 mb-6 shadow-sm">
                        🔥 Oferta Exclusiva por Tempo Limitado
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                        Aumente seus níveis de <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                            GLP-1 e GIP naturalmente
                        </span>
                        <br />com o poder da sua mente.
                    </h1>

                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
                        O método científico para <span className="text-gray-900 font-bold">emagrecer sem remédios</span>, sem cirurgias e sem dietas restritivas.
                    </p>

                    {/* Hero Image - Simple Quiz Style */}
                    <div className="relative w-full max-w-2xl mx-auto mb-10">
                        <div className="aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
                            <img
                                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763515318/soulsync/hero/woman-headphones.jpg"
                                alt="Mulher relaxada com fones de ouvido"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Hero CTA with Price Anchor */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-teal-500 max-w-lg mx-auto relative transform hover:scale-[1.02] transition-transform">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full text-sm shadow-md">
                            MELHOR PREÇO: R$ 0,50/DIA
                        </div>

                        <div className="flex items-center justify-between mb-6 mt-4 px-2">
                            <div className="text-left">
                                <div className="font-extrabold text-gray-900 text-xl mb-1">4 SEMANAS</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400 line-through">R$ 99,90</span>
                                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">R$ 14,97</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-extrabold text-gray-900 leading-none tracking-tight">R$ 0,50</div>
                                <div className="text-sm text-gray-500 font-medium">por dia</div>
                            </div>
                        </div>

                        <div className="bg-teal-50/50 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-teal-800 font-medium mb-6 border border-teal-100">
                            <span className="text-lg">🎁</span>
                            Receba um presente surpresa!
                        </div>

                        {/* Payt Standard Snippet */}
                        {/* Payt Premium Snippet */}
                        {/* Payt Premium Snippet - Raw HTML Injection to bypass React Event System */}
                        <div
                            style={{ textAlign: 'center' }}
                            dangerouslySetInnerHTML={{
                                __html: `
                                <a
                                    href="#"
                                    payt_action="oneclick_buy"
                                    data-object="R2G93R-RB359G"
                                    style="
                                        background: linear-gradient(135deg, #28a745, #1e7e34);
                                        color: #ffffff;
                                        padding: 18px 36px;
                                        text-decoration: none;
                                        font-size: 26px;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-weight: bold;
                                        border-radius: 999px;
                                        display: inline-block;
                                        margin: 20px auto;
                                        box-shadow: 0 8px 20px rgba(40, 167, 69, 0.45);
                                        transition: all 0.25s ease;
                                        letter-spacing: 0.5px;
                                        cursor: pointer;
                                    "
                                    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 12px 28px rgba(40, 167, 69, 0.6)';"
                                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.45)';"
                                >
                                    ✅ COMPRAR AGORA
                                </a>
                                <select payt_element="installment" style="display: none;" data-object="R2G93R-RB359G"></select>
                            `
                            }}
                        />
                        <div className="mt-3 text-center">
                            <a href="/oferta-v2/downsell" className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors opacity-70 hover:opacity-100">
                                Não, obrigado. Prefiro continuar sem resultados garantidos.
                            </a>
                        </div>
                    </div>
                </div>



                {/* 4. FUTURE PACING (New Section) */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Em apenas <span className="text-teal-600 underline decoration-teal-300 decoration-4">4 semanas</span> você vai...
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                                <Check className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Recuperar o Controle</h3>
                            <p className="text-gray-600 text-sm">Não sentir mais aquela ansiedade incontrolável por doces ou comida nos momentos de estresse.</p>
                        </div>
                        <div className="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Desinchar Naturalmente</h3>
                            <p className="text-gray-600 text-sm">Sentir suas roupas ficando mais largas à medida que seu corpo elimina a retenção e inflamação.</p>
                        </div>
                        <div className="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                                <Star className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Se Amar no Espelho</h3>
                            <p className="text-gray-600 text-sm">Voltar a usar biquínis e roupas justas sem medo de julgamentos ou vergonha do próprio corpo.</p>
                        </div>
                        <div className="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                                <Brain className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Reprogramar sua Mente</h3>
                            <p className="text-gray-600 text-sm">Transformar sua relação com a comida, tornando o emagrecimento algo automático e sem esforço.</p>
                        </div>
                    </div>
                </div>

                {/* 5. PROBLEM & SCIENCE (GLP-1 Section) */}
                <div className="bg-white rounded-3xl p-8 mb-16 shadow-xl border border-teal-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-full opacity-50 z-0 pointer-events-none"></div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center relative z-10">
                        Ative sua <span className="text-teal-600">produção natural</span> de GLP-1 e GIP
                    </h2>

                    <div className="space-y-8 relative z-10">
                        {/* 1. The Real Mechanism (Hypnosis -> Vagus Nerve -> Hormones) */}
                        <div className="flex gap-4">
                            <div className="mt-1 flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <Brain className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Sua mente controla seus hormônios
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-3">
                                    A hipnose clínica ativa o nervo vago, enviando sinais diretos do hipotálamo para o intestino. Isso "liga" a produção natural de GLP-1 e PYY (saciedade) sem precisar de agulhas.
                                </p>
                                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-800">
                                    <span>📚 ESTUDO:</span> Journal of Integrative Medicine (2021)
                                </div>
                            </div>
                        </div>

                        {/* 2. Comparing with Injections */}
                        <div className="flex gap-4">
                            <div className="mt-1 flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <Leaf className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Mesmo efeito, zero efeitos colaterais
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-3">
                                    Enquanto as injeções inundam seu corpo com hormônios sintéticos (causando náusea e perda muscular), a hipnose apenas estimula o que seu corpo já foi feito para produzir.
                                </p>
                                <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-xs font-semibold text-green-800">
                                    <span>✅ BENEFÍCIO:</span> 100% Natural e Seguro
                                </div>
                            </div>
                        </div>

                        {/* Comparação Final */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-center text-lg">Escolha como ativar seu metabolismo:</h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm opacity-75">
                                    <div className="text-red-500 font-bold mb-1 text-sm uppercase tracking-wide">Injeções (Ozempic/Wegovy)</div>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>❌ Sintético e químico</li>
                                        <li>❌ R$ 1.000+ por mês</li>
                                        <li>❌ Efeito rebote garantido</li>
                                    </ul>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 shadow-md transform scale-[1.02]">
                                    <div className="text-teal-600 font-bold mb-1 text-sm uppercase tracking-wide">Hipnoterapia SoulSync</div>
                                    <ul className="text-sm text-gray-700 font-medium space-y-1">
                                        <li>✅ Produção biológica natural</li>
                                        <li>✅ Custo único de R$ 14,97</li>
                                        <li>✅ Resultados definitivos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. METHODOLOGY (The 3 Pillars) */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                        O Protocolo SoulSync: <br /> <span className="text-teal-600">3 Passos para o Sucesso</span>
                    </h2>

                    <div className="space-y-6">
                        {/* Passo 1 */}
                        <div className="bg-white border-l-4 border-teal-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-700">1</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Desbloqueio Mental</h3>
                                <p className="text-gray-600">Sessões de áudio que eliminam a causa raiz da compulsão e reprogramam seu cérebro para rejeitar excessos naturalmente.</p>
                            </div>
                        </div>
                        {/* Passo 2 */}
                        <div className="bg-white border-l-4 border-teal-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-700">2</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Ativação GLP-1</h3>
                                <p className="text-gray-600">Técnicas de visualização avançada que estimulam o hipotálamo a produzir hormonios de saciedade sem precisar de remédios.</p>
                            </div>
                        </div>
                        {/* Passo 3 */}
                        <div className="bg-white border-l-4 border-teal-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-700">3</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aceleração Metabólica</h3>
                                <p className="text-gray-600">Combinado com nosso "Acelerador de 7 Dias" (bônus), você verá resultados visíveis já na primeira semana de aplicação.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. VALUE STACK & BONUSES */}
                {/* Benefícios Detalhados (Copied from V3 Checkout) */}
                <div className="bg-white rounded-3xl p-8 mb-16 shadow-xl border border-teal-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        O que você recebe
                    </h2>
                    <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
                        Baseado nas suas respostas, criamos um plano personalizado de hipnoterapia especialmente para você.
                        O programa define objetivos individuais e um programa adaptado para alcançar seus resultados nas primeiras semanas.
                    </p>

                    <div className="space-y-8 max-w-3xl mx-auto">
                        {/* Item 1 - Sessões (Plano Personalizado) */}
                        <div className="flex items-start gap-4">
                            {/* Icon Desktop */}
                            <div className="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                                    Valor: <span className="line-through text-teal-600/70">R$ 67,00</span>
                                </div>

                                {/* Mobile Header */}
                                <div className="flex items-start gap-3 mb-2 sm:block">
                                    <div className="sm:hidden w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div className="text-gray-900 font-bold text-lg sm:text-xl pr-0 sm:pr-20 leading-tight">
                                        Sessões de hipnose personalizadas
                                    </div>
                                </div>

                                <div className="text-teal-600 font-medium mb-3 border-b border-gray-200 pb-2 inline-block text-sm sm:text-base">
                                    Baseadas nas suas dores e objetivos
                                </div>
                                <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                        <span>30+ sessões de áudio (15-25 min cada)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                        <span>Técnicas de visualização avançada</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Item 2 - Reprogramação */}
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative">
                                <div className="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                                    Valor: <span className="line-through text-teal-600/70">R$ 37,00</span>
                                </div>

                                <div className="flex items-start gap-3 mb-2 sm:block">
                                    <div className="sm:hidden w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div className="text-gray-900 font-bold text-lg sm:text-xl leading-tight">
                                        Reprogramação mental profunda
                                    </div>
                                </div>

                                <div className="text-teal-600 font-medium mb-3 border-b border-gray-200 pb-2 inline-block text-sm sm:text-base">
                                    Elimine a causa raiz do problema
                                </div>
                                <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                        <span>Sugestões pós-hipnóticas poderosas</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                        <span>Elimine desejos incontroláveis</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Item 3 - Meditações (Acesso Vitalício) */}
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                                    Valor: <span className="line-through text-teal-600/70">R$ 27,00</span>
                                </div>

                                <div className="flex items-start gap-3 mb-2 sm:block">
                                    <div className="sm:hidden w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div className="text-gray-900 font-bold text-lg sm:text-xl pr-0 sm:pr-20 leading-tight">
                                        Meditações anti-ansiedade
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                    15+ meditações guiadas para controlar a ansiedade e o estresse que levam à compulsão alimentar
                                </p>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                                    Valor: <span className="line-through text-teal-600/70">R$ 17,00</span>
                                </div>

                                <div className="flex items-start gap-3 mb-2 sm:block">
                                    <div className="sm:hidden w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div className="text-gray-900 font-bold text-lg sm:text-xl leading-tight">
                                        Técnicas de autocontrole
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                    Protocolo de 60 segundos para usar em momentos de desejo incontrolável
                                </p>
                            </div>
                        </div>

                        {/* Item 5 - Progresso */}
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                                    Valor: <span className="line-through text-teal-600/70">R$ 17,00</span>
                                </div>

                                <div className="flex items-start gap-3 mb-2 sm:block">
                                    <div className="sm:hidden w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div className="text-gray-900 font-bold text-lg sm:text-xl leading-tight">
                                        Acompanhamento de progresso
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                    Gráficos visuais e celebração de marcos para manter a motivação
                                </p>
                            </div>
                        </div>


                    </div>

                    {/* Bônus Inside Features with Price */}
                    <div className="mt-10 bg-gradient-to-br from-teal-600 to-indigo-600 rounded-2xl p-6 text-white text-center sm:text-left sm:flex items-center gap-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-white/10">
                            Valor: <span className="line-through">R$ 47,00</span>
                        </div>
                        <div className="text-4xl mb-4 sm:mb-0 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 shrink-0">
                            🎁
                        </div>
                        <div>
                            <h4 className="border-b border-white/20 pb-1 mb-1 inline-block text-teal-100 text-sm font-semibold uppercase tracking-wider">Bônus Exclusivo</h4>
                            <h3 className="font-bold text-xl mb-1">Acelerador Mental de 7 Dias</h3>
                            <p className="text-teal-100 text-sm mb-2">Protocolo intensivo para iniciar sua transformação com resultados visíveis.</p>
                            <p className="text-white/90 text-sm font-medium">Grátuito com seu plano hoje.</p>
                        </div>
                    </div>


                    {/* FINAL PRICE & CTA (Simplified) */}
                    <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-white shadow-2xl border border-gray-800 text-center">
                        <p className="text-teal-400 text-sm sm:text-base uppercase tracking-widest mb-4 font-bold">VALOR TOTAL: <span className="line-through text-teal-600/60">R$ 229,00</span></p>

                        <div className="flex flex-col items-center justify-center mb-6">
                            <span className="text-white/80 text-lg font-medium mb-1">Somente hoje por:</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl sm:text-7xl font-extrabold text-white tracking-tighter">R$ 14,97</span>
                            </div>
                            <span className="text-gray-400 text-sm mt-2">Plano de 4 Semanas. Cancele quando quiser.</span>
                        </div>

                        {/* Payt Standard Snippet */}
                        {/* Payt Premium Snippet */}
                        {/* Payt Premium Snippet - Raw HTML Injection to bypass React Event System */}
                        <div
                            style={{ textAlign: 'center' }}
                            dangerouslySetInnerHTML={{
                                __html: `
                                <a
                                    href="#"
                                    payt_action="oneclick_buy"
                                    data-object="R2G93R-RB359G"
                                    style="
                                        background: linear-gradient(135deg, #28a745, #1e7e34);
                                        color: #ffffff;
                                        padding: 18px 36px;
                                        text-decoration: none;
                                        font-size: 26px;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-weight: bold;
                                        border-radius: 999px;
                                        display: inline-block;
                                        margin: 20px auto;
                                        box-shadow: 0 8px 20px rgba(40, 167, 69, 0.45);
                                        transition: all 0.25s ease;
                                        letter-spacing: 0.5px;
                                        cursor: pointer;
                                    "
                                    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 12px 28px rgba(40, 167, 69, 0.6)';"
                                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.45)';"
                                >
                                    ✅ COMPRAR AGORA
                                </a>
                                <select payt_element="installment" style="display: none;" data-object="R2G93R-RB359G"></select>
                            `
                            }}
                        />

                        <div className="mt-4 text-center">
                            <a href="/oferta-v2/downsell" className="text-xs text-gray-400 hover:text-gray-300 underline transition-colors opacity-60 hover:opacity-100">
                                Não, obrigado. Eu prefiro pagar o preço total depois.
                            </a>
                        </div>

                        <div className="flex justify-center gap-4 mt-6 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra 100% Segura</span>
                            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Garantia de 30 Dias</span>
                        </div>
                    </div>
                </div>

                {/* 8. AUTHORITHY & FAQ (Existing) */}

                {/* Bloco de Autoridade */}
                <div className="text-center mb-12">
                    <p className="text-base sm:text-lg font-bold text-gray-400 uppercase tracking-widest mb-6">Conforme apresentado em</p>
                    <img
                        src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763608547/soulsync/authority/featured-in-logos.png"
                        alt="Media Logos"
                        className="h-14 sm:h-20 object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Depoimentos */}
                <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-3xl p-8 mb-8 shadow-xl border border-teal-100">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex text-yellow-400 text-xl">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-gray-900 font-bold">4.6/5</span>
                            <span className="text-gray-500 text-sm">(mais de 1000 avaliações)</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Por que <span className="text-teal-600">os usuários</span>
                        </h2>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            adoram o <span className="text-teal-600">SoulSync?</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Depoimento 1 */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                                    <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609993/soulsync/testimonials/testimonial-1.webp" alt="Jasmim Z." className="w-full h-auto" />
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                                    <div className="text-gray-400 text-sm">27 de junho</div>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">SoulSync transformou meu corpo de maneiras que eu jamais imaginei. Recomendo para todas as mulheres que buscam algo diferente e que realmente funciona!</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-900 font-bold">Jasmim Z.</p>
                                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                        <Check className="w-3 h-3" /> VERIFICADO
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Depoimento 2 */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                                    <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609994/soulsync/testimonials/testimonial-2.webp" alt="José S." className="w-full h-auto" />
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                                    <div className="text-gray-400 text-sm">24 de junho</div>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">Finalmente parei de comer compulsivamente e comecei a me exercitar. SoulSync foi a única coisa que funcionou para mim.</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-900 font-bold">José S.</p>
                                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                        <Check className="w-3 h-3" /> VERIFICADO
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Depoimento 3 */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                                    <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609995/soulsync/testimonials/testimonial-3.webp" alt="Simona K." className="w-full h-auto" />
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                                    <div className="text-gray-400 text-sm">19 de junho</div>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">Experiência fenomenal. O aplicativo SoulSync é o principal motivo da minha mudança. Ser saudável agora é muito fácil, acontece naturalmente.</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-900 font-bold">Simona K.</p>
                                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                        <Check className="w-3 h-3" /> VERIFICADO
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        {/* Payt Standard Snippet */}
                        {/* Payt Premium Snippet - Raw HTML Injection to bypass React Event System */}
                        <div
                            style={{ textAlign: 'center' }}
                            dangerouslySetInnerHTML={{
                                __html: `
                                <a
                                    href="#"
                                    payt_action="oneclick_buy"
                                    data-object="R2G93R-RB359G"
                                    style="
                                        background: linear-gradient(135deg, #28a745, #1e7e34);
                                        color: #ffffff;
                                        padding: 18px 36px;
                                        text-decoration: none;
                                        font-size: 26px;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-weight: bold;
                                        border-radius: 999px;
                                        display: inline-block;
                                        margin: 20px auto;
                                        box-shadow: 0 8px 20px rgba(40, 167, 69, 0.45);
                                        transition: all 0.25s ease;
                                        letter-spacing: 0.5px;
                                        cursor: pointer;
                                    "
                                    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 12px 28px rgba(40, 167, 69, 0.6)';"
                                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.45)';"
                                >
                                    ✅ COMPRAR AGORA
                                </a>
                                <select payt_element="installment" style="display: none;" data-object="R2G93R-RB359G"></select>
                            `
                            }}
                        />
                        <div className="mt-3 text-center">
                            <a href="/oferta-v2/downsell" className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors opacity-70 hover:opacity-100">
                                Não, obrigado.
                            </a>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Perguntas Frequentes</h3>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full text-left px-6 py-5 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-lg">{faq.question}</span>
                                    <span className={`text-teal-600 text-2xl transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card de Garantia de 30 Dias (Bottom) */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 mb-8 border border-gray-200 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                        <div className="flex-shrink-0 order-first sm:order-last">
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                                <img
                                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768476408/soulsync/seals/garantia-30-dias.png"
                                    alt="Selo de Garantia 30 dias"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Garantia Incondicional
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                                Se você não tiver resultados visíveis em 30 dias, nós devolvemos 100% do seu dinheiro. Sem perguntas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mb-12 text-center">
                    {/* Payt Premium Snippet */}
                    <div style={{ textAlign: 'center' }}>
                        <a
                            href="#"
                            {...({ payt_action: 'oneclick_buy' } as any)}
                            data-object="R2G93R-RB359G"
                            style={{
                                background: 'linear-gradient(135deg, #28a745, #1e7e34)',
                                color: '#ffffff',
                                padding: '18px 36px',
                                textDecoration: 'none',
                                fontSize: '26px',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontWeight: 'bold',
                                borderRadius: '999px',
                                display: 'inline-block',
                                margin: '20px auto',
                                boxShadow: '0 8px 20px rgba(40, 167, 69, 0.45)',
                                transition: 'all 0.25s ease',
                                letterSpacing: '0.5px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 12px 28px rgba(40, 167, 69, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.45)';
                            }}
                        >
                            ✅ COMPRAR AGORA
                        </a>

                        <select
                            {...({ payt_element: 'installment' } as any)}
                            style={{ display: 'none' }}
                            data-object="R2G93R-RB359G"
                        ></select>

                        <script
                            type="text/javascript"
                            src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js"
                        ></script>
                    </div>

                    <div className="mt-3 text-center">
                        <a href="/oferta-v2/downsell" className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors opacity-70 hover:opacity-100">
                            Não, obrigado. Eu aceito perder essa oportunidade única.
                        </a>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">Compra 100% Segura e Instantânea</p>
                </div>

            </div>
        </div>
    );
}
