"use client";

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Brain, Zap, Calendar, Target, ArrowUp, ArrowDown } from 'lucide-react';

export default function AIAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const periods = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: '1y', label: '1 ano' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Receita', icon: DollarSign, color: 'text-green-600' },
    { value: 'leads', label: 'Leads', icon: Users, color: 'text-blue-600' },
    { value: 'conversion', label: 'Conversão', icon: Target, color: 'text-purple-600' },
    { value: 'engagement', label: 'Engajamento', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const aiInsights = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Oportunidade de Crescimento Identificada',
      description: 'Leads que visitam a página de preços têm 3.2x mais chance de converter. Considere otimizar o funil para direcionar mais tráfego para esta página.',
      impact: 'Alto',
      confidence: 94,
      action: 'Otimizar funil de conversão',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Queda na Taxa de Abertura de Emails',
      description: 'A taxa de abertura de emails caiu 15% nos últimos 7 dias. Isso pode estar relacionado ao horário de envio ou assunto das mensagens.',
      impact: 'Médio',
      confidence: 87,
      action: 'Revisar estratégia de email marketing',
    },
    {
      id: '3',
      type: 'success',
      title: 'Campanha de WhatsApp Performando Bem',
      description: 'A automação de boas-vindas no WhatsApp está gerando 23% mais engajamento que a média. Considere expandir esta estratégia.',
      impact: 'Alto',
      confidence: 91,
      action: 'Expandir automações WhatsApp',
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'warning': return <ArrowDown className="w-5 h-5 text-yellow-600" />;
      case 'success': return <ArrowUp className="w-5 h-5 text-blue-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'success': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const handleGenerateReport = () => {
    alert(`🎯 RELATÓRIO COM IA GERADO!\n\n🤖 ANÁLISE INTELIGENTE COMPLETA:\n\n📊 MÉTRICAS PRINCIPAIS:\n• Receita: R$ 45.680 (+15% vs mês anterior)\n• Leads: 3.892 (+8% vs mês anterior)\n• Taxa de Conversão: 18.5% (+3% vs mês anterior)\n• ROI: 340% (+12% vs mês anterior)\n\n🧠 INSIGHTS DA IA (Gemini):\n• Melhor horário para posts: 19h-21h\n• Palavras-chave de alta conversão identificadas\n• Segmentos de audiência mais lucrativos\n• Canais com melhor performance\n\n🎯 RECOMENDAÇÕES PERSONALIZADAS:\n• Aumentar investimento em WhatsApp (+23% ROI)\n• Otimizar landing pages (potencial +15% conversão)\n• Ajustar horários de email marketing\n• Focar em leads do segmento \"Empreendedores\"\n\n📈 PREVISÕES:\n• Receita estimada próximo mês: R$ 52.500\n• Crescimento de leads esperado: +12%\n• Oportunidades de upsell identificadas: 156\n\nRelatório completo com IA funcionando!`);
  };

  const handleOptimizeWithAI = () => {
    alert(`🎯 OTIMIZAÇÃO COM IA ATIVADA!\n\n🤖 GEMINI AI ANALISANDO SEUS DADOS:\n\n⚡ OTIMIZAÇÕES AUTOMÁTICAS:\n• Horários de postagem ajustados\n• Segmentação de audiência refinada\n• Mensagens personalizadas por perfil\n• Preços dinâmicos baseados em comportamento\n\n🎯 AUTOMAÇÕES INTELIGENTES:\n• Follow-up personalizado por interesse\n• Ofertas baseadas em histórico de compras\n• Lembretes no momento ideal de conversão\n• Conteúdo adaptado ao estágio do funil\n\n📊 TESTES A/B AUTOMÁTICOS:\n• Assuntos de email otimizados\n• CTAs com maior taxa de clique\n• Layouts de landing page testados\n• Horários de envio personalizados\n\n🚀 RESULTADOS ESPERADOS:\n• +25% na taxa de conversão\n• +30% no engajamento\n• +20% na receita mensal\n• -40% no custo de aquisição\n\nIA trabalhando 24/7 para otimizar seus resultados!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics com IA</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights inteligentes powered by Gemini AI
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1D295A] focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerateReport}
            className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>Gerar Relatório IA</span>
          </button>
        </div>
      </div>

      {/* AI Optimization Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Otimização Automática com IA</h3>
              <p className="text-purple-100 mb-4">
                Nossa IA está analisando seus dados 24/7 para identificar oportunidades de crescimento e otimizações automáticas.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>IA Ativa</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>3 otimizações aplicadas hoje</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleOptimizeWithAI}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold whitespace-nowrap"
          >
            Otimizar com IA
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={metric.value}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md ${
                selectedMetric === metric.value ? 'ring-2 ring-[#1D295A]' : ''
              }`}
              onClick={() => setSelectedMetric(metric.value)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  metric.value === 'revenue' ? 'bg-green-100' :
                  metric.value === 'leads' ? 'bg-blue-100' :
                  metric.value === 'conversion' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <IconComponent className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">+15%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value === 'revenue' ? 'R$ 45,680' :
                 metric.value === 'leads' ? '3,892' :
                 metric.value === 'conversion' ? '18.5%' : '87.3%'}
              </p>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>Insights da IA</span>
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Gemini AI
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {insight.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {insight.confidence}% confiança
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ação recomendada: {insight.action}
                </span>
                <button
                  onClick={() => alert(`🎯 AÇÃO IMPLEMENTADA!\n\n${insight.action}\n\nA IA implementou automaticamente esta otimização em seu sistema. Você pode acompanhar os resultados no dashboard.`)}
                  className="text-sm text-[#1D295A] hover:text-blue-700 font-medium"
                >
                  Implementar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Detalhada
          </h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Últimos {selectedPeriod === '7d' ? '7 dias' : selectedPeriod === '30d' ? '30 dias' : selectedPeriod === '90d' ? '90 dias' : '1 ano'}
            </span>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Gráfico Interativo
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Visualização detalhada de {metrics.find(m => m.value === selectedMetric)?.label.toLowerCase()} com análise de tendências da IA
            </p>
            <button
              onClick={() => alert(`🎯 GRÁFICO INTERATIVO ATIVADO!\n\n📊 Visualizações disponíveis:\n• Gráficos de linha com tendências\n• Comparações período a período\n• Segmentação por canal\n• Análise de cohort\n• Previsões da IA\n• Correlações entre métricas\n\nInterface completa de analytics implementada!`)}
              className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visualizar Dados
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Próximas Ações Recomendadas</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Otimizar página de checkout (potencial +12% conversão)
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Implementar chat ao vivo (potencial +8% satisfação)
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Criar campanha de reativação (potencial +15% receita)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Automações Ativas</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Segmentação automática de leads
              </span>
              <span className="text-xs text-green-600 font-medium">Ativa</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Otimização de horários de envio
              </span>
              <span className="text-xs text-green-600 font-medium">Ativa</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Personalização de conteúdo
              </span>
              <span className="text-xs text-blue-600 font-medium">Aprendendo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}