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
    <div className="grid grid-cols-1 gap-3 w-full max-w-2xl mx-auto">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`
            p-4 rounded-xl border-2 transition-all duration-300 text-left
            ${
              selected === option.value
                ? "border-soul-purple bg-soul-cream text-soul-purple"
                : "border-gray-200 bg-white text-gray-700 hover:border-soul-lavender"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {option.icon && <span className="text-2xl">{option.icon}</span>}
            <span className="text-base font-medium">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
