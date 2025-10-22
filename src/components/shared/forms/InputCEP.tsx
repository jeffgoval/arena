'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCEP } from '@/lib/utils/cep';

interface InputCEPProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onCEPChange?: (cep: string) => void; // Callback quando CEP estiver completo
}

export const InputCEP = forwardRef<HTMLInputElement, InputCEPProps>(
  ({ value, onChange, onCEPChange, ...props }, ref) => {
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
      <Input
        {...props}
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="00000-000"
        maxLength={9}
      />
    );
  }
);

InputCEP.displayName = 'InputCEP';
