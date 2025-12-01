'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { BarChart3, Users, TrendingUp } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function QuizzesPage() {
  const { data, error, isLoading } = useSWR('/api/dashboard/quizzes', fetcher);

  if (isLoading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading quizzes</div>;

  const quizzes = data?.quizzes || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Quizzes</h1>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-lg text-center">
          <BarChart3 size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Nenhum quiz encontrado</h2>
          <p className="text-gray-400">
            Os quizzes aparecerão aqui quando houver sessões iniciadas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz: any) => (
            <Link
              key={quiz.id}
              href={`/dashboard/quiz/${quiz.id}`}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{quiz.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{quiz.description || 'Quiz personalizado'}</p>
                </div>
                <BarChart3 size={24} className="text-blue-500" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Visitantes</span>
                  <span className="text-sm font-semibold text-white flex items-center">
                    <Users size={14} className="mr-1" />
                    {quiz.totalSessions || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Taxa de conversão</span>
                  <span className="text-sm font-semibold text-green-500 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    {quiz.conversionRate?.toFixed(1) || '0.0'}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
