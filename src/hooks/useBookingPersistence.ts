/**
 * useBookingPersistence Hook
 * Persists booking data to localStorage for resuming after login/signup
 * Implements 30-minute expiration for security
 */

import { useState, useEffect } from 'react';

export interface BookingData {
  courtId: string;
  courtName: string;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  timestamp: number;
}

const STORAGE_KEY = 'pendingBooking';
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

export function useBookingPersistence() {
  const [pendingBooking, setPendingBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    // Load pending booking on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as BookingData;
        
        // Check if not expired
        if (Date.now() - data.timestamp < EXPIRY_TIME) {
          setPendingBooking(data);
        } else {
          // Expired - clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        // Invalid data - clear it
        console.error('Error parsing pending booking:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveBooking = (data: Omit<BookingData, 'timestamp'>) => {
    const bookingData: BookingData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    setPendingBooking(bookingData);
  };

  const clearBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPendingBooking(null);
  };

  const getTimeRemaining = (): number => {
    if (!pendingBooking) return 0;
    const elapsed = Date.now() - pendingBooking.timestamp;
    const remaining = EXPIRY_TIME - elapsed;
    return Math.max(0, remaining);
  };

  const isExpired = (): boolean => {
    return getTimeRemaining() === 0;
  };

  return {
    pendingBooking,
    saveBooking,
    clearBooking,
    getTimeRemaining,
    isExpired,
    hasBooking: !!pendingBooking,
  };
}
