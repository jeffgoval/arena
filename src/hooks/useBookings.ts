/**
 * Bookings Data Hook with SWR
 * Cached data fetching for bookings using BookingService
 */

import useSWR from 'swr';
import { useCallback, useState } from 'react';
import { Booking } from '../types';
import { serviceContainer } from '../core/config/ServiceContainer';
import { BookingService } from '../core/services/bookings';

interface UseBookingsOptions {
  userId?: string;
  courtId?: string;
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

/**
 * Hook to fetch bookings with caching
 */
export function useBookings(options: UseBookingsOptions = {}): UseBookingsReturn {
  const bookingService: BookingService = serviceContainer.getBookingService();
  const {
    userId,
    courtId,
    status,
    refreshInterval = 0,
    revalidateOnFocus = false,
  } = options;

  // Build cache key based on filters
  const cacheKey = `/api/bookings?userId=${userId || 'all'}&courtId=${courtId || 'all'}&status=${status?.join(',') || 'all'}`;

  const fetcher = async () => {
    if (userId) {
      return bookingService.getUserBookings(userId);
    } else if (courtId) {
      return bookingService.getCourtBookings(courtId);
    } else {
      return bookingService.getAllBookings();
    }
  };

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Booking[]>(cacheKey, fetcher, {
    refreshInterval,
    revalidateOnFocus,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
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
export function useBooking(bookingId: string | null) {
  const bookingService: BookingService = serviceContainer.getBookingService();
  const cacheKey = bookingId ? `/api/bookings/${bookingId}` : null;

  const fetcher = async () => {
    if (!bookingId) return null;
    return bookingService.getBooking(bookingId);
  };

  const { data, error, isLoading, mutate } = useSWR<Booking | null>(
    cacheKey,
    fetcher,
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
  const bookingService: BookingService = serviceContainer.getBookingService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await bookingService.cancelBooking(bookingId, reason);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await bookingService.confirmBooking(bookingId);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (data: Partial<Booking>) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.createBooking(data);
      return { success: true, booking };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelBooking,
    confirmBooking,
    createBooking,
    isLoading,
    error,
  };
}
