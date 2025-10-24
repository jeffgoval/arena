import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configuracoesService, type Configuracoes, type ConfiguracoesTemplate } from '@/services/core/configuracoes.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para buscar configurações do sistema
 */
export function useConfiguracoes() {
  return useQuery({
    queryKey: ['configuracoes'],
    queryFn: () => configuracoesService.getConfiguracoes(),
    staleTime: 10 * 60 * 1000, // 10 minutos (configurações mudam raramente)
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

/**
 * Hook para salvar configurações
 */
export function useSaveConfiguracoes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (config: Partial<Configuracoes>) =>
      configuracoesService.saveConfiguracoes(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
      toast({
        title: 'Configurações Salvas',
        description: 'Todas as alterações foram salvas com sucesso!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao Salvar',
        description: error.message || 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para restaurar configurações padrão
 */
export function useRestaurarConfiguracoespadrao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => configuracoesService.restaurarPadrao(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
      toast({
        title: 'Configurações Restauradas',
        description: 'Valores padrão foram restaurados',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao Restaurar',
        description: error.message || 'Não foi possível restaurar as configurações',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para buscar templates de mensagens
 */
export function useTemplates() {
  return useQuery({
    queryKey: ['configuracoes', 'templates'],
    queryFn: () => configuracoesService.getTemplates(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook para salvar templates
 */
export function useSaveTemplates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (templates: Partial<ConfiguracoesTemplate>) =>
      configuracoesService.saveTemplates(templates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes', 'templates'] });
      toast({
        title: 'Templates Salvos',
        description: 'Templates de mensagens foram atualizados',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao Salvar Templates',
        description: error.message || 'Não foi possível salvar os templates',
        variant: 'destructive',
      });
    },
  });
}
