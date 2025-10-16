/**
 * Teams Data Hook with SWR
 * Cached data fetching for teams using Supabase
 */

import useSWR from 'swr';
import { Team } from '../types';
import { ServiceContainer } from '../core/config/ServiceContainer';

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

// Real fetcher using Supabase
const fetcher = async (url: string): Promise<Team[]> => {
  try {
    const container = ServiceContainer.getInstance();
    const teamService = container.getTeamService();
    const teams = await teamService.getAllTeams();

    // Map from core Team type to hook Team type
    return teams.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      members: t.members?.length || 0,
      maxMembers: t.maxMembers || 12,
      sport: t.sport,
      createdAt: t.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
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
 * Hook to fetch teams where user is a member using Supabase
 */
export function useUserTeams(userId: string | null) {
  const cacheKey = userId ? `/api/teams/member/${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    cacheKey,
    async (url: string) => {
      try {
        if (!userId) return [];

        const container = ServiceContainer.getInstance();
        const teamService = container.getTeamService();
        const teams = await teamService.getTeamsForMember(userId);

        return teams.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          members: t.members?.length || 0,
          maxMembers: t.maxMembers || 12,
          sport: t.sport,
          createdAt: t.createdAt,
        }));
      } catch (error) {
        console.error('Error fetching user teams:', error);
        return [];
      }
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
