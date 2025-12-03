'use client';

import { motion } from 'framer-motion';

interface QuizV2VisualizationProps {
    currentWeight?: number;
    targetWeight?: number;
    onContinue: () => void;
    buttonText?: string;
    name?: string;
    beforeImage?: string;
    bodyParts?: string[];
    activityLevel?: string;
}

export default function QuizV2Visualization({
    currentWeight,
    targetWeight,
    onContinue,
    buttonText = "Continuar",
    name = "Visitante",
    beforeImage,
    bodyParts,
    activityLevel
}: QuizV2VisualizationProps) {

    // Calculate stats
    const weightLoss = (currentWeight && targetWeight) ? (currentWeight - targetWeight) : 0;

    // Map body parts to display labels
    const bodyPartLabels: Record<string, string> = {
        'pernas': 'Pernas',
        'barriga': 'Barriga',
        'bracos': 'Braços',
        'bumbum': 'Bumbum',
        'rosto': 'Rosto',
        'costas': 'Costas'
    };

    const selectedParts = bodyParts?.map(p => bodyPartLabels[p] || p).join(', ') || 'Geral';

    // Map activity level to display text
    const activityLabels: Record<string, string> = {
        'sedentario': 'Sedentário',
        'leve': 'Levemente Ativo',
        'moderado': 'Moderadamente Ativo',
        'muito-ativo': 'Muito Ativo',
        'extremo': 'Extremamente Ativo'
    };

    const activityText = activityLevel ? activityLabels[activityLevel] || 'Ativo' : 'Ativo';

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in pb-32">
            {/* Header Title */}
            <div className="text-center mb-6 px-4">
                <h2 className="text-2xl font-bold text-white leading-tight">
                    Conheça sua futura versão.<br />
                    <span className="text-hypno-purple">Confiante</span> em seu próprio corpo
                </h2>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-[2rem] p-5 shadow-xl overflow-hidden mb-6 relative">

                {/* Top Labels */}
                <div className="flex justify-between mb-4 px-8">
                    <span className="text-gray-800 font-bold">Agora</span>
                    <span className="text-green-500 font-bold">Meta</span>
                </div>

                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    {beforeImage ? (
                        <img
                            src={beforeImage}
                            alt="Transformação Antes e Depois"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Imagem não disponível
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column (Agora) */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-800 mb-1">Peso</p>
                            <p className="text-sm text-gray-600">{currentWeight ? `${currentWeight} kg` : '---'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800 mb-1">Gordura corporal</p>
                            <p className="text-sm text-gray-600">32%+</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800 mb-2">Nível de energia</p>
                            <div className="flex gap-1">
                                <div className="h-1.5 w-6 rounded-full bg-green-500"></div>
                                <div className="h-1.5 w-6 rounded-full bg-gray-200"></div>
                                <div className="h-1.5 w-6 rounded-full bg-gray-200"></div>
                                <div className="h-1.5 w-6 rounded-full bg-gray-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Meta) */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-800 mb-1">Objetivo de peso</p>
                            <p className="text-sm text-gray-600">{targetWeight ? `${targetWeight} kg` : '---'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800 mb-1">Gordura corporal</p>
                            <p className="text-sm text-gray-600">14-20%</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800 mb-2">Nível de energia</p>
                            <div className="flex gap-1">
                                <div className="h-1.5 w-6 rounded-full bg-green-500"></div>
                                <div className="h-1.5 w-6 rounded-full bg-green-500"></div>
                                <div className="h-1.5 w-6 rounded-full bg-green-500"></div>
                                <div className="h-1.5 w-6 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Message */}
            <div className="text-center px-6">
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                    Este é o seu objetivo — <span className="font-bold text-white">nós vamos te guiar até lá, um hábito de cada vez.</span>
                </p>
            </div>

            {/* Continue Button - Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
                <div className="w-full max-w-md">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onContinue}
                        className="w-full bg-hypno-purple text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-hypno-purple/30"
                    >
                        {buttonText}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
