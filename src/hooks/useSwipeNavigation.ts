/**
 * useSwipeNavigation Hook
 * Navegação por gestos de swipe em dispositivos móveis
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useHashRouter } from './useHashRouter';

export interface SwipeNavigationOptions {
  threshold?: number; // Minimum distance in pixels to trigger swipe (default: 50)
  velocityThreshold?: number; // Minimum velocity to trigger swipe (default: 0.3)
  enabled?: boolean; // Enable/disable swipe navigation
  onSwipeLeft?: () => void; // Custom handler for swipe left
  onSwipeRight?: () => void; // Custom handler for swipe right
  preventDefaultSwipe?: boolean; // Prevent default swipe behavior
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

/**
 * Hook para navegação por swipe gestures
 */
export function useSwipeNavigation(
  elementRef?: React.RefObject<HTMLElement>,
  options: SwipeNavigationOptions = {}
) {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    enabled = true,
    onSwipeLeft,
    onSwipeRight,
    preventDefaultSwipe = false,
  } = options;

  const { goBack, goForward } = useHashRouter();

  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0 to 1

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    touchEnd.current = null;
    setIsSwiping(true);
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStart.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStart.current.x;
    const deltaY = currentY - touchStart.current.y;

    // Check if horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Calculate progress (0 to 1)
      const progress = Math.min(Math.abs(deltaX) / threshold, 1);
      setSwipeProgress(progress);

      if (preventDefaultSwipe && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    }

    touchEnd.current = {
      x: currentX,
      y: currentY,
      time: Date.now(),
    };
  }, [enabled, threshold, preventDefaultSwipe]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchStart.current || !touchEnd.current) {
      setIsSwiping(false);
      setSwipeProgress(0);
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    // Calculate velocity (pixels per millisecond)
    const velocity = Math.abs(deltaX) / deltaTime;

    // Check if it's a horizontal swipe (not vertical)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    // Check if swipe meets threshold requirements
    const meetsThreshold = Math.abs(deltaX) > threshold || velocity > velocityThreshold;

    if (isHorizontalSwipe && meetsThreshold) {
      if (deltaX > 0) {
        // Swipe right (go back)
        if (onSwipeRight) {
          onSwipeRight();
        } else {
          goBack();
        }
      } else {
        // Swipe left (go forward)
        if (onSwipeLeft) {
          onSwipeLeft();
        } else {
          goForward();
        }
      }
    }

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
    setIsSwiping(false);
    setSwipeProgress(0);
  }, [
    enabled,
    threshold,
    velocityThreshold,
    onSwipeLeft,
    onSwipeRight,
    goBack,
    goForward,
  ]);

  useEffect(() => {
    const element = elementRef?.current || document.body;

    if (!enabled) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultSwipe });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    enabled,
    elementRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    preventDefaultSwipe,
  ]);

  return {
    isSwiping,
    swipeProgress,
  };
}

/**
 * Hook para detectar direção de swipe
 */
export function useSwipeDetection(
  callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  },
  options: {
    threshold?: number;
    preventDefault?: boolean;
  } = {}
) {
  const { threshold = 50, preventDefault = false } = options;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine swipe direction
    if (absX > absY && absX > threshold) {
      // Horizontal swipe
      if (deltaX > 0 && callbacks.onSwipeRight) {
        if (preventDefault) e.preventDefault();
        callbacks.onSwipeRight();
      } else if (deltaX < 0 && callbacks.onSwipeLeft) {
        if (preventDefault) e.preventDefault();
        callbacks.onSwipeLeft();
      }
    } else if (absY > absX && absY > threshold) {
      // Vertical swipe
      if (deltaY > 0 && callbacks.onSwipeDown) {
        if (preventDefault) e.preventDefault();
        callbacks.onSwipeDown();
      } else if (deltaY < 0 && callbacks.onSwipeUp) {
        if (preventDefault) e.preventDefault();
        callbacks.onSwipeUp();
      }
    }

    touchStart.current = null;
  }, [callbacks, threshold, preventDefault]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd, preventDefault]);
}

/**
 * Hook para edge swipe (swipe from screen edge)
 */
export function useEdgeSwipe(
  options: {
    edgeWidth?: number; // Width in pixels from edge to detect (default: 20)
    onLeftEdgeSwipe?: () => void;
    onRightEdgeSwipe?: () => void;
  } = {}
) {
  const { edgeWidth = 20, onLeftEdgeSwipe, onRightEdgeSwipe } = options;
  const touchStart = useRef<{ x: number; isEdge: boolean } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const x = e.touches[0].clientX;
    const isLeftEdge = x <= edgeWidth;
    const isRightEdge = x >= window.innerWidth - edgeWidth;

    if (isLeftEdge || isRightEdge) {
      touchStart.current = {
        x,
        isEdge: isLeftEdge ? true : false, // true = left, false = right
      };
    }
  }, [edgeWidth]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;

    // Left edge swipe (swipe right from left edge)
    if (touchStart.current.isEdge && deltaX > 50 && onLeftEdgeSwipe) {
      onLeftEdgeSwipe();
    }
    // Right edge swipe (swipe left from right edge)
    else if (!touchStart.current.isEdge && deltaX < -50 && onRightEdgeSwipe) {
      onRightEdgeSwipe();
    }

    touchStart.current = null;
  }, [onLeftEdgeSwipe, onRightEdgeSwipe]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}
