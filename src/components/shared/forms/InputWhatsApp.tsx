'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatPhone } from '@/lib/utils/phone';

interface InputWhatsAppProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const InputWhatsApp = forwardRef<HTMLInputElement, InputWhatsAppProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value);
      onChange(formatted);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        maxLength={15}
      />
    );
  }
);

InputWhatsApp.displayName = 'InputWhatsApp';
