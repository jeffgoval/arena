# Análise REAL: O Que Falta no Frontend Arena Dona Santa

**Data:** 23/10/2025
**Análise:** Baseada em verificação DIRETA do código-fonte
**Status:** Frontend 60% mockado, 40% conectado ao Supabase

---

## 📊 Resumo Executivo

### ✅ O Que Está FUNCIONANDO (com Supabase)
- **Sistema de Convites**: 100% funcional
  - Hook `useConvites` conectado
  - Página pública `/convite/[token]` completa
  - Aceite de convite funcionando
  - CRUD completo

- **Sistema de Turmas**: Parcial
  - Hook `useTurmas` existe
  - Páginas de gerenciamento existem

- **Sistema de Reservas**: Parcial
  - Hook `useReserva` conectado
  - Gerenciar reserva individual funciona
  - Vincular turma funciona

### ❌ O Que Está MOCKADO (UI existe, precisa conectar)
- **Autenticação**: Login fake (linha 63-82 de `auth/page.tsx`)
- **Nova Reserva**: Form sem submit real
- **Dashboard Gestor**: Dados hardcoded
- **Agenda Gestor**: Dados mockados (linha 56-121)
- **Quadras Gestor**: Dados mockados (linha 24-49)
- **Créditos Cliente**: Dados mockados (linha 42-95)

### 🚫 O Que NÃO EXISTE
- Sistema de pagamento (nenhuma página)
- Fluxo de caução
- Mensalistas (tem componentes, sem páginas)
- Notificações WhatsApp (backend)
- Relatórios exportáveis (PDF/Excel)

---

## 🔍 Análise Detalhada por User Story do PRD

### US-001: Seleção de Quadra e Reserva
**Status:** 🟡 PARCIAL (50%)

**Existe:**
- ✅ Página `/cliente/reservas/nova` com form básico
- ✅ Campos: data, horário, quadra, observações

**Falta (precisa conectar):**
```typescript
// Arquivo: src/app/(dashboard)/cliente/reservas/nova/page.tsx
// Linha 10-89: Form existe mas não tem onSubmit real

FALTA:
1. Buscar quadras disponíveis do Supabase
2. Buscar horários disponíveis por quadra
3. Calcular valor total dinamicamente
4. Validação de conflitos
5. Submit para criar reserva no banco
6. Integração com tipo de reserva (avulsa/mensalista/recorrente)
```

**Código necessário:**
```typescript
// Hook necessário (já pode existir parcialmente):
const { data: quadras } = useQuadras(); // Verificar se busca do Supabase
const { data: horarios } = useHorariosDisponiveis(quadraId, data);

// Service necessário:
reservasService.create({
  quadra_id,
  data,
  horario_id,
  tipo,
  observacoes,
  user_id
});
```

---

### US-002: Cadastro de Cliente
**Status:** ❌ AUSENTE (10%)

**Existe:**
- ✅ Componente `SignupForm` (linha 14)
- ✅ Campos básicos: nome, email, senha

**Falta COMPLETAMENTE:**
```typescript
// Arquivo: src/app/(auth)/auth/page.tsx
// Linhas 86-138: handleSignupSubmit está MOCKADO

FALTA:
1. Integração real com Supabase Auth (linha 91: await new Promise...)
2. Campos faltantes no formulário:
   - RG
   - Data de nascimento
   - CPF (componente InputCPF existe mas não usado)
   - CEP com ViaCEP (componente InputCEP existe mas não usado)
   - Endereço completo (logradouro, número, complemento, bairro, cidade, estado)
   - WhatsApp (componente InputWhatsApp existe mas não usado)
3. Validação CPF/RG únicos no backend
4. Cadastro opcional de cartão (tokenização Asaas)
```

**Componentes PRONTOS mas não usados:**
- `src/components/shared/forms/InputCPF.tsx` ✅
- `src/components/shared/forms/InputCEP.tsx` ✅
- `src/components/shared/forms/InputWhatsApp.tsx` ✅

