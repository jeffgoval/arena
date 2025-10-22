# Planejamento de Implementação - Arena Dona Santa
## Arquitetura Componentizada e Modular

---

## 📊 Visão Geral do Projeto

**Arena Dona Santa** é um sistema completo de gestão de arena esportiva com 3 módulos principais:
- **CORE (MVP)**: Reservas, turmas autônomas, rateio flexível, convites públicos
- **Escolinha**: Academia do Galo (futuro)
- **Day Use**: Gestão de day use (futuro)

---

## 🏗️ Arquitetura de Alto Nível

### Princípios Arquiteturais
1. **Modularização por Domínio**: Cada módulo (Core, Escolinha, Day Use) é independente
2. **Separação de Responsabilidades**: Camadas bem definidas (UI, Services, Data)
3. **Componentização Atômica**: Componentes reutilizáveis e composáveis
4. **Type-Safety First**: TypeScript em toda a aplicação
5. **Server-Side Rendering**: Next.js App Router com SSR onde apropriado
6. **Real-time quando necessário**: Supabase Realtime para atualizações críticas

### Stack Tecnológico
```
Frontend:
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI + Tailwind)
- React Query (TanStack Query)
- Zod (validação)
- React Hook Form

Backend/BaaS:
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)

Integrações:
- Asaas (pagamentos)
- WhatsApp Business API
- ViaCEP (endereços)

Deploy:
- Cloudflare Pages
```

---

## 📁 Arquitetura de Pastas (Modular)

