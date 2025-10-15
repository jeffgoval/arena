/**
 * Card Variants Components
 * Extended card components with semantic variants
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

// Card variant types
export type CardVariant = 
  | "elevated"     // Default with shadow
  | "interactive"  // Hover lift effect
  | "ghost"        // Minimal style
  | "bordered"     // Emphasis on border
  | "flat"         // No elevation
  | "gradient"     // Special gradient
  | "success"      // Success state
  | "warning"      // Warning state
  | "error";       // Error state

interface CardVariantProps extends React.ComponentProps<typeof Card> {
  variant?: CardVariant;
}

export function CardVariant({ 
  variant = "elevated", 
  className, 
  children,
  ...props 
}: CardVariantProps) {
  const variantClasses = {
    elevated: "card-elevated",
    interactive: "card-interactive",
    ghost: "card-ghost",
    bordered: "card-bordered",
    flat: "card-flat",
    gradient: "card-gradient",
    success: "card-success",
    warning: "card-warning",
    error: "card-error",
  };

  return (
    <Card 
      className={cn(variantClasses[variant], className)} 
      {...props}
    >
      {children}
    </Card>
  );
}

// Pre-configured card components
export function InteractiveCard({ 
  className, 
  onClick,
  children,
  ...props 
}: React.ComponentProps<typeof Card> & { onClick?: () => void }) {
  return (
    <Card 
      className={cn("card-interactive", className)} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </Card>
  );
}

export function GhostCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("card-ghost", className)} {...props}>
      {children}
    </Card>
  );
}

export function BorderedCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("card-bordered", className)} {...props}>
      {children}
    </Card>
  );
}

export function GradientCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("card-gradient", className)} {...props}>
      {children}
    </Card>
  );
}

// Status cards
export function SuccessCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("card-success", className)} {...props}>
      {children}
    </Card>
  );
}

export function WarningCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("card-warning", className)} {...props}>
      {children}
    </Card>
  );
}

export function ErrorCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("card-error", className)} {...props}>
      {children}
    </Card>
  );
}

// Stat card with icon
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: "elevated" | "interactive";
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "elevated",
  onClick,
}: StatCardProps) {
  const CardComponent = variant === "interactive" ? InteractiveCard : CardVariant;

  return (
    <CardComponent 
      variant={variant}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span 
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </CardComponent>
  );
}
