import { z } from 'zod';
import { validateCPF } from '@/lib/utils/cpf';

// ============================================================
// SCHEMA: Login
// ============================================================

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email ou CPF obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// SCHEMA: Cadastro (Signup)
// Conforme PRD - US-002
// ============================================================

export const signupSchema = z.object({
  // Dados Pessoais
  nome_completo: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  cpf: z
    .string()
    .min(11, 'CPF inválido')
    .refine((val) => validateCPF(val.replace(/\D/g, '')), {
      message: 'CPF inválido',
    }),

  rg: z
    .string()
    .min(5, 'RG deve ter no mínimo 5 caracteres')
    .max(20, 'RG deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),

  data_nascimento: z
    .string()
    .refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 120;
    }, {
      message: 'Você deve ter no mínimo 13 anos',
    }),

  // Contato
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase(),

  whatsapp: z
    .string()
    .min(14, 'WhatsApp inválido')
    .max(15, 'WhatsApp inválido'),

  // Endereço
  cep: z
    .string()
    .min(8, 'CEP inválido')
    .max(9, 'CEP inválido'),

  logradouro: z
    .string()
    .min(3, 'Logradouro deve ter no mínimo 3 caracteres')
    .max(100, 'Logradouro deve ter no máximo 100 caracteres'),

  numero: z
    .string()
    .min(1, 'Número obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),

  complemento: z
    .string()
    .max(50, 'Complemento deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),

  bairro: z
    .string()
    .min(3, 'Bairro deve ter no mínimo 3 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres'),

  cidade: z
    .string()
    .min(3, 'Cidade deve ter no mínimo 3 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),

  estado: z
    .string()
    .length(2, 'Estado deve ter 2 caracteres (ex: MG)')
    .toUpperCase(),

  // Senha
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ============================================================
// SCHEMA: Recuperação de Senha
// ============================================================

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================================
// SCHEMA: Redefinir Senha
// ============================================================

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================
// SCHEMA: Atualizar Perfil
// ============================================================

export const updateProfileSchema = signupSchema.partial().omit({
  password: true,
  confirmPassword: true,
  email: true, // Email não pode ser alterado diretamente
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