```
arena-dona-santa/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── (auth)/                             # Grupo: Autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── cadastro/
│   │   │   │   └── page.tsx
│   │   │   ├── recuperar-senha/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx                      # Layout sem sidebar
│   │   │
│   │   ├── (dashboard)/                        # Grupo: Dashboard protegido
│   │   │   ├── cliente/                        # Área do cliente (role: cliente)
│   │   │   │   ├── page.tsx                    # Dashboard principal (contexto: organizador E convidado)
│   │   │   │   ├── reservas/
│   │   │   │   │   ├── page.tsx                # Lista de reservas (minhas reservas criadas)
│   │   │   │   │   ├── nova/page.tsx           # Nova reserva
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # Gerenciar reserva
│   │   │   │   ├── jogos/
│   │   │   │   │   └── page.tsx                # Jogos onde fui convidado
│   │   │   │   ├── turmas/
│   │   │   │   │   ├── page.tsx                # Minhas turmas
│   │   │   │   │   ├── nova/page.tsx           # Criar turma
│   │   │   │   │   └── [id]/page.tsx           # Editar turma
│   │   │   │   ├── convites/
│   │   │   │   │   └── page.tsx                # Convites criados por mim
│   │   │   │   ├── creditos/
│   │   │   │   │   └── page.tsx                # Comprar créditos
│   │   │   │   └── perfil/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── gestor/                         # Área do gestor (role: gestor)
│   │   │   │   ├── page.tsx                    # Dashboard gestor
│   │   │   │   ├── quadras/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── agenda/
│   │   │   │   │   └── page.tsx                # Agenda geral
│   │   │   │   ├── financeiro/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── relatorios/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── configuracoes/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── admin/                          # Área admin (role: admin)
│   │   │   │   ├── page.tsx                    # Dashboard admin
│   │   │   │   ├── usuarios/
│   │   │   │   │   └── page.tsx                # Gerenciar todos usuários
│   │   │   │   ├── logs/
│   │   │   │   │   └── page.tsx                # Logs do sistema
│   │   │   │   └── config/
│   │   │   │       └── page.tsx                # Configurações avançadas
│   │   │   │
│   │   │   └── layout.tsx                      # Layout com sidebar (adapta por role)
│   │   │
│   │   ├── (public)/                           # Grupo: Rotas públicas
│   │   │   ├── convite/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                # Landing page do convite
│   │   │   └── layout.tsx                      # Layout público
│   │   │
│   │   ├── api/                                # API Routes
│   │   │   ├── webhooks/
│   │   │   │   ├── asaas/route.ts
│   │   │   │   └── whatsapp/route.ts
│   │   │   └── cron/
│   │   │       └── close-games/route.ts
│   │   │
│   │   ├── layout.tsx                          # Root layout
│   │   ├── globals.css
│   │   └── page.tsx                            # Landing page (atual)
│   │
│   ├── components/                             # Componentes React
│   │   ├── ui/                                 # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (outros shadcn)
│   │   │
│   │   ├── modules/                            # Componentes por módulo
│   │   │   └── core/                           # Módulo CORE
│   │   │       ├── reservas/
│   │   │       │   ├── CalendarioReservas.tsx
│   │   │       │   ├── FormNovaReserva.tsx
│   │   │       │   ├── CardReserva.tsx
│   │   │       │   ├── DetalheReserva.tsx
│   │   │       │   └── ListaReservas.tsx
│   │   │       │
│   │   │       ├── turmas/
│   │   │       │   ├── FormCriarTurma.tsx
│   │   │       │   ├── ListaTurmas.tsx
│   │   │       │   ├── CardTurma.tsx
│   │   │       │   ├── ModalVincularTurma.tsx
│   │   │       │   ├── GerenciadorMembros.tsx
│   │   │       │   └── ToggleMembroFixo.tsx
│   │   │       │
│   │   │       ├── rateio/
│   │   │       │   ├── ConfiguradorRateio.tsx
│   │   │       │   ├── ToggleModoRateio.tsx
│   │   │       │   ├── InputRateioPercentual.tsx
│   │   │       │   ├── InputRateioValorFixo.tsx
│   │   │       │   ├── ResumoRateio.tsx
│   │   │       │   └── IndicadorProgresso.tsx
│   │   │       │
│   │   │       ├── convites/
│   │   │       │   ├── FormCriarConvite.tsx
│   │   │       │   ├── ListaConvites.tsx
│   │   │       │   ├── CardConvite.tsx
│   │   │       │   ├── LinkConvite.tsx
│   │   │       │   ├── LandingPageConvite.tsx
│   │   │       │   └── FormAceitarConvite.tsx
│   │   │       │
│   │   │       └── participantes/
│   │   │           ├── ListaParticipantes.tsx
│   │   │           ├── CardParticipante.tsx
│   │   │           └── StatusPagamento.tsx
│   │   │
│   │   ├── shared/                             # Componentes compartilhados
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── InputCPF.tsx
│   │   │   │   ├── InputCEP.tsx
│   │   │   │   ├── InputWhatsApp.tsx
│   │   │   │   └── InputCurrency.tsx
│   │   │   │
│   │   │   ├── calendario/
│   │   │   │   ├── CalendarioBase.tsx
│   │   │   │   ├── SeletorHorario.tsx
│   │   │   │   └── GradeHoraria.tsx
│   │   │   │
│   │   │   ├── pagamento/
│   │   │   │   ├── FormPagamento.tsx
│   │   │   │   ├── PagamentoPix.tsx
│   │   │   │   ├── PagamentoCartao.tsx
│   │   │   │   └── SeletorMetodoPagamento.tsx
│   │   │   │
│   │   │   └── feedback/
│   │   │       ├── Loading.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       └── SkeletonCard.tsx
│   │   │
│   │   └── providers/
│   │       ├── QueryProvider.tsx
│   │       ├── SupabaseProvider.tsx
│   │       └── ToastProvider.tsx
│   │
│   ├── lib/                                    # Bibliotecas e utilitários
│   │   ├── supabase/
│   │   │   ├── client.ts                       # Cliente browser
│   │   │   ├── server.ts                       # Cliente server
│   │   │   ├── middleware.ts                   # Middleware de auth
│   │   │   └── admin.ts                        # Cliente admin (service role)
│   │   │
│   │   ├── validations/                        # Schemas Zod
│   │   │   ├── auth.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   ├── reserva.schema.ts
│   │   │   ├── turma.schema.ts
│   │   │   ├── rateio.schema.ts
│   │   │   ├── convite.schema.ts
│   │   │   └── pagamento.schema.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── currency.ts                     # Formatação de moeda
│   │   │   ├── date.ts                         # Formatação de datas
│   │   │   ├── cpf.ts                          # Validação de CPF
│   │   │   ├── rg.ts                           # Validação de RG
│   │   │   ├── cep.ts                          # Formatação de CEP
│   │   │   ├── phone.ts                        # Formatação de telefone
│   │   │   └── cn.ts                           # Class name merger
│   │   │
│   │   └── constants.ts                        # Constantes da aplicação
│   │
│   ├── hooks/                                  # Custom React Hooks
│   │   ├── core/
│   │   │   ├── useReservas.ts
│   │   │   ├── useCreateReserva.ts
│   │   │   ├── useTurmas.ts
│   │   │   ├── useConvites.ts
│   │   │   ├── useRateio.ts
│   │   │   └── useParticipantes.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── useAuth.ts
│   │   │   ├── useUser.ts
│   │   │   └── usePermissions.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── usePayment.ts
│   │   │   └── useCreditos.ts
│   │   │
│   │   └── shared/
│   │       ├── useMediaQuery.ts
│   │       ├── useDebounce.ts
│   │       └── useLocalStorage.ts
│   │
│   ├── services/                               # Serviços de API
│   │   ├── core/
│   │   │   ├── reservas.service.ts
│   │   │   ├── turmas.service.ts
│   │   │   ├── convites.service.ts
│   │   │   ├── rateio.service.ts
│   │   │   └── participantes.service.ts
│   │   │
│   │   ├── auth/
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── integrations/
│   │   │   ├── asaas.service.ts
│   │   │   ├── whatsapp.service.ts
│   │   │   └── viacep.service.ts
│   │   │
│   │   └── storage/
│   │       └── upload.service.ts
│   │
│   └── types/                                  # TypeScript types
│       ├── database.types.ts                   # Gerado pelo Supabase
│       ├── core.types.ts
│       ├── auth.types.ts
│       └── payment.types.ts
│
├── supabase/                                   # Configurações Supabase
│   ├── functions/                              # Edge Functions
│   │   ├── process-payment/
│   │   │   └── index.ts
│   │   ├── send-whatsapp/
│   │   │   └── index.ts
│   │   ├── close-game/
│   │   │   └── index.ts
│   │   └── notify-participants/
│   │       └── index.ts
│   │
│   ├── migrations/                             # SQL Migrations
│   │   ├── 20240101000000_initial_schema.sql
│   │   ├── 20240101000001_auth_tables.sql
│   │   ├── 20240101000002_core_tables.sql
│   │   ├── 20240101000003_rls_policies.sql
│   │   └── 20240101000004_indexes.sql
│   │
│   ├── seed.sql                                # Dados iniciais
│   └── config.toml
│
├── public/
│   ├── images/
│   ├── icons/
│   └── ... (arquivos atuais)
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗄️ Arquitetura de Banco de Dados

### Modelo Relacional (Módulo CORE - MVP)

```sql
-- AUTENTICAÇÃO E USUÁRIOS
-- IMPORTANTE: Supabase Auth gerencia autenticação em auth.users
-- Nossa tabela public.users é o perfil estendido

