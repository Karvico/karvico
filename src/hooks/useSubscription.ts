"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isConfigured } from '@/lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise' | 'silver' | 'pro';
  plan_status: 'active' | 'inactive' | 'cancelled';
  expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
  isSubscribed: boolean;
  refreshSubscription: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Função para criar assinatura padrão (free)
  const createDefaultSubscription = (userId: string): Subscription => ({
    id: 'free-plan-default',
    user_id: userId,
    plan: 'free',
    plan_status: 'active',
    expires_at: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Função para buscar assinatura
  const fetchSubscription = async (userId: string) => {
    if (!isConfigured) {
      console.log('🔧 Supabase não configurado - usando plano gratuito padrão');
      setSubscription(createDefaultSubscription(userId));
      return;
    }

    try {
      console.log('🔍 Buscando assinatura para usuário:', userId);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan_status, expires_at, stripe_customer_id, stripe_subscription_id, created_at, updated_at')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle() em vez de single() para evitar erro quando não encontrar

      if (error) {
        console.warn('⚠️ Erro ao buscar assinatura (tabela pode não existir):', error.message);
        // Se a tabela não existir ou houver erro de acesso, usar plano gratuito
        setSubscription(createDefaultSubscription(userId));
        return;
      }

      if (data) {
        console.log('✅ Assinatura encontrada:', data);
        // Mapear plan_status para plan (assumindo que plan_status contém o tipo do plano)
        const planType = data.plan_status === 'free' ? 'free' : 
                        data.plan_status === 'basic' ? 'basic' :
                        data.plan_status === 'premium' ? 'premium' :
                        data.plan_status === 'enterprise' ? 'enterprise' :
                        data.plan_status === 'silver' ? 'silver' :
                        data.plan_status === 'pro' ? 'pro' : 'free';

        setSubscription({
          ...data,
          plan: planType,
          plan_status: data.expires_at && new Date(data.expires_at) > new Date() ? 'active' : 'inactive'
        });
      } else {
        console.log('📝 Nenhuma assinatura encontrada - usando plano gratuito');
        // Usuário sem assinatura = plano gratuito
        setSubscription(createDefaultSubscription(userId));
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar assinatura:', error);
      // Em caso de erro de rede ou outro, assumir plano gratuito
      setSubscription(createDefaultSubscription(userId));
    }
  };

  // Função para atualizar assinatura
  const refreshSubscription = async () => {
    if (user) {
      setLoading(true);
      await fetchSubscription(user.id);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      console.log('🔧 Supabase não configurado - modo offline');
      setLoading(false);
      return;
    }

    // Obter usuário atual
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          await fetchSubscription(user.id);
        }
      } catch (error) {
        console.error('❌ Erro ao obter usuário:', error);
        // Em caso de erro, não bloquear a aplicação
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Escutar mudanças de autenticação
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          setLoading(true);
          await fetchSubscription(currentUser.id);
          setLoading(false);
        } else {
          setSubscription(null);
          setLoading(false);
        }
      }
    );

    return () => authSubscription.unsubscribe();
  }, []);

  const isSubscribed = subscription ? subscription.plan !== 'free' : false;

  return {
    subscription,
    loading,
    isSubscribed,
    refreshSubscription,
  };
};