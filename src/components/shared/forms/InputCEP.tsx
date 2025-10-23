'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCEP } from '@/lib/utils/cep';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputCEPProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onCEPChange?: (cep: string) => void;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
}

export const InputCEP = forwardRef<HTMLInputElement, InputCEPProps>(
  ({ value, onChange, onCEPChange, loading, error, success, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCEP(e.target.value);
      onChange(formatted);

      // Se CEP estiver completo (9 caracteres com hífen), chamar callback
      if (formatted.length === 9 && onCEPChange) {
        const numbers = formatted.replace(/\D/g, '');
        onCEPChange(numbers);
      }
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="00000-000"
          maxLength={9}
          className={cn(
            className,
            error && 'border-destructive focus-visible:ring-destructive',
            success && 'border-green-500 focus-visible:ring-green-500'
          )}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
        )}
        {success && !loading && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
        {error && !loading && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
        )}
      </div>
    );
  }
);

InputCEP.displayName = 'InputCEP';
