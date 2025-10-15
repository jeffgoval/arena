/**
 * Performance Utilities
 * Code splitting, prefetching, and performance monitoring
 */

import { lazy, ComponentType } from "react";

/**
 * Lazy load with preload capability
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = lazy(factory);
  
  // Add preload method
  (Component as any).preload = factory;
  
  return Component as typeof Component & { preload: typeof factory };
}

/**
 * Prefetch route component
 */
export function prefetchRoute(route: string) {
  const routeMap: Record<string, () => Promise<any>> = {
    'booking': () => import('../components/BookingFlow').then(m => m.BookingFlow),
    'client-dashboard': () => import('../components/ClientDashboardEnhanced').then(m => m.ClientDashboardEnhanced),
    'manager-dashboard': () => import('../components/ManagerDashboard').then(m => m.ManagerDashboard),
    'teams': () => import('../components/TeamsPage').then(m => m.TeamsPage),
    'transactions': () => import('../components/TransactionHistory').then(m => m.TransactionHistory),
    'user-profile': () => import('../components/UserProfile').then(m => m.UserProfile),
    'settings': () => import('../components/Settings').then(m => m.Settings),
  };

  const loader = routeMap[route];
  if (loader) {
    // Prefetch with low priority
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loader());
    } else {
      setTimeout(() => loader(), 1);
    }
  }
}

/**
 * Performance observer for monitoring
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {
    this.initObservers();
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initObservers() {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.duration);
          }
        });
        observer.observe({ entryTypes: ['navigation', 'measure'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetrics(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    this.metrics.forEach((values, name) => {
      result[name] = this.getMetrics(name);
    });
    return result;
  }

  clear() {
    this.metrics.clear();
  }
}

/**
 * Measure component render time
 */
export function measureRender(componentName: string) {
  return {
    start: () => {
      performance.mark(`${componentName}-start`);
    },
    end: () => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        componentName,
        `${componentName}-start`,
        `${componentName}-end`
      );
      
      const measure = performance.getEntriesByName(componentName)[0];
      if (measure) {
        PerformanceMonitor.getInstance().recordMetric(
          componentName,
          measure.duration
        );
      }

      // Clean up marks
      performance.clearMarks(`${componentName}-start`);
      performance.clearMarks(`${componentName}-end`);
      performance.clearMeasures(componentName);
    },
  };
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request Idle Callback polyfill
 */
export function requestIdleCallback(callback: () => void) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  return setTimeout(callback, 1);
}

/**
 * Get Web Vitals
 */
export async function getWebVitals() {
  if (typeof window === 'undefined') return null;

  const vitals: Record<string, number> = {};

  // Get navigation timing
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    vitals.FCP = navigation.responseEnd - navigation.fetchStart; // First Contentful Paint (approx)
    vitals.TTFB = navigation.responseStart - navigation.requestStart; // Time to First Byte
    vitals.DomContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    vitals.LoadComplete = navigation.loadEventEnd - navigation.loadEventStart;
  }

  // Get paint timing
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach((entry) => {
    if (entry.name === 'first-contentful-paint') {
      vitals.FCP = entry.startTime;
    }
  });

  return vitals;
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics() {
  if (process.env.NODE_ENV !== 'development') return;

  const monitor = PerformanceMonitor.getInstance();
  const metrics = monitor.getAllMetrics();

  console.group('📊 Performance Metrics');
  console.table(metrics);
  console.groupEnd();

  getWebVitals().then((vitals) => {
    if (vitals) {
      console.group('⚡ Web Vitals');
      console.table(vitals);
      console.groupEnd();
    }
  });
}

/**
 * Bundle size utilities
 */
export const bundleUtils = {
  /**
   * Estimate component size in memory
   */
  estimateSize(obj: any): number {
    const seen = new WeakSet();
    
    function sizeOf(obj: any): number {
      if (obj === null || obj === undefined) return 0;
      
      const type = typeof obj;
      if (type === 'boolean') return 4;
      if (type === 'number') return 8;
      if (type === 'string') return obj.length * 2;
      
      if (type === 'object') {
        if (seen.has(obj)) return 0;
        seen.add(obj);
        
        let size = 0;
        if (Array.isArray(obj)) {
          size = obj.reduce((acc, item) => acc + sizeOf(item), 0);
        } else {
          size = Object.keys(obj).reduce((acc, key) => {
            return acc + sizeOf(key) + sizeOf(obj[key]);
          }, 0);
        }
        return size;
      }
      
      return 0;
    }
    
    return sizeOf(obj);
  },

  /**
   * Log bundle information
   */
  logBundleInfo() {
    if (process.env.NODE_ENV !== 'development') return;

    console.group('📦 Bundle Information');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Build time:', new Date().toISOString());
    console.groupEnd();
  },
};
