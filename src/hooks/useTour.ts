/**
 * useTour Hook
 * Sistema simples de tour guiado para novos usuários
 */

import { useState, useCallback, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';

export interface TourStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UseTourOptions {
  id: string;
  steps: TourStep[];
  autoStart?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

/**
 * Hook para gerenciar tour guiado
 */
export function useTour(options: UseTourOptions) {
  const { id, steps, autoStart = false, onComplete, onSkip } = options;

  const [completedTours, setCompletedTours] = usePersistedState<string[]>(
    'completed-tours',
    []
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const isCompleted = completedTours.includes(id);
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  /**
   * Iniciar tour
   */
  const start = useCallback(() => {
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  /**
   * Próximo passo
   */
  const next = useCallback(() => {
    if (isLastStep) {
      setIsActive(false);
      setCompletedTours((prev) => [...prev, id]);
      onComplete?.();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [isLastStep, id, onComplete, setCompletedTours]);

  /**
   * Passo anterior
   */
  const previous = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [isFirstStep]);

  /**
   * Pular tour
   */
  const skip = useCallback(() => {
    setIsActive(false);
    setCompletedTours((prev) => [...prev, id]);
    onSkip?.();
  }, [id, onSkip, setCompletedTours]);

  /**
   * Ir para step específico
   */
  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  /**
   * Resetar tour
   */
  const reset = useCallback(() => {
    setCompletedTours((prev) => prev.filter((t) => t !== id));
    setCurrentStepIndex(0);
    setIsActive(false);
  }, [id, setCompletedTours]);

  /**
   * Auto-start se não completado
   */
  useEffect(() => {
    if (autoStart && !isCompleted && !isActive) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        start();
      }, 500);
    }
  }, [autoStart, isCompleted, isActive, start]);

  return {
    isActive,
    isCompleted,
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    isFirstStep,
    isLastStep,
    start,
    next,
    previous,
    skip,
    goToStep,
    reset,
  };
}

/**
 * Hook para gerenciar múltiplos tours
 */
export function useTourManager() {
  const [activeTourId, setActiveTourId] = useState<string | null>(null);

  const startTour = useCallback((tourId: string) => {
    setActiveTourId(tourId);
  }, []);

  const endTour = useCallback(() => {
    setActiveTourId(null);
  }, []);

  return {
    activeTourId,
    startTour,
    endTour,
    isAnyTourActive: activeTourId !== null,
  };
}
