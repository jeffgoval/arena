-- TPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPW
-- Q  RECUPERAÇÃO COMPLETA DO SCHEMA - ARENA DONA SANTA                        Q
-- Q  Banco de Dados: Supabase PostgreSQL                                      Q
-- Q  Data: 2025-10-25                                                         Q
-- Q  Total de Tabelas: 31                                                     Q
-- Q  Total de Tipos Customizados: 2                                           Q
-- ZPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP]

-- IMPORTANTE: Execute este script no Dashboard do Supabase
-- URL: https://supabase.com/dashboard/project/[seu-project-id]/sql/new

-- ATENÇÃO: Este script criará TODAS as tabelas do zero
-- Certifique-se de que o banco está limpo ou faça backup antes!

-- ============================================================================
-- PREPARAÇÃO: Habilitar extensão UUID
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ETAPA 1: TIPOS CUSTOMIZADOS (ENUMs)
-- ============================================================================

-- Tipo para status de usuário
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Tipo para prioridade de notificação
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================================================
-- ETAPA 2: TABELAS BÁSICAS SEM DEPENDÊNCIAS (8 tabelas)
-- ============================================================================

-- Tabela de usuários (depende apenas de auth.users do Supabase)
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  cpf text UNIQUE,
  rg text UNIQUE,
  nome_completo text,
  data_nascimento date,
  whatsapp text,
  cep text,
  logradouro text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  role text NOT NULL DEFAULT 'cliente'::text CHECK (role = ANY (ARRAY['admin'::text, 'gestor'::text, 'cliente'::text])),
  saldo_creditos numeric DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  banned boolean NOT NULL DEFAULT false,
  status user_status NOT NULL DEFAULT 'active'::user_status,
  banned_at timestamp with time zone,
  banned_reason text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de quadras (quadras)
CREATE TABLE public.quadras (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['society'::text, 'beach_tennis'::text, 'volei'::text, 'futevolei'::text])),
  descricao text,
  status text NOT NULL DEFAULT 'ativa'::text CHECK (status = ANY (ARRAY['ativa'::text, 'inativa'::text, 'manutencao'::text])),
  capacidade_maxima integer NOT NULL,
  foto_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quadras_pkey PRIMARY KEY (id)
);

-- Tabela de quadras (courts) - versão alternativa
CREATE TABLE public.courts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['society'::text, 'beach_tennis'::text, 'volei'::text, 'futvolei'::text, 'futsal'::text])),
  descricao text,
  capacidade_maxima integer DEFAULT 14,
  ativa boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT courts_pkey PRIMARY KEY (id)
);

-- Tabela de planos mensalista
CREATE TABLE public.planos_mensalista (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL,
  descricao text,
  valor_mensal numeric NOT NULL,
  horas_incluidas integer NOT NULL,
  horas_extras_valor numeric NOT NULL DEFAULT 0,
  quadras_permitidas text[] DEFAULT '{}'::text[],
  horarios_permitidos jsonb DEFAULT '[]'::jsonb,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT planos_mensalista_pkey PRIMARY KEY (id)
);

-- Tabela de configurações do sistema
CREATE TABLE public.configuracoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  antecedencia_minima integer DEFAULT 2,
  antecedencia_maxima integer DEFAULT 30,
  dia_vencimento integer DEFAULT 25,
  hora_limite_reserva integer DEFAULT 22,
  cancelamento_gratuito integer DEFAULT 24,
  multa_cancelamento numeric DEFAULT 30,
  reembolso_total integer DEFAULT 48,
  permite_cancelamento boolean DEFAULT true,
  pagamento_pix boolean DEFAULT true,
  pagamento_cartao boolean DEFAULT true,
  pagamento_dinheiro boolean DEFAULT true,
  pagamento_transferencia boolean DEFAULT true,
  taxa_conveniencia numeric DEFAULT 3.5,
  valor_minimo numeric DEFAULT 50,
  notif_whatsapp boolean DEFAULT true,
  notif_email boolean DEFAULT true,
  notif_sms boolean DEFAULT false,
  lembrete_antes integer DEFAULT 45,
  lembrete_final integer DEFAULT 10,
  desconto_mensalista numeric DEFAULT 15,
  desconto_primeira_reserva numeric DEFAULT 10,
  bonus_indicacao numeric DEFAULT 20,
  desconto_recorrente numeric DEFAULT 5,
  bonus_aniversario numeric DEFAULT 50,
  desconto_grupo numeric DEFAULT 8,
  minimo_participantes_desconto integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT configuracoes_pkey PRIMARY KEY (id)
);

-- Tabela de system_settings
CREATE TABLE public.system_settings (
  key character varying NOT NULL,
  value jsonb NOT NULL,
  descricao text,
  categoria character varying,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT system_settings_pkey PRIMARY KEY (key)
);

-- Tabela de templates de notificação
CREATE TABLE public.templates_notificacao (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo character varying NOT NULL UNIQUE,
  titulo character varying NOT NULL,
  template text NOT NULL,
  variaveis text[] NOT NULL,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT templates_notificacao_pkey PRIMARY KEY (id)
);

-- Tabela de notification_templates
CREATE TABLE public.notification_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  type character varying NOT NULL,
  title_template text NOT NULL,
  message_template text NOT NULL,
  priority notification_priority DEFAULT 'medium'::notification_priority,
  variables jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notification_templates_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- ETAPA 3: TABELAS COM DEPENDÊNCIAS SIMPLES (7 tabelas)
-- ============================================================================

-- Tabela de turmas (depende de users)
CREATE TABLE public.turmas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organizador_id uuid NOT NULL,
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT turmas_pkey PRIMARY KEY (id),
  CONSTRAINT turmas_organizador_id_fkey FOREIGN KEY (organizador_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Tabela de membros de turma (depende de turmas)
CREATE TABLE public.turma_membros (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  turma_id uuid NOT NULL,
  nome text NOT NULL,
  email text,
  whatsapp text,
  status text NOT NULL CHECK (status = ANY (ARRAY['fixo'::text, 'variavel'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT turma_membros_pkey PRIMARY KEY (id),
  CONSTRAINT turma_membros_turma_id_fkey FOREIGN KEY (turma_id) REFERENCES public.turmas(id) ON DELETE CASCADE
);

-- Tabela de horários das quadras (depende de quadras)
CREATE TABLE public.horarios (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  quadra_id uuid NOT NULL,
  dia_semana integer NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_inicio time without time zone NOT NULL,
  hora_fim time without time zone NOT NULL,
  valor_avulsa numeric NOT NULL,
  valor_mensalista numeric NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT horarios_pkey PRIMARY KEY (id),
  CONSTRAINT horarios_quadra_id_fkey FOREIGN KEY (quadra_id) REFERENCES public.quadras(id) ON DELETE CASCADE
);

-- Tabela de schedules (depende de courts)
CREATE TABLE public.schedules (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  court_id uuid NOT NULL,
  dia_semana integer NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  horario_inicio time without time zone NOT NULL,
  horario_fim time without time zone NOT NULL,
  valor_avulsa numeric NOT NULL,
  valor_mensalista numeric NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE
);

-- Tabela de bloqueios de quadra (depende de courts e users)
CREATE TABLE public.court_blocks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  court_id uuid NOT NULL,
  data_inicio date NOT NULL,
  data_fim date NOT NULL,
  horario_inicio time without time zone,
  horario_fim time without time zone,
  motivo text NOT NULL,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT court_blocks_pkey PRIMARY KEY (id),
  CONSTRAINT court_blocks_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE,
  CONSTRAINT court_blocks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Tabela de códigos de indicação (depende de users)
CREATE TABLE public.codigos_indicacao (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  codigo text NOT NULL UNIQUE CHECK (char_length(codigo) >= 4),
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT codigos_indicacao_pkey PRIMARY KEY (id),
  CONSTRAINT codigos_indicacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Tabela de transações (depende de users)
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['compra'::character varying, 'bonus'::character varying, 'indicacao_quem_indicou'::character varying, 'indicacao_novo_usuario'::character varying, 'uso_reserva'::character varying, 'estorno'::character varying, 'mensalidade'::character varying, 'expiracao'::character varying, 'ajuste_manual'::character varying]::text[])),
  valor numeric NOT NULL,
  saldo_anterior numeric NOT NULL DEFAULT 0,
  saldo_novo numeric NOT NULL DEFAULT 0,
  referencia_id uuid,
  descricao text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- ETAPA 4: TABELAS COM DEPENDÊNCIAS MÉDIAS (5 tabelas)
-- ============================================================================

-- Tabela de indicações (depende de users e codigos_indicacao)
CREATE TABLE public.indicacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id_indicador uuid NOT NULL,
  user_id_indicado uuid,
  codigo_usado character varying NOT NULL,
  creditos_concedidos_indicador numeric DEFAULT 0,
  creditos_concedidos_indicado numeric DEFAULT 0,
  status character varying DEFAULT 'pendente'::character varying CHECK (status::text = ANY (ARRAY['pendente'::character varying, 'confirmado'::character varying, 'expirado'::character varying]::text[])),
  data_primeiro_uso timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT indicacoes_pkey PRIMARY KEY (id),
  CONSTRAINT indicacoes_user_id_indicador_fkey FOREIGN KEY (user_id_indicador) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT indicacoes_user_id_indicado_fkey FOREIGN KEY (user_id_indicado) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Tabela de reservas (depende de users, quadras, horarios, turmas)
CREATE TABLE public.reservas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organizador_id uuid NOT NULL,
  quadra_id uuid NOT NULL,
  horario_id uuid NOT NULL,
  data date NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['avulsa'::text, 'mensalista'::text, 'recorrente'::text])),
  status text NOT NULL DEFAULT 'pendente'::text CHECK (status = ANY (ARRAY['pendente'::text, 'confirmada'::text, 'cancelada'::text])),
  valor_total numeric NOT NULL,
  observacoes text,
  turma_id uuid,
  rateio_modo text CHECK (rateio_modo = ANY (ARRAY['percentual'::text, 'fixo'::text])),
  rateio_configurado boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  split_mode text DEFAULT 'percentual'::text CHECK (split_mode = ANY (ARRAY['percentual'::text, 'valor_fixo'::text])),
  team_id uuid,
  CONSTRAINT reservas_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_organizador_id_fkey FOREIGN KEY (organizador_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT reservas_quadra_id_fkey FOREIGN KEY (quadra_id) REFERENCES public.quadras(id) ON DELETE CASCADE,
  CONSTRAINT reservas_horario_id_fkey FOREIGN KEY (horario_id) REFERENCES public.horarios(id) ON DELETE RESTRICT,
  CONSTRAINT reservas_turma_id_fkey FOREIGN KEY (turma_id) REFERENCES public.turmas(id) ON DELETE SET NULL,
  CONSTRAINT reservas_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.turmas(id) ON DELETE SET NULL
);

-- Tabela de assinaturas mensalista (depende de auth.users e planos_mensalista)
CREATE TABLE public.assinaturas_mensalista (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  plano_id uuid NOT NULL,
  status character varying DEFAULT 'ativa'::character varying CHECK (status::text = ANY (ARRAY['ativa'::character varying, 'pausada'::character varying, 'cancelada'::character varying, 'vencida'::character varying]::text[])),
  data_inicio timestamp with time zone NOT NULL,
  data_fim timestamp with time zone,
  dia_vencimento integer NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  valor_mensal numeric NOT NULL,
  horas_utilizadas_mes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT assinaturas_mensalista_pkey PRIMARY KEY (id),
  CONSTRAINT assinaturas_mensalista_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT assinaturas_mensalista_plano_id_fkey FOREIGN KEY (plano_id) REFERENCES public.planos_mensalista(id) ON DELETE RESTRICT
);

-- Tabela de mensalistas (depende de users, quadras, horarios)
CREATE TABLE public.mensalistas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quadra_id uuid NOT NULL,
  dia_semana integer NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  horario_id uuid NOT NULL,
  valor_mensal numeric NOT NULL CHECK (valor_mensal >= 0::numeric),
  data_inicio date NOT NULL,
  data_fim date,
  status character varying DEFAULT 'ativo'::character varying CHECK (status::text = ANY (ARRAY['ativo'::character varying, 'suspenso'::character varying, 'cancelado'::character varying]::text[])),
  forma_pagamento character varying DEFAULT 'pix'::character varying CHECK (forma_pagamento::text = ANY (ARRAY['pix'::character varying, 'cartao'::character varying, 'boleto'::character varying, 'dinheiro'::character varying]::text[])),
  dia_vencimento integer DEFAULT 5 CHECK (dia_vencimento >= 1 AND dia_vencimento <= 28),
  observacoes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mensalistas_pkey PRIMARY KEY (id),
  CONSTRAINT mensalistas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT mensalistas_quadra_id_fkey FOREIGN KEY (quadra_id) REFERENCES public.quadras(id) ON DELETE CASCADE,
  CONSTRAINT mensalistas_horario_id_fkey FOREIGN KEY (horario_id) REFERENCES public.horarios(id) ON DELETE RESTRICT
);

