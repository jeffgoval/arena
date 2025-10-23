'use client';

import { Button } from '@/components/ui/button';
import type { ConviteStatus } from '@/types/convites.types';
import { CONVITE_STATUS_LABELS } from '@/types/convites.types';

interface ConvitesFiltrosProps {
  statusAtivo: ConviteStatus | 'todos';
  onStatusChange: (status: ConviteStatus | 'todos') => void;
}

export function ConvitesFiltros({ statusAtivo, onStatusChange }: ConvitesFiltrosProps) {
  const filtros: Array<{ value: ConviteStatus | 'todos'; label: string }> = [
    { value: 'todos', label: 'Todos' },
    { value: 'ativo', label: CONVITE_STATUS_LABELS.ativo },
    { value: 'completo', label: CONVITE_STATUS_LABELS.completo },
    { value: 'expirado', label: CONVITE_STATUS_LABELS.expirado },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filtros.map((filtro) => (
        <Button
          key={filtro.value}
          variant={statusAtivo === filtro.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(filtro.value)}
        >
          {filtro.label}
        </Button>
      ))}
    </div>
  );
}
