/**
 * useMediaQuery Hook
 * React hook for responsive media queries
 */

import { useState, useEffect } from 'react';

/**
 * Hook to check if a media query matches
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 * 
 * @example
 * const isDesktop = useMediaQuery("(min-width: 768px)");
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with false for SSR compatibility
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (browser environment)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Common breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsTouchDevice() {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
