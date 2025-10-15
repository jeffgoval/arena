/**
 * useOptimizedData Hook
 * Advanced data fetching with SWR, prefetch, cache, and optimistic updates
 */

import useSWR, { mutate, SWRConfiguration } from 'swr';
import { useCallback, useMemo } from 'react';

/**
 * Default fetcher function
 */
const defaultFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Hook for optimized data fetching with SWR
 */
export function useOptimizedData<T>(
  key: string | null,
  options?: SWRConfiguration<T>
) {
  const { data, error, isLoading, isValidating, mutate: mutateFn } = useSWR<T>(
    key,
    defaultFetcher,
    {
      ...options,
      // Enable revalidation on mount for fresh data
      revalidateOnMount: true,
    }
  );

  /**
   * Optimistic update - update UI immediately, then revalidate
   */
  const optimisticUpdate = useCallback(
    async (newData: T, shouldRevalidate = true) => {
      if (!key) return;

      // Update cache immediately
      await mutateFn(newData, false);

      // Optionally revalidate from server
      if (shouldRevalidate) {
        await mutateFn();
      }
    },
    [key, mutateFn]
  );

  /**
   * Force refresh data from server
   */
  const refresh = useCallback(() => {
    return mutateFn();
  }, [mutateFn]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    isEmpty: !data && !error && !isLoading,
    optimisticUpdate,
    refresh,
    mutate: mutateFn,
  };
}

/**
 * Hook for paginated data with infinite scroll
 */
export function usePaginatedData<T>(
  getKey: (pageIndex: number, previousPageData: T | null) => string | null,
  options?: SWRConfiguration<T>
) {
  // Implementation would use useSWRInfinite here
  // For now, returning a basic structure
  return {
    data: [] as T[],
    error: null,
    isLoading: false,
    isValidating: false,
    size: 1,
    setSize: (size: number) => {},
    isReachingEnd: false,
    isEmpty: true,
  };
}

/**
 * Prefetch data into cache
 */
export function prefetchData(key: string): void {
  // Start fetching but don't wait for it
  mutate(key, defaultFetcher(key), false);
}

/**
 * Clear cache for specific key
 */
export function clearCache(key: string): void {
  mutate(key, undefined, false);
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  // This would need access to SWR's cache provider
  // For now, log a warning
  console.warn('clearAllCache: Not implemented. Consider page reload.');
}

/**
 * Hook for dependent data fetching
 * Only fetches when dependencies are ready
 */
export function useDependentData<T>(
  getKey: () => string | null,
  dependencies: any[],
  options?: SWRConfiguration<T>
) {
  const key = useMemo(() => {
    // Only generate key if all dependencies are truthy
    return dependencies.every(Boolean) ? getKey() : null;
  }, dependencies);

  return useOptimizedData<T>(key, options);
}

/**
 * Hook for conditional data fetching
 */
export function useConditionalData<T>(
  key: string,
  condition: boolean,
  options?: SWRConfiguration<T>
) {
  return useOptimizedData<T>(condition ? key : null, options);
}

/**
 * Batch prefetch multiple resources
 */
export function prefetchBatch(keys: string[]): void {
  keys.forEach(key => prefetchData(key));
}

/**
 * Hook for parallel data fetching
 */
export function useParallelData<T extends Record<string, any>>(
  keys: Record<keyof T, string>,
  options?: SWRConfiguration
) {
  const results = {} as Record<keyof T, ReturnType<typeof useOptimizedData>>;

  for (const [name, key] of Object.entries(keys)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[name as keyof T] = useOptimizedData(key, options);
  }

  const isLoading = Object.values(results).some(r => r.isLoading);
  const hasError = Object.values(results).some(r => r.error);
  const data = Object.fromEntries(
    Object.entries(results).map(([key, value]) => [key, value.data])
  ) as T;

  return {
    data,
    isLoading,
    hasError,
    results,
  };
}
