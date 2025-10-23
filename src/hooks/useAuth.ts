"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isConfigured } from '@/lib/supabase';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se o Supabase não está configurado, não tenta fazer operações
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session apenas se configurado
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn('Supabase não configurado corretamente:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes apenas se configurado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: { message: 'Supabase não está configurado. Clique no banner laranja "Configurar" para adicionar suas credenciais.' } };
    }

    try {
      console.log('🔐 Tentando login com email/senha...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erro no login:', error);
        
        // Melhorar mensagens de erro específicas
        let errorMessage = 'Erro ao fazer login. Tente novamente.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Cadastro desabilitado. Entre em contato com o administrador.';
        }
        
        return { error: { message: errorMessage } };
      }
      
      if (data.user) {
        console.log('✅ Login realizado com sucesso:', data.user.email);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado no signIn:', error);
      return { error: { message: 'Erro inesperado ao fazer login. Verifique sua conexão e tente novamente.' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: { message: 'Supabase não está configurado. Clique no banner laranja "Configurar" para adicionar suas credenciais.' } };
    }

    try {
      console.log('📝 Tentando criar conta...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erro no cadastro:', error);
        
        // Melhorar mensagens de erro específicas
        let errorMessage = 'Erro ao criar conta. Tente novamente.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Cadastro desabilitado. Entre em contato com o administrador.';
        }
        
        return { error: { message: errorMessage } };
      }
      
      if (data.user) {
        console.log('✅ Conta criada com sucesso:', data.user.email);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado no signUp:', error);
      return { error: { message: 'Erro inesperado ao criar conta. Verifique sua conexão e tente novamente.' } };
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      return { error: { message: 'Supabase não está configurado' } };
    }

    try {
      console.log('🚪 Fazendo logout...');
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        console.log('✅ Logout realizado com sucesso');
      }
      
      return { error };
    } catch (error: any) {
      console.error('❌ Erro no signOut:', error);
      return { error: { message: 'Erro ao fazer logout. Tente novamente.' } };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return { error: { message: 'Supabase não está configurado. Clique no banner laranja "Configurar" para adicionar suas credenciais.' } };
    }

    try {
      console.log('🔄 Enviando email de recuperação...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error('❌ Erro no reset de senha:', error.message);
        
        if (error.message.includes('For security purposes')) {
          return { error: { message: 'Por segurança, aguarde alguns minutos antes de solicitar outro reset.' } };
        }
        
        return { error: { message: error.message } };
      }
      
      console.log('✅ Email de recuperação enviado');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado no resetPassword:', error);
      return { error: { message: 'Erro ao enviar email de recuperação. Tente novamente.' } };
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      return { error: { message: 'Supabase não está configurado. Clique no banner laranja "Configurar" para adicionar suas credenciais.' } };
    }

    try {
      console.log('🔍 Iniciando login com Google...');
      
      // CORREÇÃO CRÍTICA: URL de callback mais robusta e configuração OAuth aprimorada
      const currentUrl = window.location.origin;
      const callbackUrl = `${currentUrl}/auth/callback`;
      
      console.log('🔗 URL de callback configurada:', callbackUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: undefined, // Remove domain restriction
          },
          skipBrowserRedirect: false, // Garante redirecionamento
        }
      });
      
      if (error) {
        console.error('❌ Erro no OAuth Google:', error);
        
        // DIAGNÓSTICO DETALHADO para erro 403
        let errorMessage = 'Erro ao fazer login com Google.';
        
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = `❌ ERRO 403 - CONFIGURAÇÃO NECESSÁRIA:

🔧 PASSOS PARA RESOLVER:

1️⃣ SUPABASE DASHBOARD:
   • Vá em Authentication → Providers → Google
   • Verifique se está HABILITADO
   • Configure Client ID e Client Secret do Google

2️⃣ GOOGLE CLOUD CONSOLE:
   • Acesse console.cloud.google.com
   • Vá em APIs & Services → Credentials
   • Configure OAuth 2.0 Client IDs
   • Adicione URLs autorizadas:
     - ${currentUrl}
     - ${callbackUrl}

3️⃣ URLs DE CALLBACK:
   • No Supabase: ${callbackUrl}
   • No Google: ${callbackUrl}

4️⃣ VERIFICAR DOMÍNIO:
   • Certifique-se que o domínio está autorizado
   • Remova restrições de domínio se houver

⚠️ ERRO 403 = Configuração OAuth incompleta ou URLs não autorizadas`;
        } else if (error.message.includes('Unsupported provider')) {
          errorMessage = 'Provedor Google não está habilitado. Configure no painel do Supabase → Authentication → Providers → Google.';
        } else if (error.message.includes('Invalid redirect URL')) {
          errorMessage = `URL de callback não configurada. Configure no painel do Supabase: ${callbackUrl}`;
        } else if (error.message.includes('OAuth client')) {
          errorMessage = 'Credenciais do Google OAuth não configuradas. Configure Client ID e Client Secret no painel do Supabase.';
        }
        
        return { error: { message: errorMessage } };
      }
      
      console.log('✅ Redirecionamento OAuth iniciado');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado no signInWithGoogle:', error);
      
      // DIAGNÓSTICO ADICIONAL para erros de rede
      let errorMessage = 'Erro inesperado ao fazer login com Google.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        errorMessage = `❌ ERRO DE REDE - POSSÍVEIS CAUSAS:

🔧 VERIFICAR:
1️⃣ Conexão com internet
2️⃣ Configuração do Supabase
3️⃣ URLs de callback no Google Console
4️⃣ Certificados SSL do domínio

💡 DICA: Teste em modo incógnito para descartar cache/cookies`;
      }
      
      return { error: { message: errorMessage } };
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isSupabaseConfigured: isConfigured,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
  };
};