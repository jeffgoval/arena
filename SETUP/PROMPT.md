Prompt para Criação do Sistema Arena Dona Santa

Vou criar uma aplicação web completa de gestão de arena esportiva com os seguintes requisitos:



🎯 Visão Geral do Projeto

Desenvolver o Sistema Arena Dona Santa - uma plataforma web responsiva para gestão completa de reservas de quadras esportivas, com sistema robusto de gestão de turmas, convites e rateio flexível de custos. O sistema terá 3 módulos principais: CORE (reservas), Escolinha e Day Use.



🏗️ Arquitetura e Stack Tecnológica

Frontend

&nbsp;	• Framework: Next.js 14+ (App Router)

&nbsp;	• Linguagem: TypeScript

&nbsp;	• Estilização: Tailwind CSS

&nbsp;	• Componentes: shadcn/ui

&nbsp;	• State Management: React Query (TanStack Query)

&nbsp;	• Validação: Zod

&nbsp;	• Formatação: React Hook Form

Backend

&nbsp;	• BaaS: Supabase

&nbsp;	• Banco de Dados: PostgreSQL (Supabase)

&nbsp;	• Autenticação: Supabase Auth

&nbsp;	• Storage: Supabase Storage

&nbsp;	• Functions: Supabase Edge Functions

Deploy e Infraestrutura

&nbsp;	• Hospedagem: Cloudflare Pages

&nbsp;	• CDN: Cloudflare (automático)

&nbsp;	• Environment: Edge Runtime

Integrações

&nbsp;	• Pagamentos: Asaas (gateway brasileiro)

&nbsp;	• WhatsApp: WhatsApp Business API

&nbsp;	• CEP: API ViaCEP

&nbsp;	• Email: Resend ou SendGrid

&nbsp;	

📁 Estrutura de Pastas (Arquitetura Modular)

arena-dona-santa/

├── src/

│   ├── app/                          # Next.js App Router

│   │   ├── (auth)/                   # Grupo de rotas autenticadas

│   │   │   ├── login/

│   │   │   └── cadastro/

│   │   ├── (dashboard)/              # Grupo de rotas com layout dashboard

│   │   │   ── cliente/

│   │   │   └── gestor/

│   │   ├── (public)/                 # Rotas públicas

│   │   │   ├── reservas/

│   │   │   ├── convite/\[id]/

│   │   │   └── day-use/

│   │   ├── api/                      # API Routes

│   │   └── layout.tsx

│   │

│   ├── components/                   # Componentes React

│   │   ├── ui/                       # shadcn/ui components

│   │   ├── modules/                  # Componentes por módulo

│   │   │   ├── core/

│   │   │   │   ├── reservas/

│   │   │   │   ├── turmas/

│   │   │   │   ├── convites/

│   │   │   │   └── rateio/

│   │   │   ├── escolinha/

│   │   │   │   ├── turmas/

│   │   │   │   ├── alunos/

│   │   │   │   └── presenca/

│   │   │   └── dayuse/

│   │   │       ├── pacotes/

│   │   │       └── checkin/

│   │   ├── shared/                   # Componentes compartilhados

│   │   │   ├── Header.tsx

│   │   │   ├── Sidebar.tsx

│   │   │   ├── Calendar.tsx

│   │   │   └── PaymentForm.tsx

│   │   └── layouts/

│   │

│   ├── lib/                          # Bibliotecas e utilitários

│   │   ├── supabase/

│   │   │   ├── client.ts

│   │   │   ├── server.ts

│   │   │   └── middleware.ts

│   │   ├── validations/              # Schemas Zod

│   │   │   ├── user.schema.ts

│   │   │   ├── reserva.schema.ts

│   │   │   └── turma.schema.ts

│   │   ├── utils/

│   │   │   ├── currency.ts

│   │   │   ├── date.ts

│   │   │   └── cpf.ts

│   │   └── constants.ts

│   │

│   ├── hooks/                        # Custom React Hooks

│   │   ├── useReservas.ts

│   │   ├── useTurmas.ts

│   │   ├── useConvites.ts

│   │   └── useAuth.ts

│   │

│   ├── services/                     # Serviços de API

│   │   ├── core/

│   │   │   ├── reservas.service.ts

│   │   │   ├── turmas.service.ts

│   │   │   └── convites.service.ts

│   │   ├── escolinha/

│   │   │   ├── turmas.service.ts

│   │   │   └── alunos.service.ts

│   │   ├── dayuse/

│   │   │   └── pacotes.service.ts

│   │   ├── integrations/

│   │   │   ├── asaas.service.ts

│   │   │   ├── whatsapp.service.ts

│   │   │   └── viacep.service.ts

│   │   └── auth.service.ts

│   │

│   ├── types/                        # TypeScript types

│   │   ├── database.types.ts         # Gerado pelo Supabase

│   │   ├── core.types.ts

│   │   ├── escolinha.types.ts

│   │   └── dayuse.types.ts

│   │

│   └── styles/

│       └── globals.css

│

├── supabase/                         # Configurações Supabase

│   ├── functions/                    # Edge Functions

│   │   ├── process-payment/

│   │   ├── send-whatsapp/

│   │   └── close-game/

│   ├── migrations/                   # SQL Migrations

│   │   ├── 001\_initial\_schema.sql

│   │   ├── 002\_core\_tables.sql

│   │   ├── 003\_escolinha\_tables.sql

│   │   └── 004\_dayuse\_tables.sql

│   └── seed.sql                      # Dados iniciais

│

├── public/

│   ├── images/

│   └── icons/

│

├── .env.local

├── .env.example

├── next.config.js

├── tailwind.config.ts

├── tsconfig.json

└── package.json

🗄️ Estrutura do Banco de Dados

Por favor, crie as seguintes tabelas no Supabase PostgreSQL seguindo o PRD completo fornecido:

Módulo CORE

&nbsp;	• users - usuários (clientes, gestor)

&nbsp;	• courts - quadras

&nbsp;	• schedules - grade horária

&nbsp;	• reservations - reservas

&nbsp;	• teams - turmas autônomas

&nbsp;	• team\_members - membros das turmas

&nbsp;	• reservation\_participants - participantes de cada reserva

&nbsp;	• invitations - convites públicos

&nbsp;	• invitation\_acceptances - aceites de convite

&nbsp;	• payments - pagamentos

&nbsp;	• transactions - extrato/histórico financeiro

&nbsp;	• reviews - avaliações

&nbsp;	• referrals - indicações

Módulo Escolinha

&nbsp;	• school\_classes - turmas da escolinha

&nbsp;	• students - alunos

&nbsp;	• class\_enrollments - matrículas

&nbsp;	• attendance - presença

&nbsp;	• school\_payments - mensalidades

&nbsp;	• teachers - professores

&nbsp;	• teacher\_commissions - comissões

Módulo Day Use

&nbsp;	• day\_use\_packages - pacotes

&nbsp;	• day\_use\_addons - add-ons

&nbsp;	• day\_use\_reservations - reservas de day use

&nbsp;	• day\_use\_reservation\_addons - add-ons da reserva

&nbsp;	• day\_use\_court\_bookings - quadras no day use

&nbsp;	• day\_use\_extra\_consumption - consumo extra

&nbsp;	• day\_use\_capacity\_control - controle de capacidade

🎨 Design System (shadcn/ui)

Configure e instale os seguintes componentes do shadcn/ui:

npx shadcn-ui@latest init

npx shadcn-ui@latest add button

npx shadcn-ui@latest add card

npx shadcn-ui@latest add form

npx shadcn-ui@latest add input

npx shadcn-ui@latest add select

npx shadcn-ui@latest add calendar

npx shadcn-ui@latest add dialog

npx shadcn-ui@latest add dropdown-menu

npx shadcn-ui@latest add table

npx shadcn-ui@latest add tabs

npx shadcn-ui@latest add toast

npx shadcn-ui@latest add badge

npx shadcn-ui@latest add checkbox

npx shadcn-ui@latest add radio-group

npx shadcn-ui@latest add switch

npx shadcn-ui@latest add textarea

npx shadcn-ui@latest add avatar

npx shadcn-ui@latest add separator

Paleta de Cores

:root {

&nbsp; --primary: 142 76% 36%;        /\* Verde esportivo \*/

&nbsp; --secondary: 217 91% 60%;      /\* Azul confiança \*/

&nbsp; --accent: 25 95% 53%;          /\* Laranja energia \*/

&nbsp; --success: 142 76% 36%;        /\* Verde confirmado \*/

&nbsp; --warning: 45 93% 47%;         /\* Amarelo atenção \*/

&nbsp; --error: 0 84% 60%;            /\* Vermelho erro \*/

&nbsp; --muted: 210 40% 96%;          /\* Cinza claro \*/

}

🔐 Autenticação e Autorização

Implemente 3 tipos de usuários com permissões distintas:

&nbsp;	1. Cliente:

&nbsp;		○ Criar reservas

&nbsp;		○ Gerenciar turmas

&nbsp;		○ Criar convites

&nbsp;		○ Ver dashboard pessoal

&nbsp;		○ Aceitar convites

&nbsp;		○ Ver próximos jogos

&nbsp;		○ Comprar créditos

&nbsp;		○ Dashboard simplificado

&nbsp;	2. Gestor:

&nbsp;		○ Acesso completo ao sistema

&nbsp;		○ Cadastrar quadras

&nbsp;		○ Ver todas as reservas

&nbsp;		○ Relatórios gerenciais

&nbsp;		○ Gerenciar escolinha e day use

Utilize Row Level Security (RLS) do Supabase para proteger os dados.



📋 Funcionalidades Principais a Implementar

Fase 1 - MVP (Prioridade Must Have)

1\. Sistema de Autenticação

&nbsp;	• \[ ] Cadastro completo (CPF, RG, CEP com autopreenchimento ViaCEP)

&nbsp;	• \[ ] Login (email/CPF + senha)

&nbsp;	• \[ ] Recuperação de senha

&nbsp;	• \[ ] Validação de CPF e RG únicos

2\. Sistema de Reservas (US-001 a US-003)

&nbsp;	• \[ ] Seleção de quadra, data, horário

&nbsp;	• \[ ] Campo de observações (max 500 chars)

&nbsp;	• \[ ] Três tipos: Avulsa, Mensalista, Recorrente

&nbsp;	• \[ ] Integração com Asaas (Pix, cartão, caução)

&nbsp;	• \[ ] Validação de conflitos

3\. Sistema de Turmas Autônomas (US-004 a US-006)

&nbsp;	• \[ ] Criar turma independente (aba "Minhas Turmas")

&nbsp;	• \[ ] Membros fixos vs variáveis

&nbsp;	• \[ ] Vincular turma a reserva

&nbsp;	• \[ ] Criar turma durante reserva

&nbsp;	• \[ ] Múltiplas turmas por organizador

4\. Sistema de Rateio Flexível (US-007)

&nbsp;	• \[ ] Modo Percentual (soma = 100%)

&nbsp;	• \[ ] Modo Valor Fixo (soma ≤ valor reserva)

&nbsp;	• \[ ] Interface com toggle e validações em tempo real

&nbsp;	• \[ ] Botão "Dividir Igualmente"

&nbsp;	• \[ ] Indicadores visuais de progresso

5\. Sistema de Convites Públicos (US-008 a US-010)

&nbsp;	• \[ ] Criar convites com link único

&nbsp;	• \[ ] Múltiplos lotes por reserva

&nbsp;	• \[ ] Página de aceite de convite (landing page)

&nbsp;	• \[ ] Cadastro simplificado do convidado

&nbsp;	• \[ ] Painel do convidado

&nbsp;	• \[ ] Sistema de compra de créditos

6\. Painel do Cliente (US-011 a US-013)

&nbsp;	• \[ ] Dashboard com cards de acesso rápido

&nbsp;	• \[ ] Aba "Minhas Reservas"

&nbsp;	• \[ ] Página "Gerenciar Reserva" (completa)

&nbsp;	• \[ ] Aba "Minhas Turmas"

&nbsp;	• \[ ] Aba "Convites Criados"

7\. Painel do Gestor (US-014 a US-020)

&nbsp;	• \[ ] Cadastro de quadras e horários

&nbsp;	• \[ ] Agenda geral (visão semanal)

&nbsp;	• \[ ] Gerenciar reservas

&nbsp;	• \[ ] Bloqueio de horários

&nbsp;	• \[ ] Relatórios básicos

8\. Notificações WhatsApp (US-021 a US-024)

&nbsp;	• \[ ] Lembretes automáticos (45min, 10min antes)

&nbsp;	• \[ ] Notificação de aceite de convite

&nbsp;	• \[ ] Avaliações pós-jogo

&nbsp;	• \[ ] Integração com WhatsApp Business API

🔌 Integrações Necessárias

1\. Asaas (Pagamentos)

// src/services/integrations/asaas.service.ts

export class AsaasService {

&nbsp; // Pix

&nbsp; async createPixPayment()

&nbsp; // Cartão de crédito

&nbsp; async createCreditCardPayment()

&nbsp; // Caução (pré-autorização)

&nbsp; async createAuthorization()

&nbsp; async capturePartialAmount()

&nbsp; // Webhooks

&nbsp; async handleWebhook()

}

2\. WhatsApp Business API

// src/services/integrations/whatsapp.service.ts

export class WhatsAppService {

&nbsp; async sendTemplateMessage()

&nbsp; async sendInviteNotification()

&nbsp; async sendReminder()

&nbsp; async sendReviewRequest()

}

3\. ViaCEP

// src/services/integrations/viacep.service.ts

export class ViaCepService {

&nbsp; async fetchAddress(cep: string)

}

🎯 Componentes Críticos a Criar

1\. Calendário de Reservas

// src/components/modules/core/reservas/CalendarioReservas.tsx

\- Visualização mensal/semanal

\- Marcação de horários disponíveis

\- Indicação de preços dinâmicos

\- Bloqueios visuais

2\. Configurador de Rateio

// src/components/modules/core/rateio/ConfiguradorRateio.tsx

\- Toggle Percentual/Valor Fixo

\- Lista dinâmica de membros

\- Validação em tempo real

\- Indicadores visuais de progresso

3\. Gerenciador de Turmas

// src/components/modules/core/turmas/GerenciadorTurmas.tsx

\- Lista de turmas cadastradas

\- Formulário de criação

\- Marcação fixo/variável

\- Modal de vínculo a reserva

4\. Landing Page de Convite

// src/app/(public)/convite/\[id]/page.tsx

\- Design atrativo e responsivo

\- Detalhes do jogo

\- Botão destacado "Aceitar Convite"

\- Formulário de cadastro simplificado

🔄 Fluxos de Estado (React Query)

Configure queries e mutations para:

// Reservas

useReservas()

useCreateReserva()

useUpdateReserva()

useCancelReserva()

// Turmas

useTurmas()

useCreateTurma()

useVincularTurma()

useDesvincularTurma()

// Convites

useConvites()

useCreateConvite()

useAcceptConvite()

// Pagamentos

useCreatePayment()

usePaymentStatus()

🧪 Testes

Configure testes para:

&nbsp;	• \[ ] Validações de formulário (Zod)

&nbsp;	• \[ ] Cálculos de rateio

&nbsp;	• \[ ] Validação de CPF/RG

&nbsp;	• \[ ] Integração ViaCEP

&nbsp;	• \[ ] Componentes críticos (Storybook)

&nbsp;	

🚀 Configuração para Cloudflare Pages

next.config.js

/\*\* @type {import('next').NextConfig} \*/

const nextConfig = {

&nbsp; output: 'export',  // Para Cloudflare Pages

&nbsp; images: {

&nbsp;   unoptimized: true,

&nbsp;   domains: \['supabase.co'],

&nbsp; },

&nbsp; // Configurações específicas do Cloudflare

}

wrangler.toml (se usar Workers)

name = "arena-dona-santa"

compatibility\_date = "2024-01-01"

pages\_build\_output\_dir = "out"

📝 Variáveis de Ambiente

Crie .env.example:

\# Supabase

NEXT\_PUBLIC\_SUPABASE\_URL=

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=

SUPABASE\_SERVICE\_ROLE\_KEY=

\# Asaas

ASAAS\_API\_KEY=

ASAAS\_WALLET\_ID=

\# WhatsApp

WHATSAPP\_API\_TOKEN=

WHATSAPP\_PHONE\_NUMBER\_ID=

\# ViaCEP (público, sem chave)

\# App

NEXT\_PUBLIC\_APP\_URL=

📱 Responsividade

Garanta comportamento mobile-first:

&nbsp;	• Mobile (320px - 767px): navegação bottom tabs, cards full-width

&nbsp;	• Tablet (768px - 1023px): sidebar colapsável, grid 2 colunas

&nbsp;	• Desktop (1024px+): sidebar fixa, grid 3-4 colunas

⚡ Performance

&nbsp;	• Lazy loading de módulos

&nbsp;	• Image optimization

&nbsp;	• Code splitting por rota

&nbsp;	• React Query com cache

&nbsp;	• Supabase realtime apenas onde necessário

🎨 UX/UI Crítico

&nbsp;	1. Feedback visual imediato para todas as ações

&nbsp;	2. Loading states com skeleton screens

&nbsp;	3. Mensagens de erro claras em português

&nbsp;	4. Confirmações para ações destrutivas

&nbsp;	5. Tooltips para ajuda contextual

&nbsp;	

📦 Instalação e Setup Inicial

\# Criar projeto Next.js

npx create-next-app@latest arena-dona-santa --typescript --tailwind --app

\# Instalar dependências principais

npm install @supabase/supabase-js

npm install @tanstack/react-query

npm install zod react-hook-form @hookform/resolvers

npm install date-fns lucide-react

npm install clsx tailwind-merge

\# Supabase CLI

npm install -g supabase

\# Inicializar Supabase

supabase init

supabase start

🎯 Ordem de Implementação Sugerida

&nbsp;	1. Setup inicial (Next.js + Tailwind + shadcn/ui)

&nbsp;	2. Configuração Supabase (migrations + RLS)

&nbsp;	3. Autenticação (login, cadastro, recuperação)

&nbsp;	4. Integração ViaCEP (autopreenchimento endereço)

&nbsp;	5. Sistema de Reservas (seleção, calendário, pagamento)

&nbsp;	6. Sistema de Turmas (CRUD completo)

&nbsp;	7. Sistema de Rateio (interface + lógica)

&nbsp;	8. Sistema de Convites (criação + aceite)

&nbsp;	9. Painéis (organizador, convidado, gestor)

&nbsp;	10. Integrações (Asaas, WhatsApp)

&nbsp;	11. Testes e refinamentos

&nbsp;	

📚 Documentação a Gerar

Durante o desenvolvimento, crie:

&nbsp;	• \[ ] README.md completo

&nbsp;	• \[ ] Documentação de componentes (Storybook)

&nbsp;	• \[ ] Guia de contribuição

&nbsp;	• \[ ] Documentação de API (endpoints)

&nbsp;	• \[ ] Manual de deploy



🚀 Comando para Iniciar

Por favor, comece criando a estrutura base do projeto seguindo esta ordem:

&nbsp;	1. Inicializar Next.js com TypeScript e Tailwind

&nbsp;	2. Configurar shadcn/ui com os componentes listados

&nbsp;	3. Criar estrutura de pastas modular

&nbsp;	4. Configurar Supabase e criar as migrations do banco

&nbsp;	5. Implementar sistema de autenticação

&nbsp;	6. Criar componentes base do sistema de reservas

Foque em código limpo, componentizado e reutilizável. Cada módulo (Core, Escolinha, Day Use) deve ser independente mas integrado.



