# Plano de Implementação para Resolver os Gaps Identificados

## Visão Geral

Este plano detalha as etapas necessárias para resolver todos os gaps críticos, médios e baixos identificados no relatório GAP1.md. O plano está organizado em 3 sprints principais, com foco inicial nas funcionalidades críticas que bloqueiam o funcionamento do sistema.

## Sprint 1 - Backend Core (2 semanas)

### Objetivo
Resolver os gaps críticos que impedem o funcionamento básico do sistema de reservas e pagamentos.

### Tarefas

#### 1. Migrações de Banco de Dados
- [x] Criar migration completa com todos os campos faltantes
  - Tabela `payments` (pagamentos)
  - Colunas faltantes em `reservas`: observacoes, split_mode, team_id
  - Colunas faltantes em `reserva_participantes`: source, split_type, split_value, amount_to_pay, payment_status, payment_id
  - Campos faltantes em `users`: rg, birth_date, cep, number, complement, neighborhood, city, state, user_type, balance
  - Atualizar estrutura de `convites` para modelo de "lotes"
  - Verificar e atualizar `aceites_convite`
  - Adicionar constraints UNIQUE para CPF e RG
  - Criar índices de performance

#### 2. Sistema de Rateio
- [x] Criar serviço de rateio com validações (`rateios.service.ts`)
- [x] Criar hooks React Query (`useRateiosSimple.ts`)
- [x] Criar endpoint da API (`/api/reservas/[id]/rateio/route.ts`)
- [ ] Implementar validações de negócio (RN-017, RN-018, RN-019)
  - Validação: soma de percentuais = 100%
  - Validação: total valor fixo ≤ valor reserva
  - Cálculo automático de diferença para organizador

#### 3. Integração com Asaas (Pagamentos)
- [x] Estrutura já existe no `pagamentoService.ts`
- [ ] Implementar integração real com API Asaas
  - Configurar variáveis de ambiente: ASAAS_API_KEY, ASAAS_WALLET_ID, ASAAS_WEBHOOK_SECRET
  - Implementar webhooks para confirmação de pagamento
  - Testar todos os métodos de pagamento

#### 4. Sistema de Caução
- [x] Estrutura de pré-autorização já existe
- [ ] Implementar fluxo completo de caução
  - Débito parcial conforme participantes pagam
  - Cálculo automático do saldo restante
  - Liberação da diferença após fechamento do jogo

## Sprint 2 - Automações (1-2 semanas)

### Objetivo
Implementar as automações e notificações que melhoram a experiência do usuário.

### Tarefas

#### 1. Fechamento Automático de Jogos
- [x] Função Edge `close-game` já implementada
- [ ] Testar e validar o fluxo completo
- [ ] Configurar cron jobs no Supabase

#### 2. Notificações Automáticas
- [x] Funções Edge já implementadas:
  - `send-reminder-45min`
  - `send-reminder-10min`
  - `send-review-request`
- [ ] Completar integração WhatsApp (templates + envio real)
- [ ] Configurar webhooks para status de entrega
- [ ] Configurar cron jobs no Supabase

#### 3. Sistema de Compra de Créditos
- [ ] Implementar endpoint para compra de créditos sem vínculo a reserva
  - POST `/api/creditos/comprar`
- [ ] Implementar lógica de uso automático ao aceitar convite
- [ ] Implementar validação de saldo antes de aceitar convite pago
- [ ] Implementar fluxo de complemento se saldo insuficiente

## Sprint 3 - Refinamentos (1 semana)

### Objetivo
Finalizar as melhorias e validações restantes.

### Tarefas

#### 1. Validações de Negócio
- [ ] Implementar validações faltantes:
  - RN-006: Cliente não pode ter saldo devedor > R$ 200 para fazer novas reservas
  - RN-026: Total de participantes (turma + convites) não pode exceder capacidade
  - RN-049, RN-050: CPF e RG devem ser únicos (já implementado via constraints)

#### 2. Segurança e Performance
- [ ] Auditar e implementar todas as RLS policies
- [ ] Adicionar índices de performance faltantes
- [ ] Implementar triggers automáticos:
  - Decrementar filled_slots ao aceitar convite
  - Atualizar saldo do usuário após transação
  - Function para calcular valor de rateio automaticamente

#### 3. Testes e Documentação
- [ ] Testes de integração end-to-end
- [ ] Documentar APIs e fluxos
- [ ] Criar guia de deployment

## Priorização Detalhada

### 🔴 CRÍTICO (Bloqueia funcionalidades core)
1. [x] Criar tabela payments
2. [x] Adicionar campos faltantes em reservas: observacoes, split_mode, team_id
3. [x] Adicionar campos faltantes em reserva_participantes
4. [ ] Integração real com Asaas (pagamentos)
5. [ ] Sistema de caução com pré-autorização
6. [x] Fechamento automático de jogos (Edge Function)
7. [ ] Validações de rateio no backend

### 🟡 ALTO (Funcionalidades importantes)
8. [ ] Completar integração WhatsApp (templates + envio real)
9. [x] Notificações automáticas (Edge Functions + Cron)
10. [ ] Sistema de compra de créditos sem vínculo
11. [ ] Ajustar tabela convites para modelo de "lotes"
12. [ ] Validações de negócio (RN-006, RN-026, RN-049, RN-050)
13. [ ] RLS policies em todas as tabelas
14. [ ] Índices de performance

### 🟢 MÉDIO (Melhorias e refinamentos)
15. [x] Consolidar migrations
16. [ ] Triggers automáticos (saldo, vagas, etc.)
17. [ ] Ajustar campos em users (RG, CEP detalhado, user_type)
18. [ ] Sistema de cupons de desconto
19. [ ] Exportação de relatórios (PDF/Excel)

## Cronograma

| Sprint | Período | Foco Principal | Entregáveis |
|--------|---------|----------------|-------------|
| Sprint 1 | Semanas 1-2 | Backend Core | Estrutura de banco de dados, rateio, pagamentos, caução |
| Sprint 2 | Semanas 3-4 | Automações | Notificações, fechamento automático, compra de créditos |
| Sprint 3 | Semana 5 | Refinamentos | Validações, segurança, testes |

## Próximos Passos Imediatos

1. [x] Executar migration do banco de dados
2. [ ] Configurar credenciais da API Asaas no ambiente
3. [ ] Testar integração de pagamentos
4. [ ] Validar funcionamento do sistema de rateio
5. [ ] Configurar cron jobs para funções Edge