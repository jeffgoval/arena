import { useEffect, useRef } from "react";

interface UseKeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (shiftKey: boolean) => void;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
  } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case "ArrowUp":
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case "ArrowDown":
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case "ArrowLeft":
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case "ArrowRight":
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        case "Tab":
          if (onTab) {
            onTab(event.shiftKey);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]);
}

/**
 * Hook to trap focus within a modal/dialog
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Save the previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus the first element
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    return () => {
      container.removeEventListener("keydown", handleTabKey);
      // Restore focus to the previously focused element
      previouslyFocused?.focus();
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to announce route changes to screen readers
 */
export function useRouteAnnouncement(routeName: string) {
  useEffect(() => {
    // Announce the route change
    const announcement = `Navegado para ${routeName}`;
    const announcer = document.getElementById("route-announcer");
    if (announcer) {
      announcer.textContent = announcement;
    }
  }, [routeName]);
}