users (perfil estendido)
  - id (UUID, PK, FK -> auth.users.id)
  - email (unique)
  - cpf (unique)
  - rg (unique, nullable)
  - nome_completo
  - data_nascimento
  - whatsapp
  - cep
  - logradouro
  - numero
  - complemento
  - bairro
  - cidade
  - estado
  - role (admin | gestor | cliente)
  - saldo_creditos (decimal, default 0)
  - created_at
  - updated_at

-- QUADRAS
courts
  - id (UUID, PK)
  - nome
  - tipo (society | beach_tennis | volei | futvolei)
  - ativa (boolean)
  - capacidade_maxima
  - created_at

-- GRADE HORÁRIA
schedules
  - id (UUID, PK)
  - court_id (FK -> courts)
  - dia_semana (0-6)
  - horario_inicio
  - horario_fim
  - valor_avulsa (decimal)
  - valor_mensalista (decimal)
  - ativo (boolean)

-- RESERVAS
reservations
  - id (UUID, PK)
  - user_id (FK -> users)
  - court_id (FK -> courts)
  - data
  - horario_inicio
  - horario_fim
  - tipo (avulsa | mensalista | recorrente)
  - valor_total (decimal)
  - observacoes (text, max 500)
  - status (pendente | confirmada | cancelada | concluida)
  - created_at
  - updated_at

-- TURMAS AUTÔNOMAS
teams
  - id (UUID, PK)
  - user_id (FK -> users)           # Dono da turma
  - nome
  - descricao
  - created_at
  - updated_at

-- MEMBROS DAS TURMAS
team_members
  - id (UUID, PK)
  - team_id (FK -> teams)
  - nome
  - whatsapp
  - email
  - tipo (fixo | variavel)
  - created_at

-- PARTICIPANTES DE RESERVAS
reservation_participants
  - id (UUID, PK)
  - reservation_id (FK -> reservations)
  - user_id (FK -> users, nullable)  # Null se não tem conta
  - team_member_id (FK -> team_members, nullable)
  - invitation_id (FK -> invitations, nullable)
  - nome
  - whatsapp
  - email
  - origem (turma | convite)
  - tipo_rateio (percentual | valor_fixo)
  - valor_percentual (decimal, nullable)
  - valor_fixo (decimal, nullable)
  - valor_final (decimal)
  - status_pagamento (pendente | pago | isento)
  - created_at

-- CONVITES PÚBLICOS
invitations
  - id (UUID, PK)
  - reservation_id (FK -> reservations)
  - token (unique)                   # Token único para o link
  - numero_vagas
  - valor_por_vaga (decimal)
  - descricao
  - vagas_preenchidas
  - ativo (boolean)
  - created_at
  - expires_at

-- ACEITES DE CONVITES
invitation_acceptances
  - id (UUID, PK)
  - invitation_id (FK -> invitations)
  - user_id (FK -> users)
  - status (aceito | cancelado)
  - created_at

-- PAGAMENTOS
payments
  - id (UUID, PK)
  - user_id (FK -> users)
  - reservation_id (FK -> reservations, nullable)
  - tipo (pix | cartao_credito | cartao_debito | credito | caucao)
  - valor (decimal)
  - status (pendente | aprovado | recusado | estornado)
  - asaas_payment_id
  - metadata (jsonb)
  - created_at
  - updated_at

