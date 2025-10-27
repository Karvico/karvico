import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar dados financeiros do usuário
    const { data: stripeTransactions } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: bankTransactions } = await supabase
      .from('bank_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(50);

    // Preparar dados para análise
    const financialData = {
      stripeTransactions: stripeTransactions || [],
      bankTransactions: bankTransactions || [],
      totalStripeRevenue: stripeTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0,
      totalBankRevenue: bankTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0,
    };

    // Prompt para análise financeira
    const prompt = `
    Analise os seguintes dados financeiros de um negócio e forneça insights valiosos:

    Dados do Stripe:
    - Receita total: R$ ${financialData.totalStripeRevenue.toLocaleString('pt-BR')}
    - Transações: ${financialData.stripeTransactions.length}
    
    Dados Bancários:
    - Receita total: R$ ${financialData.totalBankRevenue.toLocaleString('pt-BR')}
    - Transações: ${financialData.bankTransactions.length}

    Últimas transações Stripe:
    ${financialData.stripeTransactions.slice(0, 10).map(t => 
      `- R$ ${t.amount.toLocaleString('pt-BR')} - ${t.description} - ${t.status}`
    ).join('\\n')}

    Últimas transações bancárias:
    ${financialData.bankTransactions.slice(0, 10).map(t => 
      `- R$ ${t.amount.toLocaleString('pt-BR')} - ${t.description}`
    ).join('\\n')}

    Por favor, forneça 3-5 insights específicos e acionáveis sobre:
    1. Padrões de receita
    2. Oportunidades de crescimento
    3. Otimizações financeiras
    4. Tendências identificadas
    5. Recomendações estratégicas

    Responda em português brasileiro, de forma clara e objetiva.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Extrair insights individuais
    const insights = analysisText
      .split('\\n')
      .filter(line => line.trim().length > 0 && (line.includes('-') || line.includes('•')))
      .map(line => line.replace(/^[-•]\\s*/, '').trim())
      .filter(insight => insight.length > 20);

    // Salvar insights no banco
    const insightsToSave = insights.slice(0, 5).map(insight => ({
      user_id: userId,
      insight,
      created_at: new Date().toISOString(),
    }));

    if (insightsToSave.length > 0) {
      await supabase
        .from('ai_financial_insights')
        .insert(insightsToSave);
    }

    return NextResponse.json({
      success: true,
      insights: insights.slice(0, 5),
      fullAnalysis: analysisText,
    });
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}