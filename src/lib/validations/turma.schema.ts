import { z } from 'zod';

/**
 * Schema de validação para membros da turma
 */
export const teamMemberSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  whatsapp: z.string().min(10, 'WhatsApp inválido').optional().or(z.literal('')),
  status: z.enum(['fixo', 'variavel']),
});

/**
 * Schema de validação para criar/editar turma
 */
export const teamFormSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  descricao: z.string()
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  membros: z.array(teamMemberSchema)
    .min(1, 'Adicione pelo menos um membro à turma')
    .max(20, 'Máximo de 20 membros por turma'),
});

export type TeamFormData = z.infer<typeof teamFormSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