-- TRANSAÇÕES (EXTRATO)
transactions
  - id (UUID, PK)
  - user_id (FK -> users)
  - tipo (credito | debito)
  - valor (decimal)
  - descricao
  - payment_id (FK -> payments, nullable)
  - reservation_id (FK -> reservations, nullable)
  - created_at

-- AVALIAÇÕES
reviews
  - id (UUID, PK)
  - reservation_id (FK -> reservations)
  - user_id (FK -> users)
  - nota (1-5)
  - comentario
  - created_at

-- INDICAÇÕES
referrals
  - id (UUID, PK)
  - referrer_id (FK -> users)
  - referred_id (FK -> users)
  - bonus_valor (decimal)
  - status (pendente | pago)
  - created_at
```

### Relacionamentos Chave

1. **User → Teams** (1:N)
   - Um usuário pode ter múltiplas turmas

2. **Team → TeamMembers** (1:N)
   - Uma turma tem vários membros

3. **Reservation → Team** (N:1, opcional)
   - Uma reserva pode vincular UMA turma
   - Relacionamento indireto via `reservation_participants`

4. **Reservation → Invitations** (1:N)
   - Uma reserva pode ter múltiplos convites (lotes diferentes)

5. **Invitation → InvitationAcceptances** (1:N)
   - Um convite pode ter vários aceites

6. **Reservation → ReservationParticipants** (1:N)
   - Participantes podem vir de turma OU convite

---

## 🎨 Design System (shadcn/ui)

### Componentes Base a Instalar

```bash
# Instalação shadcn/ui
npx shadcn-ui@latest init

# Componentes de formulário
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add textarea

# Componentes de layout
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator

# Componentes de feedback
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress

# Componentes de dados
npx shadcn-ui@latest add table
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar

# Componentes de navegação
npx shadcn-ui@latest add breadcrumb
npx shadcn-ui@latest add navigation-menu
```

### Paleta de Cores (Tailwind Config)

```css
:root {
  --primary: 142 76% 36%;        /* Verde #2D9F5D - Esportivo */
  --secondary: 217 91% 60%;      /* Azul #4F9CFF - Confiança */
  --accent: 25 95% 53%;          /* Laranja #FF6B35 - CTA */
  --success: 142 76% 36%;        /* Verde #2D9F5D */
  --warning: 45 93% 47%;         /* Amarelo #EAB308 */
  --error: 0 84% 60%;            /* Vermelho #EF4444 */
  --muted: 210 40% 96%;          /* Cinza #F5F5F5 */
  --dark: 0 0% 10%;              /* #1A1A1A */
}
```

---

## 🔐 Sistema de Autenticação e Autorização

### Autenticação Nativa Supabase

**Utilizaremos Supabase Auth nativo** com as seguintes funcionalidades:

- ✅ **Sign Up**: Cadastro com email + senha
- ✅ **Sign In**: Login com email ou CPF + senha
- ✅ **Password Recovery**: Recuperação de senha via email
- ✅ **Session Management**: Gerenciamento automático de sessão
- ✅ **JWT Tokens**: Tokens automáticos (access + refresh)
- ✅ **Server-Side Auth**: SSR com cookies seguros
- ✅ **Metadata**: Armazenamento de role em `user_metadata`

### Estrutura de Autenticação

```typescript
// Supabase Auth User
interface SupabaseUser {
  id: string;                    // UUID do Supabase Auth
  email: string;
  user_metadata: {
    role: 'admin' | 'gestor' | 'cliente';
    nome_completo: string;
  };
}

// Tabela users (perfil estendido)
interface UserProfile {
  id: string;                    // FK -> auth.users.id
  email: string;
  cpf: string;
  rg: string;
  nome_completo: string;
  role: 'admin' | 'gestor' | 'cliente';
  // ... outros campos
}
```

### Tipos de Usuários (Roles)

1. **admin**
   - Acesso total ao sistema (suporte técnico)
   - Gerenciamento de usuários
   - Configurações avançadas
   - Logs e auditoria

2. **gestor**
   - Proprietário da arena
   - Gerencia quadras e horários
   - Visualiza todas as reservas
   - Relatórios financeiros e gerenciais
   - Controle de bloqueios
   - Configurações da arena

3. **cliente**
   - Jogadores (organizadores e/ou convidados)
   - **Como organizador**: Cria reservas, gerencia turmas, cria convites
   - **Como convidado**: Aceita convites, visualiza jogos
   - **Ambos**: Compra créditos, visualiza histórico, perfil
   - Dashboard único com funcionalidades contextuais

### Políticas de RLS (Row Level Security)

**IMPORTANTE**: Usaremos `auth.uid()` (função nativa do Supabase) para identificar o usuário autenticado.

```sql
-- Helper function para obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE;

-- Políticas para Turmas
CREATE POLICY "Users can view their own teams"
  ON teams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
  ON teams FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para Reservas
