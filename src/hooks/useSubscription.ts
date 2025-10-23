"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isConfigured } from '@/lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise' | 'silver' | 'pro';
  plan_status: 'active' | 'inactive' | 'cancelled';
  current_period_start: string;
  current_period_end: string;
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

  // Função para buscar assinatura
  const fetchSubscription = async (userId: string) => {
    if (!isConfigured) {
      // Se Supabase não configurado, simular usuário free
      setSubscription({
        id: 'mock-subscription',
        user_id: userId,
        plan: 'free',
        plan_status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('plan_status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar assinatura:', error);
        return;
      }

      if (data) {
        setSubscription(data);
      } else {
        // Usuário sem assinatura ativa = plano gratuito
        setSubscription({
          id: 'free-plan',
          user_id: userId,
          plan: 'free',
          plan_status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Erro inesperado ao buscar assinatura:', error);
      // Em caso de erro, assumir plano gratuito
      setSubscription({
        id: 'free-plan-fallback',
        user_id: userId,
        plan: 'free',
        plan_status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
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
        console.error('Erro ao obter usuário:', error);
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