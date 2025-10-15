/**
 * Tour Components
 * Sistema de tour guiado visual
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { useTour, type TourStep } from '../../hooks/useTour';

interface TourProps {
  id: string;
  steps: TourStep[];
  autoStart?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

/**
 * Tour Component - Main tour wrapper
 */
export function Tour({ id, steps, autoStart, onComplete, onSkip }: TourProps) {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    next,
    previous,
    skip,
  } = useTour({ id, steps, autoStart, onComplete, onSkip });

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Find and track target element
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const element = document.querySelector(currentStep.target) as HTMLElement;
    setTargetElement(element);

    if (element) {
      // Scroll element into view
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Calculate position
      const rect = element.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isActive, currentStep]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!targetElement) return;

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetElement]);

  if (!isActive || !currentStep) return null;

  return (
    <>
      {/* Overlay */}
      <TourOverlay
        targetElement={targetElement}
        position={position}
        onClick={skip}
      />

      {/* Step Card */}
      <TourStepCard
        step={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={totalSteps}
        targetElement={targetElement}
        position={position}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onNext={next}
        onPrevious={previous}
        onSkip={skip}
      />
    </>
  );
}

/**
 * Tour Overlay with Spotlight
 */
interface TourOverlayProps {
  targetElement: HTMLElement | null;
  position: { top: number; left: number };
  onClick: () => void;
}

function TourOverlay({ targetElement, position, onClick }: TourOverlayProps) {
  const rect = targetElement?.getBoundingClientRect();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998]"
      onClick={onClick}
    >
      {/* Dark overlay with spotlight */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - 8}
                y={rect.top - 8}
                width={rect.width + 16}
                height={rect.height + 16}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.7)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Highlight border */}
      {rect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute border-2 border-primary rounded-lg"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * Tour Step Card
 */
interface TourStepCardProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetElement: HTMLElement | null;
  position: { top: number; left: number };
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

function TourStepCard({
  step,
  stepIndex,
  totalSteps,
  targetElement,
  position,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onSkip,
}: TourStepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

  // Calculate card position based on target and placement
  useEffect(() => {
    if (!targetElement || !cardRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    const placement = step.placement || 'bottom';

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = targetRect.top - cardRect.height - 16;
        left = targetRect.left + targetRect.width / 2 - cardRect.width / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + 16;
        left = targetRect.left + targetRect.width / 2 - cardRect.width / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - cardRect.height / 2;
        left = targetRect.left - cardRect.width - 16;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - cardRect.height / 2;
        left = targetRect.right + 16;
        break;
    }

    // Keep card within viewport
    const padding = 16;
    top = Math.max(padding, Math.min(top, window.innerHeight - cardRect.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - cardRect.width - padding));

    setCardPosition({ top, left });
  }, [targetElement, step.placement]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'fixed z-[9999] w-80 max-w-[calc(100vw-2rem)]',
        'bg-popover border rounded-lg shadow-lg p-4'
      )}
      style={{
        top: cardPosition.top,
        left: cardPosition.left,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold">{step.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Passo {stepIndex + 1} de {totalSteps}
          </p>
        </div>
        <button
          onClick={onSkip}
          className="p-1 rounded hover:bg-muted transition-colors"
          aria-label="Pular tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground mb-4">{step.content}</p>

      {/* Action (if provided) */}
      {step.action && (
        <Button
          variant="outline"
          size="sm"
          onClick={step.action.onClick}
          className="w-full mb-3"
        >
          {step.action.label}
        </Button>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        {/* Progress dots */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                i === stepIndex ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            disabled={isFirstStep}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <Button size="sm" onClick={onNext}>
            {isLastStep ? (
              <>
                Concluir
                <Check className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Tour Trigger Button
 */
interface TourTriggerProps {
  tourId: string;
  steps: TourStep[];
  children?: React.ReactNode;
  className?: string;
}

export function TourTrigger({
  tourId,
  steps,
  children = 'Iniciar Tour',
  className,
}: TourTriggerProps) {
  const { start } = useTour({ id: tourId, steps });

  return (
    <Button variant="outline" size="sm" onClick={start} className={className}>
      {children}
    </Button>
  );
}
