'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { LineChart } from '@/components/dashboard/LineChart';
import { Users, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage() {
  const [selectedQuizId, setSelectedQuizId] = useState('all');

  // Fetch quizzes list
  const { data: quizzesData } = useSWR('/api/dashboard/quizzes', fetcher);

  // Fetch overview data with selected quiz filter
  const { data, error, isLoading } = useSWR(
    `/api/dashboard/overview?quizId=${selectedQuizId}`,
    fetcher
  );

  if (isLoading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading data</div>;
  if (!data) return <div className="text-white p-8">No data available</div>;

  const funnel = [
    { stage: 'Visitors', count: data.visitors || 0 },
    { stage: 'Started', count: data.started || 0 },
    { stage: 'Completed', count: data.completed || 0 },
    { stage: 'Converted', count: data.converted || 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        {/* Quiz Selector */}
        <div className="relative">
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Quizzes</option>
            {quizzesData?.quizzes?.map((quiz: any) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Visitors" value={data.visitors || 0} icon={<Users size={24} />} />
        <StatCard title="Completion" value={(data.completionRate || 0).toFixed(1) + '%'} icon={<CheckCircle size={24} />} />
        <StatCard title="Conversion" value={(data.finalConversionRate || 0).toFixed(1) + '%'} icon={<TrendingUp size={24} />} />
        <StatCard title="Revenue" value={'R$ ' + (data.revenue || 0).toFixed(2)} icon={<DollarSign size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Funnel</h2>
          <FunnelChart data={funnel} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Trend</h2>
          {data.trend && <LineChart data={data.trend} />}
        </div>
      </div>
    </div>
  );
}
