'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courtsService, schedulesService, courtBlocksService } from '@/services/core/courts.service';
import type { CourtFormData, ScheduleFormData, CourtBlockFormData } from '@/lib/validations/court.schema';
import { useToast } from '@/hooks/use-toast';

// ============================================================
// COURTS
// ============================================================

export function useCourts() {
  return useQuery({
    queryKey: ['courts'],
    queryFn: courtsService.getAll,
  });
}

export function useCourt(id: string) {
  return useQuery({
    queryKey: ['courts', id],
    queryFn: () => courtsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCourt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CourtFormData) => courtsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
      toast({
        title: 'Quadra criada!',
        description: 'A quadra foi adicionada com sucesso.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.toString() || 'Erro desconhecido ao criar quadra';
      console.error('Erro ao criar quadra:', error);
      toast({
        title: 'Erro ao criar quadra',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCourt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourtFormData> }) =>
      courtsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
      toast({
        title: 'Quadra atualizada!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.toString() || 'Erro desconhecido ao atualizar quadra';
      console.error('Erro ao atualizar quadra:', error);
      toast({
        title: 'Erro ao atualizar quadra',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCourt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => courtsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
      toast({
        title: 'Quadra removida!',
        description: 'A quadra foi excluída do sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover quadra',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================
// SCHEDULES
// ============================================================

export function useSchedules(courtId: string) {
  return useQuery({
    queryKey: ['schedules', courtId],
    queryFn: () => schedulesService.getByCourt(courtId),
    enabled: !!courtId,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ScheduleFormData) => schedulesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', variables.quadra_id] });
      toast({
        title: 'Horário adicionado!',
        description: 'O horário foi configurado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao adicionar horário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ScheduleFormData> }) =>
      schedulesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: 'Horário atualizado!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar horário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => schedulesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: 'Horário removido!',
        description: 'O horário foi excluído.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover horário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================
// COURT_BLOCKS
// ============================================================

export function useAllCourtBlocks() {
  return useQuery({
    queryKey: ['court_blocks_all'],
    queryFn: () => courtBlocksService.getAll(),
  });
}

export function useCourtBlocks(courtId: string) {
  return useQuery({
    queryKey: ['court_blocks', courtId],
    queryFn: () => courtBlocksService.getByCourt(courtId),
    enabled: !!courtId,
  });
}

export function useCreateCourtBlock() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CourtBlockFormData & { created_by?: string }) =>
      courtBlocksService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['court_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['court_blocks_all'] });
      toast({
        title: 'Bloqueio criado!',
        description: 'O horário foi bloqueado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar bloqueio',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCourtBlock() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourtBlockFormData> }) =>
      courtBlocksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['court_blocks_all'] });
      toast({
        title: 'Bloqueio atualizado!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar bloqueio',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCourtBlock() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => courtBlocksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['court_blocks_all'] });
      toast({
        title: 'Bloqueio removido!',
        description: 'O bloqueio foi excluído.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover bloqueio',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
