"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Container para formulários responsivos
interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function ResponsiveForm({ children, className, onSubmit }: ResponsiveFormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className={cn("space-y-4 md:space-y-6", className)}
    >
      {children}
    </form>
  );
}

// Campo de formulário responsivo
interface ResponsiveFieldProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export function ResponsiveField({ 
  children, 
  className, 
  layout = 'vertical' 
}: ResponsiveFieldProps) {
  const layoutClasses = {
    vertical: "space-y-2",
    horizontal: "flex flex-col md:flex-row md:items-center md:gap-4 space-y-2 md:space-y-0"
  };

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {children}
    </div>
  );
}

// Input responsivo
interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function ResponsiveInput({ 
  label, 
  error, 
  required, 
  className, 
  ...props 
}: ResponsiveInputProps) {
  return (
    <ResponsiveField>
      {label && (
        <Label htmlFor={props.id} className="mobile-body font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        {...props}
        className={cn("mobile-input", error && "border-destructive", className)}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </ResponsiveField>
  );
}

// Textarea responsivo
interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function ResponsiveTextarea({ 
  label, 
  error, 
  required, 
  className, 
  ...props 
}: ResponsiveTextareaProps) {
  return (
    <ResponsiveField>
      {label && (
        <Label htmlFor={props.id} className="mobile-body font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        {...props}
        className={cn("mobile-input resize-none", error && "border-destructive", className)}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </ResponsiveField>
  );
}

// Select responsivo
interface ResponsiveSelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveSelect({ 
  label, 
  error, 
  required, 
  placeholder,
  value,
  onValueChange,
  children,
  className
}: ResponsiveSelectProps) {
  return (
    <ResponsiveField>
      {label && (
        <Label className="mobile-body font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("mobile-select", error && "border-destructive", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </ResponsiveField>
  );
}

// Grupo de botões responsivo
interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  layout?: 'horizontal' | 'vertical' | 'responsive';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export function ResponsiveButtonGroup({ 
  children, 
  layout = 'responsive',
  align = 'end',
  className 
}: ResponsiveButtonGroupProps) {
  const layoutClasses = {
    horizontal: "flex gap-3",
    vertical: "flex flex-col gap-3",
    responsive: "flex flex-col md:flex-row gap-3"
  };

  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end md:justify-end",
    stretch: "[&>*]:flex-1 md:[&>*]:flex-none"
  };

  return (
    <div className={cn(
      layoutClasses[layout],
      alignClasses[align],
      "pt-4 md:pt-6",
      className
    )}>
      {children}
    </div>
  );
}

// Botão responsivo
interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

export function ResponsiveButton({ 
  children,
  variant = 'default',
  size = 'default',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props 
}: ResponsiveButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        "mobile-button touch-manipulation",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}