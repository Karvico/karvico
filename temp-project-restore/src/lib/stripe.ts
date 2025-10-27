import { loadStripe } from '@stripe/stripe-js';

// Verificar se o Stripe está configurado
const isStripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Criar instância do Stripe apenas se configurado
export const stripePromise = isStripeConfigured 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  : null;

// Exportar status da configuração
export const isConfigured = isStripeConfigured;

// Função helper para operações seguras do Stripe
export const safeStripeOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isConfigured) {
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('❌ Erro na operação Stripe:', error);
    return fallback;
  }
};

// Configuração dos planos - VALORES ATUALIZADOS CONFORME SOLICITADO
export const stripePlans = {
  silver: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_SILVER_PRICE_ID || 'price_silver_placeholder',
    price: 97, // R$ 97,00 / mês - PLANO PROFISSIONAL
    name: 'Plano Profissional'
  },
  pro: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    price: 397, // R$ 397,00 / mês - PLANO BUSINESS
    name: 'Plano Business'
  }
};

// Mensagem de configuração para o usuário
export const getConfigurationMessage = () => {
  if (isConfigured) {
    return '✅ Stripe configurado corretamente';
  }
  
  return '⚠️ Stripe não configurado. Configure as variáveis de ambiente do Stripe para ativar os pagamentos.';
};