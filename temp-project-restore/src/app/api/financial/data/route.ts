import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar dados do Stripe
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let stripeRevenue = 0;
    let stripeTransactions: any[] = [];

    if (subscription?.stripe_customer_id) {
      // Buscar invoices do Stripe
      const invoices = await stripe.invoices.list({
        customer: subscription.stripe_customer_id,
        limit: 100,
      });

      stripeRevenue = invoices.data
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + (invoice.amount_paid / 100), 0);

      stripeTransactions = invoices.data.map(invoice => ({
        id: invoice.id,
        amount: invoice.amount_paid / 100,
        description: invoice.description || 'Pagamento de assinatura',
        date: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
        source: 'stripe',
        status: invoice.status === 'paid' ? 'paid' : 'pending',
      }));
    }

    // Buscar transações bancárias
    const { data: bankTransactions } = await supabase
      .from('bank_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    const bankRevenue = bankTransactions?.reduce((sum, transaction) => 
      sum + (transaction.amount || 0), 0) || 0;

    const allTransactions = [
      ...stripeTransactions,
      ...(bankTransactions?.map(transaction => ({
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.transaction_date,
        source: 'bank',
        status: 'paid',
      })) || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalRevenue = stripeRevenue + bankRevenue;

    // Calcular crescimento mensal (simulado)
    const monthlyGrowth = Math.random() * 20 - 5; // Entre -5% e +15%

    // Buscar insights da IA
    const { data: insights } = await supabase
      .from('ai_financial_insights')
      .select('insight')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      totalRevenue,
      monthlyGrowth,
      stripeRevenue,
      bankRevenue,
      transactions: allTransactions,
      insights: insights?.map(i => i.insight) || [],
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}