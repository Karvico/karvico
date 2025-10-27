import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, account_name, credentials } = body;

    if (!platform || !account_name || !credentials) {
      return NextResponse.json({ 
        error: 'Plataforma, nome da conta e credenciais são obrigatórios' 
      }, { status: 400 });
    }

    // Validar plataforma
    const validPlatforms = ['meta', 'tiktok', 'google', 'linkedin'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ 
        error: 'Plataforma inválida' 
      }, { status: 400 });
    }

    // Criar conexão no banco
    const { data: connection, error: insertError } = await supabase
      .from('ads_connections')
      .insert([{
        user_id: session.user.id,
        platform,
        account_name,
        credentials,
        is_active: true
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar conexão:', insertError);
      return NextResponse.json({ 
        error: 'Erro ao criar conexão de anúncios' 
      }, { status: 500 });
    }

    // Remover credenciais sensíveis da resposta
    const safeConnection = {
      ...connection,
      credentials: Object.keys(connection.credentials).reduce((acc, key) => {
        acc[key] = '***';
        return acc;
      }, {} as any)
    };

    return NextResponse.json({
      success: true,
      connection: safeConnection
    });

  } catch (error) {
    console.error('Erro na rota de conexão de anúncios:', error);
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

    // Buscar conexões do usuário
    const { data: connections, error } = await supabase
      .from('ads_connections')
      .select('id, platform, account_name, is_active, last_sync, created_at, updated_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar conexões:', error);
      return NextResponse.json({ 
        error: 'Erro ao buscar conexões de anúncios' 
      }, { status: 500 });
    }

    return NextResponse.json({ connections });

  } catch (error) {
    console.error('Erro na rota GET de conexões:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('id');

    if (!connectionId) {
      return NextResponse.json({ 
        error: 'ID da conexão é obrigatório' 
      }, { status: 400 });
    }

    // Deletar conexão
    const { error: deleteError } = await supabase
      .from('ads_connections')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', session.user.id);

    if (deleteError) {
      console.error('Erro ao deletar conexão:', deleteError);
      return NextResponse.json({ 
        error: 'Erro ao deletar conexão' 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro na rota DELETE de conexões:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}