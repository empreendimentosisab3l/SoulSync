'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { GitCompare } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ComparePage() {
  const [quiz1Id, setQuiz1Id] = useState('');
  const [quiz2Id, setQuiz2Id] = useState('');
  const { data: quizzesData } = useSWR('/api/dashboard/quizzes', fetcher);
  const { data: comparisonData, error } = useSWR(
    quiz1Id && quiz2Id ? `/api/dashboard/compare?quiz1=${quiz1Id}&quiz2=${quiz2Id}` : null,
    fetcher
  );

  const quizzes = quizzesData?.quizzes || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Comparar Quizzes</h1>
        <p className="text-gray-400 mt-1">Compare o desempenho de dois quizzes lado a lado</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quiz 1
            </label>
            <select
              value={quiz1Id}
              onChange={(e) => setQuiz1Id(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione um quiz</option>
              {quizzes.map((quiz: any) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quiz 2
            </label>
            <select
              value={quiz2Id}
              onChange={(e) => setQuiz2Id(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione um quiz</option>
              {quizzes.map((quiz: any) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!quiz1Id || !quiz2Id ? (
        <div className="bg-gray-800 p-12 rounded-lg text-center">
          <GitCompare size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Selecione dois quizzes para comparar
          </h2>
          <p className="text-gray-400">
            Escolha dois quizzes acima para ver uma comparação detalhada de suas métricas.
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg">
          <p className="text-red-400">Erro ao carregar comparação</p>
        </div>
      ) : !comparisonData ? (
        <div className="text-white p-8 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[comparisonData.quiz1, comparisonData.quiz2].map((quiz: any, index: number) => (
            <div key={quiz.id} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                {quiz.name}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total de Sessões</span>
                  <span className="text-white font-semibold">{quiz.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Completaram</span>
                  <span className="text-white font-semibold">{quiz.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Taxa de Conclusão</span>
                  <span className="text-green-500 font-semibold">
                    {quiz.completionRate?.toFixed(1) || '0.0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Converteram</span>
                  <span className="text-white font-semibold">{quiz.converted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Taxa de Conversão</span>
                  <span className="text-green-500 font-semibold">
                    {quiz.conversionRate?.toFixed(1) || '0.0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Receita Total</span>
                  <span className="text-blue-500 font-semibold text-lg">
                    R$ {quiz.revenue?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
