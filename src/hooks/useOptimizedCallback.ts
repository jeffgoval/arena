/**
 * useOptimizedCallback Hook
 * Advanced callback memoization and optimization
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Like useCallback, but guarantees stable reference
 * Useful when you need a callback that doesn't change
 * but uses latest props/state
 */
export function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>(fn);

  // Update ref on every render to have access to latest props/state
  useEffect(() => {
    ref.current = fn;
  });

  // Return a memoized callback that calls the latest function
  return useCallback(((...args: any[]) => {
    return ref.current(...args);
  }) as T, []);
}

/**
 * Batches multiple state updates into a single render
 */
export function useBatchedUpdates() {
  const queue = useRef<Array<() => void>>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const scheduleUpdate = useCallback((update: () => void) => {
    queue.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Execute all queued updates in a single batch
      queue.current.forEach(fn => fn());
      queue.current = [];
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return scheduleUpdate;
}

/**
 * Memoize async callbacks
 */
export function useAsyncCallback<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  deps: React.DependencyList
): [T, { loading: boolean; error: Error | null }] {
  const loadingRef = useRef(false);
  const errorRef = useRef<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const memoizedCallback = useCallback(
    (async (...args: Parameters<T>) => {
      loadingRef.current = true;
      errorRef.current = null;

      try {
        const result = await callback(...args);
        if (mountedRef.current) {
          loadingRef.current = false;
        }
        return result;
      } catch (error) {
        if (mountedRef.current) {
          loadingRef.current = false;
          errorRef.current = error as Error;
        }
        throw error;
      }
    }) as T,
    deps
  );

  return [
    memoizedCallback,
    { loading: loadingRef.current, error: errorRef.current },
  ];
}

/**
 * Memoize function with custom equality
 */
export function useCallbackWithEquality<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  equality: (a: any, b: any) => boolean = Object.is
): T {
  const ref = useRef<{ deps: React.DependencyList; callback: T }>();

  if (!ref.current || !depsAreEqual(ref.current.deps, deps, equality)) {
    ref.current = { deps, callback };
  }

  return ref.current.callback;
}

function depsAreEqual(
  a: React.DependencyList,
  b: React.DependencyList,
  equality: (a: any, b: any) => boolean
): boolean {
  if (a.length !== b.length) return false;
  return a.every((dep, i) => equality(dep, b[i]));
}

/**
 * Debounced callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Throttled callback
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        lastRun.current = now;
        return callback(...args);
      } else {
        // Schedule for later
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [callback, delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * Callback that only executes when component is mounted
 */
export function useMountedCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (mountedRef.current) {
        return callback(...args);
      }
    }) as T,
    [callback]
  );
}

/**
 * Callback with automatic error handling
 */
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  onError?: (error: Error) => void
): T {
  return useCallback(
    ((...args: Parameters<T>) => {
      try {
        return callback(...args);
      } catch (error) {
        console.error('Callback error:', error);
        onError?.(error as Error);
      }
    }) as T,
    [callback, onError]
  );
}
