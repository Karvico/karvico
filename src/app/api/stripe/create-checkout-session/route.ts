import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🚀 API Route chamada: /api/stripe/create-checkout-session');
  
  try {
    // Parse do body da requisição
    const body = await request.json();
    console.log('📋 Dados recebidos:', body);

    const { priceId, userId, userEmail, planName, planPrice } = body;

    // Validação dos dados obrigatórios
    if (!priceId || !userId || !userEmail) {
      console.error('❌ Dados obrigatórios ausentes:', { priceId, userId, userEmail });
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos (priceId, userId, userEmail)' },
        { status: 400 }
      );
    }

    // Verificar se o Stripe está configurado
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    console.log('🔑 Verificando configuração do Stripe...');
    console.log('- STRIPE_SECRET_KEY:', stripeSecretKey ? 'Configurada' : 'Ausente');
    console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', stripePublishableKey ? 'Configurada' : 'Ausente');

    if (!stripeSecretKey || !stripePublishableKey) {
      console.error('❌ Stripe não configurado - variáveis de ambiente ausentes');
      return NextResponse.json(
        { 
          error: 'Stripe não configurado',
          message: 'Configure as variáveis STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
          configured: false,
          details: {
            secretKey: !!stripeSecretKey,
            publishableKey: !!stripePublishableKey
          }
        },
        { status: 500 }
      );
    }

    // Verificar se as chaves não são placeholders
    if (stripeSecretKey.includes('placeholder') || stripePublishableKey.includes('placeholder')) {
      console.error('❌ Stripe configurado com valores placeholder');
      return NextResponse.json(
        { 
          error: 'Stripe configurado com valores placeholder',
          message: 'Configure as chaves reais do Stripe',
          configured: false
        },
        { status: 500 }
      );
    }

    // Verificar se o priceId não é placeholder
    if (priceId.includes('placeholder')) {
      console.error('❌ Price ID é placeholder:', priceId);
      return NextResponse.json(
        { 
          error: 'Price ID não configurado',
          message: 'Configure os Price IDs reais do Stripe para os planos',
          configured: false,
          priceId: priceId
        },
        { status: 500 }
      );
    }

    // Importar Stripe dinamicamente para evitar problemas de SSR
    const { default: Stripe } = await import('stripe');
    
    // Inicializar Stripe
    console.log('🔧 Inicializando Stripe...');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
    console.log('✅ Stripe inicializado com sucesso');

    // Criar customer
    console.log('👤 Criando customer...');
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: {
        userId: userId,
      },
    });
    console.log('✅ Customer criado:', customer.id);

    // Criar sessão de checkout
    console.log('🛒 Criando sessão de checkout...');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        userId: userId,
        planName: planName || 'Plano não especificado',
        planPrice: planPrice ? planPrice.toString() : '0',
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planName: planName || 'Plano não especificado',
        },
      },
    });

    console.log('✅ Sessão de checkout criada com sucesso:', session.id);
    return NextResponse.json({ 
      sessionId: session.id,
      success: true 
    });

  } catch (error) {
    console.error('❌ Erro geral na API route:', error);
    
    // Tratamento específico de erros do Stripe
    if (error && typeof error === 'object' && 'type' in error) {
      return NextResponse.json(
        { 
          error: 'Erro do Stripe',
          message: error.message || 'Erro desconhecido do Stripe',
          type: error.type,
          configured: false
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        configured: false
      },
      { status: 500 }
    );
  }
}

// Handler para GET para debug
export async function GET() {
  console.log('🔍 GET request para /api/stripe/create-checkout-session');
  return NextResponse.json({ 
    message: 'API Route funcionando',
    method: 'GET',
    timestamp: new Date().toISOString(),
    env: {
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      publishableKeyConfigured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
  });
}