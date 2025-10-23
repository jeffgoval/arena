import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface Quadra {
  id: string;
  nome: string;
  tipo: string;
  status: 'ativa' | 'manutencao' | 'inativa';
}

export interface Horario {
  id: string;
  quadra_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  valor_avulsa: number;
  ativo: boolean;
}

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
        .order('nome');

      if (error) throw error;
      return data as Quadra[];
    },
  });
}

/**
 * Hook para buscar horários de uma quadra específica
 */
export function useHorarios(quadra_id?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['horarios', quadra_id],
    queryFn: async () => {
      let query = supabase
        .from('horarios')
        .select('*')
        .eq('ativo', true)
        .order('dia_semana')
        .order('hora_inicio');

      if (quadra_id) {
        query = query.eq('quadra_id', quadra_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Horario[];
    },
    enabled: !!quadra_id,
  });
}

/**
 * Hook para buscar todos os horários de todas as quadras
 */
export function useAllHorarios() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['horarios-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('horarios')
        .select('*')
        .eq('ativo', true)
        .order('dia_semana')
        .order('hora_inicio');

      if (error) throw error;
      return data as Horario[];
    },
  });
}
