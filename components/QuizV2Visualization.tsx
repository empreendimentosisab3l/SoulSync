'use client';

import { useEffect, useState } from 'react';

interface QuizV2VisualizationProps {
    currentWeight?: number;
    targetWeight?: number;
    onContinue: () => void;
    buttonText?: string;
    name?: string;
}

export default function QuizV2Visualization({
    currentWeight = 85,
    targetWeight = 65,
    onContinue,
    buttonText = "Continuar",
    name = "Visitante"
}: QuizV2VisualizationProps) {
    const [showAfter, setShowAfter] = useState(false);

    // Animate the transition to "After" state
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAfter(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Calculate stats
    const weightLoss = currentWeight - targetWeight;
    const currentBodyFat = 35; // Estimated
    const targetBodyFat = 22; // Estimated
    const weeks = Math.round(weightLoss * 0.8); // Rough estimate: 0.8 weeks per kg

    return (
        <div className="space-y-8 animate-fade-in pb-32">
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {name}, aqui está seu plano!
                </h2>
                <p className="text-white/60">
                    Baseado nas suas respostas:
                </p>
            </div>

            {/* Visualization Card */}
            <div className="relative bg-gradient-to-br from-hypno-accent/10 via-hypno-dark/90 to-hypno-purple/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-hypno-accent/30 overflow-hidden">

                {/* Header Tabs */}
                <div className="flex gap-2 mb-8">
                    <div className={`flex-1 rounded-xl px-4 py-2 text-center transition-all duration-500 ${!showAfter ? 'bg-hypno-accent text-white font-bold shadow-lg shadow-hypno-accent/30' : 'bg-white/5 text-white/50'}`}>
                        AGORA
                    </div>
                    <div className={`flex-1 rounded-xl px-4 py-2 text-center transition-all duration-500 flex items-center justify-center gap-2 ${showAfter ? 'bg-hypno-accent text-white font-bold shadow-lg shadow-hypno-accent/30' : 'bg-white/5 text-white/50'}`}>
                        META <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">Em {weeks} semanas</span>
                    </div>
                </div>

                {/* Avatars & Stats */}
                <div className="relative min-h-[300px]">

                    {/* BEFORE STATE */}
                    <div className={`absolute inset-0 transition-all duration-700 transform ${showAfter ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                        <div className="flex flex-col items-center">
                            {/* Avatar Placeholder */}
                            <div className="w-32 h-32 rounded-full bg-gray-700 mb-6 flex items-center justify-center border-4 border-gray-600">
                                <span className="text-4xl">😐</span>
                            </div>

                            {/* Stats Grid */}
                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <div className="text-xs text-white/40 uppercase tracking-wider">Peso</div>
                                    <div className="text-xl font-bold text-white">{currentWeight} kg</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <div className="text-xs text-white/40 uppercase tracking-wider">Gordura</div>
                                    <div className="text-xl font-bold text-white">{currentBodyFat}%</div>
                                </div>
                                <div className="col-span-2 bg-white/5 rounded-xl p-3">
                                    <div className="flex justify-between text-xs text-white/40 uppercase tracking-wider mb-1">
                                        <span>Energia</span>
                                        <span>Baixa</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[30%] bg-red-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AFTER STATE */}
                    <div className={`absolute inset-0 transition-all duration-700 transform ${showAfter ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                        <div className="flex flex-col items-center">
                            {/* Avatar Placeholder */}
                            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-hypno-purple to-hypno-accent mb-6 flex items-center justify-center border-4 border-hypno-accent shadow-lg shadow-hypno-accent/50">
                                <span className="text-4xl">😍</span>
                                <div className="absolute -bottom-2 -right-2 bg-hypno-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    -{weightLoss}kg
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="bg-hypno-accent/10 border border-hypno-accent/30 rounded-xl p-3 text-center">
                                    <div className="text-xs text-hypno-accent uppercase tracking-wider">Peso</div>
                                    <div className="text-xl font-bold text-white">{targetWeight} kg</div>
                                </div>
                                <div className="bg-hypno-accent/10 border border-hypno-accent/30 rounded-xl p-3 text-center">
                                    <div className="text-xs text-hypno-accent uppercase tracking-wider">Gordura</div>
                                    <div className="text-xl font-bold text-white">{targetBodyFat}%</div>
                                </div>
                                <div className="col-span-2 bg-hypno-accent/10 border border-hypno-accent/30 rounded-xl p-3">
                                    <div className="flex justify-between text-xs text-hypno-accent uppercase tracking-wider mb-1">
                                        <span>Energia</span>
                                        <span>Máxima</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[90%] bg-gradient-to-r from-hypno-purple to-hypno-accent rounded-full shadow-[0_0_10px_rgba(0,217,255,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Message */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-white/70">
                        Este é o SEU objetivo - vamos reprogramar sua mente para alcançá-lo <span className="text-hypno-accent font-bold">AUTOMATICAMENTE</span>.
                    </p>
                </div>
            </div>

            {/* Continue Button - Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
                <div className="w-full max-w-md">
                    <button
                        onClick={onContinue}
                        className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-hypno-accent/50 transition-all duration-300"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
