"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  RotateCcw
} from "lucide-react";

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: { x: number; y: number };
  showSkip?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
  customActions?: React.ReactNode;
  beforeShow?: () => void | Promise<void>;
  afterShow?: () => void | Promise<void>;
}

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  className?: string;
  overlayClassName?: string;
  tooltipClassName?: string;
}

export function GuidedTour({
  steps,
  isOpen,
  onClose,
  onComplete,
  onStepChange,
  autoPlay = false,
  autoPlayDelay = 3000,
  showProgress = true,
  showStepNumbers = true,
  className,
  overlayClassName,
  tooltipClassName
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentStepData = steps[currentStep];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && isOpen && steps.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlayDelay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isOpen, steps.length, autoPlayDelay]);

  // Position tooltip based on target element
  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(currentStepData.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      setTargetRect(rect);

      const placement = currentStepData.placement || "bottom";
      const offset = currentStepData.offset || { x: 0, y: 0 };
      
      let x = 0;
      let y = 0;

      switch (placement) {
        case "top":
          x = rect.left + rect.width / 2 + offset.x;
          y = rect.top - 10 + offset.y;
          break;
        case "bottom":
          x = rect.left + rect.width / 2 + offset.x;
          y = rect.bottom + 10 + offset.y;
          break;
        case "left":
          x = rect.left - 10 + offset.x;
          y = rect.top + rect.height / 2 + offset.y;
          break;
        case "right":
          x = rect.right + 10 + offset.x;
          y = rect.top + rect.height / 2 + offset.y;
          break;
      }

      setTooltipPosition({ x, y });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, currentStepData, isOpen]);

  // Execute step callbacks
  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const executeCallbacks = async () => {
      if (currentStepData.beforeShow) {
        await currentStepData.beforeShow();
      }
      
      if (onStepChange) {
        onStepChange(currentStep);
      }

      if (currentStepData.afterShow) {
        await currentStepData.afterShow();
      }
    };

    executeCallbacks();
  }, [currentStep, currentStepData, isOpen, onStepChange]);

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
    onClose();
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setCurrentStep(0);
    setIsPlaying(autoPlay);
  };

  if (!isOpen || !currentStepData) return null;

  const placement = currentStepData.placement || "bottom";

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          overlayClassName
        )}
        onClick={onClose}
      />

      {/* Highlight target element */}
      {targetRect && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        >
          <div className="w-full h-full border-2 border-primary rounded-lg shadow-lg animate-pulse" />
        </div>
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "fixed z-50 bg-card border border-border rounded-lg shadow-xl max-w-sm",
          "transform transition-all duration-200",
          placement === "top" && "-translate-x-1/2 -translate-y-full",
          placement === "bottom" && "-translate-x-1/2",
          placement === "left" && "-translate-x-full -translate-y-1/2",
          placement === "right" && "-translate-y-1/2",
          tooltipClassName
        )}
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
      >
        {/* Arrow */}
        <div
          className={cn(
            "absolute w-3 h-3 bg-card border-border rotate-45",
            placement === "top" && "bottom-[-7px] left-1/2 -translate-x-1/2 border-r border-b",
            placement === "bottom" && "top-[-7px] left-1/2 -translate-x-1/2 border-l border-t",
            placement === "left" && "right-[-7px] top-1/2 -translate-y-1/2 border-t border-r",
            placement === "right" && "left-[-7px] top-1/2 -translate-y-1/2 border-b border-l"
          )}
        />

        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {showStepNumbers && (
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                    {currentStep + 1}
                  </span>
                )}
                <h3 className="font-semibold text-sm">{currentStepData.title}</h3>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="text-sm text-muted-foreground">
            {currentStepData.content}
          </div>

          {/* Progress */}
          {showProgress && steps.length > 1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Passo {currentStep + 1} de {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {steps.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAutoPlay}
                    className="w-8 h-8"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={restart}
                    className="w-8 h-8"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStepData.showSkip !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-xs"
                >
                  Pular
                </Button>
              )}

              {currentStepData.showPrevious !== false && currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousStep}
                  className="text-xs"
                >
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Anterior
                </Button>
              )}

              {currentStepData.customActions || (
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="text-xs"
                >
                  {currentStep === steps.length - 1 ? (
                    "Concluir"
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook para controlar tours
export function useGuidedTour(tourId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Verificar se o tour já foi completado
    const completed = localStorage.getItem(`tour-${tourId}-completed`);
    setHasCompleted(completed === 'true');
  }, [tourId]);

  const start = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const complete = () => {
    setIsOpen(false);
    setHasCompleted(true);
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
  };

  const reset = () => {
    setHasCompleted(false);
    localStorage.removeItem(`tour-${tourId}-completed`);
  };

  return {
    isOpen,
    hasCompleted,
    start,
    close,
    complete,
    reset
  };
}