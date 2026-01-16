"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pageview } from "@/lib/analytics";

export default function ResultPage() {
  const router = useRouter();
  const [currentWeight, setCurrentWeight] = useState<number | undefined>();
  const [targetWeight, setTargetWeight] = useState<number | undefined>();

  useEffect(() => {
    // Track page view
    pageview('/quiz-v3/result');

    // Load answers from localStorage
    const answers = localStorage.getItem("quizV3Answers");
    if (answers) {
      try {
        const parsed = JSON.parse(answers);
        // Step 18 = current weight, Step 19 = target weight
        if (parsed['18']) setCurrentWeight(parseFloat(parsed['18']));
        if (parsed['19']) setTargetWeight(parseFloat(parsed['19']));
      } catch (e) {
        console.error('Error parsing answers:', e);
      }
    }
  }, []);

  const handleContinue = () => {
    router.push("/quiz-v3/scratch");
  };

  const weightLoss = (currentWeight && targetWeight) ? (currentWeight - targetWeight) : 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto animate-fade-in pb-32">
        {/* Header Title */}
        <div className="text-center mb-6 px-4">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Conheça sua futura versão.<br />
            <span className="text-teal-600">Confiante</span> em seu próprio corpo
          </h2>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] p-5 shadow-xl overflow-hidden mb-6 relative border border-gray-200">
          {/* Top Labels */}
          <div className="flex justify-between mb-4 px-8">
            <span className="text-gray-800 font-bold">Agora</span>
            <span className="text-green-500 font-bold">Meta</span>
          </div>

          {/* Image Container */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100">
            <img
              src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1764709910/soulsync/quiz-v2/overweight.webp"
              alt="Transformação Antes e Depois"
              className="w-full h-full object-cover"
            />
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
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Este é o seu objetivo — <span className="font-bold text-gray-900">nós vamos te guiar até lá, um hábito de cada vez.</span>
          </p>
        </div>

        {/* Continue Button - Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-50 flex justify-center">
          <div className="w-full max-w-md">
            <button
              onClick={handleContinue}
              className="w-full bg-teal-600 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300"
            >
              Ver meu plano completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