CREATE POLICY "Users can view their reservations"
  ON reservations FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM reservation_participants
      WHERE reservation_id = reservations.id AND user_id = auth.uid()
    ) OR
    get_user_role() IN ('admin', 'gestor')
  );

CREATE POLICY "Clients can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id AND get_user_role() = 'cliente');

CREATE POLICY "Gestor can view all reservations"
  ON reservations FOR SELECT
  USING (get_user_role() IN ('admin', 'gestor'));

-- Políticas para Users (perfil)
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
  USING (get_user_role() = 'admin');

CREATE POLICY "Admin can manage all users"
  ON users FOR ALL
  USING (get_user_role() = 'admin');
```

---

## 🎯 Componentes Críticos do Sistema

### 1. Calendário de Reservas

**Responsabilidade**: Visualização e seleção de horários disponíveis

```typescript
// components/modules/core/reservas/CalendarioReservas.tsx

interface CalendarioReservasProps {
  courtId: string;
  onSelectSlot: (date: Date, slot: TimeSlot) => void;
}

Features:
- Visão mensal/semanal
- Horários disponíveis com preços
- Indicação visual de status (disponível, reservado, bloqueado)
- Responsivo (mobile-first)
```

### 2. Configurador de Rateio

**Responsabilidade**: Interface para configurar divisão de custos

```typescript
// components/modules/core/rateio/ConfiguradorRateio.tsx

interface ConfiguradorRateioProps {
  participants: Participant[];
  totalValue: number;
  onSave: (config: RateioConfig) => void;
}

Features:
- Toggle Percentual/Valor Fixo
- Validação em tempo real
- Indicador visual de progresso
- Botão "Dividir Igualmente"
- Cálculo automático
```

### 3. Gerenciador de Turmas

**Responsabilidade**: CRUD completo de turmas autônomas

```typescript
// components/modules/core/turmas/GerenciadorTurmas.tsx

Features:
- Lista de turmas cadastradas
- Formulário de criação/edição
- Gerenciamento de membros (fixo/variável)
- Modal de vínculo a reserva
- Histórico de jogos da turma
```

### 4. Landing Page de Convite

**Responsabilidade**: Página pública de aceite de convite

```typescript
// app/(public)/convite/[id]/page.tsx

Features:
- Design atrativo e responsivo
- Detalhes do jogo (quadra, data, hora, valor)
- Informações do organizador
- Botão destacado "Aceitar Convite"
- Formulário de cadastro simplificado
- Integração com pagamento
```

### 5. Sistema de Pagamento

**Responsabilidade**: Processar pagamentos via Asaas

```typescript
// components/shared/pagamento/FormPagamento.tsx

Features:
- Seletor de método (Pix, Cartão, Créditos)
- Formulário de cartão
- QR Code para Pix
- Validação de cartão
- Feedback de status
```

---

## 🔄 Fluxos de Dados (React Query)

### Queries (Leitura)

```typescript
// hooks/core/useReservas.ts
export const useReservas = (userId: string) => {
  return useQuery({
    queryKey: ['reservas', userId],
    queryFn: () => reservasService.getByUser(userId),
  });
};

// hooks/core/useTurmas.ts
export const useTurmas = (userId: string) => {
  return useQuery({
    queryKey: ['turmas', userId],
    queryFn: () => turmasService.getByUser(userId),
  });
};
```

### Mutations (Escrita)

```typescript
// hooks/core/useCreateReserva.ts
export const useCreateReserva = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservaInput) =>
      reservasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Reserva criada com sucesso!');
    },
  });
};
```

---

## 📝 Schemas de Validação (Zod)

### Exemplo: Schema de Turma

```typescript
// lib/validations/turma.schema.ts

export const teamMemberSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\d{11}$/, 'WhatsApp inválido'),
  email: z.string().email('Email inválido').optional(),
  tipo: z.enum(['fixo', 'variavel']),
});

export const createTeamSchema = z.object({
  nome: z.string().min(3, 'Nome da turma obrigatório'),
  descricao: z.string().optional(),
  members: z.array(teamMemberSchema).min(1, 'Adicione pelo menos 1 membro'),
});
```

### Exemplo: Schema de Rateio

```typescript
// lib/validations/rateio.schema.ts

export const rateioPercentualSchema = z.object({
  tipo: z.literal('percentual'),
  valores: z.array(z.object({
    participante_id: z.string().uuid(),
    percentual: z.number().min(0).max(100),
  }))
  .refine(
    (valores) => {
      const soma = valores.reduce((acc, v) => acc + v.percentual, 0);
      return soma === 100;
    },
    { message: 'A soma dos percentuais deve ser exatamente 100%' }
  ),
});

