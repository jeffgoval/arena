import { useState, useEffect } from 'react';

interface ConvitesPendentesData {
  count: number;
  loading: boolean;
}

export function useConvitesPendentes(): ConvitesPendentesData {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConvitesPendentes = async () => {
      try {
        const response = await fetch('/api/convites?status=ativo');
        
        if (response.ok) {
          const data = await response.json();
          setCount(data.stats?.ativos || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar convites pendentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConvitesPendentes();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchConvitesPendentes, 30000);

    return () => clearInterval(interval);
  }, []);

  return { count, loading };
}
