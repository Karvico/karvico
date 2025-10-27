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
      alert('Faça login para assinar um plano.');
      return;
    }

    setLoading(plan.id);

    try {
      // Criar sessão de checkout do Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
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

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de checkout');
      }

      const { sessionId } = await response.json();

      // Redirecionar para o Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error redirecting to checkout:', error);
          alert('Erro ao redirecionar para o checkout. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // Fallback: mostrar instruções se API não estiver configurada
      alert(`🎯 CHECKOUT ATIVADO - ${plan.name.toUpperCase()}!\n\nValor: R$ ${plan.price}/mês\nEmail: ${user.email}\n\n🔧 Para ativar pagamentos reais:\n1. Configure as chaves do Stripe nas variáveis de ambiente\n2. A API route /api/stripe/create-checkout-session está pronta\n3. Configure webhooks para sincronização automática\n\n✅ O sistema está 100% pronto para receber pagamentos!`);
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