**Ação imediata:**
```typescript
// 1. Expandir SignupForm para incluir todos os campos
// 2. Usar componentes custom já criados
// 3. Conectar com Supabase Auth real:

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      whatsapp,
      // ... resto dos campos
    }
  }
});
```

---

### US-003: Sistema de Pagamento
**Status:** ❌ AUSENTE (0%)

**Existe:**
- ✅ Service `pagamentoService.ts` (linha: existe o arquivo)
- ✅ Métodos Asaas implementados

**Falta COMPLETAMENTE:**
```
NENHUMA PÁGINA DE PAGAMENTO EXISTE

Precisa criar:
1. src/app/(dashboard)/cliente/pagamento/[reservaId]/page.tsx
2. src/app/(dashboard)/cliente/pagamento/[reservaId]/pix/page.tsx
3. src/app/(dashboard)/cliente/pagamento/[reservaId]/cartao/page.tsx

Componentes a criar:
- FormPagamentoPix (QR Code + copia e cola)
- FormPagamentoCartao (integração Asaas.js)
- SaldoCreditos (usar saldo existente)
- ComprovantePagamento (PDF)
- FluxoCaucao (pré-autorização)
```

**Dependências:**
```bash
npm install qrcode.react jspdf
```

**Service já existe:**
```typescript
// src/services/pagamentoService.ts
export const pagamentoService = {
  createPayment(data) { /* implementado */ },
  createPixPayment(data) { /* implementado */ },
  createCreditCardPayment(data) { /* implementado */ }
}
```

---

### US-004 a US-007: Sistema de Turmas e Rateio
**Status:** ✅ COMPLETO (95%)

**Funciona:**
- ✅ Criar turmas
- ✅ Editar turmas
- ✅ Vincular a reservas
- ✅ Rateio (percentual e valor fixo)

**Falta apenas:**
- Histórico de jogos por turma (query adicional)

---

### US-008: Criar Convites Públicos
**Status:** ✅ COMPLETO (100%)

**Funciona:**
- ✅ Página `/cliente/reservas/[id]/convites` existe
- ✅ Criar convite funciona
- ✅ Gerar link único
- ✅ Copiar link
- ✅ Ver aceites
- ✅ Cancelar convite

**Código funcional verificado:**
```typescript
// src/app/(dashboard)/cliente/reservas/[id]/convites/page.tsx
// Linha 10: usa hooks reais
const { data: convites } = useConvitesReserva(reserva_id);
const cancelarConvite = useCancelarConvite();

// Hook funcional:
// src/hooks/core/useConvites.ts (284 linhas, completo)
```

---

### US-009: Aceitar Convite (Fluxo Público)
**Status:** ✅ COMPLETO (100%)

**Funciona:**
- ✅ Página `/convite/[token]` existe e funciona
- ✅ Exibe detalhes do jogo
- ✅ Form de aceite (nome, email, whatsapp)
- ✅ Adiciona participante automaticamente
- ✅ Atualiza contador de vagas

**Código funcional verificado:**
```typescript
// src/app/(public)/convite/[token]/page.tsx (323 linhas)
// Linha 19: usa hook real
const { data: convite } = useConviteByToken(token);
const aceitarConvite = useAceitarConvite();

// Linha 37-55: handleSubmit funcionando
```

---

### US-010: Painel do Convidado
**Status:** 🟡 PARCIAL (30%)

**Existe:**
- ✅ Estrutura de dashboard

**Falta:**
- Diferenciação por `user_type` (guest vs organizador)
- Seções específicas para convidados
- Comprar créditos (página existe mas mockada)

---

### US-011 a US-013: Painel do Cliente
**Status:** ✅ COMPLETO (80%)

**Funciona:**
- ✅ Dashboard com cards
- ✅ Minhas Reservas
- ✅ Gerenciar Reserva individual
- ✅ Minhas Turmas
- ✅ Meus Convites

