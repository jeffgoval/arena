/**
 * Auto-save hook for forms
 * Automatically saves form data after a debounced delay
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions {
  delay?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  forceSave: () => Promise<void>;
}

export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const {
    delay = 2000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);
  const isMountedRef = useRef(true);

  const save = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return;

    try {
      setIsSaving(true);
      setError(null);
      
      await saveFunction(data);
      
      if (isMountedRef.current) {
        setLastSaved(new Date());
        onSuccess?.();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to auto-save');
      if (isMountedRef.current) {
        setError(error);
        onError?.(error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [data, saveFunction, enabled, onSuccess, onError]);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    previousDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        save();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  return {
    isSaving,
    lastSaved,
    error,
    forceSave,
  };
}

/**
 * Format time ago helper
 */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora mesmo';
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
  return `há ${Math.floor(seconds / 86400)} dias`;
}
