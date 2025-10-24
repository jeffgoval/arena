import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  CreditosResponse, 
  ComprarCreditosData, 
  PacoteCredito 
} from '@/types/creditos.types';

/**
 * Hook para buscar dados de créditos do usuário
 */
export function useCreditos(limit = 50, offset = 0) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['creditos', limit, offset],
    queryFn: async (): Promise<CreditosResponse> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const params = new URLSearchParams({
        userId: user.id,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`/api/creditos?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar créditos');
      }

      return await response.json();
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para comprar créditos
 */
export function useComprarCreditos() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ComprarCreditosData) => {
      const response = await fetch('/api/creditos/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao comprar créditos');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Compra realizada!',
        description: data.message || 'Créditos adicionados com sucesso!',
      });
      
      // Invalidar cache de créditos
      queryClient.invalidateQueries({ queryKey: ['creditos'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro na compra',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para usar créditos
 */
export function useUsarCreditos() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ valor, reservaId }: { valor: number; reservaId: string }) => {
      const response = await fetch('/api/creditos/usar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor, reservaId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao usar créditos');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Créditos utilizados!',
        description: data.message || 'Créditos descontados com sucesso!',
      });
      
      // Invalidar cache de créditos
      queryClient.invalidateQueries({ queryKey: ['creditos'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao usar créditos',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Pacotes de créditos disponíveis
 */
export const PACOTES_CREDITOS: PacoteCredito[] = [
  {
    id: 'basico',
    nome: 'Pacote Básico',
    valor: 50,
    creditos: 50,
    bonus: 0,
    validadeMeses: 6,
    beneficios: [
      'R$ 50 em créditos',
      'Válido por 6 meses',
      'Sem taxa adicional'
    ],
  },
  {
    id: 'premium',
    nome: 'Pacote Premium',
    valor: 100,
    creditos: 110,
    bonus: 10,
    validadeMeses: 12,
    beneficios: [
      'R$ 110 em créditos',
      '+R$ 10 de bônus',
      'Válido por 12 meses',
      'Prioridade nas reservas'
    ],
    popular: true,
  },
  {
    id: 'vip',
    nome: 'Pacote VIP',
    valor: 200,
    creditos: 250,
    bonus: 50,
    validadeMeses: 18,
    beneficios: [
      'R$ 250 em créditos',
      '+R$ 50 de bônus',
      'Válido por 18 meses',
      'Acesso a quadras premium',
      'Desconto em equipamentos'
    ],
  },
];

/**
 * Formas de ganhar créditos grátis
 */
export const FORMAS_GANHAR_CREDITOS = [
  {
    titulo: 'Indique Amigos',
    descricao: 'Ganhe R$ 25 para cada amigo que se cadastrar e fizer sua primeira reserva',
    icon: 'ArrowUpRight',
    color: 'purple',
  },
  {
    titulo: 'Jogue Regularmente',
    descricao: 'Ganhe bônus de fidelidade jogando pelo menos 4 vezes por mês',
    icon: 'Calendar',
    color: 'blue',
  },
  {
    titulo: 'Promoções Especiais',
    descricao: 'Participe de promoções sazonais e ganhe créditos extras',
    icon: 'Gift',
    color: 'green',
  },
  {
    titulo: 'Avalie Suas Partidas',
    descricao: 'Ganhe R$ 5 em créditos para cada avaliação detalhada que fizer',
    icon: 'CheckCircle',
    color: 'orange',
  },
];