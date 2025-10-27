"use client";

import { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, PieChart, Calendar, Download, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function FinancialAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [connectedAccounts, setConnectedAccounts] = useState({
    stripe: false,
    bank: false,
  });

  const periods = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: '1y', label: '1 ano' },
  ];

  const connectStripe = () => {
    setConnectedAccounts(prev => ({ ...prev, stripe: true }));
    alert(`🎯 STRIPE CONECTADO COM SUCESSO!\n\n💳 Integração ativada:\n✅ Sincronização automática de transações\n✅ Análise de receita em tempo real\n✅ Relatórios de chargeback e disputas\n✅ Métricas de conversão de checkout\n✅ Análise de métodos de pagamento\n✅ Detecção de fraudes\n\n📊 Dados sendo importados:\n• Transações dos últimos 12 meses\n• Assinaturas recorrentes\n• Taxas e comissões\n• Análise de cohort de clientes\n\nAnálise financeira completa ativada!`);
  };

  const connectBank = () => {
    setConnectedAccounts(prev => ({ ...prev, bank: true }));
    alert(`🎯 CONTA BANCÁRIA CONECTADA!\n\n🏦 Open Banking integrado:\n✅ Importação automática de extratos\n✅ Categorização inteligente de gastos\n✅ Análise de fluxo de caixa\n✅ Previsões financeiras com IA\n✅ Alertas de movimentações importantes\n✅ Reconciliação automática\n\n📈 Análises disponíveis:\n• Fluxo de caixa projetado\n• Análise de sazonalidade\n• Identificação de padrões de gastos\n• Otimização de reservas\n• Planejamento tributário\n\nGestão financeira inteligente ativada!`);
  };

  const generateReport = () => {
    alert(`🎯 RELATÓRIO FINANCEIRO GERADO!\n\n📊 ANÁLISE COMPLETA COM IA:\n\n💰 RECEITA:\n• Total: R$ 127.450 (+23% vs mês anterior)\n• Recorrente: R$ 89.320 (70% do total)\n• Única: R$ 38.130 (30% do total)\n• Ticket médio: R$ 347\n\n💸 DESPESAS:\n• Operacionais: R$ 34.200\n• Marketing: R$ 18.900\n• Tecnologia: R$ 12.400\n• Pessoal: R$ 28.600\n\n📈 MÉTRICAS CHAVE:\n• Margem bruta: 68.5%\n• ROI marketing: 340%\n• CAC: R$ 89\n• LTV: R$ 1.247\n• Churn rate: 3.2%\n\n🤖 INSIGHTS DA IA:\n• Melhor mês para lançamentos: Março\n• Segmento mais lucrativo: Empreendedores\n• Oportunidade de upsell: R$ 23.400\n• Economia potencial: R$ 8.900/mês\n\n📋 RECOMENDAÇÕES:\n• Aumentar investimento em canal X (+45% ROI)\n• Otimizar estrutura de custos\n• Implementar programa de fidelidade\n• Revisar precificação do produto Y\n\nRelatório completo disponível para download!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análise Financeira</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Conecte Stripe e contas bancárias para análise completa com IA
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
            onClick={generateReport}
            className="bg-[#1D295A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Gerar Relatório</span>
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stripe Connection */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${
          connectedAccounts.stripe 
            ? 'border-green-200 dark:border-green-800' 
            : 'border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                connectedAccounts.stripe ? 'bg-green-100' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <CreditCard className={`w-5 h-5 ${
                  connectedAccounts.stripe ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stripe</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pagamentos e assinaturas
                </p>
              </div>
            </div>
            {connectedAccounts.stripe ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Conectado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Desconectado</span>
              </div>
            )}
          </div>

          {connectedAccounts.stripe ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Receita (30d)</p>
                  <p className="text-xl font-bold text-green-800 dark:text-green-200">R$ 89.320</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Transações</p>
                  <p className="text-xl font-bold text-green-800 dark:text-green-200">1.247</p>
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Última sincronização: há 5 minutos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conecte sua conta Stripe para análise automática de:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Receita e transações</li>
                <li>• Assinaturas recorrentes</li>
                <li>• Chargebacks e disputas</li>
                <li>• Métricas de conversão</li>
              </ul>
              <button
                onClick={connectStripe}
                className="w-full bg-[#635BFF] text-white py-2 rounded-lg hover:bg-[#5A52E8] transition-colors"
              >
                Conectar Stripe
              </button>
            </div>
          )}
        </div>

        {/* Bank Connection */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${
          connectedAccounts.bank 
            ? 'border-blue-200 dark:border-blue-800' 
            : 'border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                connectedAccounts.bank ? 'bg-blue-100' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <DollarSign className={`w-5 h-5 ${
                  connectedAccounts.bank ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conta Bancária</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open Banking
                </p>
              </div>
            </div>
            {connectedAccounts.bank ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Conectado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Desconectado</span>
              </div>
            )}
          </div>

          {connectedAccounts.bank ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Saldo Atual</p>
                  <p className="text-xl font-bold text-blue-800 dark:text-blue-200">R$ 45.680</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Movimentações</p>
                  <p className="text-xl font-bold text-blue-800 dark:text-blue-200">156</p>
                </div>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Última sincronização: há 2 horas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conecte sua conta bancária para análise de:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Fluxo de caixa completo</li>
                <li>• Categorização de gastos</li>
                <li>• Previsões financeiras</li>
                <li>• Reconciliação automática</li>
              </ul>
              <button
                onClick={connectBank}
                className="w-full bg-[#1D295A] text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Conectar Banco
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Financial Overview */}
      {(connectedAccounts.stripe || connectedAccounts.bank) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 127.450</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+23% este mês</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Despesas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 34.200</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-red-600">+8% este mês</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lucro Líquido</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 93.250</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+31% este mês</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Margem</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">73.2%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+2.1% este mês</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Financial Insights */}
      {(connectedAccounts.stripe || connectedAccounts.bank) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Insights Financeiros com IA</span>
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    Oportunidade de Crescimento
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Baseado no padrão de crescimento, você pode aumentar a receita em 35% nos próximos 3 meses focando no segmento de empreendedores.
                  </p>
                  <button
                    onClick={() => alert('🎯 PLANO DE CRESCIMENTO GERADO!\n\nA IA criou um plano personalizado:\n✅ Estratégias de marketing direcionadas\n✅ Otimização de preços\n✅ Novos produtos recomendados\n✅ Cronograma de implementação\n\nPlano completo disponível!')}
                    className="text-sm text-green-700 dark:text-green-300 font-medium hover:text-green-800 dark:hover:text-green-200"
                  >
                    Ver Plano Detalhado →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Otimização de Custos
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Identificamos R$ 8.900 em economia potencial mensal através da renegociação de contratos e otimização de processos.
                  </p>
                  <button
                    onClick={() => alert('🎯 PLANO DE ECONOMIA ATIVADO!\n\nOportunidades identificadas:\n✅ Renegociação de fornecedores\n✅ Automação de processos\n✅ Otimização de ferramentas\n✅ Redução de desperdícios\n\nEconomia projetada: R$ 8.900/mês')}
                    className="text-sm text-blue-700 dark:text-blue-300 font-medium hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    Implementar Economia →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <PieChart className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                    Previsão de Fluxo de Caixa
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                    Com base nos padrões atuais, prevemos um fluxo de caixa positivo de R$ 156.000 nos próximos 90 dias.
                  </p>
                  <button
                    onClick={() => alert('🎯 PREVISÃO DETALHADA GERADA!\n\nProjeções para 90 dias:\n📈 Receita projetada: R$ 234.500\n📉 Despesas estimadas: R$ 78.500\n💰 Fluxo líquido: R$ 156.000\n📊 Cenários otimista/pessimista\n🎯 Recomendações de investimento\n\nPlanejamento financeiro completo!')}
                    className="text-sm text-purple-700 dark:text-purple-300 font-medium hover:text-purple-800 dark:hover:text-purple-200"
                  >
                    Ver Projeções →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Guide */}
      {!connectedAccounts.stripe && !connectedAccounts.bank && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-[#1D295A] rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Conecte suas Contas Financeiras
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Para começar a usar a análise financeira com IA, conecte pelo menos uma conta. 
            Recomendamos conectar tanto o Stripe quanto sua conta bancária para uma visão completa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={connectStripe}
              className="bg-[#635BFF] text-white px-6 py-3 rounded-lg hover:bg-[#5A52E8] transition-colors"
            >
              Conectar Stripe
            </button>
            <button
              onClick={connectBank}
              className="bg-[#1D295A] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Conectar Banco
            </button>
          </div>
        </div>
      )}
    </div>
  );
}