export const rateioValorFixoSchema = z.object({
  tipo: z.literal('valor_fixo'),
  valor_total: z.number().positive(),
  valores: z.array(z.object({
    participante_id: z.string().uuid(),
    valor: z.number().min(0),
  }))
  .refine(
    (valores) => {
      const soma = valores.reduce((acc, v) => acc + v.valor, 0);
      return soma <= valores[0]?.valor_total;
    },
    { message: 'A soma dos valores não pode exceder o total da reserva' }
  ),
});
```

---

## 🚀 Ordem de Implementação (Fases)

### **FASE 1: Setup e Infraestrutura** (1-2 semanas)

#### 1.1 Configuração Inicial
- [ ] Migrar de static export para SSR
- [ ] Remover `output: 'export'` do next.config.js
- [ ] Instalar dependências (Supabase, React Query, Zod, etc)
- [ ] Configurar shadcn/ui
- [ ] Estrutura de pastas modular

#### 1.2 Supabase Setup
- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Configurar Supabase CLI local
- [ ] Criar migrations iniciais (schema base)
- [ ] Configurar Row Level Security (RLS)
- [ ] Gerar tipos TypeScript do banco

#### 1.3 Autenticação Base
- [ ] Tela de login
- [ ] Tela de cadastro (básica)
- [ ] Recuperação de senha
- [ ] Middleware de autenticação
- [ ] Proteção de rotas
- [ ] Hooks de autenticação

---

### **FASE 2: Sistema de Usuários e Cadastro** (1 semana)

#### 2.1 Cadastro Completo
- [ ] Formulário com todos os campos (CPF, RG, etc)
- [ ] Integração com ViaCEP
- [ ] Validação de CPF/RG únicos
- [ ] Schemas Zod de validação
- [ ] Componentes customizados (InputCPF, InputCEP, etc)

#### 2.2 Perfil e Dashboards Base
- [ ] Layout com Sidebar
- [ ] Header com menu de usuário
- [ ] Dashboard do Cliente (estrutura)
- [ ] Dashboard do Gestor (estrutura)
- [ ] Tela de perfil
- [ ] Edição de dados

---

### **FASE 3: Sistema de Quadras e Grade Horária** (1 semana)

#### 3.1 Gestão de Quadras (Gestor)
- [ ] CRUD de quadras
- [ ] Configuração de grade horária
- [ ] Definição de preços por horário
- [ ] Ativação/desativação de horários

#### 3.2 Bloqueio de Horários
- [ ] Interface de bloqueio
- [ ] Bloqueio por período
- [ ] Histórico de bloqueios

---

### **FASE 4: Sistema de Reservas** (2 semanas)

#### 4.1 Criação de Reserva
- [ ] Componente CalendarioReservas
- [ ] Seleção de quadra, data, horário
- [ ] Exibição de preços dinâmicos
- [ ] Validação de conflitos
- [ ] Campo de observações
- [ ] 3 tipos de reserva (Avulsa, Mensalista, Recorrente)

#### 4.2 Gestão de Reservas
- [ ] Lista de reservas do cliente
- [ ] Filtros (futuras, passadas, canceladas)
- [ ] Página "Gerenciar Reserva"
- [ ] Cancelamento de reserva
- [ ] Status de reserva

#### 4.3 Agenda do Gestor
- [ ] Visualização semanal/mensal
- [ ] Código de cores por status
- [ ] Filtros avançados
- [ ] Detalhamento de reserva
- [ ] Criação manual de reserva

---

### **FASE 5: Sistema de Turmas Autônomas** (2 semanas)

#### 5.1 CRUD de Turmas
- [ ] Tela "Minhas Turmas"
- [ ] Formulário de criação
- [ ] Gerenciador de membros
- [ ] Toggle fixo/variável
- [ ] Edição e exclusão
- [ ] Histórico da turma

#### 5.2 Vínculo Turma-Reserva
- [ ] Modal "Vincular Turma Existente"
- [ ] Seleção de turma (dropdown)
- [ ] Carregamento automático de membros
- [ ] Criação de turma durante reserva
- [ ] Desvincular turma
- [ ] Validação (1 turma por reserva)

---

### **FASE 6: Sistema de Rateio Flexível** (1-2 semanas)

#### 6.1 Configurador de Rateio
- [ ] Componente ConfiguradorRateio
- [ ] Toggle Percentual/Valor Fixo
- [ ] InputRateioPercentual
- [ ] InputRateioValorFixo
- [ ] Validação em tempo real
- [ ] Indicador visual de progresso
- [ ] Botão "Dividir Igualmente"
- [ ] Resumo financeiro

#### 6.2 Lógica de Rateio
- [ ] Service de cálculo
- [ ] Schemas de validação
- [ ] Persistência no banco
- [ ] Atualização de valores

---

### **FASE 7: Sistema de Convites Públicos** (2 semanas)

#### 7.1 Criação de Convites
- [ ] Formulário de criação
- [ ] Geração de token único
- [ ] Múltiplos lotes por reserva
- [ ] Link compartilhável
- [ ] Lista de convites criados
- [ ] Ativar/desativar convite

#### 7.2 Landing Page de Convite
- [ ] Rota pública /convite/[id]
- [ ] Design atrativo
- [ ] Detalhes do jogo
- [ ] Botão "Aceitar Convite"
- [ ] Formulário de cadastro simplificado
- [ ] Redirect para pagamento

#### 7.3 Fluxo de Aceite
- [ ] Verificação de vagas
- [ ] Criação de perfil (se novo)
- [ ] Adição como participante
- [ ] Atualização de vagas preenchidas
- [ ] Notificação ao organizador

---

### **FASE 8: Sistema de Participantes** (1 semana)

#### 8.1 Gestão de Participantes
- [ ] Lista de participantes na reserva
- [ ] Origem (turma ou convite)
- [ ] Status de pagamento
- [ ] Resumo financeiro
- [ ] Valores individuais

---

### **FASE 9: Sistema de Pagamentos** (2 semanas)

#### 9.1 Integração Asaas
- [ ] Service do Asaas
- [ ] Pagamento Pix (QR Code)
- [ ] Pagamento Cartão
- [ ] Pré-autorização (caução)
- [ ] Webhooks
- [ ] Atualização de status

#### 9.2 Sistema de Créditos
- [ ] Saldo de créditos
- [ ] Compra de créditos
- [ ] Uso de créditos em pagamentos
- [ ] Extrato (transactions)
- [ ] Gestão de saldo

#### 9.3 Fechamento de Jogos
- [ ] Cron job (2h antes)
- [ ] Consolidação de pagamentos
- [ ] Débito do organizador
- [ ] Liberação de caução
- [ ] Comprovante financeiro

---

### **FASE 10: Dashboard do Cliente (Contexto Unificado)** (1 semana)

#### 10.1 Dashboard Único do Cliente
- [ ] Dashboard contextual (exibe organizador E convidado)
- [ ] Seção "Minhas Reservas" (reservas criadas)
- [ ] Seção "Meus Jogos" (convites aceitos)
- [ ] Próximos jogos (todos)
- [ ] Histórico completo
- [ ] Meu saldo de créditos
- [ ] Comprar créditos
- [ ] Estatísticas unificadas

---

### **FASE 11: Notificações WhatsApp** (1 semana)

#### 11.1 Integração WhatsApp
- [ ] Service WhatsApp Business API
- [ ] Templates de mensagens
- [ ] Lembrete 45min antes
- [ ] Lembrete 10min antes
- [ ] Notificação de aceite
- [ ] Solicitação de avaliação
- [ ] Edge Functions para envio

---

### **FASE 12: Sistema de Avaliações** (1 semana)

#### 12.1 Avaliações de Jogos
- [ ] Formulário de avaliação
- [ ] Envio automático pós-jogo
- [ ] Armazenamento de reviews
- [ ] Visualização de avaliações
- [ ] Relatório para gestor

---

### **FASE 13: Relatórios e Financeiro (Gestor)** (1-2 semanas)

#### 13.1 Relatórios Gerenciais
- [ ] Relatório de Faturamento
- [ ] Relatório de Participação
- [ ] Relatório de Convites
- [ ] Relatório de Avaliações
- [ ] Relatório de Turmas
- [ ] Exportação PDF/Excel

#### 13.2 Controle Financeiro
- [ ] Lista de clientes com saldo devedor
- [ ] Extrato por cliente
- [ ] Registro de pagamentos manuais
- [ ] Relatório de inadimplência

---

### **FASE 14: Refinamentos e Testes** (2 semanas)

#### 14.1 UX/UI
- [ ] Loading states
- [ ] Skeleton screens
- [ ] Mensagens de erro
- [ ] Confirmações
- [ ] Tooltips
- [ ] Acessibilidade

#### 14.2 Performance
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Image optimization
- [ ] Cache do React Query
- [ ] Otimização de queries

#### 14.3 Testes
- [ ] Testes unitários (utils)
- [ ] Testes de componentes
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)

---

### **FASE 15: Deploy e Monitoramento** (1 semana)

#### 15.1 Deploy
- [ ] Configuração Cloudflare Pages
- [ ] Variáveis de ambiente
- [ ] CI/CD
- [ ] Preview environments
- [ ] Deploy de produção

#### 15.2 Monitoramento
- [ ] Error tracking (Sentry)
- [ ] Analytics
- [ ] Performance monitoring
- [ ] Logs

---

## 🎯 Priorização (MoSCoW)

### Must Have (MVP - Fases 1-9)
- Autenticação completa
- CRUD de quadras
- Sistema de reservas
- Turmas autônomas
- Rateio flexível
- Convites públicos
- Pagamentos (Asaas)
- Dashboard cliente e gestor

### Should Have (Pós-MVP)
- WhatsApp notifications
- Sistema de avaliações
- Relatórios avançados
- Dashboard convidado completo

### Could Have (Futuro)
- Programa de indicação
- Módulo Escolinha
- Módulo Day Use
- Gamificação
- App mobile

### Won't Have (Não agora)
- Integrações com redes sociais
- Chat em tempo real
- Transmissão de jogos

---

## 📊 Métricas de Sucesso

### Performance
- Tempo de resposta < 2s (95% das requisições)
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

### Usabilidade
- Taxa de conversão cadastro > 70%
- Taxa de conclusão de reserva > 85%
- NPS > 8

### Técnicas
- Cobertura de testes > 80%
- Zero erros críticos em produção
- Uptime > 99%

---

## 🔧 Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar desenvolvimento local
npm run dev

# Supabase local
supabase start
supabase db reset
supabase gen types typescript --local > src/types/database.types.ts

# Build
npm run build

# Testes
npm run test
npm run test:e2e

# Lint
npm run lint
```

