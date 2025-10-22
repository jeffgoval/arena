'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCPF } from '@/lib/utils/cpf';

interface InputCPFProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const InputCPF = forwardRef<HTMLInputElement, InputCPFProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCPF(e.target.value);
      onChange(formatted);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="000.000.000-00"
        maxLength={14}
      />
    );
  }
);

InputCPF.displayName = 'InputCPF';
