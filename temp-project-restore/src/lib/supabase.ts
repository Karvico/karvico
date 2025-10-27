import { createClient } from '@supabase/supabase-js';

// Função para verificar se as variáveis de ambiente estão configuradas
const checkEnvironmentVariables = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return {
    url: url || '',
    key: key || '',
    isValid: !!(url && key && !url.includes('placeholder') && !key.includes('placeholder'))
  };
};

// Verificar configuração
const config = checkEnvironmentVariables();

// Usar valores seguros para desenvolvimento se não configurado
const supabaseUrl = config.url || 'https://placeholder.supabase.co';
const supabaseAnonKey = config.key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'karvico-dashboard'
    }
  }
});

// Exportar status da configuração
export const isConfigured = config.isValid;

// Função helper para operações seguras
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isConfigured) {
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('❌ Erro na operação Supabase:', error);
    return fallback;
  }
};

// Mensagem de configuração para o usuário
export const getConfigurationMessage = () => {
  if (isConfigured) {
    return '✅ Supabase configurado corretamente';
  }
  
  return '⚠️ Supabase não configurado. Clique no banner laranja \"Configurar\" ou vá em Configurações → Integrações → Conectar Supabase';
};