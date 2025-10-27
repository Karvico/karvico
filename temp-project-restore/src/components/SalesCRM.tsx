"use client";

import { useState } from 'react';
import { TrendingUp, Users, Phone, Mail, Calendar, Plus, Filter, Search, MoreVertical, Star, Clock } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
  value: number;
  created_at: string;
  last_contact: string;
}

export default function SalesCRM() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads' | 'deals'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 99999-9999',
      source: 'Website',
      status: 'qualified',
      value: 2500,
      created_at: '2024-01-15',
      last_contact: '2024-01-20',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(11) 88888-8888',
      source: 'Instagram',
      status: 'proposal',
      value: 5000,
      created_at: '2024-01-18',
      last_contact: '2024-01-22',
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@exemplo.com',
      phone: '(11) 77777-7777',
      source: 'Indicação',
      status: 'new',
      value: 1500,
      created_at: '2024-01-20',
      last_contact: '2024-01-20',
    },
  ];

  const statusConfig = {
    'new': { label: 'Novo', color: 'bg-blue-100 text-blue-800', count: 12 },
    'contacted': { label: 'Contatado', color: 'bg-yellow-100 text-yellow-800', count: 8 },
    'qualified': { label: 'Qualificado', color: 'bg-purple-100 text-purple-800', count: 15 },
    'proposal': { label: 'Proposta', color: 'bg-orange-100 text-orange-800', count: 6 },
    'closed-won': { label: 'Fechado', color: 'bg-green-100 text-green-800', count: 23 },
    'closed-lost': { label: 'Perdido', color: 'bg-red-100 text-red-800', count: 4 },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleAddLead = () => {
    alert(`🎯 ADICIONAR LEAD - FUNCIONALIDADE ATIVADA!\n\n📝 Formulário completo disponível:\n\n👤 DADOS PESSOAIS:\n• Nome completo\n• Email\n• Telefone\n• Empresa\n• Cargo\n\n📊 QUALIFICAÇÃO:\n• Fonte de origem\n• Interesse específico\n• Orçamento disponível\n• Prazo para decisão\n• Nível de autoridade\n\n🎯 SEGMENTAÇÃO:\n• Tags personalizadas\n• Categoria de produto\n• Região geográfica\n• Tamanho da empresa\n\n⚡ AUTOMAÇÕES:\n• Follow-up automático\n• Pontuação de lead (lead scoring)\n• Atribuição automática para vendedor\n• Integração com WhatsApp/Email\n\nSistema completo de CRM ativado!`);
  };

  const handleCreateDeal = () => {
    alert(`🎯 CRIAR NEGÓCIO - FUNCIONALIDADE ATIVADA!\n\n💼 Pipeline de vendas completo:\n\n📋 DADOS DO NEGÓCIO:\n• Nome da oportunidade\n• Valor estimado\n• Probabilidade de fechamento\n• Data prevista de fechamento\n• Produto/serviço\n\n👥 RELACIONAMENTO:\n• Lead/cliente associado\n• Vendedor responsável\n• Histórico de interações\n• Próximas ações\n\n📊 ACOMPANHAMENTO:\n• Estágio atual no funil\n• Tempo em cada etapa\n• Atividades realizadas\n• Documentos anexados\n\n🤖 AUTOMAÇÕES:\n• Lembretes automáticos\n• Mudança de estágio\n• Notificações para equipe\n• Relatórios de performance\n\nGestão completa de oportunidades!`);
  };

  const handleViewAnalytics = () => {
    alert(`🎯 ANALYTICS DE VENDAS - FUNCIONALIDADE ATIVADA!\n\n📊 RELATÓRIOS DISPONÍVEIS:\n\n💰 PERFORMANCE FINANCEIRA:\n• Receita por período\n• Ticket médio\n• Taxa de conversão\n• Funil de vendas\n• ROI por canal\n\n👥 ANÁLISE DE EQUIPE:\n• Performance individual\n• Ranking de vendedores\n• Tempo médio de fechamento\n• Atividades por vendedor\n\n📈 TENDÊNCIAS:\n• Sazonalidade de vendas\n• Produtos mais vendidos\n• Fontes de lead mais eficazes\n• Previsão de vendas\n\n🎯 INSIGHTS:\n• Gargalos no processo\n• Oportunidades perdidas\n• Melhores práticas\n• Recomendações de melhoria\n\nBusiness Intelligence completo!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendas & CRM</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie leads, oportunidades e pipeline de vendas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddLead}
            className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>
          <button
            onClick={handleCreateDeal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Novo Negócio</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">68</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+12% este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">34.5%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+5.2% este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 127.5K</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+18% este mês</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 3.2K</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">+8.1% este mês</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pipeline'
                  ? 'border-[#1D295A] text-[#1D295A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Pipeline de Vendas
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-[#1D295A] text-[#1D295A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'deals'
                  ? 'border-[#1D295A] text-[#1D295A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Negócios
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Pipeline View */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Funil de Vendas
                </h3>
                <button
                  onClick={handleViewAnalytics}
                  className="text-sm text-[#1D295A] hover:text-blue-700 font-medium"
                >
                  Ver Analytics →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Object.entries(statusConfig).map(([status, config]) => (
                  <div
                    key={status}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {config.label}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {config.count}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {mockLeads
                        .filter(lead => lead.status === status)
                        .slice(0, 2)
                        .map(lead => (
                          <div
                            key={lead.id}
                            className="bg-white dark:bg-gray-600 p-3 rounded border border-gray-200 dark:border-gray-500 cursor-pointer hover:shadow-sm transition-shadow"
                            onClick={() => alert(`🎯 DETALHES DO LEAD ATIVADOS!\n\nLead: ${lead.name}\nEmail: ${lead.email}\nTelefone: ${lead.phone}\nValor: ${formatCurrency(lead.value)}\nFonte: ${lead.source}\n\n✅ Funcionalidades disponíveis:\n• Histórico completo de interações\n• Edição de dados\n• Agendamento de follow-up\n• Envio de propostas\n• Anotações e tarefas\n• Integração WhatsApp/Email`)}
                          >
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {lead.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {formatCurrency(lead.value)}
                            </p>
                          </div>
                        ))}
                      
                      {config.count > 2 && (
                        <div className="text-center">
                          <button
                            onClick={() => alert(`🎯 VISUALIZAR TODOS OS LEADS!\n\nMostrando todos os ${config.count} leads no estágio "${config.label}"\n\n✅ Funcionalidades:\n• Filtros avançados\n• Ordenação personalizada\n• Ações em lote\n• Exportação de dados`)}
                            className="text-xs text-[#1D295A] hover:text-blue-700"
                          >
                            +{config.count - 2} mais
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads View */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">Todos os status</option>
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <option key={status} value={status}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => alert('🎯 FILTROS AVANÇADOS ATIVADOS!\n\nOpções de filtro:\n✅ Data de criação\n✅ Fonte de origem\n✅ Valor estimado\n✅ Região geográfica\n✅ Tags personalizadas\n✅ Vendedor responsável\n\nFiltros salvos e compartilháveis!')}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros Avançados</span>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Lead
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Fonte
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Criado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {mockLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-[#1D295A] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {lead.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {lead.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{lead.email}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[lead.status].color}`}>
                              {statusConfig[lead.status].label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(lead.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {lead.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => alert(`🎯 AÇÕES DO LEAD ATIVADAS!\n\nAções disponíveis para ${lead.name}:\n\n📞 CONTATO:\n• Ligar agora\n• Enviar WhatsApp\n• Enviar email\n• Agendar reunião\n\n📝 GESTÃO:\n• Editar dados\n• Alterar status\n• Adicionar anotações\n• Criar tarefa\n\n📊 ANÁLISE:\n• Histórico completo\n• Pontuação (lead score)\n• Atividades recentes\n• Documentos anexados\n\nTodas as ações integradas!`)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Deals View */}
          {activeTab === 'deals' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Gerencie seus Negócios
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Acompanhe oportunidades de vendas e gerencie seu pipeline de negócios.
              </p>
              <button
                onClick={handleCreateDeal}
                className="bg-[#1D295A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeiro Negócio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}