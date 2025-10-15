/**
 * usePrefetch Hook
 * Intelligent data prefetching strategies
 */

import { useEffect, useCallback, useRef } from 'react';
import { prefetchData, prefetchBatch } from './useOptimizedData';

/**
 * Prefetch strategy types
 */
type PrefetchStrategy = 
  | 'hover' // Prefetch on hover
  | 'visible' // Prefetch when element is visible
  | 'idle' // Prefetch during browser idle time
  | 'mount' // Prefetch on component mount
  | 'delay'; // Prefetch after a delay

interface PrefetchOptions {
  strategy: PrefetchStrategy;
  delay?: number; // For 'delay' strategy
  enabled?: boolean;
  threshold?: number; // For 'visible' strategy
}

/**
 * Hook to prefetch data with different strategies
 */
export function usePrefetch(
  keys: string | string[],
  options: PrefetchOptions = { strategy: 'mount' }
) {
  const { strategy, delay = 2000, enabled = true, threshold = 0.5 } = options;
  const prefetched = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const doPrefetch = useCallback(() => {
    if (prefetched.current || !enabled) return;

    const keyArray = Array.isArray(keys) ? keys : [keys];
    
    if (keyArray.length === 1) {
      prefetchData(keyArray[0]);
    } else {
      prefetchBatch(keyArray);
    }

    prefetched.current = true;
  }, [keys, enabled]);

  // Mount strategy
  useEffect(() => {
    if (strategy === 'mount') {
      doPrefetch();
    }
  }, [strategy, doPrefetch]);

  // Delay strategy
  useEffect(() => {
    if (strategy === 'delay') {
      const timer = setTimeout(doPrefetch, delay);
      return () => clearTimeout(timer);
    }
  }, [strategy, delay, doPrefetch]);

  // Idle strategy
  useEffect(() => {
    if (strategy === 'idle') {
      if ('requestIdleCallback' in window) {
        const handle = requestIdleCallback(doPrefetch, { timeout: 5000 });
        return () => cancelIdleCallback(handle);
      } else {
        // Fallback for browsers without requestIdleCallback
        const timer = setTimeout(doPrefetch, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [strategy, doPrefetch, delay]);

  // Visible strategy - prefetch when element enters viewport
  useEffect(() => {
    if (strategy === 'visible' && elementRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            doPrefetch();
          }
        },
        { threshold }
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }
  }, [strategy, threshold, doPrefetch]);

  // Hover strategy handler
  const handleMouseEnter = useCallback(() => {
    if (strategy === 'hover') {
      doPrefetch();
    }
  }, [strategy, doPrefetch]);

  return {
    ref: elementRef,
    onMouseEnter: handleMouseEnter,
    prefetch: doPrefetch,
  };
}

/**
 * Hook to prefetch next page in pagination
 */
export function usePrefetchNextPage(
  getCurrentPageKey: () => string,
  currentPage: number,
  hasNextPage: boolean
) {
  useEffect(() => {
    if (!hasNextPage) return;

    // Prefetch next page during idle time
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => {
        const nextPageKey = getCurrentPageKey();
        prefetchData(nextPageKey);
      });

      return () => cancelIdleCallback(handle);
    }
  }, [currentPage, hasNextPage, getCurrentPageKey]);
}

/**
 * Hook to prefetch related resources based on user intent
 */
export function usePrefetchOnIntent(
  getKeys: () => string[],
  intentSignals: {
    mouseMoving?: boolean;
    scrolling?: boolean;
    typing?: boolean;
  }
) {
  const hasIntent = Object.values(intentSignals).some(Boolean);

  useEffect(() => {
    if (!hasIntent) return;

    const timer = setTimeout(() => {
      const keys = getKeys();
      prefetchBatch(keys);
    }, 500); // Wait 500ms after intent signal

    return () => clearTimeout(timer);
  }, [hasIntent, getKeys]);
}

/**
 * Hook for predictive prefetching based on navigation patterns
 */
export function usePredictivePrefetch(
  navigationHistory: string[],
  currentRoute: string
) {
  useEffect(() => {
    // Analyze common navigation patterns
    const patterns = analyzeNavigationPatterns(navigationHistory, currentRoute);
    
    if (patterns.length > 0) {
      // Prefetch most likely next routes
      prefetchBatch(patterns.slice(0, 3)); // Top 3 predictions
    }
  }, [navigationHistory, currentRoute]);
}

/**
 * Analyze navigation history to predict next routes
 */
function analyzeNavigationPatterns(
  history: string[],
  current: string
): string[] {
  // Simple frequency-based prediction
  const nextRoutes: Record<string, number> = {};

  for (let i = 0; i < history.length - 1; i++) {
    if (history[i] === current) {
      const next = history[i + 1];
      nextRoutes[next] = (nextRoutes[next] || 0) + 1;
    }
  }

  // Sort by frequency
  return Object.entries(nextRoutes)
    .sort(([, a], [, b]) => b - a)
    .map(([route]) => route);
}

/**
 * Hook to prefetch on link hover
 */
export function useLinkPrefetch() {
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-prefetch]');
      
      if (link) {
        const href = link.getAttribute('data-prefetch');
        if (href) {
          prefetchData(href);
        }
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    return () => document.removeEventListener('mouseenter', handleMouseEnter, true);
  }, []);
}

/**
 * Component wrapper for prefetching
 */
export interface PrefetchLinkProps {
  href: string;
  strategy?: PrefetchStrategy;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function PrefetchLink({
  href,
  strategy = 'hover',
  children,
  className,
  onClick,
}: PrefetchLinkProps) {
  const { ref, onMouseEnter } = usePrefetch(href, { strategy });

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={className}
      data-prefetch={href}
    >
      {children}
    </a>
  );
}
