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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Processar eventos do Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planName = session.metadata?.planName;
  
  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Determinar o plan_status baseado no plano
  let planStatus = 'basic';
  if (planName?.toLowerCase().includes('business') || planName?.toLowerCase().includes('pro')) {
    planStatus = 'premium';
  }

  // Atualizar ou criar assinatura no Supabase
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_status: planStatus,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error updating subscription:', error);
  } else {
    console.log(`Subscription activated for user ${userId} with plan ${planStatus}`);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const planName = subscription.metadata?.planName;
  
  if (!userId) return;

  let planStatus = 'basic';
  if (planName?.toLowerCase().includes('business') || planName?.toLowerCase().includes('pro')) {
    planStatus = 'premium';
  }

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_status: planStatus,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error creating subscription:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan_status: 'free',
      expires_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error deleting subscription:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionUpdated(subscription);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Implementar lógica para pagamento falhado
  // Por exemplo, enviar email de notificação ou suspender acesso
  console.log('Payment failed for invoice:', invoice.id);
}