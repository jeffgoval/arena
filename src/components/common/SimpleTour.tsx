/**
 * SimpleTour - Tour modal super simples que realmente funciona
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TourStep {
  title: string;
  description: string;
  image?: string;
}

interface SimpleTourProps {
  tourId: string;
  steps: TourStep[];
  onComplete?: () => void;
}

export function SimpleTour({ tourId, steps, onComplete }: SimpleTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if tour was already completed
    const completedTours = JSON.parse(localStorage.getItem('completed-tours') || '[]');
    
    console.log('🎓 SimpleTour - Checking tour:', tourId);
    console.log('🎓 Completed tours:', completedTours);
    
    if (!completedTours.includes(tourId)) {
      console.log('🎓 Tour not completed yet, showing in 1 second...');
      // Small delay to ensure page is loaded
      setTimeout(() => {
        console.log('🎓 Opening tour!');
        setIsOpen(true);
      }, 1000);
    } else {
      console.log('🎓 Tour already completed, skipping');
    }
  }, [tourId]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const completedTours = JSON.parse(localStorage.getItem('completed-tours') || '[]');
    completedTours.push(tourId);
    localStorage.setItem('completed-tours', JSON.stringify(completedTours));
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={handleSkip}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription className="mt-2">
                        Passo {currentStep + 1} de {steps.length}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{step.description}</p>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === currentStep
                            ? 'bg-primary'
                            : index < currentStep
                            ? 'bg-primary/50'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2 justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={isFirstStep}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>

                    <Button onClick={handleNext}>
                      {isLastStep ? (
                        <>
                          Concluir
                          <Check className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Próximo
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="w-full"
                  >
                    Pular tour
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
