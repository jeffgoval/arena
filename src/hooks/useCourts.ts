/**
 * Courts Data Hook with SWR
 * Cached data fetching for courts
 */

import useSWR from 'swr';
import { Court } from '../types';

interface UseCortsOptions {
  search?: string;
  type?: string;
  minRating?: number;
  refreshInterval?: number;
}

interface UseCortsReturn {
  courts: Court[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate: () => void;
}

// Mock fetcher
const fetcher = async (url: string): Promise<Court[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: "1",
      name: "Quadra 1 - Society",
      address: "Rua A, 123 - São Paulo, SP",
      type: "society",
      rating: 4.8,
      reviews: 45,
      price: 120,
      image: "https://via.placeholder.com/300x200?text=Quadra+1",
      amenities: ["Vestiário", "Chuveiro", "Estacionamento"],
      availability: "Disponível",
    },
    {
      id: "2",
      name: "Quadra 2 - Poliesportiva",
      address: "Rua B, 456 - São Paulo, SP",
      type: "poliesportiva",
      rating: 4.5,
      reviews: 32,
      price: 150,
      image: "https://via.placeholder.com/300x200?text=Quadra+2",
      amenities: ["Vestiário", "Chuveiro", "Estacionamento", "Ar Condicionado"],
      availability: "Disponível",
    },
    {
      id: "3",
      name: "Quadra 3 - Futsal",
      address: "Rua C, 789 - São Paulo, SP",
      type: "futsal",
      rating: 4.6,
      reviews: 28,
      price: 100,
      image: "https://via.placeholder.com/300x200?text=Quadra+3",
      amenities: ["Vestiário", "Chuveiro"],
      availability: "Disponível",
    },
  ];
};

/**
 * Hook to fetch all courts
 */
export function useCourts(options: UseCortsOptions = {}): UseCortsReturn {
  const { search, type, minRating, refreshInterval = 0 } = options;

  const cacheKey = `/api/courts?search=${search || ''}&type=${type || ''}&minRating=${minRating || 0}`;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Court[]>(cacheKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    refreshInterval,
  });

  // Filter courts based on options
  let filteredCourts = data || [];

  if (minRating) {
    filteredCourts = filteredCourts.filter(c => c.rating >= minRating);
  }

  return {
    courts: filteredCourts,
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

/**
 * Hook to fetch a single court
 */
export function useCourt(courtId: string | null) {
  const cacheKey = courtId ? `/api/courts/${courtId}` : null;

  const { data, error, isLoading, mutate } = useSWR<Court | null>(
    cacheKey,
    async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock single court
      return {
        id: courtId!,
        name: "Quadra 1 - Society",
        address: "Rua A, 123 - São Paulo, SP",
        type: "society",
        rating: 4.8,
        reviews: 45,
        price: 120,
        image: "https://via.placeholder.com/300x200?text=Quadra+1",
        amenities: ["Vestiário", "Chuveiro", "Estacionamento"],
        availability: "Disponível",
      };
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    court: data || null,
    isLoading,
    isError: !!error,
    mutate,
  };
}
