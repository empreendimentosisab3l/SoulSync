"use client";

import { useState } from "react";

interface QuizRangeProps {
  min: number;
  max: number;
  unit: string;
  onSelect: (value: string) => void;
  defaultValue?: number;
}

export default function QuizRange({ min, max, unit, onSelect, defaultValue }: QuizRangeProps) {
  const [value, setValue] = useState(defaultValue || Math.floor((min + max) / 2));

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onSelect(newValue.toString());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-teal-700 mb-2">
            {value} <span className="text-3xl">{unit}</span>
          </div>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />

        <div className="flex justify-between mt-4 text-gray-500 text-sm">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
        }
      `}</style>
    </div>
  );
}
