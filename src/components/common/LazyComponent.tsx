/**
 * LazyComponent
 * Lazy load components when they become visible in viewport
 */

import { ReactNode, useRef, useState, useEffect, ComponentType, lazy, Suspense } from 'react';
import { PageSpinner } from '../LoadingStates';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  placeholder?: ReactNode;
}

/**
 * Lazy load component content when visible
 */
export function LazyComponent({
  children,
  fallback = <PageSpinner />,
  rootMargin = '50px',
  threshold = 0.01,
  placeholder,
}: LazyComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        placeholder || <div style={{ minHeight: '100px' }} />
      )}
    </div>
  );
}

/**
 * Create a lazy-loaded component with viewport detection
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) {
  const LazyComp = lazy(importFn);

  return function LazyComponentWrapper(props: P) {
    return (
      <LazyComponent fallback={fallback}>
        <LazyComp {...props} />
      </LazyComponent>
    );
  };
}

/**
 * Lazy load component on interaction
 */
interface LazyOnInteractionProps {
  children: ReactNode;
  fallback?: ReactNode;
  interactionType?: 'hover' | 'click' | 'focus';
}

export function LazyOnInteraction({
  children,
  fallback = <PageSpinner />,
  interactionType = 'hover',
}: LazyOnInteractionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  const handleInteraction = () => {
    setShouldLoad(true);
  };

  if (shouldLoad) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
  }

  const interactionProps = {
    onMouseEnter: interactionType === 'hover' ? handleInteraction : undefined,
    onClick: interactionType === 'click' ? handleInteraction : undefined,
    onFocus: interactionType === 'focus' ? handleInteraction : undefined,
  };

  return <div {...interactionProps}>{fallback}</div>;
}

/**
 * Lazy load component after a delay
 */
interface LazyAfterDelayProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

export function LazyAfterDelay({
  children,
  fallback = <PageSpinner />,
  delay = 1000,
}: LazyAfterDelayProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldLoad) {
    return <>{fallback}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * Lazy load component during idle time
 */
interface LazyOnIdleProps {
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
}

export function LazyOnIdle({
  children,
  fallback = <PageSpinner />,
  timeout = 5000,
}: LazyOnIdleProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(
        () => {
          setShouldLoad(true);
        },
        { timeout }
      );

      return () => cancelIdleCallback(handle);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout]);

  if (!shouldLoad) {
    return <>{fallback}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * Priority-based lazy loading
 */
interface LazyWithPriorityProps {
  children: ReactNode;
  fallback?: ReactNode;
  priority: 'high' | 'medium' | 'low';
}

export function LazyWithPriority({
  children,
  fallback = <PageSpinner />,
  priority,
}: LazyWithPriorityProps) {
  const delay = {
    high: 0,
    medium: 1000,
    low: 2000,
  }[priority];

  return (
    <LazyAfterDelay delay={delay} fallback={fallback}>
      {children}
    </LazyAfterDelay>
  );
}
