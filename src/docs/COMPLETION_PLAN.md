# 🎯 Plano de Conclusão 100% - Arena Dona Santa

> **Roadmap para completar os 5% restantes do projeto**

**Status Atual:** 95% Completo  
**Meta:** 100% Completo  
**Prazo Estimado:** 2 semanas (10 dias úteis)  
**Esforço Total:** ~80 horas

---

## 📋 Visão Geral

Com base na [Análise de Lacunas](./IMPLEMENTATION_GAP_ANALYSIS.md), identificamos que faltam:

### 🔴 Alta Prioridade (Core)
1. **Gestão de Quadras** - 0% implementado
2. **Bloqueio de Horários** - 0% implementado

### 🟡 Média Prioridade (Melhorias)
3. **Programa de Indicação** - 30% implementado
4. **Templates WhatsApp** - 50% implementado
5. **Ações de Cliente** - 70% implementado

---

## 📅 Timeline Detalhado

```
┌──────────────────────────────────────────────────────────────┐
│                     SEMANA 1                                  │
├──────────────────────────────────────────────────────────────┤
│ Dia 1-2: Gestão de Quadras - Lista e Formulário             │
│ Dia 3-4: Gestão de Quadras - Configuração Horários          │
│ Dia 5: Integração e Testes                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     SEMANA 2                                  │
├──────────────────────────────────────────────────────────────┤
│ Dia 1-2: Bloqueio de Horários - Interface Completa          │
│ Dia 3: Programa de Indicação + Templates                     │
│ Dia 4: Ações de Cliente + Refinamentos                       │
│ Dia 5: Polimento Final + Documentação                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Sprint 1: Gestão de Quadras (Semana 1)

### 📌 Objetivo
Implementar CRUD completo para gestão de quadras esportivas.

### 📦 Entregáveis

#### 1.1 CourtManagement.tsx - Lista de Quadras
**Arquivo:** `/components/manager/CourtManagement.tsx`  
**Estimativa:** 2 horas  
**Prioridade:** 🔴 Alta

**Funcionalidades:**
```typescript
- [ ] Lista de quadras em cards/grid
- [ ] Cada card mostra:
  - Foto da quadra
  - Nome
  - Tipo (Society, Poliesportiva, Beach Tennis)
  - Status (Ativa/Inativa)
  - Horário de funcionamento
  - Taxa de ocupação
- [ ] Botão "Adicionar Nova Quadra" destacado
- [ ] Busca e filtros (por tipo, status)
- [ ] Ações: Editar, Desativar, Ver Detalhes
- [ ] Empty state para quando não há quadras
```

**Componentes UI necessários:**
- Card (já existe)
- Badge (já existe)
- Button (já existe)
- Input (busca)
- Select (filtros)

**Mock Data:**
```typescript
const mockCourts = [
  {
    id: 1,
    name: "Quadra 1 - Society",
    type: "society",
    status: "active",
    image: "...",
    workingHours: "06:00 - 23:00",
    occupancy: 85
  },
  // ...
]
```

#### 1.2 CourtFormModal.tsx - Criar/Editar Quadra
**Arquivo:** `/components/manager/CourtFormModal.tsx`  
**Estimativa:** 4 horas  
**Prioridade:** 🔴 Alta

**Funcionalidades:**
```typescript
- [ ] Modal/Dialog grande e organizado
- [ ] Seção "Dados Básicos":
  - Nome da quadra (input)
  - Tipo (select: Society, Poliesportiva, Beach Tennis, Vôlei, etc)
  - Foto (upload com preview)
  - Descrição (textarea)
  - Status (toggle ativo/inativo)
  
- [ ] Seção "Características":
  - Cobertura (checkbox)
  - Iluminação (checkbox)
  - Vestiário (checkbox)
  - Estacionamento (checkbox)
  - Capacidade máxima (input numérico)
  
- [ ] Seção "Contato/Localização":
  - Endereço (input)
  - Telefone (input)
  
- [ ] Botões:
  - Cancelar (secondary)
  - Salvar (primary, com loading state)
  
- [ ] Validação em tempo real
- [ ] Feedback visual (toast ao salvar)
```

**Componentes UI necessários:**
- Dialog (já existe)
- Form (já existe)
- Input, Textarea, Select, Checkbox (já existem)
- Button com loading (já existe)
- Upload component (criar simples ou usar Input file)

**Validação (Zod):**
```typescript
const courtSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.enum(["society", "poliesportiva", "beach-tennis", "volei"]),
  description: z.string().optional(),
  capacity: z.number().min(2).max(50),
  // ...
})
```

#### 1.3 CourtScheduleConfig.tsx - Configurar Horários e Preços
**Arquivo:** `/components/manager/CourtScheduleConfig.tsx`  
**Estimativa:** 4 horas  
**Prioridade:** 🔴 Alta

**Funcionalidades:**
```typescript
- [ ] Grid de configuração por dia da semana
- [ ] Cada dia tem:
  - Toggle "Funcionando" (ativo/inativo)
  - Horário abertura (time picker)
  - Horário fechamento (time picker)
  - Intervalo de slots (30 min, 1h, 1.5h, 2h)
  
- [ ] Configuração de Preços:
  - Tabela de horários com valores
  - Colunas: Horário | Preço Avulso | Preço Mensalista
  - Edição inline ou modal
  - Opção "Copiar para todos os dias"
  - Preços diferenciados (horário nobre, etc)
  
- [ ] Preview de disponibilidade:
  - Visualização de como ficará a agenda
  - Quantidade de slots disponíveis por dia
  
- [ ] Validações:
  - Horário fechamento > abertura
  - Preços válidos (> 0)
```

**Layout sugerido:**
```
┌─────────────────────────────────────────┐
│ Configuração de Horários                │
├─────────────────────────────────────────┤
│ Segunda-feira [X] Funcionando           │
│ Abertura: [06:00] Fechamento: [23:00]   │
│ Intervalo: [1 hora ▼]                   │
├─────────────────────────────────────────┤
│ Terça-feira [X] Funcionando             │
│ ...                                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Configuração de Preços                  │
├──────────┬──────────────┬───────────────┤
│ Horário  │ Avulso (R$)  │ Mensal (R$)  │
├──────────┼──────────────┼───────────────┤
│ 06:00    │ [80]         │ [60]         │
│ 07:00    │ [90]         │ [70]         │
│ ...      │              │              │
│ 19:00    │ [150]        │ [120]        │ ← Horário nobre
└──────────┴──────────────┴───────────────┘
```

**Componentes UI necessários:**
- Card/Section (já existe)
- Toggle/Switch (já existe)
- Time Picker (criar ou usar Input time)
- Table (já existe)
- Input numérico (já existe)

#### 1.4 Integração no ManagerDashboard
**Estimativa:** 2 horas  
**Prioridade:** 🔴 Alta

**Tarefas:**
```typescript
- [ ] Adicionar menu "Quadras" no sidebar do gestor
- [ ] Criar rota em /config/routes.ts
- [ ] Adicionar no AppRouter.tsx
- [ ] Navegação entre lista e formulário
- [ ] Estado global para quadras (opcional - pode usar mock)
- [ ] Feedback visual (toasts)
- [ ] Loading states
- [ ] Error states
```

**Mock data centralizado:**
Adicionar em `/data/mockData.ts`:
```typescript
export const mockCourts = [ /* ... */ ]
export const mockCourtSchedules = [ /* ... */ ]
export const mockCourtPrices = [ /* ... */ ]
```

---

## 🚀 Sprint 2: Bloqueio de Horários (Início Semana 2)

### 📌 Objetivo
Criar interface dedicada para bloqueio de horários nas quadras.

### 📦 Entregável

#### 2.1 BlockTimeModal.tsx - Interface de Bloqueio
**Arquivo:** `/components/manager/BlockTimeModal.tsx`  
**Estimativa:** 3 horas  
**Prioridade:** 🔴 Alta

**Funcionalidades:**
```typescript
- [ ] Modal/Dialog com formulário
- [ ] Campos:
  - Quadra (select dropdown)
  - Data (calendar picker - pode ser range)
  - Horário início (time picker)
  - Horário fim (time picker)
  - Motivo (select: Manutenção, Evento Privado, Outro)
  - Descrição adicional (textarea opcional)
  - Tipo de bloqueio:
    - Bloqueio único (uma data)
    - Bloqueio recorrente (semanal)
    
