"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

interface UseUserDataOptions {
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  filter?: { column: string; value: any; operator?: string };
}

export const useUserData = <T = any>({
  table,
  select = '*',
  orderBy,
  filter
}: UseUserDataOptions) => {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from(table)
        .select(select)
        .eq('user_id', user.id);

      // Aplicar filtro adicional se fornecido
      if (filter) {
        const operator = filter.operator || 'eq';
        query = query.filter(filter.column, operator, filter.value);
      }

      // Aplicar ordenação se fornecida
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        setError(queryError.message);
        setData([]);
      } else {
        setData(result || []);
      }
    } catch (err) {
      setError('Erro ao carregar dados');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, table, select, JSON.stringify(orderBy), JSON.stringify(filter)]);

  const insert = async (newData: Omit<T, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { data: result, error } = await supabase
      .from(table)
      .insert({ ...newData, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    await fetchData(); // Recarregar dados
    return result;
  };

  const update = async (id: string, updates: Partial<T>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { data: result, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Garantir que só atualiza dados do próprio usuário
      .select()
      .single();

    if (error) throw error;

    await fetchData(); // Recarregar dados
    return result;
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Garantir que só remove dados do próprio usuário

    if (error) throw error;

    await fetchData(); // Recarregar dados
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    insert,
    update,
    remove
  };
};