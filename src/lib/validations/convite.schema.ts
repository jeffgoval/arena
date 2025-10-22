import { z } from 'zod';

/**
 * Schema para criar um novo convite
 */
export const createConviteSchema = z.object({
  reserva_id: z.string().uuid('ID da reserva inválido'),
  vagas_disponiveis: z.number().int().min(1, 'Deve ter pelo menos 1 vaga').max(50, 'Máximo de 50 vagas'),
  mensagem: z.string().max(500, 'Mensagem deve ter no máximo 500 caracteres').optional().or(z.literal('')),
  valor_por_pessoa: z.number().min(0, 'Valor não pode ser negativo').optional(),
  dias_validade: z.number().int().min(1, 'Mínimo de 1 dia').max(30, 'Máximo de 30 dias').optional(),
});

/**
 * Schema para aceitar um convite
 */
export const aceitarConviteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  whatsapp: z.string().min(10, 'WhatsApp inválido').optional().or(z.literal('')),
});

/**
 * Schema para cadastro simplificado de convidado
 */
export const cadastroConvidadoSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmar_senha: z.string(),
}).refine((data) => data.senha === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

export type CreateConviteData = z.infer<typeof createConviteSchema>;
export type AceitarConviteData = z.infer<typeof aceitarConviteSchema>;
export type CadastroConvidadoData = z.infer<typeof cadastroConvidadoSchema>;
