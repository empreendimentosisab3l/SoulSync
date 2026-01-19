<?php
// Simple PHP Header
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Especial - Downsell | SoulSync</title>
    
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Confetti Library -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

    <style>
        body { font-family: 'Inter', sans-serif; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    </style>
</head>
<body class="min-h-screen bg-white text-gray-900 font-sans pb-20 overflow-x-hidden">

    <!-- Payt Script (Global) -->
    <script src="https://checkout.payt.com.br/multiple-oneclickbuyscript/L8Q8DK.js" async></script>
    <select payt_element="installment" style="display: none;" data-object="LGZAK4-RB359G"></select>

    <!-- 1. COMPACT STICKY HEADER (Red Background) -->
    <div class="bg-red-600 sticky top-0 z-50 text-white shadow-lg border-b border-red-500">
        <div class="container mx-auto px-4 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2 font-bold animate-pulse text-xs sm:text-sm">
                <svg class="w-5 h-5 text-yellow-500 fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span class="uppercase tracking-widest">Você foi selecionada!</span>
            </div>
            <div id="countdown" class="font-mono text-lg font-bold bg-black/20 px-2 py-0.5 rounded text-white">
                10:00
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 pt-6 pb-8 max-w-lg flex flex-col items-center">

        <!-- 2. SUPER COMPACT HOOK -->
        <h1 class="text-2xl sm:text-3xl font-black text-center mb-6 uppercase leading-tight text-gray-800">
            <span class="text-teal-600">Parabéns!</span> Hoje é o<br />
            seu dia de sorte.
        </h1>

        <!-- 3. THE GIANT CLICKABLE CARD WRAPPER -->
        <div class="w-full relative group">
            <!-- Card Container -->
            <div class="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 border-4 border-teal-400 transform transition-transform group-hover:scale-[1.01] shadow-2xl relative overflow-hidden ring-4 ring-teal-50">

                <!-- Confetti Background (CSS only pattern) -->
                <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style="background-image: radial-gradient(#14b8a6 2px, transparent 2px); background-size: 20px 20px;"></div>

                <!-- Discount Badge -->
                <div class="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-sm z-10">
                    Desconto Aprovado
                </div>

                <!-- Content -->
                <div class="relative z-10 flex flex-col items-center text-center">

                    <div class="bg-teal-100 text-teal-700 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest mb-4 flex items-center gap-1">
                        <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        Oportunidade Única
                    </div>

                    <h2 class="text-3xl sm:text-4xl font-black text-gray-900 mb-2 leading-none">
                        SoulSync <span class="text-teal-600">Lite</span>
                    </h2>
                    <p class="text-gray-500 font-bold uppercase text-xs mb-6">
                        Sessões de Hipnose + Reprogramação
                    </p>

                    <!-- Price Block -->
                    <div class="flex items-center gap-3 mb-6 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 w-full justify-center">
                        <div class="flex flex-col items-end">
                            <span class="text-xs text-gray-400 font-bold uppercase">De:</span>
                            <span class="text-gray-400 line-through text-sm font-bold">R$ 14,97</span>
                        </div>
                        <div class="w-px h-8 bg-gray-200"></div>
                        <div class="flex flex-col items-start">
                            <span class="text-xs text-teal-600 font-bold uppercase">Por apenas:</span>
                            <span class="text-4xl font-black text-teal-600 leading-none">R$ 7,90</span>
                        </div>
                    </div>

                    <!-- PAYT BUTTON SNIPPET (INSIDE CARD) -->
                    <div style="text-align: center;">
                        <a
                            href="#"
                            payt_action="oneclick_buy"
                            data-object="LGZAK4-RB359G"
                            style="
                                background: linear-gradient(135deg, #28a745, #1e7e34);
                                color: #ffffff;
                                padding: 18px 36px;
                                text-decoration: none;
                                font-size: 26px;
                                fontFamily: Arial, Helvetica, sans-serif;
                                font-weight: bold;
                                border-radius: 999px;
                                display: inline-block;
                                margin: 20px auto;
                                boxShadow: 0 8px 20px rgba(40, 167, 69, 0.45);
                                transition: all 0.25s ease;
                                letter-spacing: 0.5px;
                                cursor: pointer;
                            "
                            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 12px 28px rgba(40, 167, 69, 0.6)';"
                            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.45)';"
                        >
                            ✅ COMPRAR AGORA
                        </a>
                        <select payt_element="installment" style="display: none;" data-object="LGZAK4-RB359G"></select>
                    </div>

                    <p class="mt-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Clique para ativar o desconto
                    </p>

                </div>
            </div>
        </div>

        <!-- 4. DECLINE LINK -->
        <button
            onclick="window.location.href = 'https://flylabs.com.br/obrigado/'"
            class="mt-8 text-gray-400 text-xs sm:text-sm hover:text-gray-600 underline transition-colors"
        >
            Não, eu prefiro continuar sem resultados
        </button>

        <!-- 5. SECURITY FOOTER -->
        <div class="mt-8 flex items-center gap-2 text-gray-300 text-xs uppercase font-bold tracking-widest">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Ambiente Seguro & Criptografado
        </div>

    </div>

    <!-- Logic -->
    <script>
        // 1. Confetti on Load
        setTimeout(() => {
            if (window.confetti) {
                window.confetti({
                    particleCount: 300,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#14b8a6', '#f59e0b', '#ec4899', '#ffffff'] // Teal, Gold, Pink, White
                });
            }
        }, 1000);

        // 2. Countdown Timer (10m)
        let seconds = 10 * 60;
        const timerEl = document.getElementById('countdown');
        
        setInterval(() => {
            if(seconds > 0) seconds--;
            
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            timerEl.textContent = `${m}:${s}`;
        }, 1000);
    </script>
</body>
</html>
