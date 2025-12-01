// components/dashboard/StatCard.tsx

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

export function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-white">{value}</p>
            {change && (
              <span
                className={`flex items-center text-sm font-medium ${
                  trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {trend === 'up' && <TrendingUp size={16} className="mr-1" />}
                {trend === 'down' && <TrendingDown size={16} className="mr-1" />}
                {change}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-gray-700 rounded-lg text-blue-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
