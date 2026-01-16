"use client";

interface QuizMultipleProps {
  options: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  onSelect: (values: string[]) => void;
  selected: string[];
}

export default function QuizMultiple({ options, onSelect, selected }: QuizMultipleProps) {
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onSelect(newSelected);
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 w-full max-w-2xl mx-auto">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`
              px-4 py-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.98]
              ${
                isSelected
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-teal-300 active:border-teal-400"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center flex-shrink-0
                  ${
                    isSelected
                      ? "border-teal-600 bg-teal-600"
                      : "border-gray-300 bg-white"
                  }
                `}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-white"
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
              {option.icon && <span className="text-xl sm:text-2xl">{option.icon}</span>}
              <span className="text-sm sm:text-base font-medium leading-snug">{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
