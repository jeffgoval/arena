import { z } from 'zod';
import { validateCPF } from '@/lib/utils/cpf';
import { validatePhone } from '@/lib/utils/phone';
import { validateCEP } from '@/lib/utils/cep';

export const cadastroSchema = z.object({
  nome_completo: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  email: z.string()
    .email('Email inválido')
    .toLowerCase(),

  cpf: z.string()
    .min(14, 'CPF inválido')
    .refine((cpf) => validateCPF(cpf), {
      message: 'CPF inválido',
    }),

  rg: z.string()
    .min(5, 'RG deve ter no mínimo 5 caracteres')
    .optional()
    .or(z.literal('')),

  data_nascimento: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13; // Idade mínima 13 anos
    }, {
      message: 'Você deve ter pelo menos 13 anos',
    }),

  whatsapp: z.string()
    .min(14, 'WhatsApp inválido')
    .refine((phone) => validatePhone(phone), {
      message: 'WhatsApp inválido',
    }),

  cep: z.string()
    .min(9, 'CEP inválido')
    .refine((cep) => validateCEP(cep), {
      message: 'CEP inválido',
    })
    .optional()
    .or(z.literal('')),

  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),

  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;
