/**
 * User Statistics Hook with SWR
 * Cached data fetching for user stats and metrics
 */

import useSWR from 'swr';

// Types
export interface UserStats {
  gamesOrganized: number;
  gamesParticipated: number;
  totalInvested: number;
  credits: number;
  attendanceRate: number;
  gamesPerMonth: number;
  savings: number;
  referralBonus: number;
}

interface UseStatsReturn {
  stats: UserStats | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate: () => void;
}

// Mock fetcher
const fetcher = async (url: string): Promise<UserStats> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    gamesOrganized: 24,
    gamesParticipated: 42,
    totalInvested: 1240,
    credits: 250,
    attendanceRate: 95,
    gamesPerMonth: 8.5,
    savings: 186,
    referralBonus: 60,
  };
};

/**
 * Hook to fetch user statistics
 */
export function useStats(): UseStatsReturn {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<UserStats>('/api/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
    // Cache for 5 minutes
    refreshInterval: 300000,
  });

  return {
    stats: data || null,
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

/**
 * Hook to fetch monthly trends
 */
export interface MonthlyTrend {
  month: string;
  games: number;
  spent: number;
  saved: number;
}

export function useMonthlyTrends() {
  const { data, error, isLoading, mutate } = useSWR<MonthlyTrend[]>(
    '/api/stats/monthly',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return [
        { month: 'Ago', games: 6, spent: 360, saved: 45 },
        { month: 'Set', games: 8, spent: 480, saved: 60 },
        { month: 'Out', games: 10, spent: 600, saved: 81 },
      ];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    trends: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
