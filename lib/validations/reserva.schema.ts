import { z } from 'zod'
import {
  RESERVATION_TYPES,
  RESERVATION_STATUS,
  SPLIT_MODES,
  BUSINESS_RULES,
} from '@/lib/constants'

// Create reservation schema
export const createReservationSchema = z.object({
  court_id: z.string().uuid('ID da quadra inválido'),
  date: z.string().or(z.date()),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
  type: z.enum([
    RESERVATION_TYPES.SINGLE,
    RESERVATION_TYPES.MONTHLY,
    RESERVATION_TYPES.RECURRING,
  ]),

  // RN-007: Observations max 500 characters
  observations: z.string()
    .max(BUSINESS_RULES.OBSERVATION_MAX_LENGTH,
      `Observações devem ter no máximo ${BUSINESS_RULES.OBSERVATION_MAX_LENGTH} caracteres`)
    .optional(),

  // Optional team link
  team_id: z.string().uuid().optional(),

  // Optional discount coupon
  coupon_code: z.string().optional(),
})

// Update reservation schema
export const updateReservationSchema = z.object({
  observations: z.string()
    .max(BUSINESS_RULES.OBSERVATION_MAX_LENGTH)
    .optional(),
  team_id: z.string().uuid().nullable().optional(),
  status: z.enum([
    RESERVATION_STATUS.PENDING,
    RESERVATION_STATUS.CONFIRMED,
    RESERVATION_STATUS.CANCELLED,
  ]).optional(),
})

// Link team to reservation schema (US-005)
export const linkTeamSchema = z.object({
  reservation_id: z.string().uuid('ID da reserva inválido'),
  team_id: z.string().uuid('ID da turma inválido'),
  // Array of team member IDs to include (for variable members)
  included_member_ids: z.array(z.string().uuid()).optional(),
})

// Configure cost splitting schema (US-007)
export const configureSplitSchema = z.object({
  reservation_id: z.string().uuid('ID da reserva inválido'),
  split_mode: z.enum([
    SPLIT_MODES.PERCENTAGE,
    SPLIT_MODES.FIXED_VALUE,
  ]),
  participants: z.array(
    z.object({
      participant_id: z.string().uuid(),
      split_value: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
    })
  ),
}).refine((data) => {
  // RN-017: Percentage mode must sum to exactly 100%
  if (data.split_mode === SPLIT_MODES.PERCENTAGE) {
    const total = data.participants.reduce((sum, p) => sum + p.split_value, 0)
    return Math.abs(total - 100) < 0.01 // Allow small floating point errors
  }
  return true
}, {
  message: 'No modo percentual, a soma deve ser exatamente 100%',
  path: ['participants'],
}).refine((data) => {
  // RN-021: At least one participant must have value > 0
  return data.participants.some(p => p.split_value > 0)
}, {
  message: 'Pelo menos um participante deve ter valor maior que zero',
  path: ['participants'],
})

// Cancel reservation schema
export const cancelReservationSchema = z.object({
  reservation_id: z.string().uuid('ID da reserva inválido'),
  reason: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
})

// Types
export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
export type LinkTeamInput = z.infer<typeof linkTeamSchema>
export type ConfigureSplitInput = z.infer<typeof configureSplitSchema>
export type CancelReservationInput = z.infer<typeof cancelReservationSchema>
