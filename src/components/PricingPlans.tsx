"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { stripePromise, isConfigured as isStripeConfigured, stripePlans } from '@/lib/stripe';
import { Crown, Check, Zap, TrendingUp, BarChart3, Filter, DollarSign } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const plans: PricingPlan[] = [
  {
    id: 'professional',
    name: 'Plano Profissional',
    price: 97,
    priceId: stripePlans.silver.priceId,
    description: 'Ideal para empreendedores iniciantes',
    icon: Crown,
    features: [
      'Dashboard completo',
      'Área de Membros com CRUD',
      'Sistema de Agenda',
      'Vendas & CRM básico',
      'Analytics essenciais',
      'Criação de cursos ilimitados',
      'Upload de vídeos e materiais',
      'Links de vendas personalizados',
      'Suporte por email',
    ],
  },
  {
    id: 'business',
    name: 'Plano Business',
    price: 397,
    priceId: stripePlans.pro.priceId,
    description: 'Para negócios que querem escalar',
    icon: Zap,
    popular: true,
    features: [
      'Tudo do Plano Profissional',
      'Funil de Qualificação com IA',
      'Automações avançadas',
      'Análise Financeira com IA',
      'Integração com Stripe',
      'Análise de dados bancários',
      'Analytics avançados com Gemini AI',
      'Relatórios personalizados',
      'Suporte prioritário',
      'Consultoria estratégica mensal',
    ],
  },
];

