import React from 'react';
import { motion } from 'framer-motion';

interface QuizV2SummaryBMIProps {
    height: number; // in cm
    weight: number; // in kg
    bodyParts: string[];
    activityLevel?: string; // Nível de atividade física
    onContinue: () => void;
    buttonText?: string;
    image?: string;
}

export default function QuizV2SummaryBMI({
    height,
    weight,
    bodyParts,
    activityLevel,
    onContinue,
    buttonText = "Continuar",
    image
}: QuizV2SummaryBMIProps) {
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiFormatted = bmi.toFixed(1);

    // Determine BMI Category and Color
    let category = "";
    let color = "";
    let position = 0; // 0 to 100% for slider
    let bmiImage = "";
    let isHealthy = false;

    if (bmi < 18.5) {
        category = "ABAIXO DO PESO";
        color = "text-blue-400";
        position = 15;
        bmiImage = "https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703550/soulsync/quiz-v2/card-11-mid-sized-healthy.webp";
    } else if (bmi < 25) {
        category = "NORMAL";
        color = "text-green-400";
        position = 40;
        bmiImage = "https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703550/soulsync/quiz-v2/card-11-mid-sized-healthy.webp";
        isHealthy = true;
    } else if (bmi < 30) {
        category = "SOBREPESO";
        color = "text-yellow-400";
        position = 65;
        bmiImage = image || "https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703106/soulsync/quiz-v2/card-11-plus-sized-v2.webp";
    } else {
        category = "ALTO";
        color = "text-red-400";
        position = 90;
        bmiImage = image || "https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703106/soulsync/quiz-v2/card-11-plus-sized-v2.webp";
    }

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
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Seu ponto de partida</h2>
            </div>

            <div className="bg-white rounded-3xl p-6 mb-6 text-gray-800 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Índice de Massa Corporal (IMC)</h3>

                {/* BMI Badge */}
                <div className="flex justify-end mb-2">
                    <div className="bg-[#1A1A2E] text-white px-3 py-1 rounded-full text-sm font-bold">
                        Você - {bmiFormatted}
                    </div>
                </div>

                {/* BMI Slider/Gauge */}
                <div className="relative h-2 bg-gradient-to-r from-blue-300 via-green-300 to-red-400 rounded-full mb-8">
                    <div
                        className="absolute -top-1 w-4 h-4 bg-[#1A1A2E] border-2 border-white rounded-full shadow-md transform -translate-x-1/2 transition-all duration-1000"
                        style={{ left: `${position}%` }}
                    />
                    {/* Dotted line */}
                    <div
                        className="absolute bottom-2 w-px h-6 border-l-2 border-dotted border-gray-400 transform -translate-x-1/2"
                        style={{ left: `${position}%` }}
                    />
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-6 uppercase tracking-wider">
                    <span>Abaixo</span>
                    <span>Normal</span>
                    <span>Sobrepeso</span>
                    <span>Alto</span>
                </div>

                {/* Healthy BMI Message */}
                {isHealthy && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">IMC saudável</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Uma excelente base para começar a definir e alcançar o seu corpo ideal.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Risk Warning Box */}
                {bmi >= 25 && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">Riscos de um IMC não saudável:</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Hipertensão, aumento do risco de ataque cardíaco, derrame, diabetes tipo 2, dor crônica nas costas e nas articulações.
                                </p>
                                <p className="text-[10px] text-gray-400 mt-2">Fonte: Associação Americana do Coração (AHA)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-3xl mb-8 shadow-lg overflow-hidden">
                <div className="p-6 flex items-center gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">TIPO DE CORPO</p>
                                <p className="text-sm font-bold text-gray-800">Endomorfo <span className="text-gray-400 font-normal text-xs ml-1">?</span></p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">ZONAS-ALVO</p>
                                <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{selectedParts}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">ESTILO DE VIDA</p>
                                <p className="text-sm font-bold text-gray-800">{activityText}</p>
                            </div>
                        </div>
                    </div>

                    {/* Image - Dynamic based on BMI - No padding/margin on right */}
                    <div className="w-1/2 -mr-6 -my-6">
                        <img
                            src={bmiImage}
                            alt="Body Type"
                            className="w-full h-full object-cover rounded-r-3xl"
                        />
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full bg-hypno-purple text-white font-bold py-4 rounded-full text-lg shadow-lg shadow-hypno-purple/30 hover:shadow-hypno-purple/50 transition-all"
            >
                {buttonText}
            </motion.button>
        </div>
    );
}
