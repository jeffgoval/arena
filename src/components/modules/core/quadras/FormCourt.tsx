'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { courtSchema, type CourtFormData } from '@/lib/validations/court.schema';
import { COURT_TYPE_LABELS } from '@/types/courts.types';
import type { Court } from '@/types/courts.types';

interface FormCourtProps {
  court?: Court;
  onSubmit: (data: CourtFormData) => Promise<void>;
  onCancel: () => void;
}

export function FormCourt({ court, onSubmit, onCancel }: FormCourtProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CourtFormData>({
    resolver: zodResolver(courtSchema),
    defaultValues: court
      ? {
          nome: court.nome,
          tipo: court.tipo,
          descricao: court.descricao || '',
          capacidade_maxima: court.capacidade_maxima,
          ativa: court.ativa,
        }
      : {
          capacidade_maxima: 14,
          ativa: true,
        },
  });

  const tipo = watch('tipo');
  const ativa = watch('ativa');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome */}
      <div>
        <Label htmlFor="nome">Nome da Quadra *</Label>
        <Input
          id="nome"
          {...register('nome')}
          placeholder="Quadra Society Principal"
        />
        {errors.nome && (
          <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
        )}
      </div>

      {/* Tipo */}
      <div>
        <Label htmlFor="tipo">Tipo de Quadra *</Label>
        <Select
          value={tipo}
          onValueChange={(value) => setValue('tipo', value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COURT_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipo && (
          <p className="text-sm text-red-600 mt-1">{errors.tipo.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          {...register('descricao')}
          placeholder="Grama sintética, vestiários..."
          rows={3}
        />
        {errors.descricao && (
          <p className="text-sm text-red-600 mt-1">{errors.descricao.message}</p>
        )}
      </div>

      {/* Capacidade Máxima */}
      <div>
        <Label htmlFor="capacidade_maxima">Capacidade Máxima *</Label>
        <Input
          id="capacidade_maxima"
          type="number"
          {...register('capacidade_maxima', { valueAsNumber: true })}
          placeholder="14"
          min={4}
          max={30}
        />
        {errors.capacidade_maxima && (
          <p className="text-sm text-red-600 mt-1">{errors.capacidade_maxima.message}</p>
        )}
      </div>

      {/* Ativa */}
      <div className="flex items-center justify-between">
        <Label htmlFor="ativa">Quadra Ativa</Label>
        <Switch
          id="ativa"
          checked={ativa}
          onCheckedChange={(checked) => setValue('ativa', checked)}
        />
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#2D9F5D] hover:bg-[#258c4f]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : court ? (
            'Atualizar'
          ) : (
            'Criar Quadra'
          )}
        </Button>
      </div>
    </form>
  );
}
