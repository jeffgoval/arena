/**
 * Button Microinteractions
 * Componentes de botões com feedback visual rico
 */

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';
import { Loader2, Check, X, ArrowRight } from 'lucide-react';

/**
 * Interactive Button com estados visuais
 */
interface InteractiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  haptic?: boolean;
  ripple?: boolean;
}

export function InteractiveButton({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  haptic = true,
  ripple = true,
  disabled,
  className,
  onClick,
  ...props
}: InteractiveButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Haptic feedback (vibration)
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Ripple effect
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  const variantClasses = {
    default: 'bg-background text-foreground border hover:bg-muted',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'hover:bg-muted',
    outline: 'border border-input bg-background hover:bg-muted',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-6',
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-md font-medium',
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(({ x, y, id }) => (
          <motion.span
            key={id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: x,
              top: y,
              width: 0,
              height: 0,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{
              width: 200,
              height: 200,
              opacity: 0,
              x: -100,
              y: -100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Success Button - Mostra checkmark ao completar
 */
interface SuccessButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isSuccess?: boolean;
  successText?: string;
  successDuration?: number;
  onSuccessComplete?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function SuccessButton({
  children,
  isSuccess = false,
  successText = 'Concluído!',
  successDuration = 2000,
  onSuccessComplete,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: SuccessButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useState(() => {
    if (isSuccess && !showSuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccessComplete?.();
      }, successDuration);
    }
  });

  return (
    <InteractiveButton
      variant={showSuccess ? 'default' : variant}
      size={size}
      className={cn(
        showSuccess && 'bg-success text-success-foreground hover:bg-success',
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{successText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </InteractiveButton>
  );
}

/**
 * Progress Button - Mostra progresso durante ação
 */
interface ProgressButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  progress?: number;
  isLoading?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressButton({
  children,
  progress = 0,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ProgressButtonProps) {
  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-md font-medium',
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        variant === 'default' && 'bg-background text-foreground border',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-11 px-6',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Progress background */}
      <motion.div
        className="absolute inset-0 bg-primary/20"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
        {progress > 0 && progress < 100 && (
          <span className="text-xs">({Math.round(progress)}%)</span>
        )}
      </span>
    </button>
  );
}

/**
 * Slide Button - Botão com animação de slide
 */
interface SlideButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  slideText?: string;
  slideIcon?: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function SlideButton({
  children,
  slideText,
  slideIcon = <ArrowRight className="w-4 h-4" />,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: SlideButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-md font-medium',
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'default' && 'bg-background text-foreground border hover:bg-muted',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-11 px-6',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <motion.span
        className="flex items-center gap-2"
        animate={{ x: isHovered ? -10 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute"
        initial={{ x: 20, opacity: 0 }}
        animate={{
          x: isHovered ? 0 : 20,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {slideIcon}
      </motion.span>
    </motion.button>
  );
}

/**
 * Hold Button - Requer segurar para confirmar
 */
interface HoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  holdDuration?: number;
  onHoldComplete: () => void;
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function HoldButton({
  children,
  holdDuration = 1000,
  onHoldComplete,
  variant = 'destructive',
  size = 'md',
  className,
  ...props
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const handleMouseDown = () => {
    setIsHolding(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onHoldComplete();
          setIsHolding(false);
          setProgress(0);
          return 100;
        }
        return prev + (100 / (holdDuration / 50));
      });
    }, 50);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-md font-medium',
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground',
        variant === 'default' && 'bg-background text-foreground border',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-11 px-6',
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...props}
    >
      {/* Progress background */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        style={{ width: `${progress}%` }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {isHolding && (
          <span className="text-xs">({Math.round(progress)}%)</span>
        )}
      </span>
    </button>
  );
}

/**
 * Toggle Button com animação
 */
interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ToggleButton({
  value,
  onChange,
  onLabel = 'Ativo',
  offLabel = 'Inativo',
  disabled = false,
  size = 'md',
  className,
}: ToggleButtonProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-6',
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-md font-medium',
        'inline-flex items-center justify-center',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        value
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground',
        sizeClasses[size],
        className
      )}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={value ? 'on' : 'off'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {value ? onLabel : offLabel}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
