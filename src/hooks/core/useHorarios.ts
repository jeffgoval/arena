import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Horario } from '@/types/horarios.types';

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
        .order('dia_semana', { ascending: true })
        .order('hora_inicio', { ascending: true });

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
 * Hook para buscar horários disponíveis para uma quadra em uma data específica
 */
export function useHorariosDisponiveis(quadra_id?: string, data?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['horarios-disponiveis', quadra_id, data],
    queryFn: async () => {
      if (!quadra_id || !data) return [];

      // Calcular dia da semana (0-6)
      const dataObj = new Date(data + 'T00:00:00');
      const diaSemana = dataObj.getDay();

      // Buscar horários da quadra para o dia da semana
      const { data: horarios, error: horariosError } = await supabase
        .from('horarios')
        .select('*')
        .eq('quadra_id', quadra_id)
        .eq('dia_semana', diaSemana)
        .eq('ativo', true)
        .order('hora_inicio', { ascending: true });

      if (horariosError) throw horariosError;

      // Buscar reservas existentes para a quadra na data
      const { data: reservas, error: reservasError } = await supabase
        .from('reservas')
        .select('horario_id')
        .eq('quadra_id', quadra_id)
        .eq('data', data)
        .neq('status', 'cancelada');

      if (reservasError) throw reservasError;

      // IDs dos horários já reservados
      const horariosReservados = new Set(reservas?.map((r) => r.horario_id) || []);

      // Filtrar horários disponíveis
      const horariosDisponiveis = (horarios || []).map((horario) => ({
        ...horario,
        disponivel: !horariosReservados.has(horario.id),
      }));

      return horariosDisponiveis;
    },
    enabled: !!quadra_id && !!data,
  });
}

/**
 * Hook para buscar um horário específico
 */
export function useHorario(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['horario', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('horarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Horario;
    },
    enabled: !!id,
  });
}
