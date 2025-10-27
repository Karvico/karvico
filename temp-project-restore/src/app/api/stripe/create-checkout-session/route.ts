import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, userEmail, planName, planPrice } = await request.json();

    if (!priceId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Verificar se o Stripe está configurado
    if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        { 
          error: 'Stripe não configurado',
          message: 'Configure as variáveis STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
        },
        { status: 500 }
      );
    }

    // Criar ou recuperar customer do Stripe
    let customer;
    
    // Verificar se já existe um customer para este usuário
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (existingSubscription?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(existingSubscription.stripe_customer_id);
    } else {
      // Criar novo customer
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
        },
      });
    }

    // Criar sessão de checkout
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?canceled=true`,
      metadata: {
        userId: userId,
        planName: planName,
        planPrice: planPrice.toString(),
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planName: planName,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}