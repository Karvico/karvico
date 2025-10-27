"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processando callback de autenticação...');
        
        // Verificar se há parâmetros de erro na URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('❌ Erro no callback OAuth:', error, errorDescription);
          
          let errorMessage = 'Erro na autenticação com Google.';
          
          if (error === 'access_denied') {
            errorMessage = 'Acesso negado. Você cancelou a autenticação.';
          } else if (error === 'server_error') {
            errorMessage = 'Erro no servidor. Tente novamente em alguns minutos.';
          } else if (errorDescription) {
            errorMessage = errorDescription;
          }
          
          setStatus('error');
          setMessage(errorMessage);
          
          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
          return;
        }

        // Processar sessão do Supabase
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro ao obter sessão:', sessionError);
          setStatus('error');
          setMessage('Erro ao processar autenticação. Tente fazer login novamente.');
          
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
          return;
        }

        if (data.session) {
          console.log('✅ Sessão obtida com sucesso:', data.session.user.email);
          setStatus('success');
          setMessage('Login realizado com sucesso! Redirecionando...');
          
          // Redirecionar para dashboard
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          console.warn('⚠️ Nenhuma sessão encontrada no callback');
          setStatus('error');
          setMessage('Nenhuma sessão encontrada. Tente fazer login novamente.');
          
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        }
      } catch (error: any) {
        console.error('❌ Erro inesperado no callback:', error);
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
        
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D295A] to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="w-16 h-16 bg-[#1D295A] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">K</span>
        </div>

        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Processando...'}
          {status === 'success' && 'Sucesso!'}
          {status === 'error' && 'Erro na Autenticação'}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message || 'Processando sua autenticação...'}
        </p>

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {/* Manual redirect button for errors */}
        {status === 'error' && (
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-[#1D295A] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Login
          </button>
        )}
      </div>
    </div>
  );
}