import { useQuery } from '@tanstack/react-query';

interface ConvitesPendentesData {
  count: number;
  loading: boolean;
}

export function useConvitesPendentes(): ConvitesPendentesData {
  const { data, isLoading } = useQuery({
    queryKey: ['convites-pendentes'],
    queryFn: async () => {
      const response = await fetch('/api/convites?status=ativo');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar convites pendentes');
      }
      
      const data = await response.json();
      return data.stats?.ativos || 0;
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000, // Refetch a cada 1 minuto
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return { 
    count: data || 0, 
    loading: isLoading 
  };
}
