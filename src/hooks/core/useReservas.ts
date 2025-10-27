import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Reserva, ReservaParticipant } from '@/types/reservas.types';
import type { CreateReservaData, ConfigRateioData, AddParticipantData } from '@/lib/validations/reserva.schema';

/**
 * Hook para buscar todas as reservas do usuário logado
 */
export function useReservas(filtro?: 'futuras' | 'passadas' | 'todas') {
  const supabase = createClient();

  return useQuery({
    queryKey: ['reservas', filtro],
    queryFn: async () => {
      console.log('[useReservas] 🔍 Iniciando busca de reservas...');
      console.log('[useReservas] Filtro aplicado:', filtro);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('[useReservas] ❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('[useReservas] ✅ Usuário autenticado:', {
        id: user.id,
        email: user.email
      });

      let query = supabase
        .from('reservas')
        .select(`
          id,
          data,
          status,
          valor_total,
          observacoes,
          created_at,
          organizador:users!reservas_organizador_id_fkey(id, nome_completo),
          quadra:quadras(id, nome, tipo),
          horario:horarios(id, hora_inicio, hora_fim),
          turma:turmas!reservas_turma_id_fkey(id, nome)
        `)
        .eq('organizador_id', user.id)
        .neq('status', 'cancelada')
        .order('data', { ascending: true });

      console.log('[useReservas] 🔍 Query configurada:', {
        filtroOrganizador: user.id,
        excluindoStatus: 'cancelada'
      });

      // Aplicar filtro
      const hoje = new Date().toISOString().split('T')[0];
      if (filtro === 'futuras') {
        query = query.gte('data', hoje);
        console.log('[useReservas] 📅 Filtrando futuras (>= hoje):', hoje);
      } else if (filtro === 'passadas') {
        query = query.lt('data', hoje);
        console.log('[useReservas] 📅 Filtrando passadas (< hoje):', hoje);
      } else {
        console.log('[useReservas] 📅 Sem filtro de data (todas)');
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useReservas] ❌ Erro na query:', error.message || 'Erro desconhecido');
        console.error('[useReservas] ❌ Detalhes:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('[useReservas] ✅ Query executada com sucesso!');
      console.log('[useReservas] 📊 Resultados:', {
        totalReservas: data?.length || 0,
        reservas: data?.map(r => ({
          id: r.id,
          data: r.data,
          status: r.status,
          quadra: Array.isArray(r.quadra) ? r.quadra[0]?.nome : (r.quadra as any)?.nome,
          valor: r.valor_total
        }))
      });

      return data as unknown as Reserva[];
    },
  });
}

/**
 * Hook para buscar uma reserva específica com todos os detalhes
 */
export function useReserva(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['reserva', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          organizador:users!reservas_organizador_id_fkey(id, nome_completo, email),
          quadra:quadras(id, nome, tipo),
          horario:horarios(id, dia_semana, hora_inicio, hora_fim, valor_avulsa),
          turma:turmas(id, nome)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Buscar participantes
      const { data: participantes, error: partError } = await supabase
        .from('reserva_participantes')
        .select('*')
        .eq('reserva_id', id);

      if (partError) throw partError;

      return {
        ...data,
        participantes,
        total_participantes: participantes?.length || 0,
      } as Reserva & { participantes: ReservaParticipant[] };
    },
    enabled: !!id,
  });
}

/**
 * Hook para criar uma nova reserva
 */
