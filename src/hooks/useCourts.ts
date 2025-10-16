/**
 * Courts Data Hook with SWR
 * Cached data fetching for courts using Supabase
 */

import useSWR from 'swr';
import { Court } from '../types';
import { ServiceContainer } from '../core/config/ServiceContainer';

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

// Real fetcher using Supabase
const fetcher = async (url: string): Promise<Court[]> => {
  try {
    const container = ServiceContainer.getInstance();
    const courtService = container.getCourtService();
    const courts = await courtService.getAllCourts();

    // Map from core Court type to hook Court type
    return courts.map(c => ({
      id: c.id,
      name: c.name,
      address: c.description || '',
      type: c.type,
      rating: c.rating?.average || 0,
      reviews: c.rating?.count || 0,
      price: c.pricing?.hourly || 0,
      image: c.images?.[0] || 'https://via.placeholder.com/300x200?text=Quadra',
      amenities: c.amenities || [],
      availability: 'Disponível',
    }));
  } catch (error) {
    console.error('Error fetching courts:', error);
    return [];
  }
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
