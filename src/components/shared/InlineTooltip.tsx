"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type TriggerType = "hover" | "click" | "focus";
type PositionType = "top" | "bottom" | "auto";
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface TooltipAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

interface InlineTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: TriggerType;
  position?: PositionType;
  className?: string;
  contentClassName?: string;
  showArrow?: boolean;
  persistent?: boolean;
  maxWidth?: string | number;
  inline?: boolean;
  disabled?: boolean;
  delay?: number;
  actions?: TooltipAction[];
  onShow?: () => void;
  onHide?: () => void;
  'data-testid'?: string;
}

export function InlineTooltip({
  children,
  content,
  trigger = "hover",
  position = "auto",
  className,
  contentClassName,
  showArrow = true,
  persistent = false,
  maxWidth = "320px",
  inline = true,
  actions
}: InlineTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<"top" | "bottom">("bottom");
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (position === "auto") {
        // Verificar se há espaço suficiente embaixo
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        
        if (spaceBelow >= tooltipRect.height + 10) {
          setActualPosition("bottom");
        } else if (spaceAbove >= tooltipRect.height + 10) {
          setActualPosition("top");
        } else {
          // Se não há espaço suficiente em nenhum lado, usar o lado com mais espaço
          setActualPosition(spaceBelow > spaceAbove ? "bottom" : "top");
        }
      } else {
        setActualPosition(position);
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, position]);

  const handleShow = () => {
    setIsVisible(true);
  };

  const handleHide = () => {
    if (!persistent) {
      setIsVisible(false);
    }
  };

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const triggerProps = {
    [trigger === "hover" ? "onMouseEnter" : ""]: trigger === "hover" ? handleShow : undefined,
    [trigger === "hover" ? "onMouseLeave" : ""]: trigger === "hover" ? handleHide : undefined,
    [trigger === "click" ? "onClick" : ""]: trigger === "click" ? handleToggle : undefined,
    [trigger === "focus" ? "onFocus" : ""]: trigger === "focus" ? handleShow : undefined,
    [trigger === "focus" ? "onBlur" : ""]: trigger === "focus" ? handleHide : undefined,
  };

  const WrapperComponent = inline ? "span" : "div";
  
  return (
    <WrapperComponent className={cn("relative", inline ? "inline-block" : "block", className)}>
      <WrapperComponent
        ref={triggerRef}
        {...triggerProps}
        className={cn(
          trigger === "click" && "cursor-pointer",
          trigger === "focus" && "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
      >
        {children}
      </WrapperComponent>

      {isVisible && (
        <>
          {/* Backdrop para click trigger */}
          {trigger === "click" && (
            <div
              className="fixed inset-0 z-40"
              onClick={handleClose}
            />
          )}

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className={cn(
              "absolute z-50 bg-card border border-border rounded-lg shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              actualPosition === "top" ? "bottom-full mb-2" : "top-full mt-2",
              "left-1/2 transform -translate-x-1/2",
              contentClassName
            )}
            style={{ maxWidth }}
            onMouseEnter={trigger === "hover" ? handleShow : undefined}
            onMouseLeave={trigger === "hover" ? handleHide : undefined}
          >
            {/* Arrow */}
            {showArrow && (
              <div
                className={cn(
                  "absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-card border-border rotate-45",
                  actualPosition === "top" 
                    ? "top-full -mt-1.5 border-r border-b" 
                    : "bottom-full -mb-1.5 border-l border-t"
                )}
              />
            )}

            <div className="p-4">
              {/* Close button for persistent tooltips */}
              {persistent && (
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="w-6 h-6 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Content */}
              <div className="text-sm">
                {content}
              </div>

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "default"}
                      size="sm"
                      onClick={() => {
                        action.onClick();
                        if (!persistent) handleClose();
                      }}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </WrapperComponent>
  );
}

// Componente para tooltips de definição
interface DefinitionTooltipProps {
  term: string;
  definition: React.ReactNode;
  children?: React.ReactNode;
  learnMoreUrl?: string;
  className?: string;
}

export function DefinitionTooltip({
  term,
  definition,
  children,
  learnMoreUrl,
  className
}: DefinitionTooltipProps) {
  const content = (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">{term}</h4>
      <div className="text-sm text-muted-foreground">
        {definition}
      </div>
    </div>
  );

  const actions = learnMoreUrl ? [
    {
      label: "Saiba mais",
      onClick: () => window.open(learnMoreUrl, '_blank'),
      variant: "outline" as const
    }
  ] : undefined;

  return (
    <InlineTooltip
      content={content}
      trigger="hover"
      maxWidth="280px"
      actions={actions}
      className={cn("inline", className)}
    >
      {children || (
        <span className="underline decoration-dotted decoration-muted-foreground cursor-help">
          {term}
        </span>
      )}
    </InlineTooltip>
  );
}

// Componente para tooltips de validação de formulário
interface ValidationTooltipProps {
  errors: string[];
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ValidationTooltip({
  errors,
  isVisible,
  children,
  className
}: ValidationTooltipProps) {
  if (!isVisible || errors.length === 0) {
    return <>{children}</>;
  }

  const content = (
    <div className="space-y-1">
      {errors.map((error, index) => (
        <div key={index} className="flex items-start gap-2 text-sm text-red-600">
          <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );

  return (
    <InlineTooltip
      content={content}
      trigger="focus"
      position="bottom"
      persistent={true}
      contentClassName="border-red-200 bg-red-50"
      className={className}
    >
      {children}
    </InlineTooltip>
  );
}

// Componente para tooltips de progresso
interface ProgressTooltipProps {
  current: number;
  total: number;
  label: string;
  details?: string;
  children: React.ReactNode;
  className?: string;
}

export function ProgressTooltip({
  current,
  total,
  label,
  details,
  children,
  className
}: ProgressTooltipProps) {
  const percentage = Math.round((current / total) * 100);

  const content = (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{current}/{total}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {percentage}% concluído
        </div>
      </div>
      
      {details && (
        <div className="text-xs text-muted-foreground border-t border-border pt-2">
          {details}
        </div>
      )}
    </div>
  );

  return (
    <InlineTooltip
      content={content}
      trigger="hover"
      maxWidth="240px"
      className={className}
    >
      {children}
    </InlineTooltip>
  );
}