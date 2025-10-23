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
    id: 'silver',
    name: 'Silver',
    price: stripePlans.silver.price,
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
    id: 'pro',
    name: 'Pro',
    price: stripePlans.pro.price,
    priceId: stripePlans.pro.priceId,
    description: 'Para negócios que querem escalar',
    icon: Zap,
    popular: true,
    features: [
      'Tudo do plano Silver',
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

    // Verificar se o Stripe está configurado
    if (!isStripeConfigured) {
      alert(`🔄 CONFIGURAÇÃO DO STRIPE NECESSÁRIA:

Para ativar os pagamentos, você precisa:

1️⃣ Criar conta no Stripe (stripe.com)
2️⃣ Obter suas chaves API (Dashboard → Developers → API Keys)
3️⃣ Configurar no projeto:
   • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   • STRIPE_SECRET_KEY

4️⃣ Criar produtos no Stripe:
   • Plano Silver: R$ ${plan.id === 'silver' ? plan.price : stripePlans.silver.price}/mês
   • Plano Pro: R$ ${plan.id === 'pro' ? plan.price : stripePlans.pro.price}/mês

5️⃣ Configurar webhooks para sincronização

💡 Após configurar, os botões funcionarão automaticamente!`);
      return;
    }

    setLoading(plan.id);

    try {
      // Simular criação de checkout session (implementar API route posteriormente)
      console.log('🔄 Iniciando checkout para plano:', plan.name);
      console.log('💳 Dados do checkout:', {
        priceId: plan.priceId,
        userId: user.id,
        userEmail: user.email,
        planName: plan.name,
        planPrice: plan.price
      });

      // Por enquanto, simular sucesso
      setTimeout(() => {
        alert(`✅ CHECKOUT SIMULADO:

Plano: ${plan.name}
Valor: R$ ${plan.price}/mês
Email: ${user.email}

🔧 Para ativar pagamentos reais:
1. Configure as chaves do Stripe
2. Implemente API route /api/stripe/create-checkout-session
3. Configure webhooks para sincronização

O sistema está pronto para integração completa!`);
        setLoading(null);
      }, 2000);

      // TODO: Implementar API route para Stripe
      /*
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de checkout');
      }

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      if (stripe && sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error redirecting to checkout:', error);
          alert('Erro ao redirecionar para o checkout. Tente novamente.');
        }
      }
      */
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao processar pagamento. Tente novamente ou entre em contato com o suporte.');
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'silver') return currentPlan === 'basic' || currentPlan === 'silver';
    if (planId === 'pro') return currentPlan === 'premium' || currentPlan === 'pro';
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Escolha seu plano
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Desbloqueie todo o potencial do Karvico com nossos planos pagos.
          Cancele a qualquer momento.
        </p>
      </div>

      {/* Current Plan Status */}
      {isSubscribed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-800">
            <Crown className="w-5 h-5" />
            <span className="font-medium">
              Você está no plano {currentPlan.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Configuration Status */}
      {!isStripeConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-amber-800">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">
              ⚙️ Configure o Stripe para ativar pagamentos automáticos
            </span>
          </div>
          <p className="text-amber-700 text-sm mt-2">
            Clique nos botões abaixo para ver as instruções de configuração
          </p>
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
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular
                  ? 'border-[#1D295A] ring-4 ring-blue-100'
                  : 'border-gray-200'
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id || isCurrent}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-[#1D295A] text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id
                  ? 'Processando...'
                  : isCurrent
                  ? 'Plano Atual'
                  : `Assinar ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Compare os recursos
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Vendas & CRM</h4>
            <p className="text-sm text-gray-600">
              Gerencie leads, oportunidades e pipeline de vendas
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Analytics com IA</h4>
            <p className="text-sm text-gray-600">
              Análises inteligentes com Gemini AI para otimizar resultados
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Análise Financeira</h4>
            <p className="text-sm text-gray-600">
              Conecte Stripe e contas bancárias para análise completa
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Perguntas Frequentes
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Posso cancelar a qualquer momento?
            </h4>
            <p className="text-gray-600">
              Sim, você pode cancelar sua assinatura a qualquer momento. 
              Você continuará tendo acesso até o final do período pago.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Como funciona a análise financeira?
            </h4>
            <p className="text-gray-600">
              No plano Pro, você pode conectar sua conta Stripe e contas bancárias 
              para receber análises automáticas com IA sobre seu faturamento e fluxo de caixa.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Há garantia de reembolso?
            </h4>
            <p className="text-gray-600">
              Oferecemos garantia de 7 dias. Se não ficar satisfeito, 
              entre em contato e faremos o reembolso integral.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              O que inclui no plano Silver?
            </h4>
            <p className="text-gray-600">
              O plano Silver (R$ 117/mês) inclui CRUD completo de cursos, upload de materiais, 
              links de vendas personalizados e todas as ferramentas essenciais para começar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}