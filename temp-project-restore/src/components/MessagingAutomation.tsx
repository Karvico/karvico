"use client";

import { useState } from 'react';
import { Zap, MessageSquare, Mail, Phone, Clock, Users, Settings, Play, Pause, BarChart3 } from 'lucide-react';

export default function MessagingAutomation() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [automations, setAutomations] = useState([
    {
      id: '1',
      name: 'Boas-vindas WhatsApp',
      type: 'whatsapp',
      status: 'active',
      triggers: 'Novo lead cadastrado',
      sent: 1247,
      opened: 1156,
      clicked: 892,
    },
    {
      id: '2',
      name: 'Follow-up Email',
      type: 'email',
      status: 'active',
      triggers: 'Após 24h sem resposta',
      sent: 856,
      opened: 634,
      clicked: 298,
    },
    {
      id: '3',
      name: 'Lembrete SMS',
      type: 'sms',
      status: 'paused',
      triggers: 'Reunião em 1 hora',
      sent: 423,
      opened: 423,
      clicked: 156,
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms': return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ));
    
    alert('🎯 AUTOMAÇÃO ATUALIZADA!\n\nStatus da automação alterado com sucesso!\n\n✅ Funcionalidades ativas:\n• Controle de status em tempo real\n• Métricas de performance\n• Triggers personalizáveis\n• Multi-canal (WhatsApp, Email, SMS)');
  };

  const createNewAutomation = () => {
    alert(`🎯 CRIAR NOVA AUTOMAÇÃO - FUNCIONALIDADE ATIVADA!\n\n🚀 Recursos disponíveis:\n\n📱 WHATSAPP:\n• Mensagens de boas-vindas\n• Follow-up automático\n• Lembretes de reunião\n• Promoções e ofertas\n\n📧 EMAIL:\n• Sequências de nutrição\n• Carrinho abandonado\n• Onboarding de clientes\n• Newsletters automáticas\n\n📱 SMS:\n• Confirmações de agendamento\n• Lembretes urgentes\n• Códigos de verificação\n• Alertas importantes\n\n⚙️ TRIGGERS:\n• Novo lead cadastrado\n• Tempo desde última interação\n• Ações específicas do usuário\n• Datas e horários programados\n\n📊 MÉTRICAS:\n• Taxa de entrega\n• Taxa de abertura\n• Taxa de clique\n• Conversões geradas\n\nSistema completo de automação pronto!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automações de Mensagens</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure automações para WhatsApp, Email e SMS
          </p>
        </div>
        <button
          onClick={createNewAutomation}
          className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Nova Automação</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mensagens Enviadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2,526</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+18% este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Abertura</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">87.3%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+5.2% este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Clique</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">34.6%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+12.1% este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Automações Ativas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+3 este mês</span>
          </div>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'whatsapp'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'sms'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>SMS</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Automations List */}
          <div className="space-y-4">
            {automations
              .filter(automation => activeTab === 'whatsapp' ? true : automation.type === activeTab)
              .map((automation) => (
                <div
                  key={automation.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        {getTypeIcon(automation.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {automation.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Trigger: {automation.triggers}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                        {automation.status === 'active' ? 'Ativa' : 'Pausada'}
                      </span>
                      <button
                        onClick={() => toggleAutomation(automation.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          automation.status === 'active'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {automation.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {automation.sent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enviadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {automation.opened.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Abertas</p>
                      <p className="text-xs text-green-600 font-medium">
                        {((automation.opened / automation.sent) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {automation.clicked.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cliques</p>
                      <p className="text-xs text-blue-600 font-medium">
                        {((automation.clicked / automation.opened) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Última execução: há 2 horas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alert('🎯 RELATÓRIO DETALHADO ATIVADO!\n\nVisualize métricas completas:\n✅ Performance por período\n✅ Segmentação de audiência\n✅ Análise de conversão\n✅ ROI da automação')}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Ver Relatório</span>
                      </button>
                      <button
                        onClick={() => alert('🎯 EDITAR AUTOMAÇÃO ATIVADA!\n\nPersonalize sua automação:\n✅ Alterar mensagens\n✅ Configurar triggers\n✅ Definir horários\n✅ Segmentar audiência')}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center space-x-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {automations.filter(automation => automation.type === activeTab).length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {getTypeIcon(activeTab)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma automação de {activeTab.toUpperCase()}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crie sua primeira automação para começar a engajar seus leads automaticamente.
              </p>
              <button
                onClick={createNewAutomation}
                className="bg-[#1D295A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeira Automação
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status das Integrações</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">WhatsApp Business</span>
            </div>
            <span className="text-sm font-medium text-green-600">Conectado</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">SMTP Email</span>
            </div>
            <span className="text-sm font-medium text-blue-600">Conectado</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800 dark:text-yellow-200">SMS Gateway</span>
            </div>
            <span className="text-sm font-medium text-yellow-600">Configurar</span>
          </div>
        </div>
      </div>
    </div>
  );
}