import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Convite, ConviteAceite } from '@/types/convites.types';
import type { CreateConviteData, AceitarConviteData } from '@/lib/validations/convite.schema';

/**
 * Hook para buscar convites de uma reserva
 */
export function useConvitesReserva(reserva_id?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['convites', 'reserva', reserva_id],
    queryFn: async () => {
      if (!reserva_id) return [];

      const { data, error } = await supabase
        .from('convites')
        .select(`
          *,
          organizador:users!convites_criado_por_fkey(id, nome_completo, email)
        `)
        .eq('reserva_id', reserva_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Convite[];
    },
    enabled: !!reserva_id,
  });
}

/**
 * Hook para buscar todos os convites criados pelo usuário
 */
export function useConvites() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['convites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('convites')
        .select(`
          *,
          reserva:reservas(
            id,
            data,
            valor_total,
            quadra:quadras(id, nome, tipo),
            horario:horarios(id, hora_inicio, hora_fim)
          )
        `)
        .eq('criado_por', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Convite[];
    },
  });
}

/**
 * Hook para buscar um convite específico pelo token (público)
 */
export function useConviteByToken(token?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['convite', 'token', token],
    queryFn: async () => {
      if (!token) return null;

      const { data, error } = await supabase
        .from('convites')
        .select(`
          *,
          organizador:users!convites_criado_por_fkey(id, nome_completo, email),
          reserva:reservas(
            id,
            data,
            valor_total,
            quadra:quadras(id, nome, tipo),
            horario:horarios(id, hora_inicio, hora_fim)
          )
        `)
        .eq('token', token)
        .single();

      if (error) throw error;

      // Buscar total de aceites
      const { data: aceites, error: aceitesError } = await supabase
        .from('convite_aceites')
        .select('id')
        .eq('convite_id', data.id);

      if (aceitesError) throw aceitesError;

      return {
        ...data,
        total_aceites: aceites?.length || 0,
      } as Convite;
    },
    enabled: !!token,
  });
}

/**
 * Hook para buscar aceites de um convite
 */
export function useConviteAceites(convite_id?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['convite-aceites', convite_id],
    queryFn: async () => {
      if (!convite_id) return [];

      const { data, error } = await supabase
        .from('convite_aceites')
        .select('*')
        .eq('convite_id', convite_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ConviteAceite[];
    },
    enabled: !!convite_id,
  });
}

/**
 * Hook para criar um novo convite
 */
export function useCreateConvite() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConviteData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar token único (8 caracteres alfanuméricos)
      const token = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Calcular data de expiração se fornecido dias_validade
      let data_expiracao = null;
      if (data.dias_validade) {
        const dataExp = new Date();
        dataExp.setDate(dataExp.getDate() + data.dias_validade);
        data_expiracao = dataExp.toISOString();
      }

      const { data: convite, error } = await supabase
        .from('convites')
        .insert({
          reserva_id: data.reserva_id,
          criado_por: user.id,
          token,
          vagas_disponiveis: data.vagas_disponiveis,
          vagas_totais: data.vagas_disponiveis,
          mensagem: data.mensagem || null,
          valor_por_pessoa: data.valor_por_pessoa || null,
          data_expiracao,
          status: 'ativo',
          total_aceites: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return convite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] });
    },
  });
}

/**
 * Hook para aceitar um convite
 */
export function useAceitarConvite() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token, data }: { token: string; data: AceitarConviteData }) => {
      // Buscar convite
      const { data: convite, error: conviteError } = await supabase
        .from('convites')
        .select('*')
        .eq('token', token)
        .single();

      if (conviteError) throw conviteError;
      if (!convite) throw new Error('Convite não encontrado');
      if (convite.status !== 'ativo') throw new Error('Convite não está mais ativo');
      if (convite.total_aceites >= convite.vagas_disponiveis) throw new Error('Não há vagas disponíveis');

      // Verificar se usuário está logado
      const { data: { user } } = await supabase.auth.getUser();

      // Criar aceite
      const { data: aceite, error: aceiteError } = await supabase
        .from('convite_aceites')
        .insert({
          convite_id: convite.id,
          nome: data.nome,
          email: data.email || null,
          whatsapp: data.whatsapp || null,
          user_id: user?.id || null,
          confirmado: true,
        })
        .select()
        .single();

      if (aceiteError) throw aceiteError;

      // Atualizar contador de aceites no convite
      const novoTotal = convite.total_aceites + 1;
      const novoStatus = novoTotal >= convite.vagas_disponiveis ? 'completo' : 'ativo';

      await supabase
        .from('convites')
        .update({
          total_aceites: novoTotal,
          status: novoStatus,
        })
        .eq('id', convite.id);

      // Adicionar como participante da reserva
      await supabase
        .from('reserva_participantes')
        .insert({
          reserva_id: convite.reserva_id,
          nome: data.nome,
          email: data.email || null,
          whatsapp: data.whatsapp || null,
          origem: 'convite',
          convite_id: convite.id,
          status_pagamento: 'pendente',
        });

      return aceite;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['convite', 'token', variables.token] });
      queryClient.invalidateQueries({ queryKey: ['convite-aceites'] });
    },
  });
}

/**
 * Hook para cancelar/desativar um convite
 */
export function useCancelarConvite() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (convite_id: string) => {
      const { error } = await supabase
        .from('convites')
        .update({
          status: 'expirado',
          updated_at: new Date().toISOString(),
        })
        .eq('id', convite_id);

      if (error) throw error;
      return { convite_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites'] });
    },
  });
}
