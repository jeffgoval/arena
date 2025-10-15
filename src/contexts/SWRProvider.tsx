/**
 * SWR Provider
 * Global configuration for SWR data fetching
 */

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global fetcher (can be overridden per hook)
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
        
        // Revalidation options
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        
        // Deduping interval (prevent duplicate requests)
        dedupingInterval: 5000, // 5 seconds
        
        // Error retry
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        
        // Loading timeout
        loadingTimeout: 10000,
        
        // Keep previous data while revalidating
        keepPreviousData: true,
        
        // Global error handler
        onError: (error, key) => {
          console.error('SWR Error:', { key, error });
          
          // You can integrate with error tracking here
          // e.g., Sentry, LogRocket, etc.
        },
        
        // Success handler
        onSuccess: (data, key, config) => {
          // Optional: track successful fetches
          // console.log('SWR Success:', key);
        },
        
        // Retry on error with exponential backoff
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Don't retry on 404
          if (error.status === 404) return;
          
          // Only retry up to 3 times
          if (retryCount >= 3) return;
          
          // Exponential backoff
          setTimeout(() => revalidate({ retryCount }), 
            Math.min(1000 * Math.pow(2, retryCount), 30000)
          );
        },
        
        // Cache provider (can use custom storage)
        // provider: () => new Map(),
        
        // Compare function for data equality
        compare: (a, b) => {
          // Deep comparison for objects
          return JSON.stringify(a) === JSON.stringify(b);
        },
        
        // Suspense mode (experimental)
        suspense: false,
        
        // Focus throttle
        focusThrottleInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}

/**
 * SWR Cache utilities
 */
export const swrCache = {
  /**
   * Clear all cache
   */
  clearAll: () => {
    // Implementation depends on cache provider
    // For default Map-based cache:
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
  
  /**
   * Clear specific cache key
   */
  clear: (key: string) => {
    // Use mutate with undefined to clear
    // This is typically done via useSWR's mutate function
  },
  
  /**
   * Prefetch data
   */
  prefetch: async (key: string, fetcher: () => Promise<any>) => {
    try {
      await fetcher();
    } catch (error) {
      console.error('Prefetch error:', error);
    }
  },
};