export default function PricingPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscription, isSubscribed } = useSubscription();

  // Determinar plano atual
  const currentPlan = subscription?.plan || 'free';

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) {
      alert('🔐 LOGIN NECESSÁRIO\n\nPara assinar um plano, você precisa estar logado.\n\n📋 Faça login e tente novamente.');
      return;
    }

    setLoading(plan.id);

    try {
      console.log('🚀 Iniciando checkout para:', plan.name);
      console.log('📋 Dados do plano:', {
        priceId: plan.priceId,
        userId: user.id,
        userEmail: user.email,
        planName: plan.name,
        planPrice: plan.price,
      });
      
      // Verificar se a API está acessível primeiro
      let response;
      try {
        response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            userId: user.id,
            userEmail: user.email,
            planName: plan.name,
            planPrice: plan.price,
          }),
        });
      } catch (fetchError) {
        console.error('❌ Erro de rede ao chamar API:', fetchError);
        
        // Verificar se é erro de rede ou servidor
        if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
          throw new Error('🌐 ERRO DE CONEXÃO\n\nNão foi possível conectar ao servidor de pagamentos.\n\n🔧 Possíveis causas:\n- Problema temporário de rede\n- Servidor em manutenção\n- Firewall bloqueando conexão\n\n💡 Tente novamente em alguns minutos.');
        }
        
        throw new Error(`Erro de conexão: ${fetchError instanceof Error ? fetchError.message : 'Falha na rede'}`);
      }

      console.log('📡 Status da resposta:', response.status);

      let responseData;
      try {
        responseData = await response.json();
        console.log('📋 Resposta da API:', responseData);
      } catch (jsonError) {
        console.error('❌ Erro ao fazer parse da resposta JSON:', jsonError);
        throw new Error('🔧 RESPOSTA INVÁLIDA DO SERVIDOR\n\nO servidor retornou uma resposta inválida.\n\n💡 Tente recarregar a página e tentar novamente.');
      }

      if (!response.ok) {
        console.error('❌ Resposta não OK:', response.status, responseData);
        
        // Tratar diferentes tipos de erro
        if (response.status === 500 && responseData.configured === false) {
          // Stripe não configurado - mostrar instruções detalhadas
          const configDetails = responseData.details || {};
          let configMessage = `🔧 STRIPE NÃO CONFIGURADO\n\n${responseData.message}\n\n📋 STATUS ATUAL:\n`;
          
          if (configDetails.secretKey !== undefined) {
            configMessage += `- STRIPE_SECRET_KEY: ${configDetails.secretKey ? '✅ Configurada' : '❌ Ausente'}\n`;
          }
          if (configDetails.publishableKey !== undefined) {
            configMessage += `- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${configDetails.publishableKey ? '✅ Configurada' : '❌ Ausente'}\n`;
          }
          if (responseData.priceId) {
            configMessage += `- Price ID: ${responseData.priceId}\n`;
          }
          
          configMessage += `\n📋 PARA O DESENVOLVEDOR:\n1. Acesse o dashboard do Stripe\n2. Copie suas chaves de API\n3. Configure as variáveis de ambiente\n4. Configure os Price IDs dos planos\n\n✅ Após configurar, os pagamentos funcionarão automaticamente!`;
          
          alert(configMessage);
          return;
        }
        
        if (response.status === 404) {
          throw new Error('🔧 API NÃO ENCONTRADA\n\nA API de pagamentos não foi encontrada.\n\n💡 Verifique se o servidor está rodando corretamente.');
        }
        
        if (response.status >= 500) {
          throw new Error('🔧 ERRO DO SERVIDOR\n\nOcorreu um erro interno no servidor.\n\n💡 Tente novamente em alguns minutos.');
        }
        
        throw new Error(responseData.message || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const { sessionId } = responseData;

      if (!sessionId) {
        console.error('❌ Session ID não retornado:', responseData);
        throw new Error('🔧 SESSÃO INVÁLIDA\n\nO servidor não retornou uma sessão de checkout válida.\n\n💡 Tente novamente ou entre em contato com o suporte.');
      }

      // Verificar se o Stripe está carregado
      console.log('🔄 Carregando Stripe...');
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('❌ Stripe não carregado');
        throw new Error('🔧 STRIPE NÃO CARREGADO\n\nErro ao carregar o sistema de pagamentos.\n\n💡 Verifique sua conexão e tente novamente.');
      }

      console.log('✅ Redirecionando para checkout:', sessionId);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('❌ Erro ao redirecionar para checkout:', error);
        throw new Error(`🔧 ERRO NO REDIRECIONAMENTO\n\n${error.message}\n\n💡 Tente novamente ou use outro método de pagamento.`);
      }

    } catch (error) {
      console.error('❌ Erro completo no checkout:', error);
      
      // Mostrar erro específico com mais detalhes
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Se a mensagem já está formatada (contém emojis), mostrar diretamente
      if (errorMessage.includes('🔧') || errorMessage.includes('🌐') || errorMessage.includes('🔐')) {
        alert(errorMessage);
      } else if (errorMessage.includes('não configurado') || 
          errorMessage.includes('placeholder') || 
          errorMessage.includes('Configure')) {
        alert(`🔧 STRIPE NÃO CONFIGURADO\n\n${errorMessage}\n\n📋 PARA ATIVAR PAGAMENTOS:\n1. Configure as chaves do Stripe\n2. Configure os Price IDs dos planos\n3. O sistema está pronto para funcionar!\n\n🔍 Verifique o console para mais detalhes.`);
      } else if (errorMessage.includes('conexão') || errorMessage.includes('rede') || errorMessage.includes('fetch')) {
        alert(`🌐 ERRO DE CONEXÃO\n\n${errorMessage}\n\n🔧 Verifique:\n- Conexão com internet\n- Se o servidor está rodando\n- Se a API route existe\n\n💡 Tente recarregar a página e tentar novamente.`);
      } else {
        alert(`❌ ERRO NO CHECKOUT\n\n${errorMessage}\n\n🔧 Possíveis causas:\n- Configuração do Stripe\n- Problema temporário no servidor\n- Price ID inválido\n\n🔍 Verifique o console para logs detalhados.\n\n💡 Tente novamente em alguns minutos.`);
      }
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'professional') return currentPlan === 'basic' || currentPlan === 'silver';
    if (planId === 'business') return currentPlan === 'premium' || currentPlan === 'pro';
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Escolha seu plano
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Desbloqueie todo o potencial do Karvico com nossos planos pagos.
          Cancele a qualquer momento.
        </p>
      </div>

      {/* Current Plan Status */}
      {isSubscribed && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200">
            <Crown className="w-5 h-5" />
            <span className="font-medium">
              Você está no plano {currentPlan.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Upgrade Banner for Free Users */}
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">🚀 Máquina de Vendas Pronta!</h3>
            <p className="text-orange-100 mb-4">
              Sistema completo para gerar receita recorrente. Escolha seu plano e comece a faturar hoje mesmo!
            </p>
          </div>
        </div>
      )}

      {/* Debug Info - Mostrar apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🔍 Debug Info</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <div>Stripe Configurado: {isStripeConfigured ? '✅ Sim' : '❌ Não'}</div>
            <div>Price ID Profissional: {stripePlans.silver.priceId}</div>
            <div>Price ID Business: {stripePlans.pro.priceId}</div>
            <div>Usuário: {user ? `✅ ${user.email}` : '❌ Não logado'}</div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isCurrent = isCurrentPlan(plan.id);
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular
                  ? 'border-[#1D295A] ring-4 ring-blue-100 dark:ring-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#1D295A] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#1D295A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    R$ {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id || isCurrent}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-[#1D295A] text-white hover:bg-blue-700'
                    : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id
                  ? 'Processando...'
                  : isCurrent
                  ? 'Plano Atual'
                  : plan.id === 'professional'
                  ? 'Assinar Profissional'
                  : 'Assinar Business'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Compare os recursos
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Vendas & CRM</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie leads, oportunidades e pipeline de vendas
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics com IA</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Análises inteligentes com Gemini AI para otimizar resultados
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Análise Financeira</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Conecte Stripe e contas bancárias para análise completa
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Perguntas Frequentes
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Posso cancelar a qualquer momento?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Sim, você pode cancelar sua assinatura a qualquer momento. 
              Você continuará tendo acesso até o final do período pago.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Como funciona a análise financeira?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              No Plano Business, você pode conectar sua conta Stripe e contas bancárias 
              para receber análises automáticas com IA sobre seu faturamento e fluxo de caixa.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Há garantia de reembolso?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Oferecemos garantia de 7 dias. Se não ficar satisfeito, 
              entre em contato e faremos o reembolso integral.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              O que inclui no Plano Profissional?
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              O Plano Profissional (R$ 97/mês) inclui CRUD completo de cursos, upload de materiais, 
              links de vendas personalizados e todas as ferramentas essenciais para começar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}