/**
 * Bookings Data Hook with SWR
 * Cached data fetching for bookings
 */

import useSWR from 'swr';
import { useCallback } from 'react';

// Types
export interface Booking {
  id: number;
  court: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  players: number;
  totalPlayers: number;
  payment: 'paid' | 'pending' | 'cancelled';
  price?: number;
  organizerId?: number;
}

interface UseBookingsOptions {
  type?: 'organized' | 'participating' | 'all';
  status?: Booking['status'][];
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
}

interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  mutate: () => void;
  refresh: () => void;
}

// Mock fetcher (replace with real API call)
const fetcher = async (url: string): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock data
  return [
    {
      id: 1,
      court: "Quadra 1 - Society",
      date: "15/10/2025",
      time: "19:00",
      status: "confirmed",
      players: 8,
      totalPlayers: 10,
      payment: "paid",
      price: 120,
    },
    {
      id: 2,
      court: "Quadra 2 - Poliesportiva",
      date: "18/10/2025",
      time: "20:00",
      status: "confirmed",
      players: 6,
      totalPlayers: 12,
      payment: "paid",
      price: 150,
    },
    {
      id: 3,
      court: "Quadra 1 - Society",
      date: "22/10/2025",
      time: "19:00",
      status: "pending",
      players: 5,
      totalPlayers: 10,
      payment: "pending",
      price: 120,
    },
  ];
};

/**
 * Hook to fetch bookings with caching
 */
export function useBookings(options: UseBookingsOptions = {}): UseBookingsReturn {
  const {
    type = 'all',
    status,
    refreshInterval = 0,
    revalidateOnFocus = false,
  } = options;

  // Build cache key based on filters
  const cacheKey = `/api/bookings?type=${type}&status=${status?.join(',') || 'all'}`;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Booking[]>(cacheKey, fetcher, {
    refreshInterval,
    revalidateOnFocus,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5 seconds
    // Keep previous data while loading new data
    keepPreviousData: true,
  });

  // Filter bookings based on status
  const filteredBookings = data?.filter((booking) => {
    if (status && status.length > 0) {
      return status.includes(booking.status);
    }
    return true;
  }) || [];

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    bookings: filteredBookings,
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
    refresh,
  };
}

/**
 * Hook to fetch a single booking
 */
export function useBooking(bookingId: number | null) {
  const cacheKey = bookingId ? `/api/bookings/${bookingId}` : null;

  const { data, error, isLoading, mutate } = useSWR<Booking>(
    cacheKey,
    async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock single booking
      return {
        id: bookingId!,
        court: "Quadra 1 - Society",
        date: "15/10/2025",
        time: "19:00",
        status: "confirmed",
        players: 8,
        totalPlayers: 10,
        payment: "paid",
        price: 120,
      };
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    booking: data || null,
    isLoading,
    isError: !!error,
    error: error || null,
    mutate,
  };
}

/**
 * Optimistic update helper
 */
export function useBookingMutations() {
  const cancelBooking = async (bookingId: number) => {
    // Optimistic update logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const confirmBooking = async (bookingId: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const updateBooking = async (bookingId: number, data: Partial<Booking>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  return {
    cancelBooking,
    confirmBooking,
    updateBooking,
  };
}
