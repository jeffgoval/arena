import { z } from 'zod';

/**
 * Schema para criar uma nova reserva
 */
export const createReservaSchema = z.object({
  quadra_id: z.string().uuid('ID da quadra inválido'),
  horario_id: z.string().uuid('ID do horário inválido'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)'),
  tipo: z.enum(['avulsa', 'mensalista', 'recorrente']),
  observacoes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional().or(z.literal('')),
  turma_id: z.string().uuid('ID da turma inválido').optional().or(z.literal('')),
});

/**
 * Schema para configurar rateio
 */
export const rateioParticipantSchema = z.object({
  participante_id: z.string().uuid('ID do participante inválido'),
  nome: z.string(),
  valor: z.number().min(0, 'Valor não pode ser negativo').optional(),
  percentual: z.number().min(0, 'Percentual não pode ser negativo').max(100, 'Percentual não pode ser maior que 100').optional(),
});

export const configRateioSchema = z.object({
  modo: z.enum(['percentual', 'fixo']),
  participantes: z.array(rateioParticipantSchema).min(1, 'Adicione pelo menos um participante'),
}).refine((data) => {
  if (data.modo === 'percentual') {
    const total = data.participantes.reduce((sum, p) => sum + (p.percentual || 0), 0);
    return Math.abs(total - 100) < 0.01; // Aceita pequenos erros de arredondamento
  }
  return true;
}, {
  message: 'A soma dos percentuais deve ser 100%',
});

/**
 * Schema para adicionar participante manual
 */
export const addParticipantSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  whatsapp: z.string().min(10, 'WhatsApp inválido').optional().or(z.literal('')),
});

export type CreateReservaData = z.infer<typeof createReservaSchema>;
export type ConfigRateioData = z.infer<typeof configRateioSchema>;
export type AddParticipantData = z.infer<typeof addParticipantSchema>;
