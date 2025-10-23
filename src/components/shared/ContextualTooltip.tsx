"use client";

import React, { useState, useEffect } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  HelpCircle, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Lightbulb,
  Star,
  Zap
} from "lucide-react";

interface ContextualTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  variant?: "default" | "info" | "warning" | "success" | "error" | "tip" | "feature" | "premium";
  showIcon?: boolean;
  disabled?: boolean;
  delayDuration?: number;
  className?: string;
  contentClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
}

const variantStyles = {
  default: "bg-primary text-primary-foreground",
  info: "bg-blue-600 text-white",
  warning: "bg-yellow-600 text-white",
  success: "bg-green-600 text-white", 
  error: "bg-red-600 text-white",
  tip: "bg-purple-600 text-white",
  feature: "bg-indigo-600 text-white",
  premium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
};

const variantIcons = {
  default: HelpCircle,
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  error: XCircle,
  tip: Lightbulb,
  feature: Zap,
  premium: Star
};

const maxWidthStyles = {
  sm: "max-w-xs",
  md: "max-w-sm", 
  lg: "max-w-md",
  xl: "max-w-lg"
};

export function ContextualTooltip({
  children,
  content,
  side = "top",
  align = "center",
  variant = "default",
  showIcon = false,
  disabled = false,
  delayDuration = 300,
  className,
  contentClassName,
  maxWidth = "sm",
  interactive = false
}: ContextualTooltipProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (disabled || (isMobile && !interactive)) {
    return <>{children}</>;
  }

  const Icon = variantIcons[variant];

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            "px-3 py-2 text-sm font-medium shadow-lg border-0",
            variantStyles[variant],
            maxWidthStyles[maxWidth],
            contentClassName
          )}
          sideOffset={8}
        >
          <div className="flex items-start gap-2">
            {showIcon && (
              <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              {typeof content === 'string' ? (
                <p className="leading-relaxed">{content}</p>
              ) : (
                content
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Componente específico para ícones de ajuda
interface HelpTooltipProps {
  content: React.ReactNode;
  variant?: ContextualTooltipProps['variant'];
  side?: ContextualTooltipProps['side'];
  className?: string;
  iconClassName?: string;
  maxWidth?: ContextualTooltipProps['maxWidth'];
}

export function HelpTooltip({
  content,
  variant = "info",
  side = "top",
  className,
  iconClassName,
  maxWidth = "md"
}: HelpTooltipProps) {
  return (
    <ContextualTooltip
      content={content}
      variant={variant}
      side={side}
      showIcon={true}
      maxWidth={maxWidth}
      className={className}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 rounded-full",
          "text-muted-foreground hover:text-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          iconClassName
        )}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </ContextualTooltip>
  );
}

// Componente para tooltips de funcionalidades
interface FeatureTooltipProps {
  title: string;
  description: string;
  isNew?: boolean;
  isPremium?: boolean;
  children: React.ReactNode;
  side?: ContextualTooltipProps['side'];
  className?: string;
}

export function FeatureTooltip({
  title,
  description,
  isNew = false,
  isPremium = false,
  children,
  side = "top",
  className
}: FeatureTooltipProps) {
  const variant = isPremium ? "premium" : isNew ? "feature" : "info";

  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        {isNew && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-white/20 rounded-full">
            Novo
          </span>
        )}
        {isPremium && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-white/20 rounded-full">
            Premium
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed opacity-90">{description}</p>
    </div>
  );

  return (
    <ContextualTooltip
      content={content}
      variant={variant}
      side={side}
      showIcon={true}
      maxWidth="lg"
      className={className}
      interactive={true}
    >
      {children}
    </ContextualTooltip>
  );
}

// Componente para tooltips de status
interface StatusTooltipProps {
  status: "success" | "warning" | "error" | "info";
  title: string;
  description?: string;
  children: React.ReactNode;
  side?: ContextualTooltipProps['side'];
  className?: string;
}

export function StatusTooltip({
  status,
  title,
  description,
  children,
  side = "top",
  className
}: StatusTooltipProps) {
  const content = (
    <div className="space-y-1">
      <h4 className="font-semibold text-sm">{title}</h4>
      {description && (
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
      )}
    </div>
  );

  return (
    <ContextualTooltip
      content={content}
      variant={status}
      side={side}
      showIcon={true}
      maxWidth="md"
      className={className}
    >
      {children}
    </ContextualTooltip>
  );
}

// Hook para controlar tooltips programaticamente
export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>("");

  const show = (newContent: React.ReactNode) => {
    setContent(newContent);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  const toggle = (newContent?: React.ReactNode) => {
    if (newContent) setContent(newContent);
    setIsVisible(!isVisible);
  };

  return {
    isVisible,
    content,
    show,
    hide,
    toggle
  };
}