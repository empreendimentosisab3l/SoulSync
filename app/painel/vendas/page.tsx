'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface SaleListRow {
  data: string;
  createdTs: number;
  origem: string;
  nome: string;
  email: string;
  status: string;
  valor: string;
  fimTrial: string;
  subscriptionId: string;
}

const STATUS_STYLE: Record<string, string> = {
  Trial: 'bg-amber-100 text-amber-800',
  Ativa: 'bg-green-100 text-green-800',
  Cancelada: 'bg-red-100 text-red-700',
  Atrasada: 'bg-orange-100 text-orange-800',
};

export default function PainelVendasPage() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<SaleListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtroSrc, setFiltroSrc] = useState('(todas)');

  const carregar = useCallback(async (t: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/vendas', { headers: { 'x-admin-token': t } });
      if (res.status === 401) {
        setError('Senha incorreta.');
        sessionStorage.removeItem('adminToken');
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setError('Falha ao carregar as vendas. Tente de novo.');
        return;
      }
      const data = await res.json();
      setRows(data.sales || []);
      setAuthed(true);
      sessionStorage.setItem('adminToken', t);
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminToken');
    if (saved) {
      setToken(saved);
      carregar(saved);
    }
  }, [carregar]);

  const origens = useMemo(() => {
    const set = new Set(rows.map((r) => r.origem));
    return ['(todas)', ...Array.from(set).sort()];
  }, [rows]);

  const visiveis = useMemo(
    () => (filtroSrc === '(todas)' ? rows : rows.filter((r) => r.origem === filtroSrc)),
    [rows, filtroSrc],
  );

  const totais = useMemo(() => {
    const trial = visiveis.filter((r) => r.status === 'Trial').length;
    const ativas = visiveis.filter((r) => r.status === 'Ativa').length;
    const canceladas = visiveis.filter((r) => r.status === 'Cancelada').length;
    return { total: visiveis.length, trial, ativas, canceladas };
  }, [visiveis]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            carregar(token);
          }}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold text-gray-800 mb-1">Painel de Vendas</h1>
          <p className="text-sm text-gray-500 mb-6">Acesso restrito. Digite a senha de admin.</p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Senha de admin"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
            autoFocus
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Vendas (Stripe)</h1>
          <button
            onClick={() => carregar(token)}
            disabled={loading}
            className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {/* Totais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card label="Total" value={totais.total} />
          <Card label="Em trial" value={totais.trial} color="text-amber-600" />
          <Card label="Ativas" value={totais.ativas} color="text-green-600" />
          <Card label="Canceladas" value={totais.canceladas} color="text-red-600" />
        </div>

        {/* Filtro por origem */}
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm text-gray-600">Origem (src):</label>
          <select
            value={filtroSrc}
            onChange={(e) => setFiltroSrc(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            {origens.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Valor/mês</th>
                <th className="px-4 py-3 font-medium">Fim do trial</th>
                <th className="px-4 py-3 font-medium">Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((r) => (
                <tr key={r.subscriptionId} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.data}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{r.origem}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.nome || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{r.email || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.valor ? `R$ ${r.valor}` : '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{r.fimTrial || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400 font-mono text-xs">{r.subscriptionId}</td>
                </tr>
              ))}
              {visiveis.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Dados ao vivo do Stripe (até 100 assinaturas mais recentes). A coluna Origem vem do{' '}
          <code>src</code> da campanha.
        </p>
      </div>
    </div>
  );
}

function Card({ label, value, color = 'text-gray-800' }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
