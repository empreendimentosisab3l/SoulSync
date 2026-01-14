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
    <div className="grid grid-cols-1 gap-3 w-full max-w-2xl mx-auto">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300 text-left
              ${
                isSelected
                  ? "border-purple-500 bg-purple-50 text-purple-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                  ${
                    isSelected
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300 bg-white"
                  }
                `}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
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
              {option.icon && <span className="text-2xl">{option.icon}</span>}
              <span className="text-base font-medium">{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
