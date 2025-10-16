/**
 * Teams Data Hook with SWR
 * Cached data fetching for teams using TeamService
 */

import useSWR from 'swr';
import { Team } from '../types';
import { serviceContainer } from '../core/config/ServiceContainer';
import { TeamService } from '../core/services/teams';

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

/**
 * Hook to fetch teams for a user
 */
export function useTeams(options: UseTeamsOptions = {}): UseTeamsReturn {
  const teamService: TeamService = serviceContainer.getTeamService();
  const { userId, search, refreshInterval = 0 } = options;

  const cacheKey = `/api/teams?userId=${userId || 'all'}&search=${search || ''}`;

  const fetcher = async () => {
    if (search) {
      return teamService.searchTeams(search);
    } else if (userId) {
      return teamService.getUserTeams(userId);
    } else {
      return teamService.getAllTeams();
    }
  };

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
  const teamService: TeamService = serviceContainer.getTeamService();
  const cacheKey = teamId ? `/api/teams/${teamId}` : null;

  const fetcher = async () => {
    if (!teamId) return null;
    return teamService.getTeam(teamId);
  };

  const { data, error, isLoading, mutate } = useSWR<Team | null>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    team: data || null,
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

/**
 * Hook to fetch teams where user is a member
 */
export function useUserTeams(userId: string | null) {
  const teamService: TeamService = serviceContainer.getTeamService();
  const cacheKey = userId ? `/api/teams/member/${userId}` : null;

  const fetcher = async () => {
    if (!userId) return [];
    return teamService.getTeamsForMember(userId);
  };

  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    teams: data || [],
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

