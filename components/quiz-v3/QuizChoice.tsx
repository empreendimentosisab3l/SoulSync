"use client";

interface QuizChoiceProps {
  options: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  onSelect: (value: string) => void;
  selected?: string;
}

export default function QuizChoice({ options, onSelect, selected }: QuizChoiceProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 w-full max-w-2xl mx-auto">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`
            px-4 py-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.98]
            ${
              selected === option.value
                ? "border-teal-600 bg-teal-50 text-teal-900"
                : "border-gray-200 bg-white text-gray-700 hover:border-teal-300 active:border-teal-400"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {option.icon && <span className="text-xl sm:text-2xl">{option.icon}</span>}
            <span className="text-sm sm:text-base font-medium leading-snug">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
