'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '@/services/core/clients.service';
import type { ClientUpdateData } from '@/services/core/clients.service';
import { useToast } from '@/hooks/use-toast';

// ============================================================
// QUERIES
// ============================================================

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useClientReservas(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId, 'reservas'],
    queryFn: () => clientsService.getReservas(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useClientTransacoes(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId, 'transacoes'],
    queryFn: () => clientsService.getTransacoes(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

// ============================================================
// MUTATIONS
// ============================================================

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      nome_completo: string;
      email: string;
      cpf?: string;
      whatsapp?: string;
      cep?: string;
      logradouro?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
    }) => clientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Cliente criado!',
        description: 'O novo cliente foi cadastrado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar cliente',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientUpdateData }) =>
      clientsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      toast({
        title: 'Cliente atualizado!',
        description: 'Os dados do cliente foram salvos com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar cliente',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useAdjustClientCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      clientId,
      valor,
      tipo,
      descricao,
    }: {
      clientId: string;
      valor: number;
      tipo: 'adicao' | 'uso';
      descricao?: string;
    }) => clientsService.adjustCredits(clientId, valor, tipo, descricao),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId, 'transacoes'] });
      toast({
        title: 'Créditos ajustados!',
        description: `${variables.tipo === 'adicao' ? 'Créditos adicionados' : 'Créditos removidos'} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao ajustar créditos',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