---

## 📚 Documentação Adicional

- [PRD Completo](./SETUP/PRD.md)
- [Prompt Técnico](./SETUP/PROMPT.md)
- [Guia de Deploy](./DEPLOY.md)
- [CLAUDE.md](./CLAUDE.md)

---

## 🎨 Padrões de Código

### Nomenclatura
- Componentes: PascalCase (`CalendarioReservas.tsx`)
- Funções: camelCase (`createReserva()`)
- Constantes: UPPER_SNAKE_CASE (`MAX_PARTICIPANTS`)
- Types/Interfaces: PascalCase (`ReservaType`)

### Organização de Imports
```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. Libs externas
import { useQuery } from '@tanstack/react-query';

// 3. Componentes
import { Button } from '@/components/ui/button';

// 4. Hooks
import { useAuth } from '@/hooks/auth/useAuth';

// 5. Services
import { reservasService } from '@/services/core/reservas.service';

// 6. Types
import type { Reserva } from '@/types/core.types';

// 7. Utils
import { formatCurrency } from '@/lib/utils/currency';
```

### Componentes React
```typescript
// Preferir function components com TypeScript
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function Component({ prop1, prop2 = 0 }: ComponentProps) {
  // ...
}
```

---

## 🚨 Pontos Críticos de Atenção

