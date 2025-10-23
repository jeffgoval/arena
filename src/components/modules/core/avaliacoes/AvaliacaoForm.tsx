'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createAvaliacaoSchema, type CreateAvaliacaoData } from '@/lib/validations/avaliacao.schema';
import { cn } from '@/lib/utils';
import type { AvaliacaoRating } from '@/types/avaliacoes.types';

interface AvaliacaoFormProps {
    reservaId: string;
    quadraNome?: string;
    dataReserva?: string;
    onSubmit: (data: CreateAvaliacaoData) => Promise<void>;
    loading?: boolean;
}

export function AvaliacaoForm({
    reservaId,
    quadraNome,
    dataReserva,
    onSubmit,
    loading = false
}: AvaliacaoFormProps) {
    const [selectedRating, setSelectedRating] = useState<AvaliacaoRating | null>(null);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const form = useForm<CreateAvaliacaoData>({
        resolver: zodResolver(createAvaliacaoSchema),
        defaultValues: {
            reserva_id: reservaId,
            rating: 0,
            comentario: '',
        },
    });

    const handleRatingClick = (rating: AvaliacaoRating) => {
        setSelectedRating(rating);
        form.setValue('rating', rating);
        form.clearErrors('rating');
    };

    const handleSubmit = async (data: CreateAvaliacaoData) => {
        await onSubmit(data);
    };

    const getRatingLabel = (rating: number): string => {
        const labels: Record<number, string> = {
            1: 'Péssimo',
            2: 'Ruim',
            3: 'Regular',
            4: 'Bom',
            5: 'Excelente',
        };
        return labels[rating] || '';
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações da Reserva */}
            {(quadraNome || dataReserva) && (
                <div className="text-center space-y-1">
                    {quadraNome && (
                        <h3 className="font-semibold text-lg">{quadraNome}</h3>
                    )}
                    {dataReserva && (
                        <p className="text-sm text-muted-foreground">
                            {new Date(dataReserva).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            )}

            {/* Seleção de Rating */}
            <div className="space-y-3">
                <Label className="text-center block">Como foi sua experiência?</Label>

                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingClick(rating as AvaliacaoRating)}
                            onMouseEnter={() => setHoveredRating(rating)}
                            onMouseLeave={() => setHoveredRating(null)}
                            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                        >
                            <Star
                                className={cn(
                                    'w-10 h-10 transition-colors',
                                    (hoveredRating !== null ? rating <= hoveredRating : rating <= (selectedRating || 0))
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                )}
                            />
                        </button>
                    ))}
                </div>

                {/* Label do Rating */}
                {(hoveredRating || selectedRating) && (
                    <p className="text-center text-sm font-medium text-primary">
                        {getRatingLabel(hoveredRating || selectedRating || 0)}
                    </p>
                )}

                {form.formState.errors.rating && (
                    <p className="text-sm text-destructive text-center">
                        {form.formState.errors.rating.message}
                    </p>
                )}
            </div>

            {/* Comentário */}
            <div className="space-y-2">
                <Label htmlFor="comentario">
                    Comentário (opcional)
                </Label>
                <Textarea
                    id="comentario"
                    {...form.register('comentario')}
                    placeholder="Conte-nos mais sobre sua experiência..."
                    rows={4}
                    maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                    {form.watch('comentario')?.length || 0}/500
                </p>
                {form.formState.errors.comentario && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.comentario.message}
                    </p>
                )}
            </div>

            {/* Botão de Envio */}
            <Button
                type="submit"
                disabled={loading || !selectedRating}
                className="w-full"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Avaliação
                    </>
                )}
            </Button>
        </form>
    );
}
