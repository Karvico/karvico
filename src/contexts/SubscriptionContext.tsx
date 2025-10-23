"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

type PlanStatus = 'free' | 'silver' | 'pro';

interface SubscriptionContextType {
  planStatus: PlanStatus;
  isFreePlan: boolean;
  hasAccess: (module: string) => boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  planStatus: 'free',
  isFreePlan: true,
  hasAccess: () => false,
  refreshSubscription: async () => {},
});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Módulos disponíveis por plano
const MODULE_ACCESS = {
  free: ['Dashboard', 'Área de Membros', 'Agenda'],
  silver: ['Dashboard', 'Área de Membros', 'Agenda', 'Vendas & CRM', 'Analytics'],
  pro: ['Dashboard', 'Área de Membros', 'Agenda', 'Vendas & CRM', 'Analytics', 'Funil de Qualificação', 'Automações', 'Análise Financeira']
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [planStatus, setPlanStatus] = useState<PlanStatus>('free');
  const { user } = useAuth();

  const refreshSubscription = async () => {
    if (!user) {
      setPlanStatus('free');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan_status')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setPlanStatus(data?.plan_status || 'free');
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  const hasAccess = (module: string): boolean => {
    return MODULE_ACCESS[planStatus].includes(module);
  };

  const isFreePlan = planStatus === 'free';

  return (
    <SubscriptionContext.Provider value={{
      planStatus,
      isFreePlan,
      hasAccess,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}