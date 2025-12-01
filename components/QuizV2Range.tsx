'use client';

import { useState } from 'react';

interface QuizV2RangeProps {
  question: string;
  description?: string;
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  onContinue: (value: number) => void;
  buttonText?: string;
}

export default function QuizV2Range({
  question,
  description,
  min,
  max,
  minLabel = '',
  maxLabel = '',
  onContinue,
  buttonText = "Continuar"
}: QuizV2RangeProps) {
  const [value, setValue] = useState(Math.floor((min + max) / 2));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Question */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {question}
        </h2>
        {description && (
          <p className="text-lg text-white/70 italic max-w-lg mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Range Slider */}
      <div className="space-y-6 py-8">
        {/* Current Value */}
        <div className="text-center">
          <div className="inline-block bg-hypno-accent/20 border-2 border-hypno-accent rounded-full px-8 py-3">
            <span className="text-4xl font-bold text-hypno-accent">{value}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="relative px-4">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="w-full h-3 bg-hypno-dark/50 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-8
              [&::-webkit-slider-thumb]:h-8
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-hypno-purple
              [&::-webkit-slider-thumb]:to-hypno-accent
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-hypno-accent/50
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-8
              [&::-moz-range-thumb]:h-8
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-gradient-to-r
              [&::-moz-range-thumb]:from-hypno-purple
              [&::-moz-range-thumb]:to-hypno-accent
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:shadow-hypno-accent/50
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:transition-all
              [&::-moz-range-thumb]:hover:scale-110"
            style={{
              background: `linear-gradient(to right, #6A4C93 0%, #00D9FF ${((value - min) / (max - min)) * 100}%, rgba(26, 26, 46, 0.5) ${((value - min) / (max - min)) * 100}%, rgba(26, 26, 46, 0.5) 100%)`
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between items-center text-sm text-white/50 px-2">
          <span className="text-left max-w-[45%]">{minLabel}</span>
          <span className="text-right max-w-[45%]">{maxLabel}</span>
        </div>

        {/* Number Indicators */}
        <div className="flex justify-between px-2 text-white/30 text-xs">
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
            <span
              key={num}
              className={`${num === value ? 'text-hypno-accent font-bold' : ''}`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Continue Button - Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={() => onContinue(value)}
            className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-hypno-accent/50 transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