export function useCreateReserva() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservaData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar valor do horário
      const { data: horario, error: horarioError } = await supabase
        .from('horarios')
        .select('valor_avulsa')
        .eq('id', data.horario_id)
        .single();

      if (horarioError) throw horarioError;

      // Criar reserva
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          organizador_id: user.id,
          quadra_id: data.quadra_id,
          horario_id: data.horario_id,
          data: data.data,
          tipo: data.tipo,
          status: 'pendente',
          valor_total: horario.valor_avulsa,
          observacoes: data.observacoes || null,
          turma_id: data.turma_id || null,
        })
        .select()
        .single();

      if (reservaError) throw reservaError;

      // Se tem turma vinculada, adicionar membros fixos automaticamente
      if (data.turma_id) {
        const { data: membros, error: membrosError } = await supabase
          .from('turma_membros')
          .select('*')
          .eq('turma_id', data.turma_id)
          .eq('status', 'fixo');

        if (!membrosError && membros && membros.length > 0) {
          const participantes = membros.map((membro) => ({
            reserva_id: reserva.id,
            nome: membro.nome,
            email: membro.email,
            whatsapp: membro.whatsapp,
            origem: 'turma' as const,
            status_pagamento: 'pendente' as const,
          }));

          await supabase
            .from('reserva_participantes')
            .insert(participantes);
        }
      }

      return reserva;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });
}

/**
 * Hook para vincular/desvincular turma
 */
export function useVincularTurma() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reserva_id, turma_id }: { reserva_id: string; turma_id: string | null }) => {
      const { error } = await supabase
        .from('reservas')
        .update({ turma_id, updated_at: new Date().toISOString() })
        .eq('id', reserva_id);

      if (error) throw error;

      // Se vincular turma, adicionar membros fixos
      if (turma_id) {
        const { data: membros, error: membrosError } = await supabase
          .from('turma_membros')
          .select('*')
          .eq('turma_id', turma_id)
          .eq('status', 'fixo');

        if (!membrosError && membros && membros.length > 0) {
          const participantes = membros.map((membro) => ({
            reserva_id,
            nome: membro.nome,
            email: membro.email,
            whatsapp: membro.whatsapp,
            origem: 'turma' as const,
            status_pagamento: 'pendente' as const,
          }));

          await supabase
            .from('reserva_participantes')
            .insert(participantes);
        }
      }

      return { reserva_id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reserva_id] });
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });
}

/**
 * Hook para configurar rateio
 */
export function useConfigurarRateio() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reserva_id, config }: { reserva_id: string; config: ConfigRateioData }) => {
      // Atualizar reserva com modo de rateio
      const { error: reservaError } = await supabase
        .from('reservas')
        .update({
          rateio_modo: config.modo,
          rateio_configurado: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reserva_id);

      if (reservaError) throw reservaError;

      // Atualizar participantes com valores/percentuais
      for (const part of config.participantes) {
        const { error: partError } = await supabase
          .from('reserva_participantes')
          .update({
            valor_rateio: config.modo === 'fixo' ? part.valor : null,
            percentual_rateio: config.modo === 'percentual' ? part.percentual : null,
          })
          .eq('id', part.participante_id);

        if (partError) throw partError;
      }

      return { reserva_id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reserva_id] });
    },
  });
}

/**
 * Hook para adicionar participante manual
 */
export function useAddParticipant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reserva_id, data }: { reserva_id: string; data: AddParticipantData }) => {
      const { data: participante, error } = await supabase
        .from('reserva_participantes')
        .insert({
          reserva_id,
          nome: data.nome,
          email: data.email || null,
          whatsapp: data.whatsapp || null,
          origem: 'turma', // Manual = origem turma
          status_pagamento: 'pendente',
        })
        .select()
        .single();

      if (error) throw error;
      return participante;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reserva_id] });
    },
  });
}

/**
 * Hook para remover participante
 */
export function useRemoveParticipant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reserva_id, participante_id }: { reserva_id: string; participante_id: string }) => {
      const { error } = await supabase
        .from('reserva_participantes')
        .delete()
        .eq('id', participante_id);

      if (error) throw error;
      return { reserva_id, participante_id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reserva', variables.reserva_id] });
    },
  });
}

/**
 * Hook para cancelar reserva
 */
export function useCancelReserva() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reserva_id: string) => {
      const { error } = await supabase
        .from('reservas')
        .update({
          status: 'cancelada',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reserva_id);

      if (error) throw error;
      return { reserva_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });
}
