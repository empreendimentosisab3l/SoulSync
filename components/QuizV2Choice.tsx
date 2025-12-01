'use client';

import { QuizV2Option } from '@/lib/quizDataV2';

interface QuizV2ChoiceProps {
  question: string;
  subtitle?: string;
  description?: string;
  options: QuizV2Option[];
  onSelect: (value: string) => void;
}

export default function QuizV2Choice({
  question,
  subtitle,
  description,
  options,
  onSelect
}: QuizV2ChoiceProps) {
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
        {description && (
          <p className="text-sm text-white/50 max-w-lg mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.value)}
            className="w-full bg-hypno-dark/40 hover:bg-hypno-purple/20 border border-white/10 hover:border-hypno-accent/50 rounded-2xl p-6 text-left transition-all duration-300 group relative overflow-hidden hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-hypno-purple/0 via-hypno-purple/5 to-hypno-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center gap-5">
              {option.icon && (
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                  {option.icon}
                </span>
              )}
              <span className="text-lg sm:text-xl text-white font-medium flex-1 group-hover:text-white transition-colors">
                {option.label}
              </span>

              {/* Custom Checkbox/Arrow */}
              <div className="w-8 h-8 rounded-full border-2 border-white/20 group-hover:border-hypno-accent group-hover:bg-hypno-accent flex items-center justify-center transition-all duration-300">
                <svg
                  className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
