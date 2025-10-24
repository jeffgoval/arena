import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Team } from '@/types/turmas.types';
import type { TeamFormData } from '@/lib/validations/turma.schema';

/**
 * Hook para buscar todas as turmas do usuário logado
 */
export function useTurmas() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['turmas'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('turmas')
        .select(`
          id,
          nome,
          descricao,
          created_at,
          organizador:users!turmas_organizador_id_fkey(id, nome_completo),
          membros:turma_membros(id, nome, email, whatsapp, status)
        `)
        .eq('organizador_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calcular totais
      const turmasComTotais = data.map((turma: any) => ({
        ...turma,
        total_membros: turma.membros?.length || 0,
        total_fixos: turma.membros?.filter((m: any) => m.status === 'fixo').length || 0,
        total_variaveis: turma.membros?.filter((m: any) => m.status === 'variavel').length || 0,
      }));

      return turmasComTotais as Team[];
    },
  });
}

/**
 * Hook para buscar uma turma específica
 */
export function useTurma(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['turma', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turmas')
        .select(`
          *,
          organizador:users!turmas_organizador_id_fkey(id, nome_completo, email),
          membros:turma_membros(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        total_membros: data.membros?.length || 0,
        total_fixos: data.membros?.filter((m: any) => m.status === 'fixo').length || 0,
        total_variaveis: data.membros?.filter((m: any) => m.status === 'variavel').length || 0,
      } as Team;
    },
    enabled: !!id,
  });
}

/**
 * Hook para criar uma nova turma
 */
export function useCreateTurma() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TeamFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Criar turma
      const { data: turma, error: turmaError } = await supabase
        .from('turmas')
        .insert({
          nome: data.nome,
          descricao: data.descricao || null,
          organizador_id: user.id,
        })
        .select()
        .single();

      if (turmaError) throw turmaError;

      // Criar membros
      if (data.membros && data.membros.length > 0) {
        const membros = data.membros.map((membro) => ({
          turma_id: turma.id,
          nome: membro.nome,
          email: membro.email || null,
          whatsapp: membro.whatsapp || null,
          status: membro.status,
        }));

        const { error: membrosError } = await supabase
          .from('turma_membros')
          .insert(membros);

        if (membrosError) throw membrosError;
      }

      return turma;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}

/**
 * Hook para atualizar uma turma
 */
export function useUpdateTurma() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TeamFormData }) => {
      // Atualizar turma
      const { error: turmaError } = await supabase
        .from('turmas')
        .update({
          nome: data.nome,
          descricao: data.descricao || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (turmaError) throw turmaError;

      // Deletar membros antigos
      const { error: deleteError } = await supabase
        .from('turma_membros')
        .delete()
        .eq('turma_id', id);

      if (deleteError) throw deleteError;

      // Inserir novos membros
      if (data.membros && data.membros.length > 0) {
        const membros = data.membros.map((membro) => ({
          turma_id: id,
          nome: membro.nome,
          email: membro.email || null,
          whatsapp: membro.whatsapp || null,
          status: membro.status,
        }));

        const { error: membrosError } = await supabase
          .from('turma_membros')
          .insert(membros);

        if (membrosError) throw membrosError;
      }

      return { id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      queryClient.invalidateQueries({ queryKey: ['turma', variables.id] });
    },
  });
}

/**
 * Hook para deletar uma turma
 */
export function useDeleteTurma() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Membros serão deletados em cascade
      const { error } = await supabase
        .from('turmas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}
