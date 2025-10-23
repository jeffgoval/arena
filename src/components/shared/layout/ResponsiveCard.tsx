"use client";

import { cn } from "@/lib/utils";

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

export function ResponsiveCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  clickable = false,
  onClick
}: ResponsiveCardProps) {
  const baseClasses = "bg-card border border-border rounded-lg transition-all duration-200";
  
  const variantClasses = {
    default: "shadow-sm hover:shadow-md",
    compact: "shadow-none border-border/50",
    elevated: "shadow-md hover:shadow-lg",
    outlined: "shadow-none border-2 border-border hover:border-primary/20"
  };

  const paddingClasses = {
    none: "",
    sm: "p-3 md:p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8"
  };

  const clickableClasses = clickable 
    ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] touch-manipulation" 
    : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        clickableClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Grid responsivo para cards
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-3 md:gap-4",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8"
  };

  const gridClasses = cn(
    "grid",
    `grid-cols-${columns.mobile}`,
    `md:grid-cols-${columns.tablet}`,
    `lg:grid-cols-${columns.desktop}`,
    gapClasses[gap],
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Lista responsiva
interface ResponsiveListProps {
  children: React.ReactNode;
  divider?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveList({
  children,
  divider = true,
  spacing = 'md',
  className
}: ResponsiveListProps) {
  const spacingClasses = {
    sm: "space-y-2",
    md: "space-y-3 md:space-y-4",
    lg: "space-y-4 md:space-y-6"
  };

  const dividerClasses = divider 
    ? "[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border [&>*:not(:last-child)]:pb-3 [&>*:not(:last-child)]:md:pb-4"
    : "";

  return (
    <div className={cn(
      spacingClasses[spacing],
      dividerClasses,
      className
    )}>
      {children}
    </div>
  );
}