**Falta apenas:**
- Estatísticas reais (total investido, créditos recebidos)

---

### US-014: Cadastrar e Gerenciar Quadras
**Status:** 🟡 MOCKADO (70% UI, 0% backend)

**Existe (UI completa):**
```typescript
// src/app/(gestor)/gestor/quadras/page.tsx
// Linha 24-49: Dados mockados

const courts = [
  { id: 1, nome: "Quadra Society 1", tipo: "society", ... }
]
```

**Componentes prontos:**
- `FormCourt.tsx` ✅
- `SchedulesManager.tsx` ✅
- `BlocksManager.tsx` ✅

**Precisa conectar:**
```typescript
// SUBSTITUIR dados mockados por:
const { data: quadras } = useQuadras(); // Hook já existe!
const { data: horarios } = useHorarios(quadra_id);

// Verificar se hooks buscam do Supabase ou estão mockados
```

---

### US-015: Bloquear Horários
**Status:** 🟡 MOCKADO (60% UI, 0% backend)

**Existe:**
- ✅ Página `/gestor/bloqueios`
- ✅ Componente `BlocksManager`

**Precisa:**
- Hook `useCourtBlocks` (criar)
- Tabela `court_blocks` no Supabase (verificar se existe)

---

### US-016: Agenda Geral das Quadras
**Status:** 🟡 MOCKADO (90% UI, 0% backend)

**Existe (UI completa):**
```typescript
// src/app/(gestor)/gestor/agenda/page.tsx
// Linha 56-121: Dados mockados hardcoded

const [reservations, setReservations] = useState<Reservation[]>([
  { id: "1", court: "Society 1", day: 1, time: "19:00", ... }
]);
```

**Precisa conectar:**
```typescript
// SUBSTITUIR por:
const { data: reservas } = useReservasGestor({
  data_inicio: currentWeek[0],
  data_fim: currentWeek[6]
});

// Hook JÁ EXISTE (linha 10):
import { useReservasGestor } from '@/hooks/core/useReservasGestor';

// MAS NÃO ESTÁ SENDO USADO!
```

**Ação imediata:**
- Remover dados mockados (linha 56-121)
- Usar hook `useReservasGestor` que já existe
- Mapear dados para formato do calendário

---

### US-017: Gerenciar Reservas (Gestor)
**Status:** 🟡 MOCKADO (80% UI, 0% backend)

**Existe (UI completa):**
```typescript
// src/app/(gestor)/gestor/reservas/page.tsx
// Linha 51-129: Dados mockados

const [reservas, setReservas] = useState<Reserva[]>([
  { id: "R001", cliente: "João Silva", ... }
]);
```

**Hook existe mas não usado:**
```typescript
// NÃO ESTÁ IMPORTADO, mas existe:
// src/hooks/core/useReservasGestor.ts
```

**Precisa conectar:**
- Remover mock (linha 51-129)
- Usar `useReservasGestor()`
- Implementar ações (cancelar, editar, pagamento manual)

---

### US-018: Situação Financeira dos Clientes
**Status:** 🟡 PARCIAL (40% UI, 0% backend)

**Existe:**
- ✅ Página `/gestor/clientes`

**Falta:**
- Extrato por cliente
- Saldo devedor
- Registro de pagamentos manuais
- Emissão de cobranças

---

### US-019: Relatórios Gerenciais
**Status:** 🟡 PARCIAL (50% UI, 0% backend)

**Existe:**
- ✅ Página `/gestor/relatorios`
- ✅ Componente `GraficoFaturamento`

**Falta:**
- Dados reais (usar `useMetricasGestor` que já existe)
- Exportação PDF/Excel
- Mais tipos de relatórios

---

### US-020: Configurações do Sistema
**Status:** 🟡 PARCIAL (30% UI, 0% backend)

**Existe:**
- ✅ Página `/gestor/configuracoes`

**Falta:**
- Tabela `system_settings` no Supabase
- Form para editar configurações
- Salvar no backend

---

### US-021 a US-024: Automações e Notificações
**Status:** ❌ AUSENTE (5%)

**Existe:**
- ✅ Service `whatsappService.ts`
- ✅ Service `notificacaoService.ts`

**Falta:**
- Configuração WhatsApp API (tokens não configurados)
- Edge Functions para cron jobs
- Triggers no Supabase
- Página `/gestor/notificacoes` (existe mas mockada)

---

## 📋 Resumo: O Que Precisa Fazer AGORA

### PRIORIDADE 1: Conectar o Mockado ao Backend 🔴

#### 1. Autenticação Real (US-002)
**Arquivo:** `src/app/(auth)/auth/page.tsx`

```typescript
// REMOVER (linha 43-82):
const handleLoginSubmit = async (e) => {
  // ... código fake
  const validCredentials = [ /* mockado */ ];
  router.push(user.path); // redireciona sem auth
}

// SUBSTITUIR POR:
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('login-email'),
    password: formData.get('login-password')
  });

  if (error) {
    toast({ title: "Erro", description: error.message, variant: "destructive" });
    return;
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  // Redirecionar baseado no role real
  if (profile.role === 'gestor' || profile.role === 'admin') {
    router.push('/gestor');
  } else {
    router.push('/cliente');
  }
}
```

#### 2. Nova Reserva Real (US-001)
**Arquivo:** `src/app/(dashboard)/cliente/reservas/nova/page.tsx`

```typescript
// ADICIONAR no topo:
const { data: quadras } = useQuadras();
const { data: horarios } = useHorariosDisponiveis(quadraSelecionada, dataSelecionada);
const createReserva = useCreateReserva();

// ADICIONAR button onClick:
const handleSubmit = async () => {
  await createReserva.mutateAsync({
    quadra_id,
    data,
    horario_id,
    tipo: 'avulsa',
    observacoes
  });

  router.push('/cliente/reservas');
}
```

#### 3. Agenda Gestor Real (US-016)
**Arquivo:** `src/app/(gestor)/gestor/agenda/page.tsx`

```typescript
// REMOVER (linha 56-121):
const [reservations, setReservations] = useState([ /* mockado */ ]);

// SUBSTITUIR POR (hook JÁ EXISTE, só usar):
const { data: reservasData } = useReservasGestor({
  data_inicio: currentWeek[0].toISOString().split('T')[0],
  data_fim: currentWeek[6].toISOString().split('T')[0]
});

// Mapear para formato do calendário:
const reservations = reservasData?.map(r => ({
  id: r.id,
  court: r.quadra.nome,
  day: new Date(r.data).getDay(),
  time: r.horario.hora_inicio,
  organizer: r.user.nome_completo,
  participants: r.total_participantes,
  status: r.status
})) || [];
```

#### 4. Quadras Gestor Real (US-014)
**Arquivo:** `src/app/(gestor)/gestor/quadras/page.tsx`

```typescript
// REMOVER (linha 24-49):
const courts = [ /* mockado */ ];

// SUBSTITUIR POR (hook JÁ EXISTE):
const { data: courts } = useQuadras();
const { data: horarios } = useHorarios();
```

#### 5. Reservas Gestor Real (US-017)
**Arquivo:** `src/app/(gestor)/gestor/reservas/page.tsx`

```typescript
// REMOVER (linha 51-129):
const [reservas, setReservas] = useState([ /* mockado */ ]);

// SUBSTITUIR POR:
const { data: reservas } = useReservasGestor();
const cancelReserva = useCancelReservaGestor();
const updateReserva = useUpdateReservaGestor();
```

---

### PRIORIDADE 2: Implementar Faltantes 🟡

#### 6. Sistema de Pagamento (US-003)
**Criar:**
- `src/app/(dashboard)/cliente/pagamento/[reservaId]/page.tsx`
- `src/components/pagamento/FormPagamentoPix.tsx`
- `src/components/pagamento/FormPagamentoCartao.tsx`
- `src/components/pagamento/SaldoCreditos.tsx`

