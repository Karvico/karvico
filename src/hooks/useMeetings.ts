"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, isConfigured } from '@/lib/supabase';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  lead_name?: string;
  lead_email?: string;
  lead_phone?: string;
  google_event_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
}

interface UseMeetingsReturn {
  meetings: Meeting[];
  isLoading: boolean;
  createMeeting: (data: CreateMeetingData) => Promise<{ success: boolean; error?: string }>;
  updateMeeting: (id: string, data: Partial<Meeting>) => Promise<{ success: boolean; error?: string }>;
  deleteMeeting: (id: string) => Promise<{ success: boolean; error?: string }>;
  getMeetings: () => Promise<Meeting[]>;
}

export const useMeetings = (): UseMeetingsReturn => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Função para criar dados mock
  const createMockMeetings = (userId: string): Meeting[] => [
    {
      id: 'mock-1',
      title: 'Reunião com Lead - João Silva',
      description: 'Apresentação do produto e negociação',
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      lead_name: 'João Silva',
      lead_email: 'joao@exemplo.com',
      lead_phone: '(11) 99999-9999',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      title: 'Follow-up - Maria Santos',
      description: 'Acompanhamento da proposta enviada',
      start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 48 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      status: 'scheduled',
      lead_name: 'Maria Santos',
      lead_email: 'maria@exemplo.com',
      lead_phone: '(11) 88888-8888',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  const getMeetings = async (): Promise<Meeting[]> => {
    if (!user) {
      console.log('👤 Usuário não autenticado');
      return [];
    }

    if (!isConfigured) {
      console.log('🔧 Supabase não configurado - usando dados mock');
      return createMockMeetings(user.id);
    }

    try {
      console.log('🔍 Buscando reuniões para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.warn('⚠️ Erro ao buscar reuniões (tabela pode não existir):', error.message);
        // Se a tabela não existir, usar dados mock
        return createMockMeetings(user.id);
      }

      console.log('✅ Reuniões encontradas:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar reuniões:', error);
      // Em caso de erro de rede, usar dados mock
      return createMockMeetings(user.id);
    }
  };

  const loadMeetings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const meetingsData = await getMeetings();
      setMeetings(meetingsData);
    } catch (error) {
      console.error('❌ Erro ao carregar reuniões:', error);
      // Em caso de erro, usar dados mock
      setMeetings(createMockMeetings(user.id));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMeetings();
    } else {
      setMeetings([]);
    }
  }, [user]);

  const createMeeting = async (data: CreateMeetingData) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: data.title,
      description: data.description,
      start_time: data.startTime,
      end_time: data.endTime,
      status: 'scheduled',
      lead_name: data.leadName,
      lead_email: data.leadEmail,
      lead_phone: data.leadPhone,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isConfigured) {
      console.log('🔧 Supabase não configurado - simulando criação');
      setMeetings(prev => [...prev, newMeeting]);
      return { success: true };
    }

    setIsLoading(true);
    try {
      console.log('📝 Criando nova reunião:', data.title);
      
      const { data: meetingData, error } = await supabase
        .from('meetings')
        .insert([
          {
            title: data.title,
            description: data.description,
            start_time: data.startTime,
            end_time: data.endTime,
            status: 'scheduled',
            lead_name: data.leadName,
            lead_email: data.leadEmail,
            lead_phone: data.leadPhone,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.warn('⚠️ Erro ao criar reunião (tabela pode não existir):', error.message);
        // Se a tabela não existir, simular criação
        setMeetings(prev => [...prev, newMeeting]);
        return { success: true };
      }

      console.log('✅ Reunião criada com sucesso');
      setMeetings(prev => [...prev, meetingData]);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao criar reunião:', error);
      // Em caso de erro de rede, simular criação
      setMeetings(prev => [...prev, newMeeting]);
      return { success: true }; // Retornar sucesso para não bloquear a UX
    } finally {
      setIsLoading(false);
    }
  };

  const updateMeeting = async (id: string, data: Partial<Meeting>) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Sempre atualizar localmente primeiro
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id 
        ? { ...meeting, ...data, updated_at: new Date().toISOString() }
        : meeting
    ));

    if (!isConfigured) {
      console.log('🔧 Supabase não configurado - simulando atualização');
      return { success: true };
    }

    setIsLoading(true);
    try {
      console.log('📝 Atualizando reunião:', id);
      
      const { data: meetingData, error } = await supabase
        .from('meetings')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.warn('⚠️ Erro ao atualizar reunião:', error.message);
        // Manter a atualização local mesmo com erro
        return { success: true };
      }

      console.log('✅ Reunião atualizada com sucesso');
      setMeetings(prev => prev.map(meeting => 
        meeting.id === id ? meetingData : meeting
      ));
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao atualizar reunião:', error);
      // Manter a atualização local mesmo com erro
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Sempre remover localmente primeiro
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));

    if (!isConfigured) {
      console.log('🔧 Supabase não configurado - simulando exclusão');
      return { success: true };
    }

    setIsLoading(true);
    try {
      console.log('🗑️ Deletando reunião:', id);
      
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.warn('⚠️ Erro ao deletar reunião:', error.message);
        // Manter a remoção local mesmo com erro
        return { success: true };
      }

      console.log('✅ Reunião deletada com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao deletar reunião:', error);
      // Manter a remoção local mesmo com erro
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    meetings,
    isLoading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetings,
  };
};