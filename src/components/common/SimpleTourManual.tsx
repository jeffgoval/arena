/**
 * SimpleTourManual - Tour completamente controlado (sem auto-start)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TourStep {
  title: string;
  description: string;
}

interface SimpleTourManualProps {
  steps: TourStep[];
  onClose: () => void;
}

export function SimpleTourManual({ steps, onClose }: SimpleTourManualProps) {
  const [currentStep, setCurrentStep] = useState(0);

  console.log('🎓 SimpleTourManual renderizado!');
  console.log('🎓 Total de passos:', steps.length);
  console.log('🎓 Passo atual:', currentStep);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      console.log('🎓 Próximo passo:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('🎓 Tour concluído!');
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      console.log('🎓 Passo anterior:', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md pointer-events-auto"
        >
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Passo {currentStep + 1} de {steps.length}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-relaxed">{step.description}</p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-primary w-8'
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
                  size="lg"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                <Button onClick={handleNext} size="lg" className="bg-accent hover:bg-accent/90">
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
                onClick={onClose}
                className="w-full"
              >
                Pular tour
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
