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
    const { funnel_url, funnel_name } = body;

    if (!funnel_url || !funnel_name) {
      return NextResponse.json({ 
        error: 'URL do funil e nome são obrigatórios' 
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

    // Buscar GEMINI_API_KEY do usuário (variável de ambiente)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY não configurada' 
      }, { status: 500 });
    }

    // Criar análise no banco
    const { data: analysis, error: insertError } = await supabase
      .from('funnel_analyses')
      .insert([{
        user_id: session.user.id,
        funnel_url,
        funnel_name,
        status: 'analyzing'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar análise:', insertError);
      return NextResponse.json({ 
        error: 'Erro ao criar análise' 
      }, { status: 500 });
    }

    try {
      // Analisar funil com Gemini
      const geminiService = new GeminiService(geminiApiKey);
      const analysisResult = await geminiService.analyzeFunnel(funnel_url, funnel_name);

      // Atualizar análise com resultados
      const { error: updateError } = await supabase
        .from('funnel_analyses')
        .update({
          analysis_data: {
            score: analysisResult.score,
            priority_level: analysisResult.priority_level,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            recommendations: analysisResult.recommendations,
            conversion_potential: analysisResult.conversion_potential,
            traffic_quality_score: analysisResult.traffic_quality_score,
            design_score: analysisResult.design_score,
            copy_score: analysisResult.copy_score,
            technical_score: analysisResult.technical_score
          },
          gemini_response: analysisResult.rawResponse,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', analysis.id);

      if (updateError) {
        console.error('Erro ao atualizar análise:', updateError);
        return NextResponse.json({ 
          error: 'Erro ao salvar análise' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        analysis_id: analysis.id,
        data: analysisResult
      });

    } catch (aiError) {
      console.error('Erro na análise de IA:', aiError);
      
      // Marcar análise como falhou
      await supabase
        .from('funnel_analyses')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', analysis.id);

      return NextResponse.json({ 
        error: 'Erro na análise de IA: ' + (aiError as Error).message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro na rota de análise de funil:', error);
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

    // Buscar análises do usuário
    const { data: analyses, error } = await supabase
      .from('funnel_analyses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar análises:', error);
      return NextResponse.json({ 
        error: 'Erro ao buscar análises' 
      }, { status: 500 });
    }

    return NextResponse.json({ analyses });

  } catch (error) {
    console.error('Erro na rota GET de análises:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}