"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Sintomas", completed: false },
    { label: "Causa raiz", completed: false },
    { label: "Metas", completed: false },
  ];

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Navigate to results after animation
          setTimeout(() => {
            router.push("/quiz-v3/result");
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Animate steps
    setTimeout(() => setCurrentStep(1), 500);
    setTimeout(() => setCurrentStep(2), 1500);
    setTimeout(() => setCurrentStep(3), 2500);

    return () => clearInterval(progressInterval);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900">hypnozio</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
            Estamos analisando suas respostas...
          </h2>

          {/* Progress Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#E5E7EB"
                strokeWidth="16"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#3B82F6"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            {/* Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-blue-600">{progress}%</span>
            </div>
          </div>

          {/* Steps Checklist */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div
                    className={`
                      w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-cyan-400 scale-100"
                          : "bg-gray-200 scale-90"
                      }
                    `}
                  >
                    {isCompleted && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-base ${
                      isCompleted ? "font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