- [ ] Seção "Preview":
  - Lista dos slots que serão bloqueados
  - Data/hora de cada slot
  - Quantidade total de slots
  - Valor total perdido (opcional, se houver reservas)
  
- [ ] Validações:
  - Horário fim > início
  - Data futura (não pode bloquear passado)
  - Conflito com reservas existentes (warning)
  
- [ ] Botões:
  - Cancelar
  - Confirmar Bloqueio (com confirmação se houver conflitos)
```

**Layout sugerido:**
```
┌──────────────────────────────────────────┐
│ Bloquear Horários                        │
├──────────────────────────────────────────┤
│ Quadra: [Quadra 1 - Society ▼]          │
│ Data: [15/10/2025] 📅                    │
│ Horário: [19:00] até [21:00]            │
│ Motivo: [Manutenção ▼]                  │
│ Descrição: [____________]                │
├──────────────────────────────────────────┤
│ Preview dos horários que serão bloqueados│
│ ✓ 15/10/2025 - 19:00 às 20:00           │
│ ✓ 15/10/2025 - 20:00 às 21:00           │
│                                           │
│ Total: 2 slots | Duração: 2 horas        │
├──────────────────────────────────────────┤
│ [Cancelar]        [Confirmar Bloqueio]   │
└──────────────────────────────────────────┘
```

**Componentes UI necessários:**
- Dialog (já existe)
- Select (já existe)
- Calendar (já existe)
- Time picker (criar ou Input time)
- Textarea (já existe)
- Alert (para warnings - já existe)

#### 2.2 Integração com ScheduleCalendar
**Estimativa:** 2 horas  
**Prioridade:** 🔴 Alta

**Tarefas:**
```typescript
- [ ] Botão "Bloquear Horário" na agenda
- [ ] Abrir BlockTimeModal ao clicar
- [ ] Passar dados de quadra/data pré-selecionados
- [ ] Atualizar agenda após bloqueio
- [ ] Adicionar slots bloqueados na visualização
- [ ] Cor diferente para bloqueados (vermelho)
- [ ] Hover mostra motivo do bloqueio
- [ ] Opção de desbloquear (botão no hover ou context menu)
```

**Melhorias no ScheduleCalendar:**
```typescript
- [ ] Legenda de cores atualizada:
  - Verde: Disponível
  - Cinza: Ocupado (reservado)
  - Vermelho: Bloqueado
  - Amarelo: Pendente confirmação
  
- [ ] Context menu ao clicar em slot:
  - Se disponível: "Nova Reserva" ou "Bloquear"
  - Se bloqueado: "Desbloquear" ou "Ver Detalhes"
  - Se ocupado: "Ver Reserva" ou "Cancelar"
```

---

## 🎨 Sprint 3: Melhorias e Refinamentos (Final Semana 2)

### 📌 Objetivo
Completar funcionalidades complementares e polir sistema.

### 📦 Entregáveis

#### 3.1 ReferralProgram.tsx - Página de Indicações
**Arquivo:** `/components/ReferralProgram.tsx`  
**Estimativa:** 4 horas  
**Prioridade:** 🟡 Média

**Funcionalidades:**
```typescript
- [ ] Header com título e descrição do programa
- [ ] Card destacado "Seu Link de Indicação":
  - Link gerado único
  - Botão "Copiar Link" (com feedback)
  - Botão "Compartilhar" (WhatsApp, Email, etc)
  - QR Code do link
  
- [ ] Dashboard de Estatísticas (cards):
  - Pessoas indicadas
  - Indicações ativas (que já jogaram)
  - Bônus acumulado (R$)
  - Próximo bônus (R$)
  
- [ ] Gráfico de indicações no tempo:
  - Linha do tempo
  - Total por mês
  
- [ ] Tabela "Minhas Indicações":
  - Nome
  - Data de cadastro
  - Status (Pendente, Ativo, Bônus Pago)
  - Bônus ganho
  - Ações (Ver Detalhes)
  
- [ ] Seção "Como Funciona":
  - Cards explicativos ilustrados
  - Regras do programa
  - Valores de bônus
  
- [ ] Gamificação (opcional):
  - Badges/conquistas
  - Níveis (Bronze, Prata, Ouro)
  - Ranking de indicadores
```

**Mock Data:**
```typescript
const mockReferrals = [
  {
    id: 1,
    name: "João Silva",
    signupDate: "01/10/2025",
    status: "active",
    bonusEarned: 20,
    gamesPlayed: 5
  },
  // ...
]
```

#### 3.2 Melhorar Templates WhatsApp
**Arquivo:** `SystemSettings.tsx` (seção existente)  
**Estimativa:** 2 horas  
**Prioridade:** 🟡 Média

**Melhorias:**
```typescript
- [ ] Editor de templates mais robusto:
  - Monaco Editor ou rich text
  - Syntax highlighting para variáveis
  
- [ ] Variáveis dinâmicas:
  - {nome_cliente}
  - {nome_quadra}
  - {data}
  - {horario}
  - {valor}
  - {link_convite}
  - Preview de como ficará
  
- [ ] Múltiplos templates por tipo:
  - Confirmação de reserva
  - Lembrete de jogo (24h antes)
  - Convite para jogo
  - Confirmação de pagamento
  - Cobrança de débito
  
- [ ] Preview em tempo real:
  - Simular com dados reais
  - Visualizar como aparece no WhatsApp
  
- [ ] Histórico de templates:
  - Versões anteriores
  - Rollback se necessário
```

**UI sugerida:**
```
┌─────────────────────────────────────────────┐
│ Templates de Mensagens WhatsApp             │
├─────────────────────────────────────────────┤
│ Tipo: [Confirmação de Reserva ▼]            │
├───────────────────┬─────────────────────────┤
│ Editor            │ Preview                 │
│                   │                         │
│ Olá {nome}!       │ Olá Carlos Silva!       │
│ Sua reserva na    │ Sua reserva na          │
│ {quadra} está     │ Quadra 1 está           │
│ confirmada para   │ confirmada para         │
│ {data} às {hora}. │ 15/10 às 19:00.         │
│                   │                         │
│ [variáveis▼]      │ [copiar] [enviar teste] │
└───────────────────┴─────────────────────────┘
```

#### 3.3 Melhorar Ações de Cliente
**Arquivo:** `ClientProfileModal.tsx` (existente)  
**Estimativa:** 2 horas  
**Prioridade:** 🟢 Baixa

**Melhorias:**
```typescript
- [ ] Modal "Ajustar Saldo":
  - Opções: Adicionar Crédito, Adicionar Débito
  - Valor (input)
  - Motivo (select + textarea)
  - Preview do novo saldo
  - Confirmação
  
- [ ] Modal "Cobrar Débito":
  - Valor a cobrar (readonly, do saldo)
  - Forma de cobrança:
    - Gerar link de pagamento
    - Enviar WhatsApp
    - Marcar como pago manualmente
  - Data de vencimento
  - Observações
  
- [ ] Botão "Enviar Mensagem":
  - Modal com templates
  - Seleção de template
  - Preview
  - Envio direto para WhatsApp
  
- [ ] Histórico de Comunicações:
  - Tab no modal do cliente
  - Lista de mensagens enviadas
  - Data/hora, tipo, status
```

#### 3.4 Polimento Final
**Estimativa:** 2 horas  
**Prioridade:** 🟢 Baixa

**Tarefas:**
```typescript
- [ ] Code review completo
- [ ] Refatoração de código duplicado
- [ ] Otimizar imports
- [ ] Adicionar comentários JSDoc
- [ ] Verificar acessibilidade (ARIA labels)
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Verificar loading states
- [ ] Verificar error states
- [ ] Atualizar documentação
- [ ] Atualizar CHANGELOG.md
- [ ] Criar demo/showcase das novas features
```

---

## ✅ Checklist de Implementação

### Sprint 1: Gestão de Quadras
- [ ] **Dia 1-2:**
  - [ ] Criar CourtManagement.tsx (lista)
  - [ ] Criar CourtFormModal.tsx (formulário)
  - [ ] Mock data em /data/mockData.ts
  - [ ] Validação com Zod
  
- [ ] **Dia 3-4:**
  - [ ] Criar CourtScheduleConfig.tsx
  - [ ] Grid de horários por dia
  - [ ] Configuração de preços
  - [ ] Preview de disponibilidade
  
- [ ] **Dia 5:**
  - [ ] Adicionar rota em /config/routes.ts
  - [ ] Integrar no ManagerDashboard
  - [ ] Navegação completa
  - [ ] Testes manuais
  - [ ] Documentar

### Sprint 2: Bloqueio de Horários
- [ ] **Dia 1:**
  - [ ] Criar BlockTimeModal.tsx
  - [ ] Formulário completo
  - [ ] Preview de slots
  - [ ] Validações
  
- [ ] **Dia 2:**
  - [ ] Integrar com ScheduleCalendar
  - [ ] Atualizar visualização
  - [ ] Context menu em slots
  - [ ] Testes
  - [ ] Documentar

### Sprint 3: Melhorias
- [ ] **Dia 3:**
  - [ ] Criar ReferralProgram.tsx
  - [ ] Dashboard de indicações
  - [ ] Tabela e estatísticas
  - [ ] Melhorar Templates WhatsApp
  
- [ ] **Dia 4:**
  - [ ] Melhorar Ações de Cliente
  - [ ] Modals de ajuste de saldo
  - [ ] Histórico de comunicações
  - [ ] Refinamentos gerais
  
- [ ] **Dia 5:**
  - [ ] Code review
  - [ ] Testes completos
  - [ ] Documentação atualizada
  - [ ] CHANGELOG atualizado
  - [ ] Demo/showcase

---

## 📊 Métricas de Sucesso

### Funcionalidade
- [ ] Todas as features do prompt original implementadas
- [ ] Todos os fluxos funcionando end-to-end
- [ ] Mock data completo para demo

### Qualidade
- [ ] TypeScript 100% (sem `any`)
- [ ] Acessibilidade WCAG 2.1 AA mantida
- [ ] Responsividade em todos os tamanhos
- [ ] Loading e error states em todos os componentes

### Performance
- [ ] Lighthouse Score 95+ mantido
- [ ] Bundle size < 500kb (gzipped)
- [ ] Lazy loading funcionando

### Documentação
- [ ] Todos os novos componentes documentados
- [ ] README atualizado
- [ ] CHANGELOG atualizado
- [ ] Gap Analysis marcado como 100%

---

## 🎯 Entrega Final

### Ao completar este plano, o projeto terá:

✅ **100% das funcionalidades** do prompt original  
✅ **81+ componentes** organizados e documentados  
✅ **Sistema completo** cliente + gestor  
✅ **Pronto para integração** com backend real  
✅ **Documentação enterprise** completa  
✅ **Performance** Lighthouse 95+  
✅ **Acessibilidade** WCAG 2.1 AA  
✅ **Código limpo** e escalável  

### Próximos passos após 100%:
1. Integração com backend real
2. Testes automatizados (E2E, Unit)
3. Deploy em produção
4. Monitoramento e analytics

---

## 📞 Suporte

**Dúvidas durante implementação?**
- Consulte [Gap Analysis](./IMPLEMENTATION_GAP_ANALYSIS.md)
- Veja [Architecture](../ARCHITECTURE.md)
- Leia [Contributing Guide](../CONTRIBUTING.md)

**Ao concluir:**
- Atualizar [PROJECT_STATUS.md](../PROJECT_STATUS.md)
- Marcar issue como completo
- Criar PR com as mudanças
- Documentar decisões técnicas

---

**Bom trabalho! Vamos aos 100%! 🚀**

---

**Versão:** 1.0.0  
**Data:** 14 de Outubro de 2025  
**Status:** 📋 Plano Aprovado  

**[← Voltar para Documentação](./README.md)**
