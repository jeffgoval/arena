📋 RELATÓRIO DE GAP ANALYSIS



&nbsp; Backend e Banco de Dados - Arena Dona Santa



&nbsp; ✅ RESUMO EXECUTIVO



&nbsp; Após análise dos arquivos de especificação (PRD.md e PROMPT.md) e auditoria do código implementado, identifiquei:



&nbsp; - 19 páginas frontend implementadas (13 gestor + 6 cliente)

&nbsp; - 20 tabelas Supabase criadas

&nbsp; - 9 serviços implementados

&nbsp; - Integração ViaCEP: ✅ Implementada

&nbsp; - Integração Asaas: ⚠️ Estrutura criada, não integrada

&nbsp; - Integração WhatsApp: ⚠️ Estrutura criada, não integrada



&nbsp; ---

&nbsp; 🔴 CRÍTICO - FALTA IMPLEMENTAR



&nbsp; 1. TABELAS FALTANTES NO BANCO DE DADOS



&nbsp; 1.1 Tabela payments (pagamentos)



&nbsp; Status: ❌ NÃO EXISTEEspecificação do PRD:

&nbsp; payments (pagamentos)

&nbsp; - id (uuid, PK)

&nbsp; - user\_id (uuid, FK)

&nbsp; - reservation\_id (uuid, FK, nullable)

&nbsp; - invitation\_id (uuid, FK, nullable)

&nbsp; - amount (decimal)

&nbsp; - method (enum: 'pix', 'credit\_card', 'debit\_card', 'balance')

&nbsp; - status (enum: 'pending', 'confirmed', 'failed', 'refunded')

&nbsp; - transaction\_id (text) -- ID da Asaas

&nbsp; - created\_at (timestamp)



&nbsp; Observação: Atualmente existe apenas transacoes\_credito que rastreia créditos, mas não pagamentos de reservas/convites.



&nbsp; ---

&nbsp; 1.2 Tabela rateios (splits/cost sharing)



&nbsp; Status: ❌ INCOMPLETAO que existe: Tabela existe mas não está sendo populadaEspecificação do PRD: Deve armazenar configuração de rateio por reserva

&nbsp; rateios

&nbsp; - id (uuid, PK)

&nbsp; - reserva\_id (uuid, FK)

&nbsp; - modo (enum: 'percentual', 'valor\_fixo')

&nbsp; - participante\_id (uuid, FK)

&nbsp; - valor\_ou\_percentual (decimal)

&nbsp; - valor\_calculado (decimal) -- em R$

&nbsp; - created\_at (timestamp)



&nbsp; Problema atual: O sistema não salva a configuração de rateio, apenas os participantes.



&nbsp; ---

&nbsp; 1.3 Coluna observations na tabela reservas



&nbsp; Status: ❌ NÃO EXISTEEspecificação do PRD: Campo de texto livre (máx 500 chars) para observações da reservaAção necessária:

&nbsp; ALTER TABLE reservas ADD COLUMN observacoes TEXT;



&nbsp; ---

&nbsp; 1.4 Coluna split\_mode na tabela reservas



&nbsp; Status: ❌ NÃO EXISTEEspecificação do PRD: Indica se rateio é percentual ou valor fixoAção necessária:

&nbsp; ALTER TABLE reservas

&nbsp; ADD COLUMN split\_mode TEXT

&nbsp; CHECK (split\_mode IN ('percentual', 'valor\_fixo'));



&nbsp; ---

&nbsp; 1.5 Coluna team\_id na tabela reservas



&nbsp; Status: ❌ NÃO EXISTE (mas essencial)Especificação do PRD: FK para tabela turmasAção necessária:

&nbsp; ALTER TABLE reservas

&nbsp; ADD COLUMN team\_id UUID REFERENCES turmas(id) ON DELETE SET NULL;



&nbsp; Observação: Esta coluna é CRÍTICA para vincular turmas a reservas conforme US-005.



&nbsp; ---

&nbsp; 1.6 Colunas em reservation\_participants (reserva\_participantes)



&nbsp; Status: ⚠️ PARCIALMENTE IMPLEMENTADAFaltam:

