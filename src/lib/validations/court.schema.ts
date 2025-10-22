import { z } from 'zod';

// Schema para criar/editar quadra
export const courtSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),

  tipo: z.enum(['society', 'beach_tennis', 'volei', 'futvolei', 'futsal'], {
    errorMap: () => ({ message: 'Tipo de quadra inválido' }),
  }),

  descricao: z.string()
    .max(500, 'Descrição muito longa')
    .optional()
    .or(z.literal('')),

  capacidade_maxima: z.number()
    .int('Capacidade deve ser um número inteiro')
    .min(4, 'Capacidade mínima é 4 pessoas')
    .max(30, 'Capacidade máxima é 30 pessoas')
    .default(14),

  ativa: z.boolean().default(true),
});

export type CourtFormData = z.infer<typeof courtSchema>;

// Schema para horário
export const scheduleSchema = z.object({
  court_id: z.string().uuid('ID da quadra inválido'),

  dia_semana: z.number()
    .int()
    .min(0, 'Dia da semana inválido')
    .max(6, 'Dia da semana inválido'),

  horario_inicio: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'),

  horario_fim: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'),

  valor_avulsa: z.number()
    .min(0, 'Valor deve ser positivo')
    .max(9999.99, 'Valor muito alto'),

  valor_mensalista: z.number()
    .min(0, 'Valor deve ser positivo')
    .max(9999.99, 'Valor muito alto'),

  ativo: z.boolean().default(true),
}).refine(
  (data) => {
    const [horaInicio, minInicio] = data.horario_inicio.split(':').map(Number);
    const [horaFim, minFim] = data.horario_fim.split(':').map(Number);
    const inicio = horaInicio * 60 + minInicio;
    const fim = horaFim * 60 + minFim;
    return fim > inicio;
  },
  {
    message: 'Horário de fim deve ser maior que horário de início',
    path: ['horario_fim'],
  }
);

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

// Schema para bloqueio
export const courtBlockSchema = z.object({
  court_id: z.string().uuid('ID da quadra inválido'),

  data_inicio: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),

  data_fim: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),

  horario_inicio: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido')
    .optional()
    .or(z.literal('')),

  horario_fim: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido')
    .optional()
    .or(z.literal('')),

  motivo: z.string()
    .min(5, 'Motivo deve ter no mínimo 5 caracteres')
    .max(500, 'Motivo muito longo'),
}).refine(
  (data) => {
    const inicio = new Date(data.data_inicio);
    const fim = new Date(data.data_fim);
    return fim >= inicio;
  },
  {
    message: 'Data de fim deve ser maior ou igual à data de início',
    path: ['data_fim'],
  }
);

export type CourtBlockFormData = z.infer<typeof courtBlockSchema>;