-- Tabela de reservas recorrentes (depende de auth.users e quadras)
CREATE TABLE public.reservas_recorrentes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  quadra_id uuid NOT NULL,
  titulo character varying NOT NULL,
  descricao text,
  tipo_recorrencia character varying NOT NULL CHECK (tipo_recorrencia::text = ANY (ARRAY['semanal'::character varying, 'quinzenal'::character varying, 'mensal'::character varying]::text[])),
  dias_semana integer[] DEFAULT '{}'::integer[],
  dia_mes integer CHECK (dia_mes >= 1 AND dia_mes <= 31),
  hora_inicio time without time zone NOT NULL,
  hora_fim time without time zone NOT NULL,
  data_inicio date NOT NULL,
  data_fim date,
  status character varying DEFAULT 'ativa'::character varying CHECK (status::text = ANY (ARRAY['ativa'::character varying, 'pausada'::character varying, 'cancelada'::character varying]::text[])),
  gerar_ate date NOT NULL,
  antecedencia_dias integer DEFAULT 7,
  valor_por_reserva numeric NOT NULL,
  desconto_percentual numeric DEFAULT 0,
  proxima_geracao timestamp with time zone,
  total_reservas_geradas integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reservas_recorrentes_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_recorrentes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT reservas_recorrentes_quadra_id_fkey FOREIGN KEY (quadra_id) REFERENCES public.quadras(id) ON DELETE CASCADE
);

-- ============================================================================
-- ETAPA 5: TABELAS COM DEPENDÊNCIAS COMPLEXAS (11 tabelas)
-- ============================================================================

-- Tabela de convites (depende de reservas e users)
CREATE TABLE public.convites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  reserva_id uuid NOT NULL,
  criado_por uuid NOT NULL,
  token text NOT NULL UNIQUE,
  vagas_disponiveis integer NOT NULL CHECK (vagas_disponiveis > 0),
  vagas_totais integer NOT NULL CHECK (vagas_totais > 0),
  mensagem text CHECK (length(mensagem) <= 500),
  valor_por_pessoa numeric,
  data_expiracao timestamp with time zone,
  status text NOT NULL DEFAULT 'ativo'::text CHECK (status = ANY (ARRAY['ativo'::text, 'expirado'::text, 'completo'::text])),
  total_aceites integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT convites_pkey PRIMARY KEY (id),
  CONSTRAINT convites_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE,
  CONSTRAINT convites_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Tabela de rateios (depende de reservas)
CREATE TABLE public.rateios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  modo character varying NOT NULL CHECK (modo::text = ANY (ARRAY['igual'::character varying, 'percentual'::character varying, 'valor_fixo'::character varying, 'manual'::character varying]::text[])),
  valor_total numeric NOT NULL,
  configuracao jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rateios_pkey PRIMARY KEY (id),
  CONSTRAINT rateios_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE
);

-- Tabela de pagamentos (depende de users e reservas)
CREATE TABLE public.pagamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reserva_id uuid,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['pix'::character varying, 'cartao'::character varying, 'credito'::character varying, 'dinheiro'::character varying, 'boleto'::character varying]::text[])),
  valor numeric NOT NULL CHECK (valor > 0::numeric),
  status character varying DEFAULT 'pendente'::character varying CHECK (status::text = ANY (ARRAY['pendente'::character varying, 'processando'::character varying, 'confirmado'::character varying, 'cancelado'::character varying, 'estornado'::character varying, 'expirado'::character varying]::text[])),
  asaas_payment_id character varying,
  asaas_pix_qrcode text,
  asaas_pix_payload text,
  metadata jsonb DEFAULT '{}'::jsonb,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pagamentos_pkey PRIMARY KEY (id),
  CONSTRAINT pagamentos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT pagamentos_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE SET NULL
);

