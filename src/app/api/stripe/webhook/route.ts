import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  
  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Recuperar a subscription
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const planStatus = getPlanFromPriceId(subscription.items.data[0].price.id);

  // Atualizar ou criar registro de assinatura no Supabase
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      plan_status: planStatus,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const planStatus = getPlanFromPriceId(subscription.items.data[0].price.id);

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      plan_status: planStatus,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      plan_status: 'free',
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating canceled subscription:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Registrar pagamento bem-sucedido para análise financeira
  const { error } = await supabase
    .from('financial_transactions')
    .insert({
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid / 100, // Converter de centavos para reais
      currency: invoice.currency,
      status: 'paid',
      payment_date: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
      description: invoice.description || 'Pagamento de assinatura',
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error recording financial transaction:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Registrar falha no pagamento
  const { error } = await supabase
    .from('financial_transactions')
    .insert({
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed',
      description: 'Falha no pagamento de assinatura',
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error recording failed transaction:', error);
  }
}

function getPlanFromPriceId(priceId: string): 'silver' | 'pro' {
  // Mapear price IDs para planos
  // Estes IDs devem ser configurados no Stripe Dashboard
  const PRICE_TO_PLAN: Record<string, 'silver' | 'pro'> = {
    [process.env.STRIPE_SILVER_PRICE_ID!]: 'silver',
    [process.env.STRIPE_PRO_PRICE_ID!]: 'pro',
  };

  return PRICE_TO_PLAN[priceId] || 'silver';
}