import { z } from 'zod'
import { validatePhone } from '@/lib/utils'

// Team member schema
export const teamMemberSchema = z.object({
  player_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  player_phone: z.string().refine((val) => validatePhone(val), {
    message: 'Telefone inválido',
  }),
  player_email: z.string().email('Email inválido').optional(),
  is_fixed: z.boolean().default(false), // RN-013: Fixed members auto-included
})

// Create team schema (US-004)
export const createTeamSchema = z.object({
  name: z.string().min(3, 'Nome da turma deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  members: z.array(teamMemberSchema).min(1, 'Adicione pelo menos um membro'),
})

// Update team schema
export const updateTeamSchema = z.object({
  name: z.string().min(3, 'Nome da turma deve ter no mínimo 3 caracteres').optional(),
  description: z.string().optional(),
})

// Add team member schema
export const addTeamMemberSchema = z.object({
  team_id: z.string().uuid('ID da turma inválido'),
  member: teamMemberSchema,
})

// Update team member schema
export const updateTeamMemberSchema = z.object({
  member_id: z.string().uuid('ID do membro inválido'),
  player_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  player_phone: z.string().refine((val) => !val || validatePhone(val), {
    message: 'Telefone inválido',
  }).optional(),
  player_email: z.string().email('Email inválido').optional(),
  is_fixed: z.boolean().optional(),
})

// Remove team member schema
export const removeTeamMemberSchema = z.object({
  team_id: z.string().uuid('ID da turma inválido'),
  member_id: z.string().uuid('ID do membro inválido'),
})

// Delete team schema
export const deleteTeamSchema = z.object({
  team_id: z.string().uuid('ID da turma inválido'),
})

// Types
export type TeamMemberInput = z.infer<typeof teamMemberSchema>
export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>
export type RemoveTeamMemberInput = z.infer<typeof removeTeamMemberSchema>
export type DeleteTeamInput = z.infer<typeof deleteTeamSchema>
