/**
 * Invitations Data Hook with SWR
 * Cached data fetching for game invitations
 */

import useSWR from 'swr';
import { useCallback } from 'react';

// Types
export interface Invitation {
  id: number;
  organizer: string;
  court: string;
  date: string;
  time: string;
  value: number;
  status?: 'pending' | 'accepted' | 'declined';
}

interface UseInvitationsReturn {
  invitations: Invitation[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate: () => void;
  refresh: () => void;
}

// Mock fetcher
const fetcher = async (url: string): Promise<Invitation[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return [
    {
      id: 1,
      organizer: "Carlos Silva",
      court: "Quadra 1 - Society",
      date: "20/10/2025",
      time: "18:00",
      value: 15,
      status: 'pending',
    },
    {
      id: 2,
      organizer: "Ana Paula",
      court: "Quadra 3 - Beach Tennis",
      date: "25/10/2025",
      time: "17:00",
      value: 20,
      status: 'pending',
    },
  ];
};

/**
 * Hook to fetch invitations
 */
export function useInvitations(): UseInvitationsReturn {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Invitation[]>('/api/invitations', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    invitations: data || [],
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
    refresh,
  };
}

/**
 * Invitation mutations
 */
export function useInvitationMutations() {
  const acceptInvitation = async (invitationId: number) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  };

  const declineInvitation = async (invitationId: number) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  };

  return {
    acceptInvitation,
    declineInvitation,
  };
}
