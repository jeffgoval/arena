/**
 * Kbd Component
 * Keyboard shortcut display component
 */

import { cn } from '../ui/utils';

interface KbdProps {
  keys: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Kbd({ keys, className, size = 'md' }: KbdProps) {
  const sizeClasses = {
    sm: 'px-1 py-0.5 text-[10px]',
    md: 'px-1.5 py-0.5 text-xs',
    lg: 'px-2 py-1 text-sm',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          className={cn(
            'bg-muted border rounded',
            'text-muted-foreground font-mono',
            'inline-flex items-center justify-center',
            'min-w-[1.5rem]',
            sizeClasses[size]
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
