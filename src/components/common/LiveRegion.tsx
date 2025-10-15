/**
 * Live Region Component
 * Dynamic announcements for screen readers
 */

import { useEffect, useRef } from "react";
import { useAnnouncer } from "../A11yAnnouncer";

interface LiveRegionProps {
  message?: string;
  priority?: "polite" | "assertive";
  clearAfter?: number; // Clear message after X ms
}

/**
 * Live Region for dynamic content updates
 */
export function LiveRegion({ 
  message, 
  priority = "polite",
  clearAfter = 5000 
}: LiveRegionProps) {
  const { announce } = useAnnouncer();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message) {
      announce(message, priority);

      // Clear after timeout
      if (clearAfter > 0) {
        timeoutRef.current = setTimeout(() => {
          announce("", priority);
        }, clearAfter);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, priority, clearAfter, announce]);

  return null;
}

/**
 * Status Live Region - For non-urgent updates
 */
export function StatusRegion({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

/**
 * Alert Live Region - For urgent updates
 */
export function AlertRegion({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

/**
 * Loading Live Region
 */
export function LoadingRegion({ 
  isLoading, 
  message = "Carregando..." 
}: { 
  isLoading: boolean; 
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
      className="sr-only"
    >
      {isLoading && message}
    </div>
  );
}

/**
 * Progress Live Region
 */
export function ProgressRegion({ 
  current, 
  total,
  label = "Progresso"
}: { 
  current: number;
  total: number;
  label?: string;
}) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {label}: {percentage}% completo. {current} de {total}.
    </div>
  );
}

/**
 * Error Live Region
 */
export function ErrorRegion({ error }: { error?: string | null }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {error && `Erro: ${error}`}
    </div>
  );
}
