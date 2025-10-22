'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
          status: court.status,
        }
      : {
          capacidade_maxima: 14 as number,
          status: 'ativa' as const,
        },
  } as any);

  const tipo = watch('tipo');
  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nome */}
      <div>
        <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
          Nome da Quadra *
        </Label>
        <Input
          id="nome"
          {...register('nome')}
          placeholder="Quadra Society Principal"
          className="mt-1.5 rounded-lg"
        />
        {errors.nome && (
          <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
        )}
      </div>

      {/* Tipo */}
      <div>
        <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">
          Tipo de Quadra *
        </Label>
        <Select
          value={tipo}
          onValueChange={(value) => setValue('tipo', value as any)}
        >
          <SelectTrigger className="mt-1.5 rounded-lg bg-white">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent className="bg-white">
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
        <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
          Descrição
        </Label>
        <Textarea
          id="descricao"
          {...register('descricao')}
          placeholder="Grama sintética, vestiários, iluminação..."
          rows={3}
          className="mt-1.5 rounded-lg"
        />
        {errors.descricao && (
          <p className="text-sm text-red-600 mt-1">{errors.descricao.message}</p>
        )}
      </div>

      {/* Capacidade Máxima */}
      <div>
        <Label htmlFor="capacidade_maxima" className="text-sm font-medium text-gray-700">
          Capacidade Máxima *
        </Label>
        <Input
          id="capacidade_maxima"
          type="number"
          {...register('capacidade_maxima', { valueAsNumber: true })}
          placeholder="14"
          min={4}
          max={30}
          className="mt-1.5 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Número máximo de pessoas permitidas na quadra
        </p>
        {errors.capacidade_maxima && (
          <p className="text-sm text-red-600 mt-1">{errors.capacidade_maxima.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
          Status da Quadra *
        </Label>
        <div className="mt-1.5 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as 'ativa' | 'inativa' | 'manutencao')}
          >
            <SelectTrigger className="rounded-lg bg-white border-gray-300">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ativa">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Ativa</span>
                </div>
              </SelectItem>
              <SelectItem value="inativa">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span>Inativa</span>
                </div>
              </SelectItem>
              <SelectItem value="manutencao">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Manutenção</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'ativa' ? 'bg-green-500' :
              status === 'manutencao' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`}></div>
            <p className="text-xs text-gray-600">
              {status === 'ativa' ? 'Quadra disponível para uso' :
               status === 'manutencao' ? 'Quadra em manutenção' :
               'Quadra não disponível'}
            </p>
          </div>
        </div>
        {errors.status && (
          <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 rounded-lg h-11"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary hover:bg-primary/90 rounded-lg h-11"
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
