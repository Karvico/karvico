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
    const { ads_connection_id, analysis_period } = body;

    if (!ads_connection_id || !analysis_period) {
      return NextResponse.json({ 
        error: 'ID da conexão de anúncios e período são obrigatórios' 
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

    // Verificar se a conexão pertence ao usuário
    const { data: connection, error: connectionError } = await supabase
      .from('ads_connections')
      .select('*')
      .eq('id', ads_connection_id)
      .eq('user_id', session.user.id)
      .single();

    if (connectionError || !connection) {
      return NextResponse.json({ 
        error: 'Conexão de anúncios não encontrada' 
      }, { status: 404 });
    }

    // Buscar GEMINI_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY não configurada' 
      }, { status: 500 });
    }

    // Criar diagnóstico no banco
    const { data: diagnosis, error: insertError } = await supabase
      .from('business_diagnoses')
      .insert([{
        user_id: session.user.id,
        ads_connection_id,
        analysis_period,
        status: 'analyzing'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar diagnóstico:', insertError);
      return NextResponse.json({ 
        error: 'Erro ao criar diagnóstico' 
      }, { status: 500 });
    }

    try {
      // Simular dados de anúncios (em produção, buscar da API real)
      const mockAdsData = {
        platform: connection.platform,
        period: analysis_period,
        metrics: {
          impressions: Math.floor(Math.random() * 100000) + 10000,
          clicks: Math.floor(Math.random() * 5000) + 500,
          conversions: Math.floor(Math.random() * 100) + 10,
          spend: Math.floor(Math.random() * 5000) + 1000,
          revenue: Math.floor(Math.random() * 15000) + 3000
        },
        campaigns: [
          { name: 'Campanha 1', performance: 'good' },
          { name: 'Campanha 2', performance: 'average' },
          { name: 'Campanha 3', performance: 'poor' }
        ]
      };

      // Gerar diagnóstico com Gemini
      const geminiService = new GeminiService(geminiApiKey);
      const diagnosisResult = await geminiService.generateBusinessDiagnosis(mockAdsData, analysis_period);

      // Atualizar diagnóstico com resultados
      const { error: updateError } = await supabase
        .from('business_diagnoses')
        .update({
          diagnosis_data: diagnosisResult,
          gemini_response: diagnosisResult.rawResponse,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', diagnosis.id);

      if (updateError) {
        console.error('Erro ao atualizar diagnóstico:', updateError);
        return NextResponse.json({ 
          error: 'Erro ao salvar diagnóstico' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        diagnosis_id: diagnosis.id,
        data: diagnosisResult
      });

    } catch (aiError) {
      console.error('Erro na análise de IA:', aiError);
      
      // Marcar diagnóstico como falhou
      await supabase
        .from('business_diagnoses')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', diagnosis.id);

      return NextResponse.json({ 
        error: 'Erro na análise de IA: ' + (aiError as Error).message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro na rota de diagnóstico de negócio:', error);
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

    // Buscar diagnósticos do usuário
    const { data: diagnoses, error } = await supabase
      .from('business_diagnoses')
      .select(`
        *,
        ads_connections (
          platform,
          account_name
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar diagnósticos:', error);
      return NextResponse.json({ 
        error: 'Erro ao buscar diagnósticos' 
      }, { status: 500 });
    }

    return NextResponse.json({ diagnoses });

  } catch (error) {
    console.error('Erro na rota GET de diagnósticos:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}