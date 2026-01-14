"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Result2() {
  const router = useRouter();
  const [weightLoss, setWeightLoss] = useState(10);
  const [currentWeight, setCurrentWeight] = useState(85);
  const [targetWeight, setTargetWeight] = useState(75);
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    // Load answers and calculate weight loss
    const savedAnswers = localStorage.getItem("quizV3Answers");

    if (!savedAnswers) {
      router.push("/");
      return;
    }

    const parsedAnswers = JSON.parse(savedAnswers);

    // Calculate weight loss from step 17 measurements
    if (parsedAnswers[17]) {
      try {
        const measurements = JSON.parse(parsedAnswers[17]);
        const weight = parseFloat(measurements.weight);
        const target = parseFloat(measurements.targetWeight);

        if (weight && target) {
          setCurrentWeight(weight);
          setTargetWeight(target);
          setWeightLoss(Math.round(weight - target));
        }
      } catch (e) {
        console.error("Error parsing measurements", e);
      }
    }

    // Calculate target date (3 months from now)
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const month = future.toLocaleDateString("pt-BR", { month: "long" });
    const year = future.getFullYear();
    setTargetDate(`${month.toUpperCase()} DE ${year}`);
  }, [router]);

  const handleNext = () => {
    router.push("/quiz-v3/result/3");
  };

  const handleBack = () => {
    router.push("/quiz-v3/result/1");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900 text-center">hypnozio</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Main Content */}
        <div className="text-center space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">
            VOCÊ PERDERÁ <span className="text-red-600">{weightLoss} KG</span> ATÉ {targetDate}
          </h2>
          <p className="text-gray-600">Comece a ver resultados nos primeiros 7 dias!</p>

          {/* Weight Loss Graph */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-gray-200">
            <svg viewBox="0 0 300 200" className="w-full">
              {/* Background grid */}
              <line x1="40" y1="20" x2="40" y2="160" stroke="#E5E7EB" strokeWidth="2" />
              <line x1="40" y1="160" x2="280" y2="160" stroke="#E5E7EB" strokeWidth="2" />

              {/* Weight loss curve */}
              <path
                d="M 40 40 Q 100 60 160 100 T 280 150"
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
              />

              {/* Start point */}
              <circle cx="40" cy="40" r="8" fill="#EF4444" />
              <text x="40" y="25" fontSize="14" fill="#EF4444" textAnchor="middle" fontWeight="bold">
                {currentWeight} kg
              </text>

              {/* End point */}
              <circle cx="280" cy="150" r="8" fill="#3B82F6" />
              <text x="280" y="135" fontSize="12" fill="#3B82F6" textAnchor="middle" fontWeight="bold">
                Com Hypnozio
              </text>
              <text x="280" y="175" fontSize="14" fill="#3B82F6" textAnchor="middle" fontWeight="bold">
                {targetWeight} kg
              </text>

              {/* Timeline */}
              <text x="80" y="185" fontSize="13" fill="#6B7280" textAnchor="middle">
                outubro
              </text>
              <text x="220" y="185" fontSize="13" fill="#6B7280" textAnchor="middle">
                dezembro
              </text>
            </svg>

            <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
              O peso permanece baixo
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 text-left">
                Com base nas suas respostas, prevemos que{" "}
                <strong>você atingirá seu objetivo antes de {targetDate.toLowerCase()}!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-700 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
