/**
 * Performance Monitoring Hook
 * Track component performance and metrics
 */

import { useEffect, useRef } from "react";
import { measureRender, PerformanceMonitor } from "../lib/performance";

interface PerformanceOptions {
  componentName: string;
  logToConsole?: boolean;
  threshold?: number; // Warn if render takes longer than this (ms)
}

/**
 * Hook to monitor component performance
 */
export function usePerformanceMonitor({
  componentName,
  logToConsole = false,
  threshold = 16, // 60fps = ~16ms per frame
}: PerformanceOptions) {
  const renderCount = useRef(0);
  const measure = useRef(measureRender(componentName));

  useEffect(() => {
    measure.current.start();
    renderCount.current++;

    return () => {
      measure.current.end();

      if (logToConsole) {
        const metrics = PerformanceMonitor.getInstance().getMetrics(componentName);
        if (metrics && metrics.avg > threshold) {
          console.warn(
            `⚠️ ${componentName} render time: ${metrics.avg.toFixed(2)}ms (threshold: ${threshold}ms)`
          );
        }
      }
    };
  });

  return {
    renderCount: renderCount.current,
    getMetrics: () => PerformanceMonitor.getInstance().getMetrics(componentName),
  };
}

/**
 * Hook to track slow renders
 */
export function useSlowRenderDetection(componentName: string, threshold = 16) {
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      const renderTime = performance.now() - startTime.current;
      
      if (renderTime > threshold) {
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    };
  });
}

/**
 * Hook to measure effect performance
 */
export function useEffectPerformance(effectName: string, effect: () => void | (() => void), deps: any[]) {
  useEffect(() => {
    const start = performance.now();
    const cleanup = effect();
    const duration = performance.now() - start;

    PerformanceMonitor.getInstance().recordMetric(`effect:${effectName}`, duration);

    if (process.env.NODE_ENV === 'development' && duration > 10) {
      console.warn(`⚠️ Slow effect: ${effectName} took ${duration.toFixed(2)}ms`);
    }

    return cleanup;
  }, deps);
}
