"use client";

import { useState } from "react";

interface QuizMeasurementsProps {
  onComplete: (data: {
    unit: "metric" | "imperial";
    height: string;
    weight: string;
    targetWeight: string;
  }) => void;
  defaultValues?: {
    unit: "metric" | "imperial";
    height: string;
    weight: string;
    targetWeight: string;
  };
}

export default function QuizMeasurements({ onComplete, defaultValues }: QuizMeasurementsProps) {
  const [unit, setUnit] = useState<"metric" | "imperial">(defaultValues?.unit || "metric");
  const [height, setHeight] = useState(defaultValues?.height || "");
  const [weight, setWeight] = useState(defaultValues?.weight || "");
  const [targetWeight, setTargetWeight] = useState(defaultValues?.targetWeight || "");

  const handleSubmit = () => {
    if (height && weight && targetWeight) {
      onComplete({ unit, height, weight, targetWeight });
    }
  };

  const isValid = height && weight && targetWeight;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setUnit("imperial")}
            className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all
              ${unit === "imperial" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}
            `}
          >
            Imperial
          </button>
          <button
            type="button"
            onClick={() => setUnit("metric")}
            className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all
              ${unit === "metric" ? "bg-cyan-400 text-white shadow-sm" : "text-gray-600"}
            `}
          >
            Métrica
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm mb-2">
            Altura
          </label>
          <div className="relative">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder={unit === "metric" ? "175" : "5.9"}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {unit === "metric" ? "cm" : "ft"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">
            Peso
          </label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder={unit === "metric" ? "75" : "165"}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {unit === "metric" ? "kg" : "lb"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">
            Peso desejado
          </label>
          <div className="relative">
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder={unit === "metric" ? "65" : "143"}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {unit === "metric" ? "kg" : "lb"}
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-xl">
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-gray-600 leading-relaxed">
          Seus dados pessoais estão seguros conosco. Não enviamos spam nem compartilhamos endereços de e-mail com terceiros.
        </p>
      </div>

      {/* Submit Button (handled by parent) */}
      {isValid && (
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-purple-700 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-purple-800 hover:scale-105"
        >
          Próxima
        </button>
      )}
    </div>
  );
}
