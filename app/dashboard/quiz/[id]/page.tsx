'use client';

import { use } from 'react';
import useSWR from 'swr';
import { StatCard } from '@/components/dashboard/StatCard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { Users, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, isLoading } = useSWR(`/api/dashboard/quiz/${id}`, fetcher);

  if (isLoading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading quiz details</div>;
  if (!data) return <div className="text-white p-8">No data available</div>;

  const funnel = data.funnel || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{data.quiz?.name || 'Quiz'}</h1>
        <p className="text-gray-400 mt-1">{data.quiz?.description || 'Análise detalhada do quiz'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sessões"
          value={data.metrics?.totalSessions || 0}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Completaram"
          value={(data.metrics?.completionRate || 0).toFixed(1) + '%'}
          icon={<CheckCircle size={24} />}
        />
        <StatCard
          title="Converteram"
          value={(data.metrics?.conversionRate || 0).toFixed(1) + '%'}
          icon={<TrendingUp size={24} />}
        />
        <StatCard
          title="Receita"
          value={'R$ ' + (data.metrics?.revenue || 0).toFixed(2)}
          icon={<DollarSign size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Funil de Conversão</h2>
          <FunnelChart data={funnel} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Por Dispositivo</h2>
          <div className="space-y-3">
            {data.devices && data.devices.length > 0 ? (
              data.devices.map((device: any) => (
                <div key={device.type} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{device.type}</span>
                  <span className="text-white font-semibold">{device.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Sem dados de dispositivos</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Por Fonte de Tráfego</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Fonte</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Visitantes</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Conversões</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {data.sources && data.sources.length > 0 ? (
                data.sources.map((source: any) => (
                  <tr key={source.source} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-white">{source.source}</td>
                    <td className="py-3 px-4 text-right text-white">{source.visitors}</td>
                    <td className="py-3 px-4 text-right text-white">{source.conversions}</td>
                    <td className="py-3 px-4 text-right text-green-500 font-semibold">
                      {source.conversionRate}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Sem dados de tráfego
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