&nbsp; - source (enum: 'team', 'invite') - origem do participante

&nbsp; - split\_type (enum: 'percentage', 'fixed\_value')

&nbsp; - split\_value (decimal) - valor ou % do rateio

&nbsp; - amount\_to\_pay (decimal) - valor calculado em R$

&nbsp; - payment\_status (enum: 'pending', 'paid', 'free')

&nbsp; - payment\_id (uuid, FK)



&nbsp; Ação necessária:

&nbsp; ALTER TABLE reserva\_participantes

&nbsp; ADD COLUMN source TEXT CHECK (source IN ('team', 'invite')),

&nbsp; ADD COLUMN split\_type TEXT CHECK (split\_type IN ('percentual', 'valor\_fixo')),

&nbsp; ADD COLUMN split\_value DECIMAL(10,2),

&nbsp; ADD COLUMN amount\_to\_pay DECIMAL(10,2),

&nbsp; ADD COLUMN payment\_status TEXT CHECK (payment\_status IN ('pending', 'paid', 'free')),

&nbsp; ADD COLUMN payment\_id UUID REFERENCES payments(id);



&nbsp; ---

&nbsp; 1.7 Campos faltantes na tabela users



&nbsp; Status: ⚠️ CAMPOS FALTANTESEspecificação do PRD:

&nbsp; - rg (text)

&nbsp; - birth\_date (date)

&nbsp; - cep (text)

&nbsp; - number (text) - número do endereço

&nbsp; - complement (text)

&nbsp; - neighborhood (text) - bairro

&nbsp; - city (text)

&nbsp; - state (text)

&nbsp; - user\_type (enum: 'organizer', 'guest', 'both')

&nbsp; - balance (decimal) - saldo em créditos



&nbsp; Verificar: Alguns desses campos podem já existir com nomes ligeiramente diferentes (como saldo\_creditos para balance).



&nbsp; ---

&nbsp; 1.8 Tabela invitations (convites) - Campos faltantes



&nbsp; Status: ⚠️ INCOMPLETAFaltam:

&nbsp; - name (text) - nome do lote de convite

&nbsp; - total\_slots (integer) - vagas totais

&nbsp; - filled\_slots (integer) - vagas preenchidas

&nbsp; - price\_per\_slot (decimal)

&nbsp; - invite\_link (text, unique) - link único

&nbsp; - description (text)

&nbsp; - expires\_at (timestamp)



&nbsp; Observação: A tabela atual parece usar estrutura diferente. Precisa verificar e ajustar.



&nbsp; ---

&nbsp; 1.9 Tabela invitation\_acceptances (aceites\_convite) - Campos faltantes



&nbsp; Status: ⚠️ VERIFICARDeve ter:

&nbsp; - invitation\_id (FK)

&nbsp; - user\_id (FK)

&nbsp; - accepted\_at (timestamp)

&nbsp; - payment\_id (FK, nullable)

&nbsp; - payment\_status (enum)



&nbsp; Ação: Verificar se tabela aceites\_convite tem todos esses campos.



&nbsp; ---

&nbsp; 2. INTEGRAÇÕES FALTANTES



&nbsp; 2.1 Integração Asaas (Gateway de Pagamento)



&nbsp; Status: 🔴 CRÍTICO - NÃO INTEGRADOEspecificação do PRD:

&nbsp; - Pagamento via Pix (QR Code e Pix Copia e Cola)

&nbsp; - Pagamento via cartão de crédito

&nbsp; - Pagamento via cartão de débito

&nbsp; - Sistema de caução (pré-autorização)

&nbsp; - Captura parcial de valores

&nbsp; - Webhooks para confirmação de pagamento

&nbsp; - Estorno e cancelamento

&nbsp; - Gestão de saldo/carteira de clientes



&nbsp; Arquivos encontrados:

&nbsp; - ✅ src/services/pagamentoService.ts - estrutura criada

&nbsp; - ❌ Não há integração real com API Asaas

&nbsp; - ❌ Webhooks não configurados



&nbsp; Tarefas necessárias:

&nbsp; 1. Implementar métodos de pagamento:

&nbsp;   - createPixPayment()

&nbsp;   - createCreditCardPayment()

&nbsp;   - createAuthorization() - caução

&nbsp;   - capturePartialAmount() - débito parcial

&nbsp; 2. Implementar webhooks:

&nbsp;   - Rota: /api/pagamentos/webhook

&nbsp;   - Validação de assinatura

&nbsp;   - Atualização de status de pagamento

&nbsp; 3. Configurar variáveis de ambiente:

&nbsp;   - ASAAS\_API\_KEY

&nbsp;   - ASAAS\_WALLET\_ID

&nbsp;   - ASAAS\_WEBHOOK\_SECRET



&nbsp; ---

&nbsp; 2.2 Integração WhatsApp Business API



&nbsp; Status: 🟡 PARCIALMENTE IMPLEMENTADOEspecificação do PRD:

&nbsp; - Envio de mensagens automáticas

&nbsp; - Templates pré-aprovados

&nbsp; - Envio de links e botões

&nbsp; - Confirmação de entrega

&nbsp; - Opt-in/opt-out

&nbsp; - Notificações de aceite de convite



&nbsp; Arquivos encontrados:

&nbsp; - ✅ src/services/whatsappService.ts - estrutura criada

&nbsp; - ⚠️ src/services/notificacaoService.ts - funções de notificação

&nbsp; - ❌ Integração real não confirmada

&nbsp; - ❌ Templates não configurados na Meta



&nbsp; Tarefas necessárias:

&nbsp; 1. Configurar WhatsApp Business Account

&nbsp; 2. Criar e aprovar templates na Meta:

&nbsp;   - Template de lembrete (45min antes)

&nbsp;   - Template de lembrete final (10min antes)

&nbsp;   - Template de aceite de convite

&nbsp;   - Template de avaliação pós-jogo

&nbsp;   - Template de confirmação de reserva

&nbsp; 3. Implementar envio real via API

&nbsp; 4. Configurar webhooks para status de entrega

&nbsp; 5. Variáveis de ambiente:

&nbsp;   - WHATSAPP\_API\_TOKEN

&nbsp;   - WHATSAPP\_PHONE\_NUMBER\_ID

&nbsp;   - WHATSAPP\_VERIFY\_TOKEN



&nbsp; ---

&nbsp; 3. FUNCIONALIDADES CORE FALTANTES



&nbsp; 3.1 Sistema de Caução com Pré-Autorização



&nbsp; Status: ❌ NÃO IMPLEMENTADOEspecificação RN-033:

&nbsp; - Pré-autorização do valor total no cartão do titular

&nbsp; - Débito parcial conforme participantes pagam

&nbsp; - Cálculo automático do saldo restante

&nbsp; - Liberação da diferença após fechamento do jogo



&nbsp; Impacto: ALTO - é funcionalidade central do sistema financeiro.



&nbsp; Tarefas necessárias:

&nbsp; 1. Implementar fluxo de caução no pagamentoService

&nbsp; 2. Criar função de fechamento de jogo (2h antes)

&nbsp; 3. Calcular saldo a debitar do organizador

&nbsp; 4. Capturar valor parcial da caução

&nbsp; 5. Liberar diferença não utilizada



&nbsp; ---

&nbsp; 3.2 Sistema de Rateio Flexível (Percentual vs Valor Fixo)



&nbsp; Status: ⚠️ FRONTEND PRONTO, BACKEND INCOMPLETOEspecificação US-007:

&nbsp; - Modo Percentual: soma deve ser 100%

&nbsp; - Modo Valor Fixo: organizador paga diferença se total < valor reserva



&nbsp; O que falta no backend:

&nbsp; 1. Endpoint para salvar configuração de rateio

&nbsp; 2. Validação de rateio (soma = 100% ou soma ≤ valor reserva)

&nbsp; 3. Cálculo automático de amount\_to\_pay por participante

&nbsp; 4. Atualização da tabela rateios ou reservation\_participants



&nbsp; Arquivos a criar/modificar:

&nbsp; - src/services/core/rateios.service.ts (NOVO)

&nbsp; - src/hooks/core/useRateios.ts (NOVO)

&nbsp; - Endpoint: POST /api/reservas/\[id]/rateio



&nbsp; ---

&nbsp; 3.3 Fechamento Automático de Jogos



&nbsp; Status: ❌ NÃO IMPLEMENTADOEspecificação RN-040:

&nbsp; - Ocorre 2h antes do horário do jogo

&nbsp; - Consolida todos os pagamentos (turma + convites)

&nbsp; - Debita saldo final do organizador

&nbsp; - Gera comprovante financeiro

&nbsp; - Envia confirmação final a todos



&nbsp; Tarefas necessárias:

&nbsp; 1. Criar Supabase Edge Function ou Cron Job:

&nbsp;   - supabase/functions/close-game/index.ts

&nbsp; 2. Implementar lógica de fechamento:

&nbsp;   - Buscar reservas 2h antes do horário

&nbsp;   - Somar pagamentos confirmados

&nbsp;   - Calcular diferença a cobrar do organizador

&nbsp;   - Capturar valor da caução

&nbsp;   - Atualizar status da reserva para "fechada"

&nbsp;   - Enviar notificações

&nbsp; 3. Configurar trigger ou cron para executar a cada hora



&nbsp; ---

&nbsp; 3.4 Notificações Automáticas



&nbsp; Status: ⚠️ ESTRUTURA CRIADA, AUTOMAÇÃO FALTANDOEspecificação US-021:

&nbsp; - 45min antes: lembrete com regras

&nbsp; - 10min antes: lembrete final + promoção

&nbsp; - Após aceite de convite

&nbsp; - Avaliação 1h após jogo



&nbsp; Tarefas necessárias:

&nbsp; 1. Criar Supabase Edge Functions ou Cron Jobs:

&nbsp;   - send-reminder-45min/

&nbsp;   - send-reminder-10min/

&nbsp;   - send-review-request/

&nbsp; 2. Configurar cron jobs no Supabase

&nbsp; 3. Implementar envio via WhatsApp API

&nbsp; 4. Variável de ambiente:

&nbsp;   - CRON\_SECRET\_TOKEN (já existe)



&nbsp; ---

&nbsp; 3.5 Sistema de Compra de Créditos (Convidados)



&nbsp; Status: 🟡 PARCIALMENTE IMPLEMENTADOEspecificação US-010:

&nbsp; - Convidado pode comprar créditos antecipadamente

&nbsp; - Créditos usados automaticamente em próximos convites

&nbsp; - Se crédito insuficiente, complementa com outra forma



&nbsp; O que falta:

&nbsp; 1. Endpoint para compra de créditos sem vínculo a reserva:

&nbsp;   - POST /api/creditos/comprar

&nbsp; 2. Lógica de uso automático ao aceitar convite

&nbsp; 3. Validação de saldo antes de aceitar convite pago

&nbsp; 4. Fluxo de complemento se saldo insuficiente



&nbsp; Arquivos a modificar:

&nbsp; - src/services/core/creditos.service.ts - adicionar método comprarCreditos()

&nbsp; - src/hooks/core/useCreditos.ts - adicionar mutation



&nbsp; ---

&nbsp; 4. VALIDAÇÕES E REGRAS DE NEGÓCIO FALTANTES



&nbsp; 4.1 Validações de Rateio



&nbsp; RN-017, RN-018, RN-019:

&nbsp; - ❌ Backend não valida soma de percentuais = 100%

&nbsp; - ❌ Backend não valida total valor fixo ≤ valor reserva

&nbsp; - ❌ Backend não calcula automaticamente diferença para organizador



&nbsp; Ação: Implementar validações em rateios.service.ts.



&nbsp; ---

&nbsp; 4.2 Validações de Convites



&nbsp; RN-026:

&nbsp; - ❌ Total de participantes (turma + convites) não pode exceder capacidade



&nbsp; Ação: Implementar validação ao criar convite e ao aceitar convite.



&nbsp; ---

&nbsp; 4.3 Validações de Reservas



