import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import GeminiService from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { lead_email, lead_name, lead_phone, funnel_url, additional_context } = body;

    if (!lead_email) {
      return NextResponse.json({ 
        error: 'Email do lead é obrigatório' 
      }, { status: 400 });
    }

    // Verificar se usuário tem acesso (apenas assinantes)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_status')
      .eq('user_id', session.user.id)
      .single();

    if (!subscription || subscription.plan_status === 'free') {
      return NextResponse.json({ 
        error: 'Funcionalidade disponível apenas para assinantes' 
      }, { status: 403 });
    }

    // Buscar GEMINI_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY não configurada' 
      }, { status: 500 });
    }

    try {
      // Pontuar lead com Gemini
      const geminiService = new GeminiService(geminiApiKey);
      const scoreResult = await geminiService.scoreLeadPriority({
        email: lead_email,
        name: lead_name,
        phone: lead_phone,
        funnelUrl: funnel_url,
        additionalContext: additional_context
      });

      // Salvar score no banco
      const { data: leadScore, error: insertError } = await supabase
        .from('lead_scores')
        .insert([{
          user_id: session.user.id,
          lead_email,
          lead_name,
          lead_phone,
          funnel_url,
          score_data: scoreResult,
          gemini_response: scoreResult.rawResponse
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao salvar score:', insertError);
        return NextResponse.json({ 
          error: 'Erro ao salvar score do lead' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        lead_score_id: leadScore.id,
        data: scoreResult
      });

    } catch (aiError) {
      console.error('Erro na análise de IA:', aiError);
      return NextResponse.json({ 
        error: 'Erro na análise de IA: ' + (aiError as Error).message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro na rota de score de lead:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar scores do usuário
    const { data: leadScores, error } = await supabase
      .from('lead_scores')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar scores:', error);
      return NextResponse.json({ 
        error: 'Erro ao buscar scores de leads' 
      }, { status: 500 });
    }

    return NextResponse.json({ leadScores });

  } catch (error) {
    console.error('Erro na rota GET de scores:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}