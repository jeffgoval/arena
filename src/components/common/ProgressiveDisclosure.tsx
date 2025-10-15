/**
 * Progressive Disclosure Component
 * Show/hide content to reduce cognitive load
 */

import { useState, ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { ChevronDown, ChevronRight, Info, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface ProgressiveDisclosureProps {
  title: string;
  summary: ReactNode;
  details: ReactNode;
  icon?: LucideIcon;
  badge?: string | number;
  defaultOpen?: boolean;
  variant?: "card" | "inline" | "compact";
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Main Progressive Disclosure Component
 */
export function ProgressiveDisclosure({
  title,
  summary,
  details,
  icon: Icon,
  badge,
  defaultOpen = false,
  variant = "card",
  className = "",
  onToggle,
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  // Card variant - Full featured
  if (variant === "card") {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {Icon && (
                <div className="mt-0.5">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-base">{title}</CardTitle>
                  {badge && (
                    <Badge variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{summary}</div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="gap-2 flex-shrink-0"
              aria-expanded={isOpen}
            >
              <span className="text-xs">{isOpen ? "Menos" : "Mais"}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0 border-t">
                <div className="mt-4">{details}</div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  // Inline variant - Minimal styling
  if (variant === "inline") {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={handleToggle}
        className={className}
      >
        <div className="flex items-start gap-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </CollapsibleTrigger>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              <span className="font-medium text-sm">{title}</span>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mb-2">{summary}</div>

            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 pl-6 border-l-2 border-muted"
              >
                {details}
              </motion.div>
            </CollapsibleContent>
          </div>
        </div>
      </Collapsible>
    );
  }

  // Compact variant - Minimal space
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleToggle}
      className={cn("border rounded-lg p-3", className)}
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between gap-2 text-left">
          <div className="flex items-center gap-2 flex-1">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <span className="font-medium text-sm">{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 pt-3 border-t"
        >
          {details}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * FAQ-style disclosure (for multiple items)
 */
interface FAQItem {
  id: string;
  question: string;
  answer: ReactNode;
  icon?: LucideIcon;
}

interface FAQDisclosureProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function FAQDisclosure({
  items,
  allowMultiple = false,
  className = "",
}: FAQDisclosureProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const Icon = item.icon || Info;

        return (
          <Card
            key={item.id}
            className="overflow-hidden transition-all hover:border-primary/50"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full text-left p-4 flex items-start gap-3"
              aria-expanded={isOpen}
            >
              <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="flex-1 font-medium">{item.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 pl-12 text-sm text-muted-foreground">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Step-by-step disclosure (for wizards/tutorials)
 */
interface StepDisclosureProps {
  steps: {
    id: string;
    title: string;
    content: ReactNode;
    completed?: boolean;
  }[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export function StepDisclosure({
  steps,
  currentStep = 0,
  onStepChange,
  className = "",
}: StepDisclosureProps) {
  const [activeStep, setActiveStep] = useState(currentStep);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    onStepChange?.(index);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = step.completed || index < activeStep;

        return (
          <Card
            key={step.id}
            className={cn(
              "overflow-hidden transition-all",
              isActive && "border-primary",
              isCompleted && "bg-muted/30"
            )}
          >
            <button
              onClick={() => handleStepClick(index)}
              className="w-full text-left p-4 flex items-center gap-3"
              aria-expanded={isActive}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 flex-shrink-0",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-success bg-success text-success-foreground",
                  !isActive && !isCompleted && "border-muted-foreground/30"
                )}
              >
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              <span className="flex-1 font-medium">{step.title}</span>
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 pl-16 border-t">
                    <div className="mt-4">{step.content}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
