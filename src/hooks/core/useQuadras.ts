import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Quadra } from '@/types/quadras.types';

/**
 * Hook para buscar todas as quadras ativas
 */
export function useQuadras() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['quadras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quadras')
        .select('*')
        .eq('status', 'ativa')
        .order('nome', { ascending: true });

      if (error) throw error;
      return data as Quadra[];
    },
  });
}

/**
 * Hook para buscar uma quadra específica
 */
export function useQuadra(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['quadra', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quadras')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Quadra;
    },
    enabled: !!id,
  });
}
