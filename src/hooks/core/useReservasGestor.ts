import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface ReservaGestor {
  id: string;
  data: string;
  quadra_id: string;
  horario_id: string;
  organizador_id: string;
  status: 'pendente' | 'confirmada' | 'cancelada';
  tipo: 'avulsa' | 'mensalista' | 'recorrente';
  valor_total: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Relações
  quadra?: {
    id: string;
    nome: string;
    tipo: string;
  };
  horario?: {
    id: string;
    dia_semana: number;
    hora_inicio: string;
    hora_fim: string;
  };
  organizador?: {
    id: string;
    nome_completo: string;
    email: string;
    telefone?: string;
  };
  participantes_count?: number;
}

/**
 * Hook para buscar todas as reservas (visão gestor)
 * Permite filtrar por data, quadra, status, etc.
 */
export function useReservasGestor(filtros?: {
  data_inicio?: string;
  data_fim?: string;
  quadra_id?: string;
  status?: string;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['reservas-gestor', filtros],
    queryFn: async () => {
      let query = supabase
        .from('reservas')
        .select(`
          *,
          quadra:quadras(id, nome, tipo),
          horario:horarios(id, dia_semana, hora_inicio, hora_fim),
          organizador:users!reservas_organizador_id_fkey(id, nome_completo, email, telefone)
        `)
        .order('data', { ascending: true });

      // Aplicar filtros
      if (filtros?.data_inicio) {
        query = query.gte('data', filtros.data_inicio);
      }
      if (filtros?.data_fim) {
        query = query.lte('data', filtros.data_fim);
      }
      if (filtros?.quadra_id) {
        query = query.eq('quadra_id', filtros.quadra_id);
      }
      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Buscar contagem de participantes para cada reserva
      const reservasComParticipantes = await Promise.all(
        (data || []).map(async (reserva) => {
          const { count } = await supabase
            .from('reserva_participantes')
            .select('*', { count: 'exact', head: true })
            .eq('reserva_id', reserva.id);

          return {
            ...reserva,
            participantes_count: count || 0,
          };
        })
      );

      return reservasComParticipantes as ReservaGestor[];
    },
  });
}

/**
 * Hook para criar reserva (visão gestor)
 */
export function useCreateReservaGestor() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      quadra_id: string;
      horario_id: string;
      data: string;
      organizador_nome: string;
      organizador_telefone?: string;
      organizador_email?: string;
      participantes: number;
      status: 'pendente' | 'confirmada';
      observacoes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar valor do horário
      const { data: horario, error: horarioError } = await supabase
        .from('horarios')
        .select('valor_avulsa')
        .eq('id', data.horario_id)
        .single();

      if (horarioError) throw horarioError;

      // Criar reserva (gestor cria em nome de um cliente)
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          organizador_id: user.id, // Por enquanto usa o ID do gestor
          quadra_id: data.quadra_id,
          horario_id: data.horario_id,
          data: data.data,
          tipo: 'avulsa',
          status: data.status,
          valor_total: horario.valor_avulsa,
          observacoes: data.observacoes || null,
        })
        .select()
        .single();

      if (reservaError) throw reservaError;

      return reserva;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas-gestor'] });
    },
  });
}

/**
 * Hook para atualizar reserva (visão gestor)
 */
export function useUpdateReservaGestor() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      quadra_id?: string;
      horario_id?: string;
      data?: string;
      status?: 'pendente' | 'confirmada' | 'cancelada';
      observacoes?: string;
    }) => {
      const { error } = await supabase
        .from('reservas')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas-gestor'] });
    },
  });
}

/**
 * Hook para deletar reserva (visão gestor)
 */
export function useDeleteReservaGestor() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Primeiro deletar participantes
      await supabase
        .from('reserva_participantes')
        .delete()
        .eq('reserva_id', id);

      // Depois deletar a reserva
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas-gestor'] });
    },
  });
}
