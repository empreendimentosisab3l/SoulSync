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
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-white mb-2">
            {value} <span className="text-3xl">{unit}</span>
          </div>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, white 0%, white ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.2) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />

        <div className="flex justify-between mt-4 text-white/60 text-sm">
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
          background: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