-- Tabela de payments (versão alternativa - depende de users, reservas e convites)
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reservation_id uuid,
  invitation_id uuid,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  method text NOT NULL CHECK (method = ANY (ARRAY['pix'::text, 'credit_card'::text, 'debit_card'::text, 'balance'::text])),
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'authorized'::text, 'paid'::text, 'failed'::text, 'cancelled'::text, 'refunded'::text])),
  transaction_id text UNIQUE,
  authorization_id text,
  capture_amount numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  paid_at timestamp with time zone,
  refunded_at timestamp with time zone,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT payments_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservas(id) ON DELETE SET NULL,
  CONSTRAINT payments_invitation_id_fkey FOREIGN KEY (invitation_id) REFERENCES public.convites(id) ON DELETE SET NULL
);

-- Tabela de participantes de reserva (depende de reservas, users, convites, payments)
CREATE TABLE public.reserva_participantes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  reserva_id uuid NOT NULL,
  user_id uuid,
  nome text NOT NULL,
  email text,
  whatsapp text,
  origem text NOT NULL CHECK (origem = ANY (ARRAY['turma'::text, 'convite'::text])),
  convite_id uuid,
  valor_rateio numeric,
  percentual_rateio numeric CHECK (percentual_rateio >= 0::numeric AND percentual_rateio <= 100::numeric),
  status_pagamento text NOT NULL DEFAULT 'pendente'::text CHECK (status_pagamento = ANY (ARRAY['pendente'::text, 'pago'::text, 'reembolsado'::text])),
  valor_pago numeric,
  data_pagamento timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  source text DEFAULT 'invite'::text CHECK (source = ANY (ARRAY['team'::text, 'invite'::text])),
  split_type text DEFAULT 'percentual'::text CHECK (split_type = ANY (ARRAY['percentual'::text, 'valor_fixo'::text])),
  split_value numeric DEFAULT 0 CHECK (split_value >= 0::numeric),
  amount_to_pay numeric DEFAULT 0 CHECK (amount_to_pay >= 0::numeric),
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'free'::text])),
  payment_id uuid,
  CONSTRAINT reserva_participantes_pkey PRIMARY KEY (id),
  CONSTRAINT reserva_participantes_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE,
  CONSTRAINT reserva_participantes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT reserva_participantes_convite_id_fkey FOREIGN KEY (convite_id) REFERENCES public.convites(id) ON DELETE SET NULL,
  CONSTRAINT reserva_participantes_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE SET NULL
);

-- Tabela de aceites de convite (depende de convites e users)
CREATE TABLE public.convite_aceites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  convite_id uuid NOT NULL,
  nome text NOT NULL,
  email text,
  whatsapp text,
  user_id uuid,
  confirmado boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT convite_aceites_pkey PRIMARY KEY (id),
  CONSTRAINT convite_aceites_convite_id_fkey FOREIGN KEY (convite_id) REFERENCES public.convites(id) ON DELETE CASCADE,
  CONSTRAINT convite_aceites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Tabela de avaliações (depende de reservas)
CREATE TABLE public.avaliacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  user_id uuid NOT NULL,
  nota integer NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario text,
  avaliacao_instalacoes integer CHECK (avaliacao_instalacoes >= 1 AND avaliacao_instalacoes <= 5),
  avaliacao_atendimento integer CHECK (avaliacao_atendimento >= 1 AND avaliacao_atendimento <= 5),
  avaliacao_limpeza integer CHECK (avaliacao_limpeza >= 1 AND avaliacao_limpeza <= 5),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT avaliacoes_pkey PRIMARY KEY (id),
  CONSTRAINT avaliacoes_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE,
  CONSTRAINT avaliacoes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Tabela de créditos (depende de users, reservas, indicacoes)
