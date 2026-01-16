"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { pageview } from "@/lib/analytics";

interface AnalysisStep {
  label: string;
  duration: number;
}

export default function AnalysisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: AnalysisStep[] = [
    { label: "Analisando perfil e hábitos...", duration: 1000 },
    { label: "Identificando gatilhos emocionais...", duration: 1200 },
    { label: "Personalizando sessões de hipnoterapia...", duration: 1000 },
    { label: "Calculando estimativa de resultados...", duration: 800 },
    { label: "Finalizando seu programa exclusivo...", duration: 800 }
  ];

  useEffect(() => {
    // Track page view
    pageview('/quiz-v3/analysis');
  }, []);

  useEffect(() => {
    if (currentStep >= steps.length) {
      // Todas as etapas concluídas - navegar para resultado
      setTimeout(() => {
        router.push("/quiz-v3/result");
      }, 800);
      return;
    }

    const step = steps[currentStep];
    const stepDuration = step.duration;
    const updateInterval = 50; // Atualiza a cada 50ms
    const totalUpdates = stepDuration / updateInterval;
    let currentUpdate = 0;

    const progressInterval = setInterval(() => {
      currentUpdate++;
      const stepProgress = (currentUpdate / totalUpdates) * 100;
      setProgress(stepProgress);

      if (currentUpdate >= totalUpdates) {
        clearInterval(progressInterval);
        setCompletedSteps(prev => [...prev, currentStep]);
        setProgress(0);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 200);
      }
    }, updateInterval);

    return () => clearInterval(progressInterval);
  }, [currentStep, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Analisando seu perfil e criando plano personalizado...
          </h2>

          <p className="text-gray-500 text-sm">
            Algoritmo de IA analisando {steps.length} parâmetros...
          </p>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-4 min-h-[400px]">
          {steps
            .map((step, index) => ({ step, index }))
            .filter(({ index }) => !completedSteps.includes(index))
            .map(({ step, index }) => {
              const isCurrent = currentStep === index;

              return (
                <div
                  key={index}
                  className={`relative bg-gray-50 rounded-2xl p-4 border-2 transition-all duration-700 ease-in-out ${
                    isCurrent
                      ? 'border-teal-300 bg-teal-50 scale-105'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-teal-600 animate-pulse'
                        : 'bg-gray-200'
                    }`}>
                      {isCurrent ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                      <p className={`font-medium transition-colors ${
                        isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>

                      {/* Progress Bar */}
                      {isCurrent && (
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Percentage */}
                    {isCurrent && (
                      <div className="flex-shrink-0 text-teal-600 font-bold text-lg animate-pulse">
                        {Math.round(progress)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Overall Progress */}
        <div className="text-center">
          <div className="inline-block bg-gray-50 px-6 py-3 rounded-full border border-teal-200">
            <p className="text-gray-600 text-sm">
              Progresso geral:{' '}
              <span className="text-gray-900 font-bold">
                {completedSteps.length}/{steps.length}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
