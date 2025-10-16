/**
 * Courts Data Hook with SWR
 * Cached data fetching for courts using CourtService
 */

import useSWR from 'swr';
import { Court } from '../types';
import { serviceContainer } from '../core/config/ServiceContainer';
import { CourtService } from '../core/services/courts';

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

/**
 * Hook to fetch all courts
 */
export function useCourts(options: UseCortsOptions = {}): UseCortsReturn {
  const courtService: CourtService = serviceContainer.getCourtService();
  const { search, type, minRating, refreshInterval = 0 } = options;

  const cacheKey = `/api/courts?search=${search || ''}&type=${type || ''}&minRating=${minRating || 0}`;

  const fetcher = async () => {
    if (search) {
      return courtService.searchCourts(search);
    } else if (type || minRating) {
      return courtService.filterCourts({ type, minRating });
    } else {
      return courtService.getAllCourts();
    }
  };

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

  return {
    courts: data || [],
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
  const courtService: CourtService = serviceContainer.getCourtService();
  const cacheKey = courtId ? `/api/courts/${courtId}` : null;

  const fetcher = async () => {
    if (!courtId) return null;
    return courtService.getCourt(courtId);
  };

  const { data, error, isLoading, mutate } = useSWR<Court | null>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    court: data || null,
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