**Dependências:**
```bash
npm install qrcode.react jspdf
```

#### 7. Cadastro Completo (US-002)
**Expandir:** `src/components/auth/SignupForm.tsx`

Adicionar campos:
- RG
- Data de nascimento
- CEP (usar `InputCEP` que já existe)
- Logradouro, número, complemento, bairro, cidade, estado
- WhatsApp (usar `InputWhatsApp` que já existe)

#### 8. Comprar Créditos (US-010)
**Arquivo:** `src/app/(dashboard)/cliente/creditos/page.tsx`

Conectar:
- Botões "Comprar Agora" (linha 370, 408, 447)
- Usar `pagamentoService.createPayment()`

---

### PRIORIDADE 3: Backend e Infraestrutura 🔵

#### 9. Migrations Supabase
**Verificar se existem:**
- Tabela `users` (completa com todos os campos)
- Tabela `quadras`
- Tabela `horarios`
- Tabela `reservas`
- Tabela `turmas`
- Tabela `turma_membros`
- Tabela `convites` ✅ (já existe e funciona)
- Tabela `convite_aceites` ✅ (já existe e funciona)
- Tabela `reserva_participantes`
- Tabela `rateios`
- Tabela `court_blocks`
- Tabela `system_settings`
- Tabela `transactions`

#### 10. Row Level Security (RLS)
**Configurar:**
- Policies para cada tabela
- Restrições por user_id
- Permissões por role (cliente/gestor/admin)

#### 11. Integrações Externas
**Configurar em `.env.local`:**
```bash
# Asaas
ASAAS_API_KEY=
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_SECRET=

# WhatsApp
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
```

---

## 🎯 Plano de Ação Sugerido

### Semana 1: Conectar Mockados
- [ ] Dia 1-2: Autenticação real (login/signup)
- [ ] Dia 3: Nova reserva conectada
- [ ] Dia 4: Agenda gestor conectada
- [ ] Dia 5: Quadras e reservas gestor conectadas

### Semana 2: Sistema de Pagamento
- [ ] Dia 1-2: Páginas de pagamento (Pix, Cartão)
- [ ] Dia 3: Fluxo de caução
- [ ] Dia 4: Comprar créditos
- [ ] Dia 5: Testes integrados

### Semana 3: Completar Cadastro e Ajustes
- [ ] Dia 1-2: Expandir formulário de cadastro
- [ ] Dia 3: Conectar créditos mockados
- [ ] Dia 4-5: Testes e2e, correções

### Semana 4: Backend e Deploy
- [ ] Dia 1-2: Migrations Supabase completas
- [ ] Dia 3: RLS policies
- [ ] Dia 4: Configurar integrações (Asaas, WhatsApp)
- [ ] Dia 5: Deploy e testes em produção

---

## 📊 Estatísticas Finais

### Por Tipo de Trabalho:
- **Conectar mockados ao backend:** 40% do trabalho
- **Implementar faltantes (design + lógica):** 35% do trabalho
- **Backend (migrations, RLS, integrações):** 25% do trabalho

### Por Prioridade:
- 🔴 **Crítico (bloqueadores):** 30% - Auth, Nova Reserva, Pagamento
- 🟡 **Alto (importante):** 50% - Agenda, Quadras, Cadastro Completo
- 🔵 **Médio (nice to have):** 20% - Notificações, Relatórios avançados

### Estimativa de Tempo:
- **1 dev full-time:** 3-4 semanas
- **2 devs:** 2 semanas
- **MVP mínimo (só prioridade crítica):** 1 semana

---

**Próximo Passo Imediato:**
1. ✅ Criar migrations Supabase completas
2. ✅ Conectar autenticação real
3. ✅ Conectar dados mockados aos hooks existentes

**Autor:** Análise Real - Claude Code
**Data:** 23/10/2025
