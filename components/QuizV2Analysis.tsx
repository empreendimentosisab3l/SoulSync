'use client';

import { useEffect, useState } from 'react';

interface AnalysisStep {
  label: string;
  duration: number;
}

interface QuizV2AnalysisProps {
  title: string;
  steps: AnalysisStep[];
  onComplete: () => void;
  autoAdvance?: boolean;
}

export default function QuizV2Analysis({
  title,
  steps,
  onComplete,
  autoAdvance = true
}: QuizV2AnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= steps.length) {
      // Todas as etapas concluídas
      if (autoAdvance) {
        setTimeout(() => {
          onComplete();
        }, 800);
      }
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
  }, [currentStep, steps, autoAdvance, onComplete]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-hypno-purple to-hypno-accent animate-pulse">
          <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {title}
        </h2>

        <p className="text-white/60 text-sm">
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
                className={`relative bg-hypno-dark/30 rounded-2xl p-4 border-2 transition-all duration-700 ease-in-out ${
                  isCurrent
                    ? 'border-hypno-purple/50 bg-hypno-purple/10 scale-105'
                    : 'border-white/10'
                }`}
              >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-hypno-purple animate-pulse'
                    : 'bg-white/10'
                }`}>
                  {isCurrent ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  ) : (
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p className={`font-medium transition-colors ${
                    isCurrent ? 'text-white' : 'text-white/40'
                  }`}>
                    {step.label}
                  </p>

                  {/* Progress Bar */}
                  {isCurrent && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-hypno-purple to-hypno-accent transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Percentage */}
                {isCurrent && (
                  <div className="flex-shrink-0 text-hypno-accent font-bold text-lg animate-pulse">
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
        <div className="inline-block bg-hypno-dark/50 px-6 py-3 rounded-full border border-hypno-purple/30">
          <p className="text-white/60 text-sm">
            Progresso geral:{' '}
            <span className="text-white font-bold">
              {completedSteps.length}/{steps.length}
            </span>
          </p>
        </div>
      </div>

      {/* Manual Continue Button (if not auto-advance) */}
      {!autoAdvance && currentStep >= steps.length && (
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-hypno-accent/50 transition-all duration-300 animate-fade-in"
        >
          Ver Resultados
        </button>
      )}
    </div>
  );
}
