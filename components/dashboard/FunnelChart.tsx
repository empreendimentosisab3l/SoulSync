// components/dashboard/FunnelChart.tsx

interface FunnelData {
  stage: string;
  count: number;
  percentage?: number;
}

interface FunnelChartProps {
  data: FunnelData[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Sem dados disponíveis
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.count / maxCount) * 100;
        const nextItem = data[index + 1];
        const dropoff = nextItem
          ? ((item.count - nextItem.count) / item.count) * 100
          : 0;

        return (
          <div key={item.stage}>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span className="font-medium">{item.stage}</span>
              <span className="font-semibold text-white">
                {item.count.toLocaleString('pt-BR')}
                {item.percentage !== undefined && ` (${item.percentage}%)`}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-10 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-4 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              >
                <span className="text-white text-sm font-medium">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            {nextItem && dropoff > 0 && (
              <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <span>{dropoff.toFixed(1)}% abandonaram</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
