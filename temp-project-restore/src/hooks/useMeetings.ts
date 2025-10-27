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

  const getMeetings = async (): Promise<Meeting[]> => {
    if (!user || !isConfigured) {
      // Retornar dados mock se não configurado
      const mockMeetings: Meeting[] = [
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
          user_id: user?.id || 'mock-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      return mockMeetings;
    }

    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Erro ao buscar reuniões:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro inesperado ao buscar reuniões:', error);
      return [];
    }
  };

  const loadMeetings = async () => {
    setIsLoading(true);
    try {
      const meetingsData = await getMeetings();
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Erro ao carregar reuniões:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMeetings();
    }
  }, [user]);

  const createMeeting = async (data: CreateMeetingData) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    if (!isConfigured) {
      // Simular criação para demonstração
      const mockMeeting: Meeting = {
        id: `mock-${Date.now()}`,
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
      
      setMeetings(prev => [...prev, mockMeeting]);
      return { success: true };
    }

    setIsLoading(true);
    try {
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
        console.error('Erro ao criar reunião:', error);
        return { success: false, error: error.message };
      }

      setMeetings(prev => [...prev, meetingData]);
      return { success: true };
    } catch (error: any) {
      console.error('Erro inesperado ao criar reunião:', error);
      return { success: false, error: 'Erro inesperado ao criar reunião' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateMeeting = async (id: string, data: Partial<Meeting>) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    if (!isConfigured) {
      // Simular atualização para demonstração
      setMeetings(prev => prev.map(meeting => 
        meeting.id === id 
          ? { ...meeting, ...data, updated_at: new Date().toISOString() }
          : meeting
      ));
      return { success: true };
    }

    setIsLoading(true);
    try {
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
        console.error('Erro ao atualizar reunião:', error);
        return { success: false, error: error.message };
      }

      setMeetings(prev => prev.map(meeting => 
        meeting.id === id ? meetingData : meeting
      ));
      return { success: true };
    } catch (error: any) {
      console.error('Erro inesperado ao atualizar reunião:', error);
      return { success: false, error: 'Erro inesperado ao atualizar reunião' };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    if (!isConfigured) {
      // Simular exclusão para demonstração
      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      return { success: true };
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar reunião:', error);
        return { success: false, error: error.message };
      }

      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Erro inesperado ao deletar reunião:', error);
      return { success: false, error: 'Erro inesperado ao deletar reunião' };
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