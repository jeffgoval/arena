import { z } from 'zod'
import { INVITATION_STATUS, PAYMENT_METHODS } from '@/lib/constants'

// Create invitation schema (US-008)
export const createInvitationSchema = z.object({
  reservation_id: z.string().uuid('ID da reserva inválido'),
  name: z.string().min(3, 'Nome do convite deve ter no mínimo 3 caracteres'),
  total_slots: z.number().int().min(1, 'Deve ter pelo menos 1 vaga'),
  price_per_slot: z.number().min(0, 'Valor deve ser maior ou igual a zero'), // RN-020: Can be R$ 0.00
  description: z.string().optional(),
})

// Update invitation schema
export const updateInvitationSchema = z.object({
  invitation_id: z.string().uuid('ID do convite inválido'),
  name: z.string().min(3, 'Nome do convite deve ter no mínimo 3 caracteres').optional(),
  description: z.string().optional(),
  status: z.enum([
    INVITATION_STATUS.ACTIVE,
    INVITATION_STATUS.CLOSED,
    INVITATION_STATUS.EXPIRED,
  ]).optional(),
})

// Close invitation schema (RN-028: Can be disabled manually)
export const closeInvitationSchema = z.object({
  invitation_id: z.string().uuid('ID do convite inválido'),
})

// Accept invitation schema (US-009)
export const acceptInvitationSchema = z.object({
  invitation_id: z.string().uuid('ID do convite inválido'),
  // If guest is not logged in, will need to register first
})

// Purchase credits schema (for guests - RN-041)
export const purchaseCreditsSchema = z.object({
  amount: z.number().min(1, 'Valor mínimo é R$ 1,00'),
  payment_method: z.enum([
    PAYMENT_METHODS.PIX,
    PAYMENT_METHODS.CREDIT_CARD,
  ]),
})

// Types
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>
export type CloseInvitationInput = z.infer<typeof closeInvitationSchema>
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>
export type PurchaseCreditsInput = z.infer<typeof purchaseCreditsSchema>
