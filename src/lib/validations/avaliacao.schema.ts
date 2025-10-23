import { z } from 'zod';

/**
 * Schema para criar uma avaliação
 */
export const createAvaliacaoSchema = z.object({
  reserva_id: z.string().uuid('ID da reserva inválido'),
  rating: z.number().int().min(1, 'Avaliação mínima é 1').max(5, 'Avaliação máxima é 5'),
  comentario: z.string()
    .max(500, 'Comentário deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type CreateAvaliacaoData = z.infer<typeof createAvaliacaoSchema>;
