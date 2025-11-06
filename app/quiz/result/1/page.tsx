"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Result1() {
  const router = useRouter();
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    // Load answers and calculate BMI
    const savedAnswers = localStorage.getItem("quizAnswers");

    if (!savedAnswers) {
      router.push("/");
      return;
    }

    const parsedAnswers = JSON.parse(savedAnswers);

    // Calculate BMI from step 17 measurements
    if (parsedAnswers[17]) {
      try {
        const measurements = JSON.parse(parsedAnswers[17]);
        const weight = parseFloat(measurements.weight);
        const height = parseFloat(measurements.height) / 100; // convert cm to m

        if (weight && height) {
          const calculatedBmi = weight / (height * height);
          setBmi(Math.round(calculatedBmi * 10) / 10);
        }
      } catch (e) {
        console.error("Error parsing measurements", e);
      }
    }
  }, [router]);

  const handleNext = () => {
    router.push("/quiz/result/2");
  };

  const handleBack = () => {
    router.push("/quiz/loading");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900 text-center">SoulSync</h1>
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

        {/* Main Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          É PROVÁVEL QUE O SOULSYNC FUNCIONE PARA VOCÊ!
        </h2>

        <div className="space-y-4">
          {/* Safety Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">A hipnoterapia é segura para você?</h3>
                <p className="text-sm text-blue-700">
                  Você atende aos critérios para hipnoterapia direcionada ao controle de peso.
                </p>
              </div>
            </div>
          </div>

          {/* Metabolic Age Card */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Sua idade metabólica</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">35 ANOS</p>
                <div className="bg-red-100 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-700 font-medium">
                    Seu corpo está envelhecendo mais rápido do que deveria.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BMI Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-center">
              Índice de Massa Corporal (<span className="text-blue-600">IMC</span>)
            </h3>
            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-900 text-center mb-2">{bmi}</div>
              <p className="text-center text-gray-600 text-sm">você está acima do peso</p>
            </div>

            {/* BMI Range Slider */}
            <div className="relative h-8 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full mb-2">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-600 rounded-full"
                style={{ left: `${Math.min(95, Math.max(5, ((bmi - 10) / 30) * 100))}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                  {bmi}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
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