### 1. Turmas Autônomas
- Turma é independente de reserva
- Uma reserva = no máximo 1 turma
- Membros fixos vs variáveis

### 2. Rateio Flexível
- Dois modos: percentual ou valor fixo
- Validações rigorosas
- Organizador paga diferença (modo valor fixo)

### 3. Convites Públicos
- Link único por lote
- Múltiplos lotes por reserva
- Auto-criação de perfil ao aceitar

### 4. Sistema Financeiro
- Caução com pré-autorização
- Débito parcial conforme pagamentos
- Fechamento automático do jogo

### 5. Performance
- React Query para cache
- Lazy loading de módulos
- Optimistic updates

---

## 🔑 Sistema de Permissões por Role

```typescript
// lib/permissions.ts

export const PERMISSIONS = {
  admin: {
    canAccessAll: true,
    canManageUsers: true,
    canViewLogs: true,
    canManageCourts: true,
    canViewAllReservations: true,
    canManageSettings: true,
    canAccessAdminPanel: true,
  },
  gestor: {
    canAccessAll: false,
    canManageUsers: false,
    canViewLogs: false,
    canManageCourts: true,
    canViewAllReservations: true,
    canManageSettings: true,
    canViewReports: true,
    canBlockSchedules: true,
    canManageFinancial: true,
  },
  cliente: {
    canAccessAll: false,
    canCreateReservations: true,
    canManageOwnTeams: true,
    canCreateInvitations: true,
    canAcceptInvitations: true,
    canBuyCredits: true,
    canViewOwnHistory: true,
    canViewOwnReservations: true,
    canViewOwnGames: true, // Jogos onde foi convidado
  },
};
```

---

## ✅ Próximos Passos Imediatos

1. **Decisão de Stack**: Confirmar versões e bibliotecas
2. **Setup do Projeto**: Migrar de static para SSR
3. **Configurar Supabase**: Criar projeto e migrations
4. **Instalar shadcn/ui**: Configurar design system
5. **Estrutura de Pastas**: Criar arquitetura modular
6. **Autenticação**: Implementar login/cadastro básico (3 roles: admin, gestor, cliente)

---

## 🎯 Quer que eu comece a implementação?

Posso começar por:

**Opção A**: Migrar para SSR e instalar todas as dependências
**Opção B**: Criar a estrutura de pastas modular primeiro
**Opção C**: Configurar Supabase e criar as migrations do banco
**Opção D**: Outro caminho que você preferir

**Qual opção você quer seguir?**

---

**Documento criado em**: 2025-10-21
**Versão**: 1.1
**Última atualização**: 2025-10-21 (Corrigido: 3 roles - admin, gestor, cliente)
