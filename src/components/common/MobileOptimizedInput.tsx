/**
 * Mobile Optimized Input Components
 * Inputs with better UX for mobile devices
 */

import { forwardRef, InputHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

// Input types optimized for mobile keyboards
type MobileInputType = 
  | "text"
  | "email"
  | "tel"
  | "number"
  | "url"
  | "search"
  | "password";

interface MobileOptimizedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  type?: MobileInputType;
}

/**
 * Base Mobile Optimized Input
 * - 16px font size to prevent iOS zoom
 * - Proper input types for mobile keyboards
 * - Autocomplete hints
 * - Touch-friendly sizing
 */
export const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ label, error, hint, className, type = "text", id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-base">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "text-base min-h-[48px]", // Prevent iOS zoom and ensure touch-friendly
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MobileOptimizedInput.displayName = "MobileOptimizedInput";

/**
 * Phone Number Input
 * Optimized for phone number entry
 */
export const PhoneInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(00) 00000-0000"
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

/**
 * Email Input
 * Optimized for email entry
 */
export const EmailInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        placeholder="seu@email.com"
        {...props}
      />
    );
  }
);

EmailInput.displayName = "EmailInput";

/**
 * CPF Input
 * Optimized for CPF entry
 */
export const CPFInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="000.000.000-00"
        maxLength={14}
        {...props}
      />
    );
  }
);

CPFInput.displayName = "CPFInput";

/**
 * Currency Input
 * Optimized for money values
 */
export const CurrencyInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="text"
        inputMode="decimal"
        pattern="[0-9.,]*"
        placeholder="R$ 0,00"
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

/**
 * Search Input
 * Optimized for search functionality
 */
export const SearchInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="Buscar..."
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

/**
 * Number Input
 * Optimized for numeric entry
 */
export const NumberInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

/**
 * Password Input with Show/Hide
 */
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <MobileOptimizedInput
          ref={ref}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          className={cn("pr-12", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent touch-target"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

/**
 * Date Input
 * Native date picker optimized for mobile
 */
export const DateInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="date"
        className="touch-target-comfortable"
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

/**
 * Time Input
 * Native time picker optimized for mobile
 */
export const TimeInput = forwardRef<HTMLInputElement, Omit<MobileOptimizedInputProps, 'type'>>(
  (props, ref) => {
    return (
      <MobileOptimizedInput
        ref={ref}
        type="time"
        className="touch-target-comfortable"
        {...props}
      />
    );
  }
);

TimeInput.displayName = "TimeInput";
