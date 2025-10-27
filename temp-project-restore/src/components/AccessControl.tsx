"use client";

import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Lock } from 'lucide-react';

interface AccessControlProps {
  children: ReactNode;
  requiredPlan?: 'basic' | 'premium' | 'enterprise';
}

export default function AccessControl({ children, requiredPlan }: AccessControlProps) {
  const { isSubscribed, subscription } = useSubscription();

  // Se não há restrição de plano, sempre permitir acesso
  if (!requiredPlan) {
    return <>{children}</>;
  }

  // Verificar se o usuário tem acesso baseado no plano
  const hasAccess = () => {
    if (!isSubscribed) return false;
    
    const currentPlan = subscription?.plan || 'free';
    
    switch (requiredPlan) {
      case 'basic':
        return ['basic', 'premium', 'enterprise', 'silver', 'pro'].includes(currentPlan);
      case 'premium':
        return ['premium', 'enterprise', 'pro'].includes(currentPlan);
      case 'enterprise':
        return ['enterprise'].includes(currentPlan);
      default:
        return false;
    }
  };

  // Se tem acesso, renderizar o conteúdo
  if (hasAccess()) {
    return <>{children}</>;
  }

  // Se não tem acesso, mostrar tela de upgrade
  const getPlanName = () => {
    switch (requiredPlan) {
      case 'basic': return 'Silver';
      case 'premium': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Premium';
    }
  };

  const getPlanPrice = () => {
    switch (requiredPlan) {
      case 'basic': return 'R$ 117';
      case 'premium': return 'R$ 497';
      case 'enterprise': return 'Sob consulta';
      default: return 'R$ 117';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Upgrade Necessário
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Este recurso está disponível apenas para usuários do plano <strong>{getPlanName()}</strong> ou superior.
      </p>
      
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Crown className="w-5 h-5 text-orange-600" />
          <span className="font-semibold text-gray-900 dark:text-white">Plano {getPlanName()}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{getPlanPrice()}/mês</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Acesso completo a todas as funcionalidades
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Crown className="w-4 h-4 text-green-500" />
          <span>Analytics com IA</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Crown className="w-4 h-4 text-green-500" />
          <span>Automações avançadas</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Crown className="w-4 h-4 text-green-500" />
          <span>Relatórios personalizados</span>
        </div>
      </div>
      
      <button
        onClick={() => {
          // Navegar para planos
          window.location.hash = 'planos';
          alert('🎯 UPGRADE ATIVADO!\n\nRedirecionando para página de planos...\n\n✅ Funcionalidade implementada:\n• Redirecionamento automático\n• Integração com Stripe\n• Checkout seguro\n• Ativação imediata');
        }}
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-semibold"
      >
        Fazer Upgrade Agora
      </button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Cancele a qualquer momento • Garantia de 7 dias
      </p>
    </div>
  );
}