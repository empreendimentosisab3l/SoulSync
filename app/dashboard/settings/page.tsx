'use client';

import { useSession } from 'next-auth/react';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-gray-400 mt-1">Gerencie suas preferências e conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <User size={24} className="text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-white">Perfil</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Usuário</label>
              <input
                type="text"
                value={session?.user?.email || 'admin'}
                disabled
                className="w-full bg-gray-700 text-gray-400 rounded-lg px-4 py-2 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={session?.user?.email || 'admin@soulsync.com'}
                disabled
                className="w-full bg-gray-700 text-gray-400 rounded-lg px-4 py-2 border border-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Bell size={24} className="text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-white">Notificações</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email de novos leads</span>
              <input type="checkbox" className="toggle" disabled />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Relatórios semanais</span>
              <input type="checkbox" className="toggle" disabled />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Alertas de conversão</span>
              <input type="checkbox" className="toggle" disabled />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Shield size={24} className="text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-white">Segurança</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors">
              Alterar Senha
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors">
              Histórico de Login
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <SettingsIcon size={24} className="text-orange-500 mr-3" />
            <h2 className="text-xl font-semibold text-white">Preferências</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Fuso Horário</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600" disabled>
                <option>America/Sao_Paulo (GMT-3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Idioma</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600" disabled>
                <option>Português (BR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded-lg">
        <p className="text-yellow-400 text-sm">
          <strong>Nota:</strong> As opções de configuração estão desabilitadas nesta versão MVP.
          Funcionalidades completas serão implementadas em versões futuras.
        </p>
      </div>
    </div>
  );
}
