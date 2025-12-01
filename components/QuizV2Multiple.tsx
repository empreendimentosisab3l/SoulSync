'use client';

import { useState } from 'react';
import { QuizV2Option } from '@/lib/quizDataV2';

interface QuizV2MultipleProps {
  question: string;
  subtitle?: string;
  options: QuizV2Option[];
  onContinue: (values: string[]) => void;
  buttonText?: string;
}

export default function QuizV2Multiple({
  question,
  subtitle,
  options,
  onContinue,
  buttonText = "Continuar"
}: QuizV2MultipleProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      onContinue(selected);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Question */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {question}
        </h2>
        {subtitle && (
          <p className="text-lg text-white/70">
            {subtitle}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 pb-32">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => toggleOption(option.value)}
            className={`w-full border rounded-2xl p-5 text-left transition-all duration-300 group relative overflow-hidden ${selected.includes(option.value)
              ? 'bg-hypno-purple/20 border-hypno-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]'
              : 'bg-hypno-dark/40 border-white/10 hover:border-hypno-accent/50 hover:bg-hypno-purple/10'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              {/* Checkbox */}
              <div
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selected.includes(option.value)
                  ? 'bg-hypno-accent border-hypno-accent scale-110'
                  : 'border-white/30 group-hover:border-hypno-accent/70'
                  }`}
              >
                {selected.includes(option.value) && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
              <span className={`text-lg font-medium flex-1 transition-colors ${selected.includes(option.value) ? 'text-white' : 'text-white/80 group-hover:text-white'
                }`}>
                {option.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button - Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${selected.length > 0
              ? 'bg-gradient-to-r from-hypno-purple to-hypno-accent text-white hover:scale-105 hover:shadow-hypno-accent/50'
              : 'bg-hypno-dark/50 text-white/30 cursor-not-allowed border border-white/5'
              }`}
          >
            {buttonText}
            {selected.length > 0 && ` (${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
