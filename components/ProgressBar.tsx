"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/80">
          Pergunta {current} de {total}
        </span>
        <span className="text-sm font-bold text-white">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
