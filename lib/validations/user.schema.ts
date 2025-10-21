import { z } from 'zod'
import { validateCPF, validateRG, validateCEP, validatePhone } from '@/lib/utils'

// User registration schema (complete)
export const userRegisterSchema = z.object({
  // Basic info
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  password_confirmation: z.string(),

  // Documents (RN-049: CPF and RG must be unique)
  cpf: z.string().refine((val) => validateCPF(val), {
    message: 'CPF inválido',
  }),
  rg: z.string().refine((val) => validateRG(val), {
    message: 'RG inválido',
  }),

  // Contact
  phone: z.string().refine((val) => validatePhone(val), {
    message: 'Telefone inválido',
  }),
  birth_date: z.string().or(z.date()),

  // Address (RN-050: CEP with autocomplete via ViaCEP)
  cep: z.string().refine((val) => validateCEP(val), {
    message: 'CEP inválido',
  }),
  address: z.string().min(3, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Senhas não conferem',
  path: ['password_confirmation'],
})

// Simplified guest registration (RN-052: Guests can create simplified profile)
export const guestRegisterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().refine((val) => validateCPF(val), {
    message: 'CPF inválido',
  }),
  email: z.string().email('Email inválido'),
  phone: z.string().refine((val) => validatePhone(val), {
    message: 'Telefone inválido',
  }),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Senhas não conferem',
  path: ['password_confirmation'],
})

// Login schema
export const loginSchema = z.object({
  identifier: z.string().min(1, 'CPF ou Email é obrigatório'), // Can be CPF or email
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Password reset request
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Email inválido'),
})

// Password reset
export const passwordResetSchema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Senhas não conferem',
  path: ['password_confirmation'],
})

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  phone: z.string().refine((val) => !val || validatePhone(val), {
    message: 'Telefone inválido',
  }).optional(),
  cep: z.string().refine((val) => !val || validateCEP(val), {
    message: 'CEP inválido',
  }).optional(),
  address: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
})

// Types
export type UserRegisterInput = z.infer<typeof userRegisterSchema>
export type GuestRegisterInput = z.infer<typeof guestRegisterSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
