/**
 * Progress Indicators
 * Componentes avançados de indicação de progresso
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../ui/utils';
import { CheckCircle2, XCircle, Loader2, Upload, Download } from 'lucide-react';

/**
 * Linear Progress with percentage
 */
interface LinearProgressProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  animated?: boolean;
}

export function LinearProgress({
  value,
  max = 100,
  showPercentage = true,
  showLabel = false,
  label,
  size = 'md',
  variant = 'default',
  className,
  animated = true,
}: LinearProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {showLabel && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
}

/**
 * Circular Progress
 */
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  variant = 'default',
  className,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    error: 'stroke-destructive',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={variantColors[variant]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-semibold text-lg">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

/**
 * Step Progress
 */
interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function StepProgress({
  steps,
  currentStep,
  completedSteps = [],
  orientation = 'horizontal',
  className,
}: StepProgressProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'items-center space-x-4' : 'flex-col space-y-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = currentStep === stepNumber;
        const isPast = currentStep > stepNumber;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              !isHorizontal && 'w-full'
            )}
          >
            {/* Step indicator */}
            <div className="flex items-center">
              <motion.div
                className={cn(
                  'flex items-center justify-center rounded-full',
                  'w-10 h-10 flex-shrink-0',
                  isCompleted || isPast
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary/10 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground'
                )}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted || isPast ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}
              </motion.div>

              {/* Step label */}
              <div className="ml-3">
                <div
                  className={cn(
                    'font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  isHorizontal
                    ? 'flex-1 h-0.5 mx-4'
                    : 'w-0.5 h-8 ml-5 my-2',
                  isPast ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Upload Progress
 */
interface UploadProgressProps {
  fileName: string;
  fileSize?: string;
  progress: number;
  status?: 'uploading' | 'success' | 'error';
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function UploadProgress({
  fileName,
  fileSize,
  progress,
  status = 'uploading',
  onCancel,
  onRetry,
  className,
}: UploadProgressProps) {
  return (
    <motion.div
      className={cn(
        'bg-card border rounded-lg p-4 space-y-3',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0',
              status === 'success'
                ? 'bg-success/10 text-success'
                : status === 'error'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary'
            )}
          >
            {status === 'uploading' && <Upload className="w-5 h-5" />}
            {status === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {status === 'error' && <XCircle className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{fileName}</p>
            {fileSize && (
              <p className="text-sm text-muted-foreground">{fileSize}</p>
            )}
          </div>
        </div>

        {status === 'uploading' && onCancel && (
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Cancelar
          </button>
        )}
        
        {status === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="text-primary hover:text-primary/80 text-sm"
          >
            Tentar novamente
          </button>
        )}
      </div>

      {status !== 'success' && (
        <LinearProgress
          value={progress}
          size="sm"
          variant={status === 'error' ? 'error' : 'default'}
          animated
        />
      )}
    </motion.div>
  );
}

/**
 * Skeleton Pulse
 */
interface SkeletonPulseProps {
  className?: string;
  count?: number;
  shape?: 'rectangle' | 'circle' | 'text';
}

export function SkeletonPulse({ className, count = 1, shape = 'rectangle' }: SkeletonPulseProps) {
  const shapeClasses = {
    rectangle: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-muted',
            shapeClasses[shape],
            className
          )}
        />
      ))}
    </>
  );
}

/**
 * Indeterminate Progress
 */
interface IndeterminateProgressProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function IndeterminateProgress({
  label,
  size = 'md',
  variant = 'default',
  className,
}: IndeterminateProgressProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{label}</span>
        </div>
      )}
      
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          style={{ width: '30%' }}
          animate={{
            x: ['0%', '350%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}

/**
 * Multi-step Progress with time estimation
 */
interface MultiStepProgressProps {
  steps: Array<{
    label: string;
    completed: boolean;
    inProgress?: boolean;
    estimatedTime?: string;
  }>;
  className?: string;
}

export function MultiStepProgress({ steps, className }: MultiStepProgressProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const percentage = (completedCount / totalSteps) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      <LinearProgress value={percentage} showPercentage size="md" />
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              step.completed && 'bg-success/10',
              step.inProgress && 'bg-primary/10',
              !step.completed && !step.inProgress && 'bg-muted/50'
            )}
          >
            <div className="flex items-center space-x-3">
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : step.inProgress ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
              )}
              <span
                className={cn(
                  step.completed || step.inProgress ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            
            {step.estimatedTime && !step.completed && (
              <span className="text-xs text-muted-foreground">
                {step.estimatedTime}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
