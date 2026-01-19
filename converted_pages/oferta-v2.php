<?php
// Simple PHP Header
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Exclusiva GLP-1 | SoulSync</title>
    
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Inter', sans-serif; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        /* FAQ Transition */
        .faq-content.open { display: block; }
        .faq-icon.open { transform: rotate(180deg); }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 font-sans">

    <!-- Payt One-Click Script (Global) -->
    <script src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js" async></script>
    <select payt_element="installment" style="display: none;" data-object="R2G93R-RB359G"></select>

    <!-- 1. STICKY HEADER -->
    <div class="bg-[#8B0000] sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between relative">
            <div class="flex items-center gap-4">
                <div class="relative group">
                    <div class="relative bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2">
                        <div class="bg-white/20 p-1.5 rounded-lg">
                            <!-- Timer Icon -->
                            <svg class="w-4 h-4 text-white animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
                        </div>
                        <div>
                            <p class="text-white/80 text-[10px] uppercase tracking-wider font-semibold">Oferta expira em</p>
                            <div id="countdown-timer" class="text-lg font-bold text-white font-mono leading-none">15:00</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Warning Message -->
            <div class="hidden lg:flex items-center gap-2 text-sm font-medium text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg class="w-5 h-5 text-yellow-400 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <p>
                    <span class="text-yellow-400 font-bold">AVISO:</span> Não feche nem atualize esta página!
                </p>
            </div>

            <!-- Header CTA -->
            <div style="text-align: center;">
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
            </div>
        </div>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="container mx-auto px-4 py-8 max-w-4xl">

        <!-- 2. HERO SECTION -->
        <div class="text-center mb-10">
            <div class="inline-block bg-teal-50 border border-teal-100 px-4 py-1.5 rounded-full text-sm font-semibold text-teal-700 mb-6 shadow-sm">
                🔥 Oferta Exclusiva por Tempo Limitado
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                Aumente seus níveis de <br class="hidden sm:block" />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                    GLP-1 e GIP naturalmente
                </span>
                <br />com o poder da sua mente.
            </h1>

            <p class="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
                O método científico para <span class="text-gray-900 font-bold">emagrecer sem remédios</span>, sem cirurgias e sem dietas restritivas.
            </p>

            <!-- Hero Image -->
            <div class="relative w-full max-w-2xl mx-auto mb-10">
                <div class="aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
                    <img
                        src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763515318/soulsync/hero/woman-headphones.jpg"
                        alt="Mulher relaxada com fones de ouvido"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>

            <!-- Hero CTA Card -->
            <div class="bg-white p-6 rounded-3xl shadow-xl border-2 border-teal-500 max-w-lg mx-auto relative transform hover:scale-[1.02] transition-transform">
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full text-sm shadow-md">
                    MELHOR PREÇO: R$ 0,50/DIA
                </div>

                <div class="flex items-center justify-between mb-6 mt-4 px-2">
                    <div class="text-left">
                        <div class="font-extrabold text-gray-900 text-xl mb-1">4 SEMANAS</div>
                        <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-400 line-through">R$ 99,90</span>
                            <span class="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">R$ 14,97</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-4xl font-extrabold text-gray-900 leading-none tracking-tight">R$ 0,50</div>
                        <div class="text-sm text-gray-500 font-medium">por dia</div>
                    </div>
                </div>

                <div class="bg-teal-50/50 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-teal-800 font-medium mb-6 border border-teal-100">
                    <span class="text-lg">🎁</span>
                    Receba um presente surpresa!
                </div>

                <!-- Payt Snippet (Hero) -->
                <div style="text-align: center;">
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
                </div>

                <div class="mt-3 text-center">
                    <a href="downsell.php" class="text-xs text-gray-400 hover:text-gray-600 underline transition-colors opacity-70 hover:opacity-100">
                        Não, obrigado. Prefiro continuar sem resultados garantidos.
                    </a>
                </div>
            </div>
        </div>

        <!-- 4. FUTURE PACING -->
        <div class="mb-16">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                Em apenas <span class="text-teal-600 underline decoration-teal-300 decoration-4">4 semanas</span> você vai...
            </h2>

            <div class="grid sm:grid-cols-2 gap-4">
                <!-- 1 -->
                <div class="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Recuperar o Controle</h3>
                    <p class="text-gray-600 text-sm">Não sentir mais aquela ansiedade incontrolável por doces ou comida nos momentos de estresse.</p>
                </div>
                <!-- 2 -->
                <div class="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Desinchar Naturalmente</h3>
                    <p class="text-gray-600 text-sm">Sentir suas roupas ficando mais largas à medida que seu corpo elimina a retenção e inflamação.</p>
                </div>
                <!-- 3 -->
                <div class="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Se Amar no Espelho</h3>
                    <p class="text-gray-600 text-sm">Voltar a usar biquínis e roupas justas sem medo de julgamentos ou vergonha do próprio corpo.</p>
                </div>
                <!-- 4 -->
                <div class="bg-white border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Reprogramar sua Mente</h3>
                    <p class="text-gray-600 text-sm">Transformar sua relação com a comida, tornando o emagrecimento algo automático e sem esforço.</p>
                </div>
            </div>
        </div>

        <!-- 5. PROBLEM & SCIENCE -->
        <div class="bg-white rounded-3xl p-8 mb-16 shadow-xl border border-teal-100 relative overflow-hidden">
             <div class="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-full opacity-50 z-0 pointer-events-none"></div>
             <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center relative z-10">
                Ative sua <span class="text-teal-600">produção natural</span> de GLP-1 e GIP
            </h2>
            <div class="space-y-8 relative z-10">
                <!-- 1 -->
                <div class="flex gap-4">
                    <div class="mt-1 flex-shrink-0">
                        <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Sua mente controla seus hormônios</h3>
                        <p class="text-gray-600 leading-relaxed mb-3">A hipnose clínica ativa o nervo vago, enviando sinais diretos do hipotálamo para o intestino. Isso "liga" a produção natural de GLP-1 e PYY (saciedade) sem precisar de agulhas.</p>
                        <div class="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-800">
                             <span>📚 ESTUDO:</span> Journal of Integrative Medicine (2021)
                        </div>
                    </div>
                </div>
                <!-- 2 -->
                <div class="flex gap-4">
                     <div class="mt-1 flex-shrink-0">
                        <div class="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                        </div>
                     </div>
                     <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Mesmo efeito, zero efeitos colaterais</h3>
                        <p class="text-gray-600 leading-relaxed mb-3">Enquanto as injeções inundam seu corpo com hormônios sintéticos (causando náusea e perda muscular), a hipnose apenas estimula o que seu corpo já foi feito para produzir.</p>
                        <div class="bg-green-50 border border-green-100 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-xs font-semibold text-green-800">
                            <span>✅ BENEFÍCIO:</span> 100% Natural e Seguro
                        </div>
                     </div>
                </div>
            </div>
        </div>

        <!-- 6. METHODOLOGY -->
        <div class="mb-16">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                O Protocolo SoulSync: <br /> <span class="text-teal-600">3 Passos para o Sucesso</span>
            </h2>

            <div class="space-y-6">
                <!-- 1 -->
                <div class="bg-white border-l-4 border-teal-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                    <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-700">1</div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Desbloqueio Mental</h3>
                        <p class="text-gray-600">Sessões de áudio que eliminam a causa raiz da compulsão e reprogramam seu cérebro para rejeitar excessos naturalmente.</p>
                    </div>
                </div>
                <!-- 2 -->
                <div class="bg-white border-l-4 border-teal-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                    <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-700">2</div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Ativação GLP-1</h3>
                        <p class="text-gray-600">Técnicas de visualização avançada que estimulam o hipotálamo a produzir hormonios de saciedade sem precisar de remédios.</p>
                    </div>
                </div>
                <!-- 3 -->
                <div class="bg-white border-l-4 border-teal-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                    <div class="flex-shrink-0">
                         <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-700">3</div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Aceleração Metabólica</h3>
                        <p class="text-gray-600">Combinado com nosso "Acelerador de 7 Dias" (bônus), você verá resultados visíveis já na primeira semana de aplicação.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 7. VALUE STACK & BONUSES -->
        <div class="bg-white rounded-3xl p-8 mb-16 shadow-xl border border-teal-100">
             <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">O que você recebe</h2>
             <p class="text-gray-500 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
                Baseado nas suas respostas, criamos um plano personalizado de hipnoterapia especialmente para você.
                O programa define objetivos individuais e um programa adaptado para alcançar seus resultados nas primeiras semanas.
            </p>

            <div class="space-y-8 max-w-3xl mx-auto">
                <!-- 1 -->
                <div class="flex items-start gap-4">
                     <div class="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                            Valor: <span class="line-through text-teal-600/70">R$ 67,00</span>
                        </div>
                        <div class="text-gray-900 font-bold text-lg sm:text-xl role">Sessões de hipnose personalizadas</div>
                        <div class="text-teal-600 font-medium mb-3 border-b border-gray-200 pb-2 inline-block text-sm sm:text-base">Baseadas nas suas dores e objetivos</div>
                         <ul class="space-y-2 text-gray-600 text-sm sm:text-base">
                            <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span><span>30+ sessões de áudio (15-25 min cada)</span></li>
                            <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span><span>Técnicas de visualização avançada</span></li>
                        </ul>
                    </div>
                </div>
                 <!-- 2 -->
                <div class="flex items-start gap-4">
                     <div class="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                            Valor: <span class="line-through text-teal-600/70">R$ 37,00</span>
                        </div>
                        <div class="text-gray-900 font-bold text-lg sm:text-xl role">Reprogramação mental profunda</div>
                        <div class="text-teal-600 font-medium mb-3 border-b border-gray-200 pb-2 inline-block text-sm sm:text-base">Elimine a causa raiz do problema</div>
                         <ul class="space-y-2 text-gray-600 text-sm sm:text-base">
                            <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span><span>Sugestões pós-hipnóticas poderosas</span></li>
                            <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span><span>Elimine desejos incontroláveis</span></li>
                        </ul>
                    </div>
                </div>
                 <!-- 3 -->
                <div class="flex items-start gap-4">
                     <div class="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                            Valor: <span class="line-through text-teal-600/70">R$ 27,00</span>
                        </div>
                        <div class="text-gray-900 font-bold text-lg sm:text-xl role">Meditações anti-ansiedade</div>
                         <p class="text-gray-600 leading-relaxed text-sm sm:text-base">15+ meditações guiadas para controlar a ansiedade e o estresse que levam à compulsão alimentar</p>
                    </div>
                </div>
                  <!-- 4 -->
                <div class="flex items-start gap-4">
                     <div class="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                            Valor: <span class="line-through text-teal-600/70">R$ 17,00</span>
                        </div>
                        <div class="text-gray-900 font-bold text-lg sm:text-xl role">Técnicas de autocontrole</div>
                         <p class="text-gray-600 leading-relaxed text-sm sm:text-base">Protocolo de 60 segundos para usar em momentos de desejo incontrolável</p>
                    </div>
                </div>
                 <!-- 5 -->
                <div class="flex items-start gap-4">
                     <div class="hidden sm:flex w-10 h-10 rounded-full bg-teal-100 items-center justify-center flex-shrink-0 mt-1 text-teal-600">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-5 sm:p-6 flex-1 border border-gray-100 relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-teal-100 hidden sm:block">
                            Valor: <span class="line-through text-teal-600/70">R$ 17,00</span>
                        </div>
                        <div class="text-gray-900 font-bold text-lg sm:text-xl role">Acompanhamento de progresso</div>
                         <p class="text-gray-600 leading-relaxed text-sm sm:text-base">Gráficos visuais e celebração de marcos para manter a motivação</p>
                    </div>
                </div>
            </div>

            <!-- BONUS -->
            <div class="mt-10 bg-gradient-to-br from-teal-600 to-indigo-600 rounded-2xl p-6 text-white text-center sm:text-left sm:flex items-center gap-6 shadow-lg relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-white/10">
                    Valor: <span class="line-through">R$ 47,00</span>
                </div>
                <div class="text-4xl mb-4 sm:mb-0 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 shrink-0">🎁</div>
                <div>
                     <h4 class="border-b border-white/20 pb-1 mb-1 inline-block text-teal-100 text-sm font-semibold uppercase tracking-wider">Bônus Exclusivo</h4>
                            <h3 class="font-bold text-xl mb-1">Acelerador Mental de 7 Dias</h3>
                            <p class="text-teal-100 text-sm mb-2">Protocolo intensivo para iniciar sua transformação com resultados visíveis.</p>
                            <p class="text-white/90 text-sm font-medium">Grátuito com seu plano hoje.</p>
                </div>
            </div>

             <!-- Final CTA in Value Stack -->
             <div class="mt-12 bg-gray-900 rounded-2xl p-8 text-white shadow-2xl border border-gray-800 text-center">
                <p class="text-teal-400 text-sm sm:text-base uppercase tracking-widest mb-4 font-bold">VALOR TOTAL: <span class="line-through text-teal-600/60">R$ 229,00</span></p>
                <div class="flex flex-col items-center justify-center mb-6">
                    <span class="text-white/80 text-lg font-medium mb-1">Somente hoje por:</span>
                    <div class="flex items-baseline gap-2">
                        <span class="text-6xl sm:text-7xl font-extrabold text-white tracking-tighter">R$ 14,97</span>
                    </div>
                    <span class="text-gray-400 text-sm mt-2">Plano de 4 Semanas. Cancele quando quiser.</span>
                </div>
                
                <!-- Payt Snippet (Middle) -->
                <div style="text-align: center;">
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
                </div>
                
                 <div class="mt-4 text-center">
                    <a href="downsell.php" class="text-xs text-gray-400 hover:text-gray-300 underline transition-colors opacity-60 hover:opacity-100">
                        Não, obrigado. Eu prefiro pagar o preço total depois.
                    </a>
                </div>
                 <div class="flex justify-center gap-4 mt-6 text-xs text-gray-500 font-medium">
                    <span class="flex items-center gap-1"><svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Compra 100% Segura</span>
                    <span class="flex items-center gap-1"><svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Garantia de 30 Dias</span>
                </div>
             </div>
        </div>

        <!-- 8. AUTHORITY & TESTIMONIALS -->
        <div class="text-center mb-12">
            <p class="text-base sm:text-lg font-bold text-gray-400 uppercase tracking-widest mb-6">Conforme apresentado em</p>
            <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763608547/soulsync/authority/featured-in-logos.png" alt="Media Logos" class="h-14 sm:h-20 object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        <div class="bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-3xl p-8 mb-8 shadow-xl border border-teal-100">
             <div class="text-center mb-8">
                <div class="flex items-center justify-center gap-2 mb-3">
                     <div class="flex text-yellow-400 text-xl">
                        ★★★★★
                     </div>
                     <span class="text-gray-900 font-bold">4.6/5</span>
                     <span class="text-gray-500 text-sm">(mais de 1000 avaliações)</span>
                </div>
                 <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Por que <span class="text-teal-600">os usuários</span></h2>
                 <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">adoram o <span class="text-teal-600">SoulSync?</span></h2>
             </div>

             <div class="space-y-6">
                <!-- T1 -->
                <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-6">
                        <div class="mb-4 rounded-xl overflow-hidden bg-gray-100">
                            <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609993/soulsync/testimonials/testimonial-1.webp" alt="Jasmim Z." class="w-full h-auto" />
                        </div>
                        <div class="flex items-center justify-between mb-3">
                             <div class="flex text-yellow-400">★★★★★</div>
                             <div class="text-gray-400 text-sm">27 de junho</div>
                        </div>
                        <p class="text-gray-600 leading-relaxed mb-4">SoulSync transformou meu corpo de maneiras que eu jamais imaginei. Recomendo para todas as mulheres que buscam algo diferente e que realmente funciona!</p>
                        <div class="flex items-center gap-2">
                            <p class="text-gray-900 font-bold">Jasmim Z.</p>
                            <div class="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full"><svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> VERIFICADO</div>
                        </div>
                    </div>
                </div>
                <!-- T2 -->
                 <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-6">
                        <div class="mb-4 rounded-xl overflow-hidden bg-gray-100">
                            <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609994/soulsync/testimonials/testimonial-2.webp" alt="José S." class="w-full h-auto" />
                        </div>
                        <div class="flex items-center justify-between mb-3">
                             <div class="flex text-yellow-400">★★★★★</div>
                             <div class="text-gray-400 text-sm">24 de junho</div>
                        </div>
                        <p class="text-gray-600 leading-relaxed mb-4">Finalmente parei de comer compulsivamente e comecei a me exercitar. SoulSync foi a única coisa que funcionou para mim.</p>
                        <div class="flex items-center gap-2">
                            <p class="text-gray-900 font-bold">José S.</p>
                            <div class="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full"><svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> VERIFICADO</div>
                        </div>
                    </div>
                </div>
                 <!-- T3 -->
                 <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-6">
                        <div class="mb-4 rounded-xl overflow-hidden bg-gray-100">
                            <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763609995/soulsync/testimonials/testimonial-3.webp" alt="Simona K." class="w-full h-auto" />
                        </div>
                        <div class="flex items-center justify-between mb-3">
                             <div class="flex text-yellow-400">★★★★★</div>
                             <div class="text-gray-400 text-sm">19 de junho</div>
                        </div>
                        <p class="text-gray-600 leading-relaxed mb-4">Experiência fenomenal. O aplicativo SoulSync é o principal motivo da minha mudança. Ser saudável agora é muito fácil, acontece naturalmente.</p>
                        <div class="flex items-center gap-2">
                            <p class="text-gray-900 font-bold">Simona K.</p>
                            <div class="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full"><svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> VERIFICADO</div>
                        </div>
                    </div>
                </div>
             </div>

             <!-- Bottom CTA in Testimonials -->
             <div class="mt-8 text-center">
                 <!-- Payt Snippet -->
                <div style="text-align: center;">
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
                </div>
                <div class="mt-3 text-center">
                    <a href="downsell.php" class="text-xs text-gray-400 hover:text-gray-600 underline transition-colors opacity-70 hover:opacity-100">
                        Não, obrigado.
                    </a>
                </div>
             </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-200">
            <h3 class="text-2xl font-bold text-center text-gray-900 mb-8">Perguntas Frequentes</h3>
            <div class="space-y-4">
                <!-- FAQ Item 1 -->
                <div class="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden faq-item transition-all hover:bg-gray-100 cursor-pointer" onclick="toggleFaq(this)">
                    <div class="w-full text-left px-6 py-5 font-semibold text-gray-800 flex justify-between items-center">
                        <span class="text-lg">O que acontece depois que eu faço o pedido?</span>
                        <span class="text-teal-600 text-2xl transform transition-transform faq-icon">▼</span>
                    </div>
                    <div class="px-6 pb-0 text-gray-600 leading-relaxed border-t-0 border-transparent transition-all max-h-0 overflow-hidden faq-content">
                         <div class="pb-6 pt-4 border-t border-gray-200">
                            Após você fazer seu pedido, começamos a trabalhar! Com base nas respostas que você deu no questionário, criaremos um programa personalizado de acordo com suas necessidades.
                         </div>
                    </div>
                </div>
                 <!-- FAQ Item 2 -->
                 <div class="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden faq-item transition-all hover:bg-gray-100 cursor-pointer" onclick="toggleFaq(this)">
                    <div class="w-full text-left px-6 py-5 font-semibold text-gray-800 flex justify-between items-center">
                        <span class="text-lg">Como posso cancelar minha assinatura?</span>
                        <span class="text-teal-600 text-2xl transform transition-transform faq-icon">▼</span>
                    </div>
                    <div class="px-6 pb-0 text-gray-600 leading-relaxed border-t-0 border-transparent transition-all max-h-0 overflow-hidden faq-content">
                         <div class="pb-6 pt-4 border-t border-gray-200">
                            Os cancelamentos são tratados diretamente com a Payt e podem ser solicitados seguindo as instruções aqui. Caso ainda tenha alguma dúvida sobre como cancelar sua assinatura, entre em contato conosco pelo e-mail suporte@soulsync.com.
                         </div>
                    </div>
                </div>
                 <!-- FAQ Item 3 -->
                 <div class="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden faq-item transition-all hover:bg-gray-100 cursor-pointer" onclick="toggleFaq(this)">
                    <div class="w-full text-left px-6 py-5 font-semibold text-gray-800 flex justify-between items-center">
                        <span class="text-lg">É seguro usar a auto-hipnose?</span>
                        <span class="text-teal-600 text-2xl transform transition-transform faq-icon">▼</span>
                    </div>
                    <div class="px-6 pb-0 text-gray-600 leading-relaxed border-t-0 border-transparent transition-all max-h-0 overflow-hidden faq-content">
                         <div class="pb-6 pt-4 border-t border-gray-200">
                            A auto-hipnoterapia é um procedimento completamente seguro.
                         </div>
                    </div>
                </div>
                 <!-- FAQ Item 4 -->
                 <div class="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden faq-item transition-all hover:bg-gray-100 cursor-pointer" onclick="toggleFaq(this)">
                    <div class="w-full text-left px-6 py-5 font-semibold text-gray-800 flex justify-between items-center">
                        <span class="text-lg">O que acontece se eu adormecer durante a sessão?</span>
                        <span class="text-teal-600 text-2xl transform transition-transform faq-icon">▼</span>
                    </div>
                    <div class="px-6 pb-0 text-gray-600 leading-relaxed border-t-0 border-transparent transition-all max-h-0 overflow-hidden faq-content">
                         <div class="pb-6 pt-4 border-t border-gray-200">
                            É perfeitamente normal e seguro adormecer durante uma sessão de hipnose. Na verdade, isso comprova que você entrou em uma fase de relaxamento profundo, na qual a hipnose é mais eficaz. Caso isso aconteça com você e você queira rever sua sessão de sono, poderá fazê-lo selecionando o dia anterior no aplicativo SoulSync.
                         </div>
                    </div>
                </div>
            </div>
        </div>

         <!-- Card de Garantia de 30 Dias (Bottom) -->
         <div class="bg-white rounded-3xl p-4 sm:p-6 md:p-8 mb-8 border border-gray-200 shadow-lg">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div class="flex-shrink-0 order-first sm:order-last">
                    <div class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                        <img src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768476408/soulsync/seals/garantia-30-dias.png" alt="Selo de Garantia 30 dias" class="w-full h-full object-contain" />
                    </div>
                </div>
                <div class="flex-1 text-center sm:text-left">
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Garantia Incondicional</h2>
                    <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">Se você não tiver resultados visíveis em 30 dias, nós devolvemos 100% do seu dinheiro. Sem perguntas.</p>
                </div>
            </div>
        </div>

        <!-- Bottom CTA -->
        <div class="mb-12 text-center">
             <!-- Payt Snippet -->
            <div style="text-align: center;">
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
            </div>
            <div class="mt-3 text-center">
                <a href="downsell.php" class="text-xs text-gray-400 hover:text-gray-600 underline transition-colors opacity-70 hover:opacity-100">
                    Não, obrigado. Eu aceito perder essa oportunidade única.
                </a>
            </div>
            <p class="text-gray-400 text-sm mt-4">Compra 100% Segura e Instantânea</p>
        </div>

    </div>

    <!-- Scripts -->
    <script>
        // Countdown Timer
        let timeLeft = 15 * 60; // 15 minutes
        function updateTimer() {
            const timerElement = document.getElementById('countdown-timer');
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (timeLeft > 0) timeLeft--;
        }
        setInterval(updateTimer, 1000);
        updateTimer();

        // FAQ Toggle Logic
        function toggleFaq(item) {
            const content = item.querySelector('.faq-content');
            const icon = item.querySelector('.faq-icon');
            
            if (content.style.maxHeight) {
                // Close
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Open
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        }
    </script>
</body>
</html>
