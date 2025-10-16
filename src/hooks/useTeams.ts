/**
 * Teams Data Hook with SWR
 * Cached data fetching for teams
 */

import useSWR from 'swr';
import { Team } from '../types';

interface UseTeamsOptions {
  userId?: string;
  search?: string;
  refreshInterval?: number;
}

interface UseTeamsReturn {
  teams: Team[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate: () => void;
}

// Mock fetcher
const fetcher = async (url: string): Promise<Team[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: "1",
      name: "Galera do Futebol",
      description: "Time de futebol society",
      members: 8,
      maxMembers: 12,
      sport: "Futebol",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Vôlei Amigos",
      description: "Time de vôlei recreativo",
      members: 6,
      maxMembers: 12,
      sport: "Vôlei",
      createdAt: new Date("2024-02-20"),
    },
  ];
};

/**
 * Hook to fetch teams for a user
 */
export function useTeams(options: UseTeamsOptions = {}): UseTeamsReturn {
  const { userId, search, refreshInterval = 0 } = options;

  const cacheKey = `/api/teams?userId=${userId || 'all'}&search=${search || ''}`;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Team[]>(cacheKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    refreshInterval,
  });

  return {
    teams: data || [],
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

/**
 * Hook to fetch a single team
 */
export function useTeam(teamId: string | null) {
  const cacheKey = teamId ? `/api/teams/${teamId}` : null;

  const { data, error, isLoading, mutate } = useSWR<Team | null>(
    cacheKey,
    async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock single team
      return {
        id: teamId!,
        name: "Galera do Futebol",
        description: "Time de futebol society",
        members: 8,
        maxMembers: 12,
        sport: "Futebol",
        createdAt: new Date("2024-01-15"),
      };
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    team: data || null,
    isLoading,
    isError: !!error,
    mutate,
  };
}

/**
 * Hook to fetch teams where user is a member
 */
export function useUserTeams(userId: string | null) {
  const cacheKey = userId ? `/api/teams/member/${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    cacheKey,
    async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    teams: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
