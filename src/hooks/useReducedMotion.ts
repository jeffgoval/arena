/**
 * Reduced Motion Hook
 * Detect and respect user's motion preferences
 */

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation configuration based on motion preference
 */
export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : 200,
    spring: prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 },
    ease: "easeOut" as const,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Hook to get safe animation class based on motion preference
 */
export function useSafeAnimation(animationClass: string): string {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? "" : animationClass;
}

/**
 * Get animation duration with reduced motion support
 */
export function useAnimationDuration(defaultDuration: number): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0 : defaultDuration;
}