CREATE TABLE public.creditos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['compra'::text, 'bonus'::text, 'indicacao'::text, 'promocao'::text, 'uso'::text, 'expiracao'::text])),
  valor numeric NOT NULL,
  descricao text NOT NULL,
  status text NOT NULL DEFAULT 'ativo'::text CHECK (status = ANY (ARRAY['ativo'::text, 'usado'::text, 'expirado'::text])),
  data_expiracao timestamp with time zone,
  reserva_id uuid,
  indicacao_id uuid,
  metodo_pagamento text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT creditos_pkey PRIMARY KEY (id),
  CONSTRAINT creditos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT creditos_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE SET NULL,
  CONSTRAINT creditos_indicacao_id_fkey FOREIGN KEY (indicacao_id) REFERENCES public.indicacoes(id) ON DELETE SET NULL
);

-- Tabela de cobranças mensalista (depende de assinaturas_mensalista)
CREATE TABLE public.cobrancas_mensalista (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  assinatura_id uuid NOT NULL,
  mes_referencia character varying NOT NULL,
  valor_plano numeric NOT NULL,
  horas_extras integer DEFAULT 0,
  valor_horas_extras numeric DEFAULT 0,
  valor_total numeric NOT NULL,
  status character varying DEFAULT 'pendente'::character varying CHECK (status::text = ANY (ARRAY['pendente'::character varying, 'paga'::character varying, 'vencida'::character varying, 'cancelada'::character varying]::text[])),
  data_vencimento date NOT NULL,
  data_pagamento timestamp with time zone,
  metodo_pagamento character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cobrancas_mensalista_pkey PRIMARY KEY (id),
  CONSTRAINT cobrancas_mensalista_assinatura_id_fkey FOREIGN KEY (assinatura_id) REFERENCES public.assinaturas_mensalista(id) ON DELETE CASCADE
);

-- Tabela de reservas geradas (depende de reservas_recorrentes)
CREATE TABLE public.reservas_geradas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_recorrente_id uuid NOT NULL,
  reserva_id uuid,
  data_reserva date NOT NULL,
  hora_inicio time without time zone NOT NULL,
  hora_fim time without time zone NOT NULL,
  status character varying DEFAULT 'agendada'::character varying CHECK (status::text = ANY (ARRAY['agendada'::character varying, 'confirmada'::character varying, 'cancelada'::character varying, 'realizada'::character varying]::text[])),
  valor numeric NOT NULL,
  data_geracao timestamp with time zone DEFAULT now(),
  CONSTRAINT reservas_geradas_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_geradas_reserva_recorrente_id_fkey FOREIGN KEY (reserva_recorrente_id) REFERENCES public.reservas_recorrentes(id) ON DELETE CASCADE,
  CONSTRAINT reservas_geradas_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE SET NULL
);

-- Tabela de notificações agendadas (depende de reservas)
CREATE TABLE public.notificacoes_agendadas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  tipo character varying NOT NULL,
  telefone character varying NOT NULL,
  data_envio timestamp with time zone NOT NULL,
  enviado boolean DEFAULT false,
  tentativas integer DEFAULT 0,
  dados_template jsonb NOT NULL,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT notificacoes_agendadas_pkey PRIMARY KEY (id),
  CONSTRAINT notificacoes_agendadas_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE
);

-- ============================================================================
-- FINALIZADO!
-- ============================================================================
--  Todas as 31 tabelas foram criadas com sucesso!
--  2 tipos customizados foram criados
--
-- PRÓXIMOS PASSOS:
--
-- 1. CONFIGURAR ROW LEVEL SECURITY (RLS)
--    - Habilitar RLS em todas as tabelas sensíveis
--    - Criar políticas de acesso por role (admin, gestor, cliente)
--
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
--    - Índices em colunas frequentemente consultadas
--    - Índices compostos para queries complexas
--
-- 3. CRIAR TRIGGERS (se necessário)
--    - Atualizar updated_at automaticamente
--    - Atualizar saldo_creditos em users
--    - Enviar notificações em eventos específicos
--
-- 4. GERAR TIPOS TYPESCRIPT
--    Execute no seu terminal:
--    npx supabase gen types typescript --linked > src/types/database.types.ts
--
-- 5. POPULAR DADOS INICIAIS
--    - Configurações padrão
--    - Templates de notificação
--    - Quadras e horários
--
-- ============================================================================
