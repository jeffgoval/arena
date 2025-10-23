"use client";

import { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  fullScreen?: boolean;
  actions?: React.ReactNode;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  showBackButton = false,
  onBack,
  className,
  headerClassName,
  contentClassName,
  fullScreen = true,
  actions
}: MobileModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevenir scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll do body
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay - apenas em desktop */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          "hidden md:block", // Apenas em desktop
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "fixed z-50 transition-all duration-300 ease-out",
        // Mobile: full screen
        fullScreen && "md:hidden inset-0 bg-background",
        // Desktop: modal centralizado
        !fullScreen && "md:block hidden",
        "md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2",
        "md:w-full md:max-w-lg md:max-h-[90vh] md:bg-card md:rounded-lg md:border md:border-border md:shadow-lg",
        // Animações
        isOpen 
          ? "translate-y-0 opacity-100 scale-100" 
          : "translate-y-full md:translate-y-0 opacity-0 md:scale-95",
        className
      )}
      onTransitionEnd={() => {
        if (!isOpen) setIsAnimating(false);
      }}>
        
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-md",
          "md:rounded-t-lg",
          headerClassName
        )}>
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack || onClose}
                className="md:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            {title && (
              <h2 className="heading-4 truncate">{title}</h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          "md:max-h-[calc(90vh-80px)]", // Altura máxima em desktop
          contentClassName
        )}>
          {children}
        </div>
      </div>
    </>
  );
}

// Hook para controlar modais mobile
export function useMobileModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}