/**
 * Bookings Data Hook with SWR
 * Cached data fetching for bookings using Supabase
 */

import useSWR from 'swr';
import { useCallback } from 'react';
import { ServiceContainer } from '../core/config/ServiceContainer';

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

// Real fetcher using Supabase
const fetcher = async (url: string): Promise<Booking[]> => {
  try {
    const container = ServiceContainer.getInstance();
    const bookingService = container.getBookingService();
    const bookings = await bookingService.getAllBookings();

    // Map from core Booking type to hook Booking type
    return bookings.map(b => ({
      id: parseInt(b.id),
      court: `Quadra ${b.courtId}`,
      date: b.date,
      time: b.time,
      status: b.status as 'confirmed' | 'pending' | 'cancelled',
      players: b.participants?.length || 0,
      totalPlayers: 10,
      payment: b.status === 'confirmed' ? 'paid' : 'pending',
      price: b.price,
      organizerId: undefined,
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
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
 * Optimistic update helper using Supabase
 */
export function useBookingMutations() {
  const cancelBooking = async (bookingId: number) => {
    try {
      const container = ServiceContainer.getInstance();
      const bookingService = container.getBookingService();
      await bookingService.cancelBooking(String(bookingId));
      return { success: true };
    } catch (error) {
      console.error('Error canceling booking:', error);
      return { success: false, error };
    }
  };

  const confirmBooking = async (bookingId: number) => {
    try {
      const container = ServiceContainer.getInstance();
      const bookingService = container.getBookingService();
      await bookingService.confirmBooking(String(bookingId));
      return { success: true };
    } catch (error) {
      console.error('Error confirming booking:', error);
      return { success: false, error };
    }
  };

  const updateBooking = async (bookingId: number, data: Partial<Booking>) => {
    try {
      const container = ServiceContainer.getInstance();
      const bookingService = container.getBookingService();
      await bookingService.updateBooking(String(bookingId), data as any);
      return { success: true };
    } catch (error) {
      console.error('Error updating booking:', error);
      return { success: false, error };
    }
  };

  return {
    cancelBooking,
    confirmBooking,
    updateBooking,
  };
}