&nbsp; RN-006:

&nbsp; - ❌ Cliente não pode ter saldo devedor > R$ 200 para fazer novas reservas



&nbsp; Ação: Implementar middleware de validação antes de criar reserva.



&nbsp; ---

&nbsp; 4.4 Validações de Cadastro



&nbsp; RN-049, RN-050:

&nbsp; - ❌ CPF e RG devem ser únicos (constraint no banco)

&nbsp; - ✅ CEP validado via ViaCEP



&nbsp; Ação: Adicionar constraints UNIQUE no banco:

&nbsp; ALTER TABLE users ADD CONSTRAINT users\_cpf\_unique UNIQUE (cpf);

&nbsp; ALTER TABLE users ADD CONSTRAINT users\_rg\_unique UNIQUE (rg);



&nbsp; ---

&nbsp; 5. EDGE FUNCTIONS / SERVERLESS FALTANTES



&nbsp; Supabase Edge Functions especificadas no PROMPT.md:



&nbsp; 1. ❌ process-payment/ - Processamento de pagamentos Asaas

&nbsp; 2. ❌ send-whatsapp/ - Envio de mensagens WhatsApp

&nbsp; 3. ❌ close-game/ - Fechamento automático de jogos

&nbsp; 4. ❌ send-reminder-45min/ - Lembrete 45min antes

&nbsp; 5. ❌ send-reminder-10min/ - Lembrete 10min antes

&nbsp; 6. ❌ send-review-request/ - Solicitação de avaliação



&nbsp; Localização esperada: supabase/functions/



&nbsp; ---

&nbsp; 6. MIGRATIONS FALTANTES



&nbsp; O PRD especifica migrations organizadas:

&nbsp; - ❌ 001\_initial\_schema.sql

&nbsp; - ❌ 002\_core\_tables.sql

&nbsp; - ❌ 003\_escolinha\_tables.sql (fora do escopo MVP)

&nbsp; - ❌ 004\_dayuse\_tables.sql (fora do escopo MVP)



&nbsp; Atual: Migrations existem parcialmente em supabase/migrations/ mas não seguem organização do PRD.



&nbsp; Ação: Consolidar migrations existentes e criar novas para campos faltantes.



&nbsp; ---

&nbsp; 🟡 MÉDIO - MELHORIAS RECOMENDADAS



&nbsp; 1. Row Level Security (RLS)



&nbsp; Status: ⚠️ VERIFICAR POLÍTICASEspecificação: Todas as tabelas devem ter RLS ativo



&nbsp; Ação: Auditar policies de TODAS as tabelas:

&nbsp; -- Exemplo de policy que deve existir

&nbsp; CREATE POLICY "users\_select\_own" ON users

&nbsp; FOR SELECT USING (auth.uid() = id);



&nbsp; CREATE POLICY "reservas\_organizador" ON reservas

&nbsp; FOR ALL USING (auth.uid() = user\_id OR

&nbsp;    auth.uid() IN (SELECT user\_id FROM users WHERE role IN ('admin', 'gestor'))

&nbsp; );



&nbsp; 2. Índices de Performance



&nbsp; Status: ⚠️ NÃO VERIFICADORecomendações:

&nbsp; CREATE INDEX idx\_reservas\_data ON reservas(data);

&nbsp; CREATE INDEX idx\_reservas\_user\_id ON reservas(user\_id);

&nbsp; CREATE INDEX idx\_convites\_reserva\_id ON convites(reserva\_id);

&nbsp; CREATE INDEX idx\_payments\_user\_id ON payments(user\_id);

&nbsp; CREATE INDEX idx\_transacoes\_user\_id ON transacoes\_credito(user\_id);



&nbsp; 3. Triggers e Functions



&nbsp; Especificação do PRD:

&nbsp; - ❌ Trigger para decrementar filled\_slots ao aceitar convite

&nbsp; - ❌ Trigger para atualizar saldo do usuário após transação

&nbsp; - ❌ Function para calcular valor de rateio automaticamente



&nbsp; ---

&nbsp; 🟢 BAIXO - FUNCIONALIDADES FUTURAS (Fora do MVP)



