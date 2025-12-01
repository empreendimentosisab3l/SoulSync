// components/dashboard/LineChart.tsx

'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  visitors: number;
  completed: number;
  converted: number;
}

interface LineChartProps {
  data: TrendData[];
}

export function LineChart({ data }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Sem dados disponíveis
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
        />
        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            color: '#fff'
          }}
        />
        <Legend
          wrapperStyle={{ color: '#9CA3AF' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6' }}
          name="Visitantes"
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981' }}
          name="Completaram"
        />
        <Line
          type="monotone"
          dataKey="converted"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={{ fill: '#8B5CF6' }}
          name="Converteram"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
