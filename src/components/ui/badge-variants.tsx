/**
 * Badge Variants Components
 * Semantic badge system with multiple variants
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

// Badge variant types
export type BadgeVariant = 
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";

export type BadgeStyle = 
  | "solid"      // Default solid background
  | "outline"    // Border only
  | "soft";      // Subtle background

interface BadgeVariantProps extends React.ComponentProps<typeof Badge> {
  variant?: BadgeVariant;
  styleType?: BadgeStyle;
  dot?: boolean;  // Show dot indicator
}

export function BadgeVariant({ 
  variant = "default", 
  styleType = "solid",
  dot = false,
  className, 
  children,
  ...props 
}: BadgeVariantProps) {
  const variantClasses = {
    // Solid variants
    'default-solid': "badge-default",
    'success-solid': "badge-success",
    'warning-solid': "badge-warning",
    'error-solid': "badge-error",
    'info-solid': "badge-info",
    
    // Outline variants
    'default-outline': "badge-outline-default",
    'success-outline': "badge-outline-success",
    'warning-outline': "badge-outline-warning",
    'error-outline': "badge-outline-error",
    'info-outline': "badge-outline-info",
    
    // Soft variants
    'default-soft': "badge-soft-default",
    'success-soft': "badge-soft-success",
    'warning-soft': "badge-soft-warning",
    'error-soft': "badge-soft-error",
    'info-soft': "badge-soft-info",
  };

  const key = `${variant}-${styleType}` as keyof typeof variantClasses;
  const badgeClass = variantClasses[key] || variantClasses['default-solid'];

  return (
    <Badge 
      className={cn(
        badgeClass,
        dot && "badge-dot",
        className
      )} 
      {...props}
    >
      {children}
    </Badge>
  );
}

// Pre-configured badge components
export function SuccessBadge({ 
  styleType = "solid",
  ...props 
}: Omit<BadgeVariantProps, "variant">) {
  return <BadgeVariant variant="success" styleType={styleType} {...props} />;
}

export function WarningBadge({ 
  styleType = "solid",
  ...props 
}: Omit<BadgeVariantProps, "variant">) {
  return <BadgeVariant variant="warning" styleType={styleType} {...props} />;
}

export function ErrorBadge({ 
  styleType = "solid",
  ...props 
}: Omit<BadgeVariantProps, "variant">) {
  return <BadgeVariant variant="error" styleType={styleType} {...props} />;
}

export function InfoBadge({ 
  styleType = "solid",
  ...props 
}: Omit<BadgeVariantProps, "variant">) {
  return <BadgeVariant variant="info" styleType={styleType} {...props} />;
}

// Status badges for specific states
interface StatusBadgeProps extends Omit<BadgeVariantProps, "variant"> {
  status: 
    | "available" 
    | "occupied" 
    | "blocked" 
    | "pending" 
    | "paid" 
    | "canceled"
    | "confirmed"
    | "active"
    | "inactive";
}

const statusConfig = {
  available: { variant: "success" as BadgeVariant, label: "Disponível" },
  occupied: { variant: "default" as BadgeVariant, label: "Ocupado" },
  blocked: { variant: "error" as BadgeVariant, label: "Bloqueado" },
  pending: { variant: "warning" as BadgeVariant, label: "Pendente" },
  paid: { variant: "success" as BadgeVariant, label: "Pago" },
  canceled: { variant: "default" as BadgeVariant, label: "Cancelado" },
  confirmed: { variant: "success" as BadgeVariant, label: "Confirmado" },
  active: { variant: "success" as BadgeVariant, label: "Ativo" },
  inactive: { variant: "default" as BadgeVariant, label: "Inativo" },
};

export function StatusBadge({ 
  status, 
  styleType = "soft",
  dot = true,
  children,
  ...props 
}: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <BadgeVariant 
      variant={config.variant} 
      styleType={styleType}
      dot={dot}
      {...props}
    >
      {children || config.label}
    </BadgeVariant>
  );
}

// Count badge (for notifications)
interface CountBadgeProps extends Omit<BadgeVariantProps, "variant"> {
  count: number;
  max?: number;
}

export function CountBadge({ 
  count, 
  max = 99,
  variant = "error",
  ...props 
}: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <BadgeVariant 
      variant={variant}
      className="h-5 w-5 flex items-center justify-center p-0 text-[10px]"
      {...props}
    >
      {displayCount}
    </BadgeVariant>
  );
}

// New badge (for recently added items)
export function NewBadge(props: Omit<BadgeVariantProps, "variant">) {
  return (
    <BadgeVariant 
      variant="info" 
      styleType="solid"
      className="animate-pulse"
      {...props}
    >
      Novo
    </BadgeVariant>
  );
}

// Pro badge (for premium features)
export function ProBadge(props: Omit<BadgeVariantProps, "variant">) {
  return (
    <BadgeVariant 
      variant="default"
      styleType="solid"
      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      {...props}
    >
      PRO
    </BadgeVariant>
  );
}