&nbsp; Módulo Escolinha



&nbsp; - Tabelas: school\_classes, students, class\_enrollments, attendance, school\_payments, teachers, teacher\_commissions

&nbsp; - Status: Fora do escopo atual



&nbsp; Módulo Day Use



&nbsp; - Tabelas: day\_use\_packages, day\_use\_addons, day\_use\_reservations, etc.

&nbsp; - Status: Fora do escopo atual



&nbsp; ---

&nbsp; 📊 PRIORIZAÇÃO DAS TAREFAS



&nbsp; 🔴 CRÍTICO (Bloqueia funcionalidades core):



&nbsp; 1. Criar tabela payments

&nbsp; 2. Adicionar campos faltantes em reservas: observacoes, split\_mode, team\_id

&nbsp; 3. Adicionar campos faltantes em reserva\_participantes (source, split\_type, etc.)

&nbsp; 4. Integração real com Asaas (pagamentos)

&nbsp; 5. Sistema de caução com pré-autorização

&nbsp; 6. Fechamento automático de jogos (Edge Function)

&nbsp; 7. Validações de rateio no backend



&nbsp; 🟡 ALTO (Funcionalidades importantes):



&nbsp; 8. Completar integração WhatsApp (templates + envio real)

&nbsp; 9. Notificações automáticas (Edge Functions + Cron)

&nbsp; 10. Sistema de compra de créditos sem vínculo

&nbsp; 11. Ajustar tabela convites para modelo de "lotes"

&nbsp; 12. Validações de negócio (RN-006, RN-026, RN-049, RN-050)

&nbsp; 13. RLS policies em todas as tabelas

&nbsp; 14. Índices de performance



&nbsp; 🟢 MÉDIO (Melhorias e refinamentos):



&nbsp; 15. Consolidar migrations

&nbsp; 16. Triggers automáticos (saldo, vagas, etc.)

&nbsp; 17. Ajustar campos em users (RG, CEP detalhado, user\_type)

&nbsp; 18. Sistema de cupons de desconto

&nbsp; 19. Exportação de relatórios (PDF/Excel)



&nbsp; ---

&nbsp; 🎯 RESUMO QUANTITATIVO



&nbsp; - Tabelas a criar: 1 (payments)

&nbsp; - Campos a adicionar: ~25 campos em várias tabelas

&nbsp; - Serviços a implementar: 3 (rateios, pagamentos Asaas, notificações)

&nbsp; - Edge Functions a criar: 6

&nbsp; - Integrações a completar: 2 (Asaas, WhatsApp)

&nbsp; - Validações a implementar: 8 regras de negócio

&nbsp; - RLS policies a auditar: 20 tabelas

&nbsp; - Índices recomendados: 5+



&nbsp; ---

&nbsp; 📝 PRÓXIMOS PASSOS SUGERIDOS



&nbsp; Sprint 1 - Backend Core (2 semanas):



&nbsp; 1. Criar migration completa com todos os campos faltantes

&nbsp; 2. Implementar serviço de rateio com validações

&nbsp; 3. Criar tabela payments e integrar com Asaas (sandbox)

&nbsp; 4. Implementar sistema de caução



&nbsp; Sprint 2 - Automações (1-2 semanas):



&nbsp; 5. Criar Edge Function de fechamento de jogos

&nbsp; 6. Implementar notificações automáticas via WhatsApp

&nbsp; 7. Configurar cron jobs no Supabase

&nbsp; 8. Testar fluxo completo de reserva→pagamento→fechamento



&nbsp; Sprint 3 - Refinamentos (1 semana):



&nbsp; 9. Auditar e implementar todas as RLS policies

&nbsp; 10. Adicionar índices de performance

&nbsp; 11. Implementar validações de negócio faltantes

&nbsp; 12. Testes de integração end-to-end



&nbsp; ---

&nbsp; Este relatório identifica TODAS as pendências críticas para deixar o sistema funcional conforme especificação do PRD. Priorize os itens CRÍTICOS para ter um MVP

&nbsp; funcional.



