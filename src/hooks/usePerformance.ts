/**
 * usePerformance Hook
 * Performance monitoring and optimization utilities
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook to measure component render performance
 */
export function useRenderTime(componentName: string, enabled = true) {
  const renderCount = useRef(0);
  const renderStart = useRef<number>(0);

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    renderCount.current += 1;
    const renderTime = performance.now() - renderStart.current;

    // Log slow renders (> 16ms)
    if (renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (render #${renderCount.current})`
      );
    }
  });

  // Mark render start
  if (enabled && process.env.NODE_ENV === 'development') {
    renderStart.current = performance.now();
  }

  return renderCount.current;
}

/**
 * Hook to track why component re-rendered
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[WhyDidYouUpdate]', name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Hook for memoized expensive calculations
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  logName?: string
): T {
  return useMemo(() => {
    const start = performance.now();
    const result = factory();
    const end = performance.now();
    
    if (logName && process.env.NODE_ENV === 'development') {
      console.log(`[Memo] ${logName} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }, deps);
}

/**
 * Hook for throttled callbacks
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        return callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook to measure time to interactive (TTI)
 */
export function useTimeToInteractive(enabled = true) {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('[TTI]', entry.name, `${entry.duration.toFixed(2)}ms`);
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, [enabled]);
}

/**
 * Hook to track long tasks (> 50ms)
 */
export function useLongTaskMonitor(enabled = true) {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn(
            `[Long Task] Task took ${entry.duration.toFixed(2)}ms`,
            entry
          );
        });
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    } catch (e) {
      // longtask may not be supported in all browsers
      console.warn('[Long Task Monitor] Not supported in this browser');
    }
  }, [enabled]);
}

/**
 * Hook for idle callback execution
 */
export function useIdleCallback(
  callback: () => void,
  options?: IdleRequestOptions
) {
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      // Fallback for browsers without requestIdleCallback
      const timeout = setTimeout(callback, 1);
      return () => clearTimeout(timeout);
    }

    const handle = requestIdleCallback(callback, options);
    return () => cancelIdleCallback(handle);
  }, [callback, options]);
}

/**
 * Hook to detect if component is visible in viewport
 * Useful for lazy loading and pausing animations
 */
export function useIsVisible(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible.current = entry.isIntersecting;
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible.current;
}

/**
 * Hook to measure First Contentful Paint (FCP)
 */
export function useFirstContentfulPaint() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          console.log(
            '[FCP] First Contentful Paint:',
            `${entry.startTime.toFixed(2)}ms`
          );
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });

    return () => observer.disconnect();
  }, []);
}

/**
 * Hook to track component mount/unmount lifecycle
 */
export function useLifecycle(
  componentName: string,
  onMount?: () => void,
  onUnmount?: () => void
) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Lifecycle] ${componentName} mounted`);
    }
    onMount?.();

    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Lifecycle] ${componentName} unmounted`);
      }
      onUnmount?.();
    };
  }, [componentName, onMount, onUnmount]);
}
