PRD - Sistema Arena Dona Santa v2.0
1. Visão Geral do Produto
1.1 Objetivo
Desenvolver uma plataforma web responsiva para gestão completa de reservas de quadras esportivas, com sistema robusto de gestão de turmas, convites e rateio flexível de custos, permitindo que clientes organizem jogos de forma autônoma e gestores controlem toda a operação através de um sistema centralizado.
1.2 Problema a Resolver
Arenas esportivas enfrentam dificuldades na gestão manual de reservas, controle de pagamentos, organização de jogos com múltiplos participantes e comunicação com clientes. Além disso, clientes precisam de flexibilidade para gerenciar grupos recorrentes de jogadores (turmas) e diferentes formas de divisão de custos. O sistema elimina processos manuais, oferece autonomia na gestão de turmas e convites, e otimiza a taxa de ocupação das quadras.
1.3 Público-Alvo
	• Clientes finais (Organizadores): Jogadores que reservam quadras e organizam partidas
	• Convidados: Participantes que são convidados para jogos através de links
	• Gestores: Administradores da arena responsáveis pela operação
1.4 Proposta de Valor
	• Para organizadores: Gestão independente de turmas, rateio flexível (percentual ou valor fixo), convites automatizados, histórico completo
	• Para convidados: Perfil próprio na plataforma, histórico de participações, possibilidade de comprar créditos antecipadamente
	• Para gestores: Automação operacional, controle financeiro completo, relatórios gerenciais e comunicação automatizada

2. Escopo do Produto
2.1 Módulo Core (MVP) - Atualizado
2.1.1 Sistema de Reservas
US-001: Como cliente, quero selecionar quadra, data, tipo de reserva e adicionar observações
	• Critérios de Aceite: 
		○ Seleção de quadra disponível
		○ Calendário interativo para escolha de data
		○ Três tipos de reserva: Avulsa, Mensalista, Recorrente
		○ Exibição de horários disponíveis com preços dinâmicos
		○ Validação de conflitos em reservas recorrentes/mensalistas
		○ NOVO: Campo de texto livre para observações (máx 500 caracteres)
		○ NOVO: Observações visíveis no detalhamento da reserva
		○ Aplicação opcional de cupom de desconto
		○ Cálculo automático do valor total
US-002: Como cliente, quero me cadastrar com informações completas para acessar o sistema
	• Critérios de Aceite: 
		○ Cadastro com: nome completo, CPF, RG, data de nascimento, WhatsApp, e-mail, CEP (com autopreenchimento de endereço), número, complemento, senha
		○ NOVO: Validação de CPF e RG únicos
		○ NOVO: Integração com API ViaCEP para autopreenchimento
		○ NOVO: Campos: logradouro, bairro, cidade, estado preenchidos automaticamente
		○ Cadastro opcional de cartão de crédito/débito
		○ Login via e-mail ou CPF + senha
		○ Criptografia de senha (bcrypt ou similar)
		○ Recuperação de senha via e-mail
US-003: Como cliente, quero pagar minha reserva de diferentes formas
	• Critérios de Aceite: 
		○ Pagamento via: Pix, cartão de crédito, cartão de débito, saldo acumulado, caução
		○ Sistema de caução com pré-autorização no cartão
		○ Débito parcial conforme convites são pagos
		○ Uso de créditos acumulados para abater valores
		○ Confirmação de pagamento em tempo real
		○ Comprovante digital disponível
2.1.2 Sistema de Turmas (REFORMULADO)
US-004: Como cliente, quero criar turmas de forma autônoma para reutilizar em diferentes jogos
	• Critérios de Aceite: 
		○ Criação de turma independente de reserva (aba "Minhas Turmas")
		○ Campos da turma: nome da turma, descrição (opcional)
		○ Cadastro de membros da turma com: nome, WhatsApp, e-mail, status (fixo/variável)
		○ NOVO: Possibilidade de ter múltiplas turmas ativas simultaneamente
		○ NOVO: Marcação de membros como "fixos" (sempre incluídos) ou "variáveis"
		○ Edição e exclusão de turmas
		○ Visualização de todas as turmas cadastradas
		○ Histórico de jogos de cada turma
US-005: Como cliente, quero vincular uma turma existente à minha reserva
	• Critérios de Aceite: 
		○ Na página "Minhas Reservas" > "Gerenciar Reserva"
		○ Opção "Vincular Turma Existente"
		○ Seleção de turma cadastrada via dropdown
		○ Sistema carrega automaticamente membros da turma
		○ Membros fixos já aparecem marcados
		○ Possibilidade de desmarcar membros variáveis
		○ Confirmação de vínculo
		○ NOVO: Uma reserva pode ter apenas uma turma vinculada por vez
		○ NOVO: Mesmo cliente pode ter múltiplas reservas com turmas diferentes
US-006: Como cliente, quero criar uma turma durante o processo de reserva
	• Critérios de Aceite: 
		○ Durante reserva, opção "Criar Turma Junto"
		○ Cadastro rápido de nome da turma e membros
		○ Turma fica salva em "Minhas Turmas" para reuso
		○ Turma automaticamente vinculada àquela reserva
		○ Possibilidade de editar turma posteriormente
US-007: Como cliente, quero definir forma de rateio flexível para cada reserva
	• Critérios de Aceite: 
		○ Na página "Gerenciar Reserva" após vincular turma
		○ Seção "Configurar Rateio"
		○ NOVO: Opção de modo de divisão via checkbox/toggle: 
			§ "Percentual": cada membro paga um percentual do total
			§ "Valor Fixo": cada membro paga um valor específico
Modo Percentual: 
		○ Lista de membros com campo de percentual ao lado
		○ Validação: soma deve ser exatamente 100%
		○ Indicador visual da soma atual
		○ Opção "Dividir Igualmente" (distribui 100% entre todos)
Modo Valor Fixo: 
		○ NOVO: Campo de valor em R$ ao lado de cada membro
		○ NOVO: Cálculo automático do total rateado
		○ NOVO: Indicador visual: "R$ X de R$ Y cobertos"
		○ NOVO: Se total rateado < valor reserva: organizador paga diferença
		○ NOVO: Se total rateado > valor reserva: erro de validação
		○ NOVO: Possibilidade de definir R$ 0,00 para membros gratuitos
		○ Visualização do valor que cada membro pagará
		○ Botão "Salvar Configuração de Rateio"
		○ Rateio vinculado àquela reserva específica (não à turma)
US-008: Como cliente, quero criar convites públicos para preencher vagas no jogo
	• Critérios de Aceite: 
		○ Na página "Gerenciar Reserva"
		○ Opção "Criar Convites Públicos"
		○ Definição de: 
			§ Número de vagas disponíveis
			§ Valor por vaga (pode ser R$ 0,00 para gratuito)
			§ Descrição opcional do jogo
		○ NOVO: Sistema gera link único de convite
		○ NOVO: Convite não identifica participantes previamente
		○ NOVO: Link pode ser compartilhado via WhatsApp, e-mail, redes sociais
		○ Visualização de vagas preenchidas em tempo real
		○ Opção de desabilitar link (fechar convites)
		○ NOVO: Múltiplos lotes de convites para mesma reserva (ex: convite A com valor X, convite B com valor Y)
2.1.3 Fluxo de Aceite de Convite (NOVO)
US-009: Como convidado, quero aceitar um convite através de link e criar meu perfil
	• Critérios de Aceite: 
		○ Acesso via link único compartilhado
		○ Página de convite exibe: 
			§ Nome do organizador
			§ Quadra, data, horário
			§ Valor do convite (se pago)
			§ Vagas disponíveis
			§ Descrição do jogo
		○ Botão destacado "Aceitar Convite"
		○ Ao clicar, redireciona para: 
			§ Se não logado: página de login/cadastro
			§ Se já logado: direto para confirmação
Cadastro simplificado do convidado: 
		○ Campos obrigatórios: nome, CPF, e-mail, WhatsApp, senha
		○ Campos opcionais: RG, endereço completo
		○ Aceite de termos
		○ Criação de perfil completo na plataforma
Confirmação e pagamento: 
		○ Se convite pago: redireciona para página de pagamento
		○ Métodos aceitos: Pix, cartão, saldo de créditos
		○ Se convite gratuito: confirmação imediata
		○ Após confirmação: convidado adicionado automaticamente à lista de participantes
		○ Organizador recebe notificação via WhatsApp
US-010: Como convidado com perfil, quero visualizar meus jogos e gerenciar créditos
	• Critérios de Aceite: 
		○ Acesso a painel próprio após login
		○ Dashboard com seções: 
			§ "Próximos Jogos": jogos futuros confirmados
			§ "Histórico": jogos já realizados
			§ "Meu Saldo": créditos disponíveis
			§ "Comprar Créditos": adicionar saldo antecipadamente
NOVO - Dashboard do Convidado: 
		○ "Convites Recebidos": pendentes de confirmação
		○ "Convites Aceitos": histórico de aceites
		○ Total de jogos participados
		○ Estatísticas básicas (gols, vitórias se houver gamificação futura)
Compra de Créditos: 
		○ Seleção de valor (R$ 50, R$ 100, R$ 200, personalizado)
		○ Pagamento via Pix ou cartão
		○ Créditos adicionados instantaneamente
		○ Uso automático em próximos convites pagos
2.1.4 Painel do Cliente Organizador (ATUALIZADO)
US-011: Como organizador, quero ter acesso centralizado a todas minhas funcionalidades
	• Critérios de Aceite: 
		○ Dashboard com cards de acesso rápido: 
			§ "Nova Reserva"
			§ "Criar Turma" (NOVO)
			§ "Minhas Reservas"
			§ "Minhas Turmas"
			§ "Convites Criados" (NOVO)
			§ "Meu Saldo"
		○ Estatísticas gerais: 
			§ Total de jogos organizados
			§ Total investido
			§ Créditos recebidos
			§ Próximo jogo
US-012: Como organizador, quero gerenciar minhas reservas com todas as informações
	• Critérios de Aceite: 
		○ Aba "Minhas Reservas" lista todas as reservas (ativas e históricas)
		○ Filtros: futuras, passadas, canceladas
		○ Cada reserva exibe: quadra, data, horário, status, valor
		○ Botão "Gerenciar" em cada reserva
Página "Gerenciar Reserva": 
		○ Seção "Informações": quadra, data, horário, observações, valor total
		○ Seção "Turma": 
			§ "Criar Turma" (se não tem)
			§ "Vincular Turma Existente" (se não tem)
			§ Lista de membros (se já tem turma)
			§ Botão "Desvincular Turma"
		○ Seção "Rateio": 
			§ Configuração de modo de divisão
			§ Lista de membros com valores/percentuais
			§ Resumo financeiro
		○ Seção "Convites": 
			§ "Criar Novo Convite"
			§ Lista de convites ativos com links
			§ Vagas preenchidas/disponíveis por convite
			§ Botão "Desativar Convite"
		○ Seção "Participantes Confirmados": 
			§ Lista completa de todos os participantes
			§ Status de pagamento de cada um
			§ Origem (turma ou convite)
		○ Seção "Resumo Financeiro": 
			§ Valor total da reserva
			§ Valor já pago por participantes
			§ Seu saldo a pagar/receber
		○ Botão "Cancelar Reserva"
US-013: Como organizador, quero visualizar e gerenciar meus convites criados
	• Critérios de Aceite: 
		○ Aba "Convites Criados" no dashboard
		○ Lista todos os convites ativos e inativos
		○ Informações por convite: 
			§ Jogo vinculado (quadra, data, hora)
			§ Número de vagas totais
			§ Vagas preenchidas
			§ Valor por vaga
			§ Link do convite
			§ Status (ativo/encerrado)
		○ Ações: 
			§ Copiar link
			§ Compartilhar via WhatsApp
			§ Ver lista de quem aceitou
			§ Desativar convite
		○ Filtros: por jogo, por status, por período
2.1.5 Sistema de Gestão (Mantido + Ajustes)
US-014: Como gestor, quero cadastrar e gerenciar quadras
	• Critérios de Aceite: 
		○ Cadastro com nome e características da quadra
		○ Definição de grade horária por dia da semana
		○ Configuração de valores por horário (avulsa e mensalista)
		○ Ativação/desativação de horários específicos
		○ Visualização de todas as quadras cadastradas
US-015: Como gestor, quero bloquear horários para manutenção ou eventos
	• Critérios de Aceite: 
		○ Bloqueio por data específica ou período
		○ Bloqueio por faixa de horário
		○ Seleção de quadra(s) a bloquear
		○ Campo obrigatório de motivo
		○ Horários bloqueados não aparecem para clientes
		○ Histórico de bloqueios
US-016: Como gestor, quero visualizar a agenda geral das quadras
	• Critérios de Aceite: 
		○ Visão semanal em formato de grade
		○ Código de cores por status (confirmada, pendente, cancelada)
		○ Filtros: tipo de reserva, status, quadra, período
		○ Detalhes ao clicar em reserva
		○ Navegação entre semanas/meses
US-017: Como gestor, quero gerenciar reservas e ver detalhamento completo
	• Critérios de Aceite: 
		○ Criação manual de reserva para qualquer cliente
		○ Visualização de detalhes completos: 
			§ Dados do titular
			§ Observações da reserva
			§ Turma vinculada (se houver)
			§ Forma de rateio configurada
			§ Lista completa de participantes
			§ Status de pagamento individual
			§ Origem de cada participante (turma ou convite)
		○ Cancelamento de reservas com registro de motivo
		○ Edição de dados da reserva
		○ Envio de mensagem ao titular
		○ Registro de pagamentos externos
US-018: Como gestor, quero acompanhar a situação financeira dos clientes
	• Critérios de Aceite: 
		○ Lista de clientes com saldo devedor
		○ Extrato detalhado por cliente
		○ Identificação de débitos por jogo
		○ Registro de pagamentos manuais
		○ Emissão de cobranças
		○ Relatório de inadimplência
US-019: Como gestor, quero gerar relatórios gerenciais
	• Critérios de Aceite: 
		○ Relatório de Faturamento: por quadra, tipo de reserva, cliente, período
		○ Relatório de Participação: clientes ativos, frequência, horários populares
		○ Relatório de Convites: total criados, taxa de aceite, conversão em receita
		○ Relatório de Avaliações: notas médias, comentários
		○ Relatório de Turmas: turmas mais ativas, membros recorrentes
		○ Visualização em gráficos e tabelas
		○ Exportação em PDF e Excel
US-020: Como gestor, quero configurar parâmetros do sistema
	• Critérios de Aceite: 
		○ Horário mínimo de antecedência para reservas
		○ Dia de vencimento para mensalistas
		○ Política de cancelamento
		○ Ativar/desativar formas de pagamento
		○ Templates de mensagens automáticas
		○ Valores de desconto e bônus do programa de indicação
2.1.6 Automações e Notificações (Atualizado)
US-021: Como cliente/convidado, quero receber lembretes automáticos via WhatsApp
	• Critérios de Aceite: 
		○ Para organizadores e convidados: 
			§ 45min antes: lembrete com regras (chuteira society)
			§ 10min antes: lembrete final + promoção do bar
		○ Para organizadores de jogos recorrentes: 
			§ Toda segunda: lembrete para convidar jogadores
		○ Para mensalistas: 
			§ Dia 25: aviso de cobrança mensal
		○ Para convidados que aceitaram: 
			§ Confirmação de aceite
			§ Lembrete 24h antes do jogo
		○ Opt-out disponível nas configurações
US-022: Como organizador, quero receber notificações quando alguém aceitar meu convite
	• Critérios de Aceite: 
		○ Notificação via WhatsApp e email
		○ Informação: nome do participante, horário de aceite
		○ Link para gerenciar reserva
		○ Atualização em tempo real no painel
US-023: Como cliente, quero avaliar o jogo após sua realização
	• Critérios de Aceite: 
		○ Envio automático 1h após término do jogo
		○ Avaliação via WhatsApp ou e-mail
		○ Opções: Excelente, Boa, Regular, Ruim
		○ Campo opcional para comentário
		○ Dados compilados para relatórios do gestor
US-024: Como gestor, quero enviar promoções para a base de clientes
	• Critérios de Aceite: 
		○ Disparo em massa via WhatsApp
		○ Segmentação: organizadores, convidados, todos
		○ Mensagem personalizável
		○ Link direto para reservas
		○ Histórico de disparos

3. Requisitos Funcionais Detalhados
3.1 Tipos de Reserva (Mantido)
3.1.1 Reserva Avulsa
	• Reserva pontual para data específica
	• Pagamento único
	• Sem compromisso futuro
	• Cancelamento conforme política definida
3.1.2 Reserva Mensalista
	• Mesmo horário todo mês
	• Cobrança automática no dia configurado (padrão: dia 25)
	• Desconto no valor comparado a avulsa
	• Cancelamento com antecedência mínima
3.1.3 Reserva Recorrente
	• Mesmo horário toda semana
	• Renovação automática até cancelamento
	• Cada ocorrência pode ter turmas/convites independentes
	• Cobrança por jogo ou pacote
3.2 Sistema de Turmas (REFORMULADO)
3.2.1 Turma como Entidade Autônoma
	• Turma é independente de reserva: pode ser criada a qualquer momento
	• Reutilizável: mesma turma pode ser vinculada a múltiplas reservas diferentes
	• Múltiplas turmas por cliente: um cliente pode ter várias turmas cadastradas
	• Membros classificados: fixos (sempre incluídos) ou variáveis (opcional incluir)
3.2.2 Vínculo Turma-Reserva
	• 1 para 1: cada reserva pode ter no máximo 1 turma vinculada
	• Vínculo opcional: reserva pode não ter turma (usar apenas convites)
	• Vínculo posterior: pode vincular turma após criar reserva
	• Desvínculo: pode remover turma de reserva a qualquer momento
3.2.3 Fluxos de Criação de Turma
	1. Autônomo: Cliente cria turma na aba "Minhas Turmas", depois vincula a reservas
	2. Durante reserva: Cliente cria turma no processo de reserva, turma fica salva para reuso
	3. Pós-reserva: Cliente cria reserva primeiro, depois cria/vincula turma
3.3 Sistema de Rateio (NOVO)
3.3.1 Modo de Divisão
	• Configurável por reserva: cada jogo pode ter modo diferente
	• Dois modos disponíveis:
Modo Percentual:
	• Cada membro paga um % do valor total
	• Soma deve ser exatamente 100%
	• Facilitador: botão "Dividir Igualmente"
	• Exemplo: Jogo R$ 200, 4 pessoas a 25% cada = R$ 50 cada
Modo Valor Fixo:
	• Cada membro paga um valor específico em R$
	• Total rateado pode ser ≤ valor da reserva
	• Se < valor reserva: organizador paga diferença
	• Se > valor reserva: erro de validação
	• Permite R$ 0,00 para membros gratuitos
	• Exemplo: Jogo R$ 200, Pessoa A paga R$ 60, B paga R$ 40, C paga R$ 50, Organizador paga R$ 50
3.3.2 Regras de Validação
	• Percentual: soma deve ser exatamente 100%
	• Valor Fixo: soma não pode exceder valor total da reserva
	• Todos os valores devem ser ≥ 0
	• Pelo menos 1 pessoa deve ter valor > 0
3.4 Sistema de Convites (REFORMULADO)
3.4.1 Convites como Auto-Criação de Turma
	• Convite não identifica participantes previamente
	• Organizador define apenas: número de vagas + valor
	• Link público gerado automaticamente
	• Qualquer pessoa com link pode aceitar
	• Participantes vão sendo adicionados conforme aceitam
3.4.2 Múltiplos Lotes de Convites
	• Mesma reserva pode ter vários convites diferentes
	• Exemplo: 
		○ Convite A: 5 vagas a R$ 30 (amigos próximos)
		○ Convite B: 3 vagas a R$ 40 (conhecidos)
		○ Convite C: 2 vagas gratuitas (VIPs)
	• Cada convite tem link único
	• Total de participantes não pode exceder capacidade
3.4.3 Fluxo de Aceite
	1. Convidado clica no link
	2. Vê detalhes do jogo e valor
	3. Clica em "Aceitar Convite"
	4. Faz login ou cadastro completo
	5. Efetua pagamento (se convite pago)
	6. É adicionado automaticamente como participante
	7. Ganha perfil completo na plataforma
	8. Organizador é notificado
3.5 Perfil do Convidado (NOVO)
3.5.1 Criação de Perfil
	• Convidado que aceita convite ganha perfil completo
	• Pode fazer login como qualquer cliente
	• Acessa painel próprio com funcionalidades específicas
3.5.2 Funcionalidades do Convidado
	• Próximos Jogos: visualiza jogos confirmados
	• Histórico: jogos já realizados como convidado
	• Convites Pendentes: aceites em aberto
	• Meu Saldo: créditos disponíveis
	• Comprar Créditos: adicionar saldo antecipadamente
	• Estatísticas: número de jogos, quadras frequentadas
3.5.3 Sistema de Créditos
	• Convidado pode comprar créditos a qualquer momento
	• Créditos ficam em conta
	• Uso automático ao aceitar próximos convites pagos
	• Se crédito insuficiente, complementa com outra forma de pagamento
3.6 Sistema Financeiro (Atualizado)
3.6.1 Caução (Mantido)
	• Pré-autorização do valor total no cartão do titular
	• Débito parcial conforme participantes pagam
	• Cálculo automático do saldo restante
	• Liberação da diferença após fechamento do jogo
	• Prazo de confirmação: até 2h antes do jogo
3.6.2 Saldo do Cliente (Organizadores e Convidados)
	• Créditos: recebidos de pagamentos de participantes (organizador) ou comprados (convidado)
	• Débitos: valores pendentes de reservas
	• Saldo pode ser positivo (crédito) ou negativo (dívida)
	• Créditos podem ser usados em novas reservas/convites
	• Sistema de cobrança automática para saldos negativos
3.6.3 Fechamento de Jogos
	• Ocorre no horário configurado (ex: 2h antes do jogo)
	• Consolida todos os pagamentos (turma + convites)
	• Debita saldo final do organizador conforme rateio
	• Gera comprovante financeiro
	• Envia confirmação final a todos os participantes
3.6.4 Fluxo Financeiro Completo
Reserva com Turma (Modo Percentual):
	1. Organizador reserva horário: R$ 200
	2. Vincula turma de 4 pessoas
	3. Define rateio: A=30%, B=25%, C=20%, Organizador=25%
	4. Sistema calcula: A=R$60, B=R$50, C=R$40, Org=R$50
	5. Membros pagam suas partes
	6. Organizador paga R$ 50 no fechamento
Reserva com Turma (Modo Valor Fixo):
	1. Organizador reserva horário: R$ 200
	2. Vincula turma de 3 pessoas
	3. Define: A=R$50, B=R$70, C=R$0 (gratuito)
	4. Total rateado: R$ 120
	5. Organizador pagará: R$ 80 (diferença)
Reserva com Convites:
	1. Organizador reserva: R$ 200
	2. Cria convite: 6 vagas a R$ 30 = R$ 180
	3. 5 pessoas aceitam e pagam = R$ 150
	4. Organizador paga diferença: R$ 50
Reserva Híbrida (Turma + Convites):
	1. Organizador reserva: R$ 200
	2. Vincula turma de 2 pessoas: A=R$40, B=R$40
	3. Cria convite: 3 vagas a R$ 35 = R$ 105
	4. 2 pessoas aceitam convite = R$ 70
	5. Total arrecadado: R$ 150
	6. Organizador paga: R$ 50

4. Requisitos Não-Funcionais (Mantido)
4.1 Performance
	• Tempo de resposta < 2s para 95% das requisições
	• Carregamento inicial da página < 3s
	• Suporte a 1000 usuários simultâneos
	• Otimização de imagens e assets
4.2 Segurança
	• Criptografia SSL/TLS em todas as comunicações
	• Senhas criptografadas com bcrypt (custo 12+)
	• Proteção contra SQL injection
	• Proteção contra XSS e CSRF
	• Validação de entrada em todos os formulários
	• Autenticação via JWT com refresh tokens
	• Logs de auditoria para ações críticas
	• Validação de CPF e RG únicos no cadastro
4.3 Usabilidade
	• Design mobile-first
	• Interface intuitiva com máximo 3 cliques para ações principais
	• Feedback visual para todas as ações
	• Mensagens de erro claras e em português
	• Acessibilidade: contraste WCAG AA, navegação por teclado
	• Autopreenchimento de endereço via CEP
4.4 Compatibilidade
	• Navegadores: Chrome, Firefox, Safari, Edge (2 últimas versões)
	• Dispositivos: desktop, tablet, smartphone
	• Resolução mínima: 320px (mobile)
4.5 Escalabilidade
	• Arquitetura preparada para múltiplas arenas
	• Banco de dados otimizado para crescimento
	• Cache de dados frequentes
	• CDN para assets estáticos
4.6 Disponibilidade
	• Uptime mínimo: 99% (SLA)
	• Backup diário automático
	• Plano de recuperação de desastres
	• Monitoramento 24/7

5. Integrações (Mantido + Adições)
5.1 Gateway de Pagamento - Asaas
Funcionalidades necessárias:
	• Pagamento via Pix (QR Code e Pix Copia e Cola)
	• Pagamento via cartão de crédito
	• Pagamento via cartão de débito
	• Pré-autorização (caução)
	• Captura parcial de valores
	• Webhooks para confirmação de pagamento
	• Estorno e cancelamento
	• NOVO: Gestão de saldo/carteira de clientes
5.2 WhatsApp Business API
Funcionalidades necessárias:
	• Envio de mensagens automáticas
	• Templates pré-aprovados pelo WhatsApp
	• Envio de links e botões
	• Confirmação de entrega
	• Opt-in/opt-out de mensagens
	• NOVO: Notificações de aceite de convite
5.3 API ViaCEP (NOVO)
Funcionalidades:
	• Consulta de endereço por CEP
	• Autopreenchimento de logradouro, bairro, cidade, estado
	• Tratamento de CEPs inválidos
	• Fallback para preenchimento manual
5.4 Supabase PostgreSQL
Estrutura de dados:
	• Autenticação e gestão de usuários
	• Armazenamento relacional
	• Real-time subscriptions para atualizações
	• Storage para documentos e imagens
	• Row Level Security (RLS)

6. Arquitetura do Sistema
6.1 Stack Tecnológica Sugerida (Mantida)
Frontend:
	• Next.js 14+ (React framework)
	• TypeScript
	• Tailwind CSS
	• Shadcn/ui (componentes)
	• React Query (state management)
	• Zod (validação)
Backend:
	• Supabase (BaaS)
	• PostgreSQL (banco de dados)
	• Edge Functions (serverless)
	• Supabase Auth (autenticação)
Integrações:
	• Asaas SDK
	• WhatsApp Business API
	• ViaCEP API
	• Cloudflare Pages (deploy)
6.2 Estrutura de Banco de Dados (ATUALIZADA)
Tabelas Principais:
users
- id (uuid, PK)
- name (text)
- cpf (text, unique)
- rg (text) -- NOVO
- birth_date (date)
- phone (text)
- email (text, unique)
- cep (text) -- NOVO
- address (text)
- number (text) -- NOVO
- complement (text) -- NOVO
- neighborhood (text) -- NOVO
- city (text) -- NOVO
- state (text) -- NOVO
- password_hash (text)
- referral_code (text, unique)
- user_type (enum: 'organizer', 'guest', 'both') -- NOVO
- balance (decimal) -- saldo em créditos
- created_at (timestamp)
courts (quadras)
- id (uuid, PK)
- name (text)
- description (text)
- capacity (integer) -- NOVO
- status (enum: 'active', 'inactive')
- created_at (timestamp)
schedules (grade horária)
- id (uuid, PK)
- court_id (uuid, FK)
- day_of_week (integer) -- 0-6
- start_time (time)
- end_time (time)
- price_single (decimal)
- price_monthly (decimal)
- status (enum: 'active', 'inactive')
reservations (reservas)
- id (uuid, PK)
- user_id (uuid, FK) -- organizador
- court_id (uuid, FK)
- date (date)
- start_time (time)
- end_time (time)
- type (enum: 'single', 'monthly', 'recurring')
- status (enum: 'pending', 'confirmed', 'cancelled')
- total_value (decimal)
- observations (text) -- NOVO
- team_id (uuid, FK, nullable) -- NOVO: turma vinculada
- split_mode (enum: 'percentage', 'fixed_value') -- NOVO
- created_at (timestamp)
teams (turmas) -- NOVA TABELA
- id (uuid, PK)
- user_id (uuid, FK) -- dono da turma
- name (text)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)
team_members (membros da turma) -- NOVA TABELA
- id (uuid, PK)
- team_id (uuid, FK)
- player_name (text)
- player_phone (text)
- player_email (text)
- is_fixed (boolean) -- sempre incluído
- created_at (timestamp)
reservation_participants (participantes de cada reserva) -- NOVA TABELA
- id (uuid, PK)
- reservation_id (uuid, FK)
- user_id (uuid, FK, nullable) -- se convidado cadastrado
- player_name (text) -- se ainda não cadastrado
- source (enum: 'team', 'invite') -- origem: turma ou convite
- split_type (enum: 'percentage', 'fixed_value')
- split_value (decimal) -- pode ser % ou R$
- amount_to_pay (decimal) -- valor calculado em R$
- payment_status (enum: 'pending', 'paid', 'free')
- payment_id (uuid, FK, nullable)
- created_at (timestamp)
invitations (convites públicos) -- REFORMULADA
- id (uuid, PK)
- reservation_id (uuid, FK)
- name (text) -- nome do lote de convite
- total_slots (integer) -- vagas totais
- filled_slots (integer) -- vagas preenchidas
- price_per_slot (decimal)
- invite_link (text, unique)
- status (enum: 'active', 'closed', 'expired')
- description (text)
- created_at (timestamp)
- expires_at (timestamp)
invitation_acceptances (aceites de convite) -- NOVA TABELA
- id (uuid, PK)
- invitation_id (uuid, FK)
- user_id (uuid, FK) -- quem aceitou
- accepted_at (timestamp)
- payment_id (uuid, FK, nullable)
- payment_status (enum: 'pending', 'paid', 'free')
payments (pagamentos)
- id (uuid, PK)
- user_id (uuid, FK)
- reservation_id (uuid, FK, nullable)
- invitation_id (uuid, FK, nullable)
- amount (decimal)
- method (enum: 'pix', 'credit_card', 'debit_card', 'balance')
- status (enum: 'pending', 'confirmed', 'failed', 'refunded')
- transaction_id (text) -- ID da Asaas
- created_at (timestamp)
transactions (extrato)
- id (uuid, PK)
- user_id (uuid, FK)
- type (enum: 'credit', 'debit')
- amount (decimal)
- description (text)
- related_type (enum: 'reservation', 'invitation', 'purchase', 'refund')
- related_id (uuid)
- balance_after (decimal) -- saldo após transação
- created_at (timestamp)
reviews (avaliações)
- id (uuid, PK)
- reservation_id (uuid, FK)
- user_id (uuid, FK)
- rating (enum: 'excellent', 'good', 'regular', 'poor')
- comment (text)
- created_at (timestamp)
referrals (indicações)
- id (uuid, PK)
- referrer_id (uuid, FK)
- referred_id (uuid, FK)
- status (enum: 'pending', 'completed')
- credit_given (boolean)
- created_at (timestamp)

7. Fluxos de Usuário (ATUALIZADOS)
7.1 Fluxo de Reserva com Criação de Turma
1. Cliente acessa página inicial
2. Clica em "Reserve seu horário"
3. Seleciona quadra desejada
4. Seleciona data no calendário
5. Escolhe tipo de reserva
6. Seleciona horário
7. [NOVO] Campo para observações (opcional)
8. [Opcional] Aplica cupom de desconto
9. Sistema calcula valor total
10. Cliente faz login ou se cadastra
11. [NOVO] Opção: "Criar Turma Junto" ou "Pular"
12. Se escolher criar:
    - Define nome da turma
    - Adiciona membros
    - Turma é salva em "Minhas Turmas"
    - Turma automaticamente vinculada à reserva
13. Escolhe forma de pagamento
14. Confirma pagamento
15. Recebe confirmação via WhatsApp e email
7.2 Fluxo de Vinculação de Turma Pós-Reserva
1. Cliente acessa "Minhas Reservas"
2. Clica em "Gerenciar" em uma reserva
3. Vai para seção "Turma"
4. Clica em "Vincular Turma Existente"
5. Seleciona turma cadastrada no dropdown
6. Sistema carrega membros da turma
7. Membros fixos já vêm marcados
8. Cliente pode desmarcar membros variáveis
9. Confirma vínculo
10. Passa para seção "Configurar Rateio"
7.3 Fluxo de Configuração de Rateio
1. Cliente está em "Gerenciar Reserva"
2. Turma já está vinculada
3. Seção "Configurar Rateio" exibe:
   - Toggle/Checkbox: "Modo de Divisão"
   - Opções: Percentual | Valor Fixo
[SE ESCOLHER PERCENTUAL:]
4. Lista de membros com campo "%" ao lado
5. Cliente define percentual de cada um
6. Sistema valida soma = 100%
7. Indicador visual mostra soma atual
8. [Opcional] Botão "Dividir Igualmente"
9. Sistema calcula valor em R$ de cada um
10. Cliente confirma configuração
[SE ESCOLHER VALOR FIXO:]
4. Lista de membros com campo "R$" ao lado
5. Cliente define valor exato de cada um
6. Sistema soma valores e mostra total
7. Indicador visual: "R$ X de R$ Y cobertos"
8. Se total < valor reserva: mostra diferença que organizador pagará
9. Se total > valor reserva: erro de validação
10. Cliente confirma configuração
11. Rateio salvo e vinculado àquela reserva
7.4 Fluxo de Criação de Convite Público
1. Cliente acessa "Gerenciar Reserva"
2. Seção "Convites"
3. Clica em "Criar Novo Convite"
4. Preenche:
   - Nome do convite (ex: "Galera do trabalho")
   - Número de vagas
   - Valor por vaga (R$)
   - Descrição opcional
5. Sistema gera link único
6. Cliente copia link
7. Compartilha via WhatsApp/redes sociais
8. Link fica ativo na lista de convites
9. Cliente vê vagas preenchidas em tempo real
10. [Opcional] Cliente desativa convite
7.5 Fluxo de Aceite de Convite (Convidado)
1. Convidado recebe link via WhatsApp
2. Clica no link
3. Abre página do convite com:
   - Nome do organizador
   - Quadra, data, horário
   - Valor (se pago)
   - Vagas disponíveis
   - Descrição
4. Clica em botão "Aceitar Convite"
5. Sistema verifica se está logado:
[SE NÃO LOGADO:]
6a. Redireciona para página Login/Cadastro
7a. Opções: Login | Cadastrar-se
8a. Se cadastro, preenche:
    - Nome, CPF, e-mail, WhatsApp, senha
    - [Opcional] RG, CEP, endereço completo
9a. Sistema cria perfil completo
10a. Usuário é logado automaticamente
[SE JÁ LOGADO:]
6b. Pula para confirmação
11. Se convite pago:
    - Redireciona para página de pagamento
    - Opções: Pix, Cartão, Saldo de Créditos
    - Processa pagamento
12. Se convite gratuito:
    - Confirmação imediata
13. Convidado adicionado à lista de participantes
14. Organizador recebe notificação WhatsApp
15. Convidado recebe confirmação
16. Convidado agora tem acesso a seu painel
7.6 Fluxo de Compra de Créditos (Convidado)
1. Convidado acessa seu painel
2. Seção "Meu Saldo" mostra crédito atual
3. Clica em "Comprar Créditos"
4. Seleciona valor:
   - Opções pré-definidas: R$ 50, R$ 100, R$ 200
   - Campo personalizado
5. Escolhe forma de pagamento (Pix ou Cartão)
6. Confirma compra
7. Processa pagamento
8. Créditos adicionados instantaneamente
9. Sistema registra transação no extrato
10. Próximos convites usam crédito automaticamente
7.7 Fluxo de Criação Autônoma de Turma
1. Cliente acessa dashboard
2. Clica em card "Criar Turma" ou aba "Minhas Turmas"
3. Clica em botão "+ Nova Turma"
4. Preenche formulário:
   - Nome da turma
   - Descrição (opcional)
5. Adiciona membros um a um:
   - Nome
   - WhatsApp
   - E-mail
   - Checkbox "Membro Fixo"
6. Salva turma
7. Turma fica disponível em "Minhas Turmas"
8. Cliente pode vincular a qualquer reserva futura
7.8 Fluxo Completo - Organizador Experiente
1. Cliente já tem turma cadastrada "Pelada de Quinta"
2. Acessa "Reserve seu horário"
3. Seleciona quadra, data, horário
4. Observações: "Trazer bola"
5. Faz reserva e paga
6. Acessa "Minhas Reservas" > "Gerenciar"
7. Vincula turma "Pelada de Quinta"
8. Configura rateio (Valor Fixo):
   - João: R$ 40
   - Pedro: R$ 35
   - Maria: R$ 35
   - Organizador: R$ 90
9. Cria convite adicional:
   - 2 vagas a R$ 35
10. Compartilha link do convite
11. 2 pessoas aceitam e pagam
12. Sistema recalcula:
    - Arrecadado de turma: R$ 110
    - Arrecadado de convites: R$ 70
    - Total: R$ 180
    - Falta: R$ 20 (organizador paga)
13. 2h antes do jogo, sistema fecha:
    - Cobra R$ 20 do organizador
    - Envia confirmação a todos
14. Jogo acontece
15. 1h depois todos recebem avaliação

8. Regras de Negócio (ATUALIZADAS)
8.1 Reservas
RN-001: Cliente só pode reservar horários com antecedência mínima configurada (padrão: 1h)
RN-002: Horários bloqueados não aparecem como disponíveis para clientes
RN-003: Em conflito de reserva recorrente/mensalista, cliente pode continuar sem dia conflitado e recebe crédito proporcional
RN-004: Reserva mensalista cobra automaticamente no dia configurado (padrão: dia 25)
RN-005: Reserva recorrente renova automaticamente até cancelamento manual
RN-006: Cliente não pode ter saldo devedor superior a R$ 200 para fazer novas reservas
RN-007: Campo de observações tem limite de 500 caracteres
8.2 Turmas
RN-008: Cliente pode ter múltiplas turmas cadastradas simultaneamente (sem limite)
RN-009: Cada reserva pode ter no máximo 1 turma vinculada
RN-010: Mesma turma pode ser vinculada a múltiplas reservas diferentes
RN-011: Turma pode ser criada antes, durante ou depois da reserva
RN-012: Turma pode ser desvinculada de reserva a qualquer momento (antes do fechamento)
RN-013: Membros fixos da turma são automaticamente incluídos ao vincular turma
RN-014: Membros variáveis podem ser incluídos ou não a cada reserva
RN-015: Exclusão de turma não afeta reservas já vinculadas (mantém participantes)
8.3 Rateio
RN-016: Modo de rateio é configurado por reserva, não por turma
RN-017: Modo Percentual: soma dos percentuais deve ser exatamente 100%
RN-018: Modo Valor Fixo: soma dos valores não pode exceder valor total da reserva
RN-019: Modo Valor Fixo: se soma < valor reserva, organizador paga diferença automaticamente
RN-020: Valores podem ser R$ 0,00 para participantes gratuitos
RN-021: Pelo menos 1 participante deve ter valor > 0
RN-022: Rateio pode ser editado até 2h antes do jogo (horário de fechamento)
RN-023: Após fechamento, rateio não pode mais ser alterado
8.4 Convites
RN-024: Convites são públicos (não identificam participantes previamente)
RN-025: Mesma reserva pode ter múltiplos lotes de convites com valores diferentes
RN-026: Total de participantes (turma + convites) não pode exceder capacidade da quadra
RN-027: Convites fecham automaticamente 2h antes do horário do jogo
RN-028: Convite pode ser desativado manualmente pelo organizador a qualquer momento
RN-029: Link de convite é único e não pode ser reutilizado em outras reservas
RN-030: Convidado que aceita convite ganha perfil completo na plataforma
RN-031: Convidado pagante deve pagar antes do fechamento do jogo
RN-032: Após aceitar convite, participante não pode cancelar (apenas organizador pode remover)
8.5 Financeiro
RN-033: Caução reserva valor total, mas cobra apenas valores confirmados
RN-034: Saldo positivo do cliente pode ser usado em novas reservas
RN-035: Saldo de convidado pode ser usado para aceitar convites pagos
RN-036: Indicador recebe R$ 10 apenas após primeira reserva do indicado
RN-037: Indicado recebe 10% desconto apenas na primeira reserva
RN-038: Estornos devem ser aprovados pelo gestor
RN-039: Pagamentos externos registrados manualmente não geram taxa
RN-040: Fechamento do jogo: organizador paga saldo restante após somar (turma + convites)
RN-041: Créditos comprados por convidados são usados automaticamente em próximos convites
RN-042: Se crédito insuficiente, sistema solicita complemento com outra forma de pagamento
8.6 Cancelamentos
RN-043: Cancelamento com mais de 24h de antecedência: reembolso de 100%
RN-044: Cancelamento entre 12h e 24h: reembolso de 50%
RN-045: Cancelamento com menos de 12h: sem reembolso
RN-046: Reembolso é convertido em crédito na conta do cliente
RN-047: Mensalistas podem cancelar com 7 dias de antecedência para evitar cobrança do mês seguinte
RN-048: Cancelamento de reserva reembolsa todos os participantes proporcionalmente
8.7 Cadastro e Autenticação
RN-049: CPF e RG devem ser únicos no sistema
RN-050: CEP deve ser validado e autocompletar endereço via API ViaCEP
RN-051: Se CEP inválido ou API indisponível, permitir preenchimento manual
RN-052: Convidados podem criar perfil simplificado (sem endereço completo inicialmente)
RN-053: Convidados podem completar perfil a qualquer momento

9. Priorização (MoSCoW) - ATUALIZADA
Must Have (Essencial para MVP)
	• Cadastro completo de clientes (CPF, RG, CEP com autopreenchimento)
	• Login e autenticação
	• Seleção e reserva de quadras (avulsa) com campo de observações
	• Sistema completo de turmas autônomas
	• Sistema de rateio (percentual e valor fixo)
	• Sistema de convites públicos
	• Perfil de convidado com compra de créditos
	• Pagamento via Pix e cartão
	• Sistema de caução
	• Painel do organizador (completo)
	• Painel do convidado
	• Painel do gestor (básico)
	• Cadastro de quadras e horários
	• Agenda geral
	• Notificações via WhatsApp (lembretes + aceite de convites)
	• Saldo e extrato (organizadores e convidados)
	• Dashboard com "Criar Turma"
	• Aba "Convites Criados"
	• Aba "Convites Aceitos" (para convidados)
Should Have (Importante, mas não crítico)
	• Reservas mensalistas e recorrentes
	• Dashboard com estatísticas avançadas
	• Programa de indicação
	• Relatórios financeiros completos
	• Relatório de turmas ativas
	• Bloqueio de horários
	• Avaliações pós-jogo
	• Cupons de desconto
	• Exportação de relatórios
Could Have (Desejável)
	• Gestão financeira avançada do gestor
	• Relatórios de participação e engajamento
	• Promoções segmentadas via WhatsApp
	• Múltiplos níveis de permissão para gestores
	• Integração com Google Calendar
	• Histórico de jogos entre participantes (estatísticas)
	• Sistema de reputação de convidados
Won't Have (Fora do escopo inicial)
	• Módulo Escolinha
	• Módulo Day Use
	• App mobile nativo
	• Sistema de gamificação
	• Integração com redes sociais
	• Chat em tempo real
	• Vídeo replays ou fotos dos jogos
	• Marketplace de equipamentos

10. Métricas de Sucesso (ATUALIZADAS)
10.1 Métricas de Produto
	• Taxa de conversão de reservas: > 60%
	• Taxa de aceite de convites: > 75%
	• Taxa de criação de turmas: > 50% dos organizadores criam pelo menos 1 turma
	• Taxa de reuso de turmas: > 70% dos organizadores reutilizam turmas
	• Tempo médio para completar reserva: < 3 minutos
	• Tempo médio para aceitar convite: < 2 minutos
	• Taxa de cancelamento: < 15%
	• Taxa de compra de créditos por convidados: > 30%
	• NPS (Net Promoter Score): > 50
10.2 Métricas de Negócio
	• Taxa de ocupação das quadras: > 75%
	• Ticket médio por reserva: > R$ 150
	• Taxa de indicação: > 20% dos clientes indicam outros
	• Taxa de retenção (MRR): > 80% dos mensalistas renovam
	• Redução de no-shows: > 50% comparado ao sistema anterior
	• Participantes médios por jogo: > 8 pessoas
	• Receita via convites: > 30% do faturamento total
10.3 Métricas Técnicas
	• Disponibilidade do sistema: > 99%
	• Tempo de resposta médio: < 2s
	• Taxa de erro: < 0,5%
	• Tempo de recuperação de incidentes: < 1h
	• Taxa de sucesso de autopreenchimento de CEP: > 95%
10.4 Métricas de Engajamento (NOVO)
	• Convidados que se tornam organizadores: > 15%
	• Turmas ativas por organizador: média de 2+
	• Convites aceitos por link compartilhado: > 60%
	• Saldo médio de créditos por convidado: > R$ 50

11. Roadmap (ATUALIZADO)
Fase 1 - MVP (4-5 meses)
Mês 1-2:
	• Setup do projeto e infraestrutura
	• Cadastro completo e autenticação (CPF, RG, CEP)
	• Integração ViaCEP
	• Cadastro de quadras e horários
	• Sistema de reservas (avulsa) com observações
	• Integração com gateway de pagamento (Asaas)
Mês 3:
	• Sistema completo de turmas autônomas
	• Vínculo turma-reserva
	• Sistema de rateio (percentual e valor fixo)
	• Painel do organizador (básico)
	• Aba "Minhas Turmas"
Mês 4:
	• Sistema de convites públicos
	• Fluxo de aceite de convite
	• Perfil de convidado
	• Sistema de compra de créditos
	• Painel do convidado
	• Notificações básicas via WhatsApp
Mês 5:
	• Painel do gestor
	• Agenda geral
	• Gestão de reservas pelo gestor
	• Testes integrados
	• Ajustes finais de UX
	• Preparação para lançamento
Fase 2 - Expansão (2-3 meses)
	• Reservas mensalistas e recorrentes
	• Programa de indicação
	• Dashboard avançado com estatísticas
	• Relatórios gerenciais completos
	• Avaliações pós-jogo
	• Sistema de cupons
	• Promoções via WhatsApp
Fase 3 - Otimização (2 meses)
	• Relatórios de turmas e engajamento
	• Gestão financeira avançada
	• Bloqueio de horários
	• Otimizações de performance
	• Melhorias de UX baseadas em feedback
	• Sistema de reputação
Fase 4 - Módulos Extras (3-4 meses)
	• Módulo Escolinha
	• Módulo Day Use
	• Funcionalidades premium
	• Integração com calendários externos

12. Riscos e Mitigações (ATUALIZADOS)
Risco 1: Complexidade do sistema de rateio flexível
Impacto: Alto | Probabilidade: Média Mitigação:
	• Validações robustas em frontend e backend
	• Testes unitários extensivos para cálculos
	• Interface visual clara com feedback em tempo real
	• Calculadora de rateio visível para organizador
Risco 2: Confusão entre turmas e convites
Impacto: Médio | Probabilidade: Média Mitigação:
	• Nomenclatura clara e consistente
	• Onboarding guiado explicando diferenças
	• Tutoriais em vídeo
	• Tooltips e ajuda contextual
	• Design visual diferenciado para cada conceito
Risco 3: Integração com WhatsApp API
Impacto: Médio | Probabilidade: Média Mitigação:
	• Contingência com notificações por email
	• Uso de serviço especializado (ex: Twilio)
	• Templates pré-aprovados antes do lançamento
Risco 4: Adoção pelos convidados (criar perfil)
Impacto: Médio | Probabilidade: Baixa Mitigação:
	• Cadastro super simplificado (3 campos obrigatórios)
	• Benefícios claros (histórico, créditos, próximos jogos)
	• Processo de aceite em 1 página
	• Opção de completar perfil depois
Risco 5: Performance com cálculos de rateio em tempo real
Impacto: Alto | Probabilidade: Baixa Mitigação:
	• Cálculos no backend com cache
	• Debounce em inputs de valores
	• Indicadores de loading
	• Testes de carga
Risco 6: Validação de CPF/RG duplicados
Impacto: Médio | Probabilidade: Baixa Mitigação:
	• Índices únicos no banco de dados
	• Validação de formato antes de salvar
	• Mensagens claras de erro
	• Possibilidade de recuperar conta existente
Risco 7: Indisponibilidade da API ViaCEP
Impacto: Baixo | Probabilidade: Média Mitigação:
	• Fallback para preenchimento manual
	• Timeout curto na requisição (3s)
	• Cache de CEPs consultados
	• API secundária de backup
Risco 8: Conformidade com LGPD
Impacto: Alto | Probabilidade: Baixa Mitigação:
	• Política de privacidade clara
	• Termo de consentimento explícito
	• Possibilidade de exclusão de dados
	• Criptografia de dados sensíveis (CPF, RG)
	• Logs de auditoria

13. Wireframes e Fluxos Visuais Sugeridos
13.1 Telas Prioritárias para Design
Organizador:
	1. Dashboard principal (com card "Criar Turma")
	2. Página "Minhas Turmas" (lista + formulário de criação)
	3. Página "Gerenciar Reserva" (completa com todas as seções)
	4. Página "Configurar Rateio" (toggle + campos dinâmicos)
	5. Página "Criar Convite" (formulário)
	6. Página "Convites Criados" (lista com links)
Convidado: 7. Página de aceite de convite (landing page) 8. Cadastro simplificado 9. Dashboard do convidado 10. Página "Comprar Créditos"
Geral: 11. Página de seleção de reserva 12. Cadastro completo (com CEP)
13.2 Componentes de Interface Críticos
Toggle/Checkbox Modo de Divisão:
[●] Percentual    [ ] Valor Fixo
**Lista de Rateio -
13.2 Componentes de Interface Críticos (continuação)
Lista de Rateio - Modo Percentual:
┌─────────────────────────────────────────┐
│ Modo de Divisão: ● Percentual  ○ Valor │
├─────────────────────────────────────────┤
│ João Silva                    [25] %    │
│ Pedro Santos                  [25] %    │
│ Maria Oliveira               [25] %    │
│ Você (Organizador)           [25] %    │
├─────────────────────────────────────────┤
│ Total: 100% ✓                           │
│ [Dividir Igualmente]                    │
│                                         │
│ Valor por pessoa:                       │
│ • João: R$ 50,00                        │
│ • Pedro: R$ 50,00                       │
│ • Maria: R$ 50,00                       │
│ • Você: R$ 50,00                        │
│                                         │
│         [Salvar Configuração]           │
└─────────────────────────────────────────┘
Lista de Rateio - Modo Valor Fixo:
┌─────────────────────────────────────────┐
│ Modo de Divisão: ○ Percentual  ● Valor │
├─────────────────────────────────────────┤
│ João Silva                  R$ [60,00]  │
│ Pedro Santos                R$ [40,00]  │
│ Maria Oliveira             R$ [0,00]   │
│ Você (Organizador)         R$ [100,00] │
├─────────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓░░ R$ 200,00 / R$ 200,00      │
│                                         │
│ ✓ Todos os valores cobertos            │
│                                         │
│         [Salvar Configuração]           │
└─────────────────────────────────────────┘
Card de Convite Ativo:
┌─────────────────────────────────────────┐
│ 🔗 Convite: Galera do Trabalho          │
├─────────────────────────────────────────┤
│ Jogo: Quinta 20/12 às 20h               │
│ Quadra Society 1                        │
│                                         │
│ 👥 Vagas: 3/5 preenchidas               │
│ 💰 Valor: R$ 35,00 por pessoa           │
│                                         │
│ Link: arena.com/invite/xyz123           │
│ [📋 Copiar] [📱 WhatsApp] [❌ Desativar]│
│                                         │
│ Aceitos:                                │
│ • Carlos Silva (pago)                   │
│ • Ana Costa (pago)                      │
│ • Bruno Lima (pendente)                 │
└─────────────────────────────────────────┘
Página de Aceite de Convite (Landing Page):
┌─────────────────────────────────────────┐
│         🏟️ Arena Dona Santa             │
├─────────────────────────────────────────┤
│                                         │
│  Você foi convidado para jogar! ⚽      │
│                                         │
│  Organizador: João Silva                │
│                                         │
│  📅 Quinta-feira, 20 de Dezembro        │
│  🕐 20:00 - 21:00                       │
│  🏟️ Quadra Society 1                    │
│                                         │
│  💰 Valor: R$ 35,00                     │
│                                         │
│  👥 Vagas disponíveis: 2                │
│                                         │
│  "Racha de quinta! Traga chuteira       │
│   society. Depois tem cerveja no bar!"  │
│                                         │
│      [🎯 ACEITAR CONVITE]               │
│                                         │
└─────────────────────────────────────────┘
Dashboard do Convidado:
┌─────────────────────────────────────────┐
│ Olá, Carlos! 👋                         │
├─────────────────────────────────────────┤
│ Meu Saldo: R$ 120,00                    │
│ [💳 Comprar Créditos]                   │
├─────────────────────────────────────────┤
│ 🔔 Próximos Jogos (2)                   │
│ • Quinta 20/12 20h - Society 1          │
│ • Sábado 22/12 18h - Campo Gramado      │
├─────────────────────────────────────────┤
│ 📜 Histórico                            │
│ Jogos participados: 15                  │
│ [Ver todos]                             │
├─────────────────────────────────────────┤
│ 📨 Convites Pendentes (1)               │
│ • Pelada do Pedro - Domingo 10h         │
│   R$ 30,00  [Aceitar] [Recusar]         │
└─────────────────────────────────────────┘
Campo CEP com Autopreenchimento:
┌─────────────────────────────────────────┐
│ CEP: [88015-500] [🔍 Buscar]            │
│                                         │
│ ✓ Endereço encontrado!                  │
│                                         │
│ Logradouro: Rua Felipe Schmidt          │
│ Bairro: Centro                          │
│ Cidade: Florianópolis                   │
│ Estado: SC                              │
│ Número: [123]                           │
│ Complemento: [Apto 201]                 │
└─────────────────────────────────────────┘

14. Requisitos de Design (ATUALIZADO)
14.1 Identidade Visual
	• Moderna e esportiva
	• Cores vibrantes primárias: verde/azul (confiança, esporte)
	• Cores secundárias: laranja/amarelo (energia, ação)
	• Cores de estado: 
		○ Verde: confirmado, pago, sucesso
		○ Amarelo/Laranja: pendente, atenção
		○ Vermelho: cancelado, erro, saldo negativo
		○ Azul: informação, neutro
	• Tipografia legível e contemporânea (sugestão: Inter, Poppins)
	• Ícones intuitivos e consistentes (lucide-react)
14.2 Componentes Principais
Cards:
	• Card de quadra (imagem, nome, status, botão reservar)
	• Card de turma (nome, nº membros, botão gerenciar)
	• Card de reserva (data, hora, quadra, status, ações)
	• Card de convite (vagas, valor, link, status)
	• Card de estatística (número grande, label, ícone)
Formulários:
	• Inputs limpos com validação inline
	• Labels flutuantes (material design)
	• Máscaras para CPF, RG, CEP, telefone
	• Autopreenchimento de CEP com feedback visual
	• Toggle/Switch para modo de divisão (percentual vs valor fixo)
	• Campos numéricos com incremento/decremento
	• Validação em tempo real com mensagens claras
Navegação:
	• Sidebar fixa (desktop) com ícones + labels
	• Bottom navigation (mobile) com 5 itens principais
	• Breadcrumbs em páginas internas
	• Tabs para alternar entre seções
Feedback:
	• Toast notifications para ações (sucesso/erro)
	• Modais para confirmações críticas (cancelar, deletar)
	• Loading states com skeleton screens
	• Empty states ilustrados e amigáveis
	• Indicadores de progresso (barra para rateio)
Listas:
	• Lista de turmas com avatares de membros
	• Lista de participantes com status de pagamento
	• Lista de convites com métricas (vagas)
	• Histórico de transações com valores coloridos
14.3 Responsividade
Mobile (320px - 767px):
	• Navegação por tabs inferior (5 ícones principais)
	• Cards empilhados verticalmente
	• Formulários full-width
	• Modais full-screen
	• Botões fixos no bottom (CTAs principais)
	• Campos de rateio simplificados (um por linha)
Tablet (768px - 1023px):
	• Layout híbrido
	• Sidebar colapsável
	• Grid de 2 colunas para cards
	• Formulários com 2 colunas quando apropriado
	• Modais centralizados (max-width 600px)
Desktop (1024px+):
	• Sidebar fixa
	• Grid de 3-4 colunas para cards
	• Formulários com múltiplas colunas
	• Modals centralizados (max-width 800px)
	• Hover states em botões e cards
	• Tooltips para explicações adicionais
14.4 Acessibilidade
	• Contraste mínimo WCAG AA (4.5:1 para texto)
	• Navegação completa por teclado (tab order lógico)
	• Focus indicators visíveis
	• Labels descritivos em todos os inputs
	• ARIA labels para elementos interativos
	• Mensagens de erro associadas aos campos
	• Textos alternativos em imagens
	• Suporte a screen readers
14.5 Microinterações
	• Botões com feedback visual (hover, active, loading)
	• Transições suaves entre estados (300ms)
	• Animação de entrada de modais (slide up)
	• Animação de sucesso (checkmark animado)
	• Contador de caracteres em observações
	• Indicador visual de validação de formulários
	• Progresso de preenchimento de cadastro
	• Confetti ao completar primeira reserva (gamificação leve)

15. Documentação Técnica Necessária
15.1 Para Desenvolvimento
Setup e Padrões:
	• Guia de setup do ambiente (Node, PostgreSQL, Supabase CLI)
	• Estrutura de pastas do projeto
	• Padrões de código (ESLint, Prettier)
	• Convenções de nomenclatura (variáveis, funções, componentes)
	• Padrões de commits (conventional commits)
	• Estrutura de branches (main, develop, feature/, hotfix/)
API e Integrações:
	• Documentação completa de endpoints (Swagger/OpenAPI)
	• Schemas de requisições e respostas
	• Exemplos de payloads
	• Códigos de erro e tratamentos
	• Guia de integração Asaas
	• Guia de integração WhatsApp API
	• Guia de integração ViaCEP
Banco de Dados:
	• Diagrama ER completo
	• Dicionário de dados (tabelas, campos, tipos)
	• Índices e constraints
	• Migrations e seeds
	• Políticas de RLS (Supabase)
	• Triggers e functions
Lógica de Negócio:
	• Fluxograma de cálculo de rateio
	• Fluxograma de fechamento de jogos
	• Fluxograma de pagamentos e estornos
	• Algoritmo de validação de conflitos
	• Algoritmo de geração de links únicos
15.2 Para Usuários
Organizadores:
	• Manual do organizador (web responsivo) 
		○ Como fazer reservas
		○ Como criar e gerenciar turmas
		○ Como configurar rateio
		○ Como criar convites
		○ Como gerenciar financeiro
	• Tutorial em vídeo (5-7 min)
	• FAQ específico
	• Onboarding guiado na primeira vez
Convidados:
	• Guia rápido de aceite de convite
	• Como comprar créditos
	• Como visualizar próximos jogos
	• Tutorial em vídeo (3 min)
Gestores:
	• Manual do gestor (PDF + web) 
		○ Configuração inicial
		○ Cadastro de quadras
		○ Gestão de reservas
		○ Relatórios gerenciais
		○ Gestão financeira
	• Tutorial em vídeo (10 min)
	• Base de conhecimento completa
Geral:
	• Política de Privacidade (LGPD)
	• Termos de Uso
	• Política de Cancelamento
	• FAQ geral
	• Contato e suporte
15.3 Para Operação
Deploy e Infraestrutura:
	• Runbook de deploy (Cloudflare Pages + Supabase)
	• Variáveis de ambiente necessárias
	• Configuração de domínio e SSL
	• Setup de CDN
	• Configuração de backup automático
	• Procedimento de rollback
Monitoramento:
	• Setup de logs (estrutura, níveis)
	• Métricas a monitorar (performance, erros, negócio)
	• Alertas configurados (downtime, erros críticos)
	• Dashboard de monitoramento (Grafana, Datadog, etc)
Manutenção:
	• Guia de troubleshooting 
		○ Problemas comuns e soluções
		○ Logs a verificar
		○ Comandos úteis
	• Procedimentos de backup e restore
	• Procedimento de migração de dados
	• Plano de contingência (falhas de integração)
	• Procedimento de limpeza de dados (LGPD)
Suporte:
	• Playbook de atendimento
	• Scripts de SQL para consultas comuns
	• Como estornar pagamento
	• Como cancelar reserva manualmente
	• Como resolver conflitos de horário
	• Como ajustar saldo de cliente

16. Casos de Uso Detalhados
16.1 Caso de Uso Completo: Organizador Experiente
Contexto: João é organizador experiente, tem 2 turmas cadastradas e organiza peladas toda semana.
Fluxo:
	1. Segunda-feira, 10h: João recebe lembrete automático via WhatsApp
		○ "Oi João! Que tal marcar a pelada de quinta? Reserve já: [link]"
	2. João acessa o sistema
		○ Login com CPF + senha
		○ Dashboard mostra: próximo jogo (quinta passada foi cancelada), saldo R$ 45
	3. Reserva novo horário
		○ "Reserve seu horário" → Quadra Society 1 → Quinta 20/12 → 20h-21h
		○ Observações: "Trazer bola. Depois vai ter churrasco no bar!"
		○ Valor: R$ 200 (avulsa)
		○ Forma de pagamento: Caução no cartão
		○ Sistema pré-autoriza R$ 200
	4. Vincula turma existente
		○ Acessa "Minhas Reservas" → "Gerenciar"
		○ Seção "Turma" → "Vincular Turma Existente"
		○ Seleciona "Pelada de Quinta" (tem 8 membros, 6 fixos)
		○ Sistema carrega: Pedro, Carlos, Rafael, Bruno, Márcio, Thiago (fixos) + André, Lucas (variáveis)
		○ João desmarca André e Lucas (vão faltar essa semana)
		○ Confirma: 6 membros + João = 7 pessoas
	5. Configura rateio (Valor Fixo)
		○ Modo: Valor Fixo
		○ Pedro: R$ 30 (chegou atrasado última vez, paga menos)
		○ Carlos: R$ 30
		○ Rafael: R$ 30
		○ Bruno: R$ 30
		○ Márcio: R$ 0 (aniversário dele)
		○ Thiago: R$ 30
		○ João: R$ 50
		○ Total rateado: R$ 200 ✓
		○ Sistema valida e salva
	6. Cria convite adicional para completar
		○ Seção "Convites" → "Criar Novo Convite"
		○ Nome: "Vagas extras pelada quinta"
		○ Vagas: 3
		○ Valor: R$ 35 cada
		○ Descrição: "Falta 3! Depois tem churrasco!"
		○ Sistema gera link: arena.com/invite/abc123
		○ João copia e posta no grupo do WhatsApp
	7. Terça, 16h: 2 pessoas aceitam convite
		○ Fernando clica no link, vê detalhes, aceita
		○ Cadastro rápido (nome, CPF, email, senha)
		○ Paga R$ 35 via Pix
		○ João recebe notificação: "Fernando aceitou seu convite!"
		○ Sistema atualiza: vagas 2/3
		○ Gustavo (já tem cadastro) clica no link
		○ Faz login
		○ Aceita e paga R$ 35 com saldo de créditos (tinha R$ 120)
		○ João recebe notificação: "Gustavo aceitou seu convite!"
		○ Sistema atualiza: vagas 3/3 (completo!)
	8. Terça, 20h: João fecha o convite
		○ Acessa "Convites Criados"
		○ Desativa convite (já está completo)
	9. Quarta, 18h: Membros da turma pagam
		○ Pedro: paga R$ 30 via Pix
		○ Carlos: paga R$ 30 com cartão
		○ Rafael: paga R$ 30 via Pix
		○ Bruno: paga R$ 30 com créditos
		○ Márcio: gratuito (R$ 0)
		○ Thiago: ainda não pagou (pendente)
	10. Quinta, 18h: Sistema fecha o jogo (2h antes)
		○ Arrecadado da turma: R$ 120 (falta Thiago R$ 30)
		○ Arrecadado dos convites: R$ 70 (2 x R$ 35)
		○ Total arrecadado: R$ 190
		○ Falta cobrar: R$ 10 (valor total R$ 200 - R$ 190)
		○ Sistema cobra R$ 10 do João (caução)
		○ Sistema registra R$ 30 pendente de Thiago
		○ Envia confirmação a todos os 9 participantes
	11. Quinta, 19:15: Lembretes automáticos
		○ Todos recebem: "Sua pelada começa às 20h! Leve chuteira society."
	12. Quinta, 19:50: Lembrete final
		○ "Hora de jogar! Depois comemore no bar com promoção."
	13. Quinta, 21:00: Jogo acontece
		○ Thiago paga os R$ 30 presencialmente
		○ João registra pagamento manualmente
	14. Quinta, 22:00: Avaliações automáticas
		○ Todos recebem: "Como foi o jogo? [Excelente] [Bom] [Regular] [Ruim]"
		○ 8 avaliam como "Excelente"
	15. Sexta: João verifica dashboard
		○ Saldo atualizado: R$ 45 inicial - R$ 10 que pagou + R$ 30 que Thiago pagou = R$ 65
		○ Estatísticas: 23 jogos organizados, R$ 1.850 investido
16.2 Caso de Uso: Primeiro Convite de Convidado
Contexto: Maria nunca usou a plataforma, recebe link de convite pela primeira vez.
Fluxo:
	1. Maria recebe WhatsApp
		○ "Oi Maria! Bora jogar quinta às 20h? R$ 35. Confirma aqui: arena.com/invite/abc123"
	2. Maria clica no link
		○ Abre página bonita do convite
		○ Vê: organizador João, quadra Society 1, quinta 20h, R$ 35
		○ Lê observações: "Depois tem churrasco!"
		○ Botão grande: "ACEITAR CONVITE"
	3. Maria clica em aceitar
		○ Sistema detecta que não está logada
		○ Redireciona para login/cadastro
		○ Maria escolhe "Cadastrar"
	4. Cadastro simplificado
		○ Nome: Maria Silva
		○ CPF: 123.456.789-00
		○ Email: maria@email.com
		○ WhatsApp: (48) 99999-9999
		○ Senha: ••••••••
		○ [Opcional] Pode pular endereço completo
		○ Aceita termos
		○ Clica "Criar conta e continuar"
	5. Redireciona para pagamento
		○ Valor: R$ 35,00
		○ Opções: Pix | Cartão de Crédito | Cartão de Débito
		○ Maria escolhe Pix
		○ QR Code gerado
		○ Maria paga pelo app do banco
		○ Confirmação automática em 5 segundos
	6. Confirmação
		○ Tela de sucesso: "Você está no jogo! ⚽"
		○ Detalhes: quinta 20h, quadra Society 1
		○ "João será notificado da sua confirmação"
		○ "Acesse seu painel para ver mais"
	7. Maria acessa painel pela primeira vez
		○ Boas-vindas: "Olá, Maria! Bem-vinda à Arena Dona Santa 👋"
		○ Dashboard mostra: 
			§ Próximos Jogos (1): Quinta 20/12 20h
			§ Saldo: R$ 0
			§ Card: "Compre créditos e ganhe 5% de bônus!"
	8. Maria compra créditos para próximas vezes
		○ Clica "Comprar Créditos"
		○ Seleciona R$ 100
		○ Paga via Pix
		○ Recebe R$ 105 (5% bônus)
		○ Saldo atualizado: R$ 105
	9. Quinta, 19:15: Maria recebe lembrete
		○ "Sua pelada começa às 20h! Quadra Society 1. Leve chuteira society."
	10. Quinta, 22:00: Após o jogo
		○ Maria recebe: "Como foi o jogo?"
		○ Avalia: "Excelente" + comentário: "Adorei! Quero jogar mais vezes"
	11. Semana seguinte: Maria recebe novo convite
		○ Link de outro jogo do João
		○ Maria clica, já está logada
		○ Aceita convite: R$ 35
		○ Sistema usa automaticamente R$ 35 do saldo
		○ Confirmação instantânea
		○ Saldo restante: R$ 70
16.3 Caso de Uso: Gestor Gerenciando Conflito
Contexto: Gestor precisa cancelar reserva por manutenção emergencial.
Fluxo:
	1. Segunda, 10h: Quadra 1 com problema no piso
		○ Gestor acessa painel
		○ Agenda Geral → visualiza semana
		○ Quinta 20h tem reserva do João (9 pessoas)
	2. Bloqueia horários para manutenção
		○ "Bloqueio de Horários"
		○ Quadra: Society 1
		○ Data: Quinta 20/12
		○ Horário: 18h - 22h
		○ Motivo: "Manutenção emergencial do piso"
		○ Salva bloqueio
	3. Entra em contato com João
		○ Clica na reserva do João
		○ Vê detalhes completos: 
			§ Organizador: João Silva - (48) 98888-8888
			§ Turma vinculada: Pelada de Quinta (6 membros)
			§ Convites: 3 aceitos
			§ Total arrecadado: R$ 190
			§ Observações: "Trazer bola. Churrasco no bar!"
		○ Botão "Enviar Mensagem"
		○ Envia WhatsApp: "Oi João, tivemos problema na quadra. Posso te realocar?"
	4. João responde e aceita realocação
		○ Gestor edita reserva: 
			§ Mantém mesma data/hora
			§ Muda para: Quadra Campo Gramado
			§ Sistema mantém todos os vínculos (turma + convites)
			§ Salva alteração
	5. Sistema notifica todos
		○ João + 6 da turma + 3 dos convites = 10 pessoas
		○ WhatsApp automático: "Atenção! Mudança de quadra. Novo local: Campo Gramado. Horário mantido: quinta 20h."
	6. Gestor gera relatório
		○ Relatórios → Ocorrências
		○ Registra: bloqueio, motivo, realocações
		○ Exporta PDF para controle interno

17. Testes Necessários
17.1 Testes Unitários
Backend (Edge Functions):
	• Cálculo de rateio percentual
	• Cálculo de rateio valor fixo
	• Validação de soma de percentuais = 100%
	• Validação de soma de valores ≤ total
	• Geração de links únicos de convite
	• Validação de CPF
	• Validação de RG
	• Autopreenchimento de endereço (mock ViaCEP)
	• Cálculo de fechamento de jogo
	• Cálculo de saldo do cliente
	• Aplicação de descontos e bônus
	• Validação de conflitos de horário
Frontend (Components):
	• Componente de toggle Percentual/Valor Fixo
	• Componente de lista de rateio
	• Cálculo em tempo real de valores
	• Validação de formulários
	• Máscaras de input (CPF, CEP, telefone)
	• Formatação de moeda
17.2 Testes de Integração
	• Fluxo completo de reserva
	• Fluxo completo de criação de turma
	• Fluxo completo de vínculo turma-reserva
	• Fluxo completo de configuração de rateio
	• Fluxo completo de criação de convite
	• Fluxo completo de aceite de convite
	• Integração com Asaas (pagamentos)
	• Integração com WhatsApp API (notificações)
	• Integração com ViaCEP (autopreenchimento)
	• Fechamento automático de jogos
	• Sistema de caução (pré-autorização + captura)
	• Compra de créditos
17.3 Testes E2E (End-to-End)
Jornada do Organizador:
	1. Cadastro completo
	2. Criar primeira reserva
	3. Criar turma durante reserva
	4. Configurar rateio (percentual)
	5. Criar convite público
	6. Compartilhar link
	7. Acompanhar aceites
	8. Receber lembretes
	9. Jogo acontece
	10. Avaliar jogo
Jornada do Convidado:
	1. Receber link de convite
	2. Aceitar convite (cadastro)
	3. Pagar convite
	4. Acessar dashboard
	5. Comprar créditos
	6. Receber segundo convite
	7. Aceitar usando créditos
	8. Receber lembretes
	9. Avaliar jogo
Jornada do Gestor:
	1. Login
	2. Cadastrar quadra
	3. Configurar horários
	4. Bloquear horários
	5. Visualizar agenda
	6. Gerenciar reserva
	7. Cancelar reserva
	8. Gerar relatórios
17.4 Testes de Performance
	• Load testing: 1000 usuários simultâneos
	• Stress testing: identificar ponto de falha
	• Tempo de resposta: 95% < 2s
	• Cálculo de rateio com 50 participantes
	• Renderização de agenda com 100 reservas
	• Paginação de listas grandes
	• Cache de consultas frequentes
17.5 Testes de Segurança
	• SQL injection em todos os inputs
	• XSS em campos de texto livre (observações, comentários)
	• CSRF em formulários
	• Autenticação e autorização (acesso a recursos de outros usuários)
	• Validação de tokens JWT
	• Criptografia de senhas
	• Rate limiting de APIs
	• Validação de uploads (se houver)
	• Proteção de endpoints sensíveis
17.6 Testes de Usabilidade
	• Teste A/B: layout de página de convite
	• Teste de navegação: usuários conseguem completar tarefas?
	• Tempo para completar reserva (meta: < 3 min)
	• Taxa de abandono em formulários
	• Clareza de mensagens de erro
	• Acessibilidade com screen readers
	• Navegação por teclado

18. Estratégia de Lançamento
18.1 Fase Beta Fechada (2 semanas)
Objetivos:
	• Validar funcionalidades core
	• Identificar bugs críticos
	• Coletar feedback qualitativo
Participantes:
	• 10 organizadores (5 experientes, 5 novos)
	• 30 convidados
	• 2 gestores
Critérios de Sucesso:
	• 80% das reservas concluídas sem erro
	• 90% de satisfação nos feedbacks
	• 0 bugs críticos identificados
	• Tempo médio de reserva < 3 min
Atividades:
	• Onboarding individual com cada beta tester
	• Acompanhamento diário via WhatsApp
	• Sessões de feedback semanal
	• Ajustes rápidos baseados em feedback
18.2 Fase Beta Aberta (4 semanas)
Objetivos:
	• Testar escalabilidade
	• Validar automações (WhatsApp)
	• Refinar UX baseado em dados
Participantes:
	• 50 organizadores
	• 200 convidados
	• 5 gestores
Critérios de Sucesso:
	• 1000 reservas criadas
	• 500 convites aceitos
	• Taxa de conversão de convite > 70%
	• NPS > 40
	• 0 incidentes de indisponibilidade
Atividades:
	• Marketing boca a boca controlado
	• Programa de incentivo para beta testers
	• Coleta de métricas automatizada
	• Iterações quinzenais
18.3 Lançamento Oficial (Soft Launch)
Estratégia:
	• Lançamento gradual: 1 arena por vez
	• Campanha de marketing local
	• Evento de inauguração presencial
	• Lives explicativas no Instagram
	• Parcerias com influencers locais
Metas Primeiros 3 Meses:
	• 200 organizadores ativos
	• 1000 convidados cadastrados
	• Taxa de ocupação das quadras > 70%
	• 5000 reservas realizadas
	• NPS > 50
18.4 Plano de Marketing
Pré-lançamento:
	• Landing page com cadastro antecipado
	• Vídeo explicativo no YouTube/Instagram
	• Postagens diárias contando a história
	• Countdown para lançamento
Lançamento:
	• Promoção: primeira reserva 50% off
	• Bônus de R$ 20 em créditos para novos cadastros
	• Programa de indicação turbinado: R$ 20 (ao invés de R$ 10)
	• Evento presencial na arena (open day)
	• Press release em mídias locais
Pós-lançamento:
	• Gamificação: badges para organizadores (bronze, prata, ouro)
	• Destaque para organizadores mais ativos
	• Programa de embaixadores
	• Pesquisas de satisfação mensais
	• Ciclo de melhorias contínuas

19. Suporte e Treinamento
19.1 Canais de Suporte
Para Clientes (Organizadores e Convidados):
	• WhatsApp Business: atendimento humano 9h-21h
	• Email: suporte@arenadonasanta.com.br (resposta em 24h)
	• FAQ no site (self-service)
	• Tutoriais em vídeo no YouTube
	• Chat bot para dúvidas simples (futuro)
Para Gestores:
	• WhatsApp direto com suporte técnico (9h-18h)
	• Email prioritário
	• Videochamada para treinamento
	• Base de conhecimento exclusiva
19.2 Materiais de Treinamento
Vídeos Tutoriais:
	1. Como fazer sua primeira reserva (3 min)
	2. Criando e gerenciando turmas (5 min)
	3. Configurando rateio de forma inteligente (4 min)
	4. Criando convites públicos (3 min)
	5. Aceitando um convite pela primeira vez (2 min)
	6. Comprando e usando créditos (3 min)
	7. Painel do gestor - visão geral (10 min)
Webinars Ao Vivo (mensais):
	• Tire suas dúvidas sobre a plataforma
	• Dicas para otimizar seu uso
	• Novidades e atualizações
	• Cases de sucesso
Documentação:
	• Base de conhecimento completa (web)
	• PDFs para download
	• Fluxogramas visuais
	• Glossário de termos
19.3 SLA de Suporte
Bugs Críticos (sistema indisponível, pagamentos falhando):
	• Resposta: imediata
	• Resolução: 2 horas
Bugs Graves (funcionalidade importante quebrada):
	• Resposta: 2 horas
	• Resolução: 8 horas
Bugs Menores (problemas cosméticos, funcionalidade secundária):
	• Resposta: 24 horas
	• Resolução: 7 dias
Dúvidas e Solicitações:
	• Resposta: 4 horas (horário comercial)
	• Resolução: conforme complexidade

20. Considerações Finais
20.1 Diferenciais Competitivos (Revisado)
	1. Sistema de Turmas Autônomo: Único no mercado, permite reutilização e flexibilidade total
	2. Rateio Flexível: Percentual ou valor fixo, adaptado à realidade de cada jogo
	3. Convites Públicos com Perfil: Convidados ganham conta completa, não são descartáveis
	4. Compra Antecipada de Créditos: Convidados podem se preparar financeiramente
	5. Gestão Financeira Transparente: Organizador vê em tempo real quanto falta arrecadar
	6. Automação Completa: WhatsApp integrado desde lembretes até notificações de aceite
	7. Experiência Mobile-First: Pensado para uso no celular (principal dispositivo)
20.2 Inovações para Futuro (Backlog)
Curto Prazo (6 meses):
	• Sistema de reputação de jogadores
	• Badges e gamificação
	• Histórico de confrontos entre times/turmas
	• Integração com Google Calendar
	• App mobile nativo (opcional)
Médio Prazo (12 meses):
	• Marketplace de equipamentos
	• Sistema de ratings por posição (goleiro, atacante, etc)
	• Campeonatos e ligas internas
	• Streaming ao vivo dos jogos (parceria)
	• Estatísticas avançadas (gols, assistências)
Longo Prazo (18+ meses):
	• Expansão para múltiplas arenas (marketplace)
	• Sistema de pagamento com split automático entre arenas
	• Franquia/white-label para outras arenas
	• Integração com wearables (Apple Watch, Garmin)
	• IA para sugestão de horários baseado em histórico
20.3 Próximos Passos Imediatos
Aprovações:
	1. Validar PRD com stakeholders (1 semana)
	2. Aprovar budget e timeline
	3. Contratar/alocar equipe
Design: 4. Criar protótipos de alta fidelidade (2 semanas) 5. Validar protótipos com usuários (1 semana) 6. Aprovar design system
Desenvolvimento: 7. Setup de ambiente e ferramentas (1 semana) 8. Sprint 0: arquitetura e estrutura (1 semana) 9. Sprints 1-16: desenvolvimento (16 semanas) 10. QA e ajustes (2 semanas)
Lançamento: 11. Beta fechada (2 semanas) 12. Beta aberta (4 semanas) 13. Soft launch (1 arena) 14. Expansão gradual
20.4 KPIs de Acompanhamento
Produto:
	• DAU/MAU (Daily/Monthly Active Users)
	• Taxa de ativação (cadastro → primeira reserva)
	• Taxa de retenção (D7, D30, D90)
	• Taxa de criação de turmas
	• Taxa de reuso de turmas
	• Taxa de aceite de convites
	• Tempo médio para reservar
	• NPS mensal
Negócio:
	• GMV (Gross Merchandise Value)
	• Receita por reserva
	• Taxa de ocupação das quadras
	• Ticket médio
	• LTV (Lifetime Value) por cliente
	• CAC (Customer Acquisition Cost)
	• Taxa de churn
Técnico:
	• Uptime
	• Tempo de resposta médio
	• Taxa de erro
	• Tempo de recuperação
	• Cobertura de testes

21. Glossário
Organizador: Cliente que faz reservas e organiza jogos
Convidado: Participante que aceita convite e ganha perfil na plataforma
Turma: Grupo de jogadores cadastrados que podem ser reutilizados em múltiplas reservas
Rateio: Divisão do custo da reserva entre participantes
Convite Público: Link compartilhável para preencher vagas sem identificar participantes previamente
Caução: Pré-autorização de valor no cartão que é cobrado parcialmente conforme pagamentos
Saldo: Créditos ou débitos acumulados na conta do cliente
Fechamento: Momento em que o jogo é consolidado financeiramente (padrão: 2h antes)
Reserva Avulsa: Reserva pontual para data específica
Reserva Mensalista: Reserva fixa mensal no mesmo horário
Reserva Recorrente: Reserva semanal que se repete até cancelamento

22. Anexos
22.1 Tabela de Prioridades das User Stories
ID	User Story	Prioridade	Complexidade	Estimativa (SP)
US-001	Seleção de reserva com observações	Must Have	Média	8
US-002	Cadastro completo (CPF, RG, CEP)	Must Have	Média	13
US-003	Sistema de pagamentos	Must Have	Alta	21
US-004	Criação de turmas autônomas	Must Have	Alta	21
US-005	Vínculo turma-reserva	Must Have	Média	13
US-006	Criar turma durante reserva	Must Have	Média	8
US-007	Configurar rateio flexível	Must Have	Alta	21
US-008	Criar convites públicos	Must Have	Alta	13
US-009	Aceitar convite e criar perfil	Must Have	Alta	21
US-010	Painel do convidado	Must Have	Média	13
US-011	Dashboard do organizador	Must Have	Média	13
US-012	Gerenciar reservas	Must Have	Alta	21
US-013	Visualizar convites criados	Must Have	Baixa	5
US-014	Cadastrar quadras (gestor)	Must Have	Baixa	5
US-015	Bloquear horários	Should Have	Média	8
US-016	Agenda geral	Must Have	Média	13
US-017	Gerenciar reservas (gestor)	Must Have	Média	13
US-018	Gestão financeira	Should Have	Alta	21
US-019	Relatórios gerenciais	Should Have	Alta	21
US-020	Configurações do sistema	Should Have	Média	8
US-021	Notificações WhatsApp	Must Have	Alta	13
US-022	Notificação de aceite	Must Have	Baixa	3
US-023	Avaliações pós-jogo	Should Have	Média	8
US-024	Promoções via WhatsApp	Could Have	Média	8
Total Story Points MVP: ~234 SP Velocidade estimada: 15 SP/sprint (time de 3 devs) Sprints necessários: ~16 sprints (4 meses)

Versão: 2.0
Data: 21 de outubro de 2025
Autor: Claude (Anthropic)
Última Atualização: Incorporação de feedback sobre turmas autônomas, rateio flexível e sistema de convites
Status: Aguardando aprovação final

Histórico de Versões:
	• v1.0 (21/10/2025): Versão inicial baseada na documentação completa
	• v2.0 (21/10/2025): Reformulação completa do sistema de turmas, rateio e convites baseado em feedback do cliente



===========================================================================



PRD - Módulo Escolinha
1. Visão Geral do Módulo
1.1 Objetivo
Gerenciar completamente a operação de escolinha esportiva da arena, incluindo cadastro de turmas, controle de alunos, gestão de presença, mensalidades com desconto para sócios, sistema de comissão para professores e bloqueio automático de quadras nos horários de treino.
1.2 Problema a Resolver
Arenas que oferecem escolinhas esportivas precisam gerenciar múltiplas turmas, controlar frequência de alunos, cobrar mensalidades diferenciadas, calcular comissões de professores e garantir que quadras não sejam reservadas nos horários de treino.
1.3 Diferencial
Integração completa com o sistema de reservas do CORE, garantindo que horários de escolinha bloqueiem automaticamente as quadras, e sistema de comissão automatizado para professores.

2. Funcionalidades Principais
2.1 Gestão de Turmas
US-ESC-001: Como gestor, quero cadastrar turmas de escolinha
	• Critérios de Aceite: 
		○ Nome da turma (ex: "Futebol Infantil - Terça e Quinta")
		○ Faixa etária (ex: 6-10 anos)
		○ Modalidade (futebol, futsal, vôlei, etc)
		○ Nível (iniciante, intermediário, avançado)
		○ Professor responsável
		○ Capacidade máxima de alunos
		○ Dias da semana e horários fixos
		○ Quadra utilizada
		○ Mensalidade padrão
		○ Mensalidade sócio (com desconto configurável)
		○ Status (ativa/inativa)
US-ESC-002: Como gestor, quero que horários de turmas bloqueiem automaticamente as quadras
	• Critérios de Aceite: 
		○ Ao criar/ativar turma, sistema bloqueia automaticamente horários na agenda
		○ Bloqueios são recorrentes (toda semana nos dias definidos)
		○ Bloqueios aparecem na agenda geral com cor diferenciada (ex: roxo para escolinha)
		○ Clientes não podem reservar esses horários
		○ Ao desativar turma, bloqueios são removidos
		○ Motivo do bloqueio: "Escolinha - [Nome da Turma]"
2.2 Gestão de Alunos
US-ESC-003: Como gestor, quero cadastrar alunos na escolinha
	• Critérios de Aceite: 
		○ Dados do aluno: nome completo, data de nascimento, foto (opcional)
		○ Dados do responsável: nome, CPF, telefone, e-mail, endereço completo
		○ Indicação se é sócio da arena (boolean)
		○ Turma(s) matriculada(s)
		○ Data de matrícula
		○ Status (ativo/inativo/trancado)
		○ Observações médicas (alergias, restrições)
		○ Documento de matrícula (upload PDF)
US-ESC-004: Como gestor, quero transferir aluno entre turmas
	• Critérios de Aceite: 
		○ Seleção do aluno
		○ Turma atual e turma destino
		○ Data de transferência
		○ Ajuste proporcional de mensalidade se necessário
		○ Histórico de transferências registrado
2.3 Controle de Presença
US-ESC-005: Como professor, quero registrar presença dos alunos
	• Critérios de Aceite: 
		○ Lista de chamada por turma e data
		○ Checkbox para cada aluno: Presente / Falta / Falta Justificada
		○ Campo para observação (opcional)
		○ Registro de horário de entrada/saída
		○ Possibilidade de lançar presença retroativa (até 7 dias)
		○ Presença salva com timestamp e usuário que registrou
US-ESC-006: Como gestor, quero visualizar relatório de frequência
	• Critérios de Aceite: 
		○ Filtros: por turma, por aluno, por período
		○ Exibição: % de presença, total de faltas, faltas justificadas
		○ Identificação de alunos com frequência baixa (< 75%)
		○ Alerta para alunos com 3+ faltas consecutivas
		○ Exportação em Excel
2.4 Gestão Financeira
US-ESC-007: Como gestor, quero cobrar mensalidades automaticamente
	• Critérios de Aceite: 
		○ Cobrança automática no dia configurado (padrão: dia 5 de cada mês)
		○ Valor diferenciado: mensalidade padrão vs sócio
		○ Desconto de sócio configurável por turma (ex: 20% off)
		○ Geração de boleto ou link de pagamento
		○ Envio automático para e-mail do responsável
		○ Notificação via WhatsApp
		○ Registro de pagamentos confirmados
		○ Status: em dia / atrasado / inadimplente
US-ESC-008: Como gestor, quero controlar inadimplência
	• Critérios de Aceite: 
		○ Lista de alunos inadimplentes (1+ mês atrasado)
		○ Total de débito por aluno
		○ Número de meses em atraso
		○ Envio de cobrança manual
		○ Bloqueio automático após 2 meses sem pagamento (aluno trancado)
		○ Possibilidade de acordo/parcelamento
		○ Relatório de inadimplência mensal
US-ESC-009: Como gestor, quero registrar pagamentos manuais
	• Critérios de Aceite: 
		○ Registro de pagamento em dinheiro/transferência
		○ Seleção do aluno e mês(es) pago(s)
		○ Upload de comprovante (opcional)
		○ Atualização automática do status
		○ Emissão de recibo
2.5 Sistema de Comissão para Professores
US-ESC-010: Como gestor, quero configurar comissão de professores
	• Critérios de Aceite: 
		○ Cadastro de professores com dados bancários
		○ Modelo de comissão por professor: 
			§ Fixo: valor fixo por mês
			§ Por aluno: R$ X por aluno ativo na turma
			§ Percentual: % sobre mensalidades pagas da turma
		○ Possibilidade de diferentes modelos por turma
		○ Configuração de bônus por metas (ex: 100% frequência)
US-ESC-011: Como gestor, quero gerar relatório de comissões
	• Critérios de Aceite: 
		○ Filtro por professor e período
		○ Cálculo automático baseado no modelo configurado
		○ Detalhamento: turmas, alunos ativos, mensalidades pagas, bônus
		○ Total a pagar ao professor
		○ Marcação de "Pago" com data
		○ Exportação para contabilidade
		○ Histórico de pagamentos
US-ESC-012: Como professor, quero visualizar minhas turmas e ganhos
	• Critérios de Aceite: 
		○ Login de professor (perfil específico)
		○ Dashboard com: 
			§ Turmas que leciona
			§ Total de alunos ativos
			§ Previsão de comissão do mês
			§ Histórico de ganhos
		○ Acesso ao controle de presença das suas turmas
		○ Visualização de alunos inadimplentes (sem valores)
2.6 Relatórios Gerenciais
US-ESC-013: Como gestor, quero relatórios completos da escolinha
	• Critérios de Aceite: 
		○ Relatório de Turmas: 
			§ Alunos por turma
			§ Taxa de ocupação (atual/máximo)
			§ Frequência média por turma
		○ Relatório Financeiro: 
			§ Receita mensal (mensalidades pagas)
			§ Receita prevista vs realizada
			§ Inadimplência (valor e %)
			§ Despesas com comissões
			§ Lucro líquido da escolinha
		○ Relatório de Frequência: 
			§ % média de presença geral
			§ Alunos com baixa frequência
			§ Comparação entre turmas
		○ Relatório de Evasão: 
			§ Alunos que saíram (por período)
			§ Motivos de desistência
			§ Taxa de retenção
		○ Exportação em PDF e Excel

3. Integrações com Módulo CORE
3.1 Bloqueio Automático de Quadras
	• Ao criar turma ativa, sistema cria bloqueios recorrentes na agenda
	• Bloqueios vinculados à turma (se editar horário da turma, atualiza bloqueios)
	• Bloqueios não permitem reservas de clientes
3.2 Cadastro de Sócios
	• Se responsável é sócio, recebe desconto configurado
	• Validação de CPF do responsável contra base de clientes
	• Possibilidade de responsável ser também cliente que faz reservas
3.3 Pagamentos
	• Usa mesma integração Asaas do CORE
	• Mensalidades geram cobranças na plataforma de pagamento
	• Extrato unificado para responsáveis que também são clientes

4. Fluxo de Usuário - Gestor
4.1 Criação de Nova Turma
1. Gestor acessa "Módulo Escolinha"
2. Clica em "Nova Turma"
3. Preenche formulário:
   - Nome: "Futebol Infantil - Terça e Quinta"
   - Faixa etária: 6-10 anos
   - Professor: João Treinador
   - Dias: Terça e Quinta
   - Horário: 16h-17h
   - Quadra: Society 1
   - Capacidade: 20 alunos
   - Mensalidade: R$ 150 (R$ 120 para sócios)
4. Salva turma
5. Sistema cria automaticamente bloqueios recorrentes:
   - Terça 16h-17h na Society 1
   - Quinta 16h-17h na Society 1
6. Turma fica disponível para matrículas
4.2 Matrícula de Novo Aluno
1. Gestor acessa "Alunos" > "Novo Aluno"
2. Preenche dados do aluno e responsável
3. Marca se é sócio (sistema aplica desconto)
4. Seleciona turma: "Futebol Infantil"
5. Sistema calcula mensalidade (R$ 120 - sócio)
6. Upload de documentos
7. Salva matrícula
8. Sistema gera primeira cobrança automaticamente
9. Envia e-mail e WhatsApp para responsável com:
   - Boas-vindas
   - Dados da turma
   - Link de pagamento
4.3 Controle de Presença (Professor)
1. Professor faz login
2. Dashboard mostra próxima aula: "Hoje 16h - Futebol Infantil"
3. Clica em "Registrar Presença"
4. Lista de 15 alunos matriculados
5. Marca presenças/faltas rapidamente
6. Adiciona observação: "Pedro machucou o joelho"
7. Salva presença
8. Sistema registra com timestamp
4.4 Gestão de Inadimplência
1. Dia 10 do mês, sistema identifica 3 alunos sem pagamento
2. Gestor acessa "Financeiro" > "Inadimplentes"
3. Vê lista:
   - Maria Silva: 1 mês atrasado (R$ 150)
   - Carlos Santos: 2 meses atrasados (R$ 300) - BLOQUEADO
   - Ana Costa: 1 mês atrasado (R$ 120)
4. Clica em "Enviar Cobrança" para Maria
5. Sistema dispara WhatsApp + E-mail
6. Maria paga via Pix
7. Sistema atualiza status automaticamente
4.5 Cálculo de Comissão
1. Final do mês, gestor acessa "Comissões"
2. Seleciona professor: João Treinador
3. Sistema calcula:
   - Turma 1: 15 alunos x R$ 30 = R$ 450
   - Turma 2: 12 alunos x R$ 30 = R$ 360
   - Bônus frequência 100%: R$ 100
   - Total: R$ 910
4. Gestor aprova e marca como "Pago"
5. Sistema registra pagamento
6. Professor visualiza em seu painel

5. Estrutura de Banco de Dados
Tabelas Principais:
school_classes (turmas)
- id (uuid, PK)
- name (text)
- age_range (text)
- sport_type (text)
- level (enum)
- teacher_id (uuid, FK)
- days_of_week (array) -- [2, 4] = terça e quinta
- start_time (time)
- end_time (time)
- court_id (uuid, FK)
- max_students (integer)
- monthly_fee (decimal)
- member_discount_percentage (decimal)
- status (enum: 'active', 'inactive')
- created_at (timestamp)
students (alunos)
- id (uuid, PK)
- full_name (text)
- birth_date (date)
- photo_url (text)
- guardian_name (text)
- guardian_cpf (text)
- guardian_phone (text)
- guardian_email (text)
- guardian_address (text)
- is_member (boolean)
- enrollment_date (date)
- status (enum: 'active', 'inactive', 'suspended')
- medical_notes (text)
- created_at (timestamp)
class_enrollments (matrículas)
- id (uuid, PK)
- student_id (uuid, FK)
- class_id (uuid, FK)
- enrollment_date (date)
- monthly_fee (decimal) -- valor específico do aluno
- status (enum: 'active', 'inactive')
- created_at (timestamp)
attendance (presença)
- id (uuid, PK)
- class_id (uuid, FK)
- student_id (uuid, FK)
- date (date)
- status (enum: 'present', 'absent', 'justified')
- notes (text)
- recorded_by (uuid, FK) -- professor
- recorded_at (timestamp)
school_payments (mensalidades)
- id (uuid, PK)
- student_id (uuid, FK)
- class_id (uuid, FK)
- reference_month (date) -- mês/ano
- amount (decimal)
- due_date (date)
- payment_date (date)
- payment_method (text)
- status (enum: 'pending', 'paid', 'overdue', 'cancelled')
- transaction_id (text) -- Asaas
- created_at (timestamp)
teachers (professores)
- id (uuid, PK)
- user_id (uuid, FK) -- vincula com users
- full_name (text)
- phone (text)
- email (text)
- bank_account (text)
- commission_type (enum: 'fixed', 'per_student', 'percentage')
- commission_value (decimal)
- status (enum: 'active', 'inactive')
- created_at (timestamp)
teacher_commissions (comissões)
- id (uuid, PK)
- teacher_id (uuid, FK)
- reference_month (date)
- base_amount (decimal)
- bonus_amount (decimal)
- total_amount (decimal)
- calculation_details (jsonb) -- detalhamento
- payment_date (date)
- status (enum: 'pending', 'paid')
- created_at (timestamp)

6. Regras de Negócio
RN-ESC-001: Turma ativa bloqueia automaticamente horários na agenda do CORE
RN-ESC-002: Aluno só pode ser matriculado em turmas com vagas disponíveis
RN-ESC-003: Mensalidade de sócio tem desconto configurável por turma
RN-ESC-004: Cobrança de mensalidade gerada automaticamente dia 5 de cada mês
RN-ESC-005: Aluno com 2+ meses de atraso é automaticamente suspenso
RN-ESC-006: Professor só pode registrar presença das suas próprias turmas
RN-ESC-007: Presença pode ser lançada retroativamente por até 7 dias
RN-ESC-008: Comissão calculada apenas sobre mensalidades efetivamente pagas
RN-ESC-009: Professor tem acesso restrito: apenas suas turmas e presença
RN-ESC-010: Transferência de turma ajusta mensalidade proporcionalmente
RN-ESC-011: Desativação de turma remove bloqueios da agenda automaticamente
RN-ESC-012: Aluno suspenso não pode ter presença registrada

7. Métricas de Sucesso
KPIs da Escolinha:
	• Taxa de ocupação média: > 80% da capacidade
	• Taxa de inadimplência: < 10%
	• Frequência média dos alunos: > 85%
	• Taxa de retenção mensal: > 95%
	• Satisfação dos responsáveis: NPS > 60
	• Receita mensal da escolinha: crescimento de 10% mês a mês

8. Priorização
Must Have (MVP Escolinha):
	• Cadastro de turmas com bloqueio automático
	• Cadastro de alunos e matrículas
	• Cobrança de mensalidades
	• Controle de inadimplência
	• Registro de presença (básico)
Should Have:
	• Sistema completo de comissões
	• Painel do professor
	• Relatórios gerenciais
	• Gestão de frequência avançada
Could Have:
	• App mobile para professores
	• Notificações para responsáveis (faltas)
	• Portal do responsável (ver presença online)
	• Sistema de avaliação de alunos

9. Roadmap de Implementação
Fase 1 - Setup (2 semanas)
	• Estrutura de banco de dados
	• Cadastro de turmas e professores
	• Integração com bloqueio de agenda
Fase 2 - Core Escolinha (4 semanas)
	• Cadastro de alunos
	• Sistema de matrículas
	• Cobrança de mensalidades
	• Controle de inadimplência
Fase 3 - Presença e Comissões (3 semanas)
	• Sistema de presença
	• Cálculo de comissões
	• Painel do professor
	• Relatórios básicos
Fase 4 - Refinamentos (2 semanas)
	• Relatórios avançados
	• Ajustes de UX
	• Testes integrados
Total: ~11 semanas (2,5 meses)




=================================================================



PRD - Módulo Day Use
1. Visão Geral do Módulo
1.1 Objetivo
Oferecer pacotes de experiência completa na arena, combinando múltiplos serviços (piscina, alimentação, bebidas, quadras) em um único produto com precificação dinâmica, horários fixos, limite de capacidade e sistema de check-in/check-out digital.
1.2 Problema a Resolver
Arenas com estrutura de lazer (piscina, bar, área de convivência) precisam monetizar esses espaços de forma organizada, controlando capacidade, oferecendo experiências completas e otimizando a operação em dias de menor movimento das quadras.
1.3 Diferencial
Pacotes personalizáveis e flexíveis, com precificação dinâmica por dia da semana, add-ons opcionais, controle de capacidade em tempo real e integração com o sistema de reservas do CORE para uso de quadras.

2. Funcionalidades Principais
2.1 Gestão de Pacotes
US-DAY-001: Como gestor, quero criar pacotes de day use personalizáveis
	• Critérios de Aceite: 
		○ Nome do pacote (ex: "Day Use Família Completo")
		○ Descrição detalhada
		○ Imagem de capa
		○ Itens inclusos (checkboxes): 
			§ ☑ Acesso à piscina
			§ ☑ Almoço (buffet ou prato executivo)
			§ ☑ Lanches da tarde
			§ ☑ Bebidas não-alcoólicas ilimitadas
			§ ☑ X horas de quadra (especificar quantidade)
			§ ☑ Acesso à área de convivência
		○ Horário de início (fixo, ex: 10h)
		○ Horário de término (fixo, ex: 18h)
		○ Capacidade máxima de pessoas
		○ Faixa etária (adultos, crianças, ambos)
		○ Preço base (dias de semana)
		○ Preço final de semana/feriado
		○ Status (ativo/inativo)
US-DAY-002: Como gestor, quero configurar precificação dinâmica
	• Critérios de Aceite: 
		○ Preço diferente para dias de semana vs fim de semana
		○ Multiplicador para feriados (ex: 1.3x)
		○ Desconto para grupos (ex: 10% para 5+ pessoas)
		○ Preço infantil (0-5 anos gratuito, 6-12 anos 50% off)
		○ Possibilidade de criar promoções por data específica
		○ Visualização de calendário de preços
2.2 Add-ons Opcionais
US-DAY-003: Como gestor, quero configurar add-ons vendidos separadamente
	• Critérios de Aceite: 
		○ Catálogo de add-ons: 
			§ Toalha de banho (R$ X)
			§ Cadeira de praia extra (R$ X)
			§ Guarda-sol extra (R$ X)
			§ Churrasqueira (R$ X por hora)
			§ Bebidas alcoólicas (lista de preços)
			§ Horas extras de quadra (R$ X por hora)
			§ Massagem (R$ X por sessão)
		○ Cada add-on tem: nome, descrição, preço, estoque disponível
		○ Possibilidade de marcar como "sob consulta"
		○ Imagens dos add-ons
		○ Status (disponível/indisponível)
US-DAY-004: Como cliente, quero adicionar add-ons ao meu pacote
	• Critérios de Aceite: 
		○ Durante compra do pacote, exibir add-ons disponíveis
		○ Cliente seleciona quantidade de cada add-on
		○ Sistema calcula valor total (pacote + add-ons)
		○ Add-ons podem ser adicionados após compra (até 24h antes)
		○ Visualização clara do que está incluído vs add-ons
2.3 Reserva e Disponibilidade
US-DAY-005: Como cliente, quero reservar day use para data específica
	• Critérios de Aceite: 
		○ Página "Day Use" com pacotes disponíveis (cards visuais)
		○ Calendário para seleção de data
		○ Exibição de disponibilidade em tempo real (ex: "15 de 30 vagas")
		○ Preço ajustado conforme dia selecionado
		○ Seleção de número de adultos e crianças
		○ Aplicação automática de descontos (infantil, grupo)
		○ Seleção de add-ons opcionais
		○ Cálculo do valor total
		○ Campo para observações especiais
		○ Pagamento integral antecipado (não usa caução)
US-DAY-006: Como gestor, quero controlar capacidade por data
	• Critérios de Aceite: 
		○ Limite de pessoas por dia configurável
		○ Visualização de ocupação no calendário
		○ Cores indicativas: verde (< 50%), amarelo (50-80%), vermelho (> 80%), cinza (esgotado)
		○ Possibilidade de bloquear data inteira (manutenção, evento privado)
		○ Overbooking controlado (configurável, ex: 5% a mais)
		○ Histórico de ocupação
2.4 Check-in e Check-out Digital
US-DAY-007: Como recepcionista, quero fazer check-in de clientes day use
	• Critérios de Aceite: 
		○ Tela "Check-ins do Dia"
		○ Lista de reservas confirmadas para hoje
		○ Busca por nome, CPF ou código de reserva
		○ Informações exibidas: nome, nº de pessoas, pacote contratado, add-ons
		○ Botão "Fazer Check-in"
		○ Registro de horário exato de entrada
		○ Emissão de pulseiras/identificação (se aplicável)
		○ Entrega de itens (toalhas, chaves de armário)
		○ Status atualizado para "Em uso"
US-DAY-008: Como recepcionista, quero fazer check-out de clientes
	• Critérios de Aceite: 
		○ Tela "Check-outs Pendentes"
		○ Lista de clientes que fizeram check-in
		○ Busca por nome ou pulseira
		○ Verificação de consumo extra (bebidas, add-ons não pagos)
		○ Cobrança de extras (se houver)
		○ Recolhimento de itens (toalhas, pulseiras)
		○ Botão "Finalizar Check-out"
		○ Registro de horário exato de saída
		○ Opção de solicitar avaliação
		○ Status atualizado para "Concluído"
US-DAY-009: Como cliente, quero fazer self check-in via QR Code
	• Critérios de Aceite: 
		○ Cliente recebe QR Code por e-mail/WhatsApp
		○ Totem ou tablet na recepção para leitura
		○ Cliente escaneia QR Code
		○ Sistema valida reserva
		○ Exibe tela de boas-vindas com: 
			§ Nome do cliente
			§ Itens inclusos
			§ Horário de saída
			§ Mapa da arena
		○ Cliente confirma check-in
		○ Sistema atualiza status automaticamente
2.5 Gestão de Quadras no Day Use
US-DAY-010: Como cliente day use, quero reservar horário de quadra incluído no pacote
	• Critérios de Aceite: 
		○ Se pacote inclui X horas de quadra
		○ Cliente acessa "Minhas Reservas Day Use"
		○ Botão "Agendar Horário de Quadra"
		○ Seleção de quadra disponível na data do day use
		○ Seleção de horário (dentro do período do day use)
		○ Máximo de horas conforme pacote
		○ Reserva vinculada ao day use (não cobra separado)
		○ Integração com agenda do CORE
US-DAY-011: Como gestor, quero priorizar quadras para day use
	• Critérios de Aceite: 
		○ Configuração de quais quadras podem ser usadas no day use
		○ Bloqueio de horários reservados por day use na agenda geral
		○ Clientes regulares veem horários como "reservado - day use"
		○ Possibilidade de liberar horários não usados 2h antes
2.6 Controle de Consumo
US-DAY-012: Como recepcionista/garçom, quero registrar consumo extra do cliente
	• Critérios de Aceite: 
		○ Sistema de comanda digital
		○ Busca de cliente por pulseira/nome
		○ Lançamento de itens consumidos (bebidas, alimentos extras)
		○ Visualização de consumo em tempo real pelo cliente (app futuro)
		○ Total acumulado por cliente
		○ Integração com sistema do bar/restaurante (se houver)
		○ Fechamento de conta no check-out
2.7 Comunicação com Clientes
US-DAY-013: Como cliente, quero receber informações sobre meu day use
	• Critérios de Aceite: 
		○ Confirmação de compra: e-mail + WhatsApp com: 
			§ Dados da reserva
			§ QR Code de check-in
			§ Itens inclusos e add-ons
			§ Horários
			§ Regras da casa
		○ 1 dia antes: lembrete via WhatsApp 
			§ Confirma presença
			§ Dicas (o que levar, horários)
		○ No dia: 
			§ Mensagem de boas-vindas
			§ Link para cardápio digital
		○ Pós day use: 
			§ Agradecimento
			§ Solicita avaliação
			§ Oferece próxima visita com desconto
2.8 Relatórios Gerenciais
US-DAY-014: Como gestor, quero relatórios completos do day use
	• Critérios de Aceite: 
		○ Relatório de Vendas: 
			§ Receita por pacote
			§ Receita por add-ons
			§ Ticket médio por pessoa
			§ Comparativo por período
		○ Relatório de Ocupação: 
			§ Taxa de ocupação por dia/semana/mês
			§ Dias com maior demanda
			§ Horários de pico
		○ Relatório de Add-ons: 
			§ Add-ons mais vendidos
			§ Receita por tipo de add-on
		○ Relatório de No-shows: 
			§ Clientes que não compareceram
			§ Taxa de no-show
			§ Valor perdido
		○ Relatório de Avaliações: 
			§ NPS do day use
			§ Comentários e sugestões
		○ Exportação em PDF e Excel

3. Integrações com Módulo CORE
3.1 Sistema de Pagamentos
	• Usa mesma integração Asaas do CORE
	• Day use sempre paga antecipado (não usa caução)
	• Extras cobrados no check-out
3.2 Agenda de Quadras
	• Horários de quadra do day use bloqueiam agenda geral
	• Clientes regulares veem como "Reservado - Day Use"
	• Integração bidirecional: day use → agenda, agenda → disponibilidade
3.3 Cadastro de Clientes
	• Cliente day use pode se tornar cliente regular
	• Histórico unificado (reservas + day use)
	• Programa de indicação vale para day use também

4. Fluxos de Usuário
4.1 Compra de Pacote Day Use
1. Cliente acessa "Day Use" no site
2. Vê 3 pacotes disponíveis com fotos:
   - Básico: R$ 80 (piscina + lanche)
   - Completo: R$ 150 (piscina + almoço + bebidas + 2h quadra)
   - Premium: R$ 250 (tudo + massagem + churrasqueira)
3. Seleciona "Completo"
4. Calendário abre: próximo sábado disponível
5. Sistema mostra: R$ 180 (preço fim de semana)
6. Define: 2 adultos + 1 criança (8 anos)
7. Sistema calcula:
   - 2 adultos: R$ 360
   - 1 criança (50%): R$ 90
   - Total: R$ 450
8. Add-ons sugeridos:
   - Cliente adiciona: 2 toalhas (R$ 20)
   - Total final: R$ 470
9. Faz login ou cadastro
10. Observações: "Aniversário do João"
11. Paga via Pix
12. Recebe confirmação + QR Code
4.2 Check-in no Dia
1. Sábado 10h, cliente chega na arena
2. Recepcionista: "Bom dia! Nome?"
3. Cliente: "João Silva"
4. Recepcionista busca no sistema
5. Encontra reserva:
   - João Silva
   - 2 adultos + 1 criança
   - Pacote Completo + 2 toalhas
6. Clica "Check-in"
7. Sistema registra 10:15h
8. Entrega:
   - 3 pulseiras (identificação)
   - 2 toalhas
   - Mapa da arena
9. Recepcionista: "Piscina ao fundo, almoço a partir do meio-dia. Aproveitem!"
10. Status: "Em uso"
4.3 Agendamento de Quadra Durante Day Use
1. João acessa painel pelo celular
2. "Meu Day Use" > "Agendar Quadra"
3. Vê disponibilidade:
   - 14h-15h: Society 1 (disponível)
   - 15h-16h: Campo Gramado (disponível)
   - 16h-17h: Ambas (indisponível)
4. Seleciona Society 1, 14h-15h
5. Confirma (não cobra, já incluso)
6. Recebe confirmação
7. Sistema bloqueia na agenda geral
4.4 Consumo Extra no Bar
1. João pede 2 cervejas no bar (14h)
2. Garçom: "Pulseira, por favor"
3. João mostra pulseira amarela #125
4. Garçom lança no sistema:
   - Cliente: João Silva #125
   - 2 Heineken: R$ 24
5. Consumo registrado na comanda
6. João pode pedir mais ao longo do dia
7. Total acumulado: R$ 24
4.5 Check-out
1. João retorna à recepção (17:30h)
2. Recepcionista: "Check-out da família Silva?"
3. João: "Sim"
4. Recepcionista verifica:
   - Consumo extra: R$ 24 (2 cervejas)
   - Toalhas: devolvidas (OK)
   - Pulseiras: recolhidas (OK)
5. "Consumo extra de R$ 24. Como quer pagar?"
6. João: "Pix"
7. Gera QR Code, João paga
8. Recepcionista: "Pronto! Como foi a experiência?"
9. João: "Excelente!"
10. Sistema finaliza check-out (17:35h)
11. Status: "Concluído"
12. João recebe SMS: "Avalie sua experiência: [link]"

5. Estrutura de Banco de Dados
Tabelas Principais:
day_use_packages (pacotes)
- id (uuid, PK)
- name (text)
- description (text)
- image_url (text)
- included_items (jsonb) -- array de itens inclusos
- start_time (time) -- ex: 10:00
- end_time (time) -- ex: 18:00
- max_capacity (integer) -- total de pessoas
- base_price (decimal) -- dias de semana
- weekend_price (decimal) -- sáb/dom
- holiday_multiplier (decimal) -- ex: 1.3
- child_discount_percentage (decimal) -- ex: 50
- group_discount_config (jsonb) -- regras de desconto
- included_court_hours (integer) -- horas de quadra inclusas
- status (enum: 'active', 'inactive')
- created_at (timestamp)
day_use_addons (add-ons)
- id (uuid, PK)
- name (text)
- description (text)
- price (decimal)
- stock_available (integer) -- se limitado
- image_url (text)
- category (enum: 'equipment', 'food', 'beverage', 'service')
- status (enum: 'available', 'unavailable')
- created_at (timestamp)
day_use_reservations (reservas de day use)
- id (uuid, PK)
- user_id (uuid, FK)
- package_id (uuid, FK)
- reservation_date (date)
- num_adults (integer)
- num_children (integer)
- total_price (decimal)
- special_notes (text)
- qr_code (text) -- para check-in
- payment_id (uuid, FK)
- status (enum: 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')
- check_in_time (timestamp)
- check_out_time (timestamp)
- created_at (timestamp)
day_use_reservation_addons (add-ons da reserva)
- id (uuid, PK)
- reservation_id (uuid, FK)
- addon_id (uuid, FK)
- quantity (integer)
- unit_price (decimal)
- total_price (decimal)
- delivered (boolean) -- se já foi entregue
day_use_court_bookings (quadras agendadas no day use)
- id (uuid, PK)
- reservation_id (uuid, FK)
- court_id (uuid, FK)
- start_time (timestamp)
- end_time (timestamp)
- status (enum: 'scheduled', 'completed', 'cancelled')
day_use_extra_consumption (consumo extra)
- id (uuid, PK)
- reservation_id (uuid, FK)
- item_name (text)
- quantity (integer)
- unit_price (decimal)
- total_price (decimal)
- recorded_by (uuid, FK) -- funcionário que lançou
- recorded_at (timestamp)
day_use_capacity_control (controle de capacidade)
- id (uuid, PK)
- date (date)
- package_id (uuid, FK)
- max_capacity (integer)
- current_bookings (integer)
- is_blocked (boolean)
- block_reason (text)

6. Regras de Negócio
RN-DAY-001: Day use sempre requer pagamento integral antecipado
RN-DAY-002: Preço é calculado dinamicamente conforme dia da semana + feriado
RN-DAY-003: Crianças 0-5 anos: gratuitas | 6-12 anos: 50% desconto
RN-DAY-004: Desconto para grupo aplicado automaticamente (configurável)
RN-DAY-005: Capacidade máxima por dia não pode ser excedida (exceto overbooking configurado)
RN-DAY-006: Check-in só pode ser feito no dia da reserva
RN-DAY-007: Check-out automático se cliente não finalizar até 2h após horário previsto
RN-DAY-008: Quadras do day use bloqueiam agenda geral do CORE
RN-DAY-009: Horas de quadra inclusas devem ser usadas no dia do day use
RN-DAY-010: Add-ons podem ser adicionados até 24h antes da data
RN-DAY-011: Cancelamento com mais de 48h: reembolso de 100%
RN-DAY-012: Cancelamento entre 24h e 48h: reembolso de 50%
RN-DAY-013: Cancelamento com menos de 24h: sem reembolso
RN-DAY-014: No-show (não comparecer): sem reembolso + marca no histórico
RN-DAY-015: Consumo extra deve ser pago no check-out (não pode ficar pendente)

7. Precificação Dinâmica - Exemplos
Exemplo 1: Família em Dia de Semana
Pacote: Completo (R$ 150 base)
Data: Quarta-feira (dia de semana)
Pessoas: 2 adultos + 2 crianças (7 e 4 anos)
Cálculo:
- Adulto 1: R$ 150
- Adulto 2: R$ 150
- Criança 1 (7 anos, 50%): R$ 75
- Criança 2 (4 anos, grátis): R$ 0
Total: R$ 375
Exemplo 2: Grupo em Fim de Semana
Pacote: Completo (R$ 150 base, R$ 180 fim de semana)
Data: Sábado (fim de semana)
Pessoas: 6 adultos
Cálculo:
- 6 adultos x R$ 180: R$ 1.080
- Desconto grupo 5+ (10%): -R$ 108
Total: R$ 972
Exemplo 3: Feriado com Add-ons
Pacote: Premium (R$ 250 base, R$ 300 fim de semana, x1.2 feriado)
Data: Feriado
Pessoas: 2 adultos
Add-ons: Churrasqueira (R$ 80) + 4 toalhas (R$ 40)
Cálculo:
- 2 adultos x R$ 300 x 1.2: R$ 720
- Add-ons: R$ 120
Total: R$ 840

8. Métricas de Sucesso
KPIs do Day Use:
	• Taxa de ocupação média: > 70% nos fins de semana
	• Ticket médio por pessoa: > R$ 120
	• Taxa de conversão add-ons: > 40% dos clientes compram add-ons
	• Taxa de no-show: < 5%
	• Consumo extra médio: > R$ 30 por reserva
	• NPS do day use: > 70
	• Taxa de retorno: > 30% dos clientes voltam em 3 meses

9. Priorização
Must Have (MVP Day Use):
	• Cadastro de pacotes com precificação dinâmica
	• Sistema de reservas com controle de capacidade
	• Add-ons básicos (toalha, cadeira, guarda-sol)
	• Check-in e check-out manual
	• Integração com pagamentos
	• Calendário de disponibilidade
Should Have:
	• Check-in via QR Code (self-service)
	• Controle de consumo extra
	• Integração com agenda de quadras
	• Relatórios gerenciais
	• Notificações automáticas
Could Have:
	• App mobile para clientes acompanharem consumo
	• Sistema de pulseiras inteligentes (RFID)
	• Mapa interativo da arena
	• Fotos durante o day use (compartilhamento social)
	• Programa de fidelidade day use

10. Roadmap de Implementação
Fase 1 - Setup (2 semanas)
	• Estrutura de banco de dados
	• Cadastro de pacotes e add-ons
	• Interface de gestão
Fase 2 - Reservas (3 semanas)
	• Sistema de reservas com calendário
	• Precificação dinâmica
	• Controle de capacidade
	• Integração com pagamentos
Fase 3 - Operação (3 semanas)
	• Check-in e check-out
	• Controle de consumo extra
	• Integração com agenda de quadras
	• QR Code para check-in
Fase 4 - Comunicação e Relatórios (2 semanas)
	• Notificações automáticas
	• Relatórios gerenciais
	• Avaliações pós day use
	• Ajustes finais
Total: ~10 semanas (2,5 meses)

11. Considerações Operacionais
11.1 Equipe Necessária
	• Recepcionista: check-in/check-out, atendimento
	• Garçons/Atendentes: controle de consumo, serviço
	• Salva-vidas: obrigatório para piscina
	• Limpeza: manutenção contínua durante o dia
11.2 Infraestrutura Necessária
	• Tablets/computadores para check-in
	• Leitor de QR Code (se self-service)
	• Pulseiras de identificação
	• Toalhas, cadeiras, guarda-sóis (estoque)
	• Sistema de som ambiente
	• WiFi para clientes
	• Armários/vestiários
11.3 Regras da Casa (Exemplo)
	• Horário de funcionamento: 10h às 18h
	• Uso de piscina: obrigatório traje de banho
	• Crianças menores de 12 anos sob supervisão
	• Proibido entrada de alimentos e bebidas externos
	• Proibido som alto (respeitar outros clientes)
	• Descarte de lixo nos locais apropriados
	• Não reservar cadeiras/mesas vazias

12. Diferencial Competitivo
Vs. Clubes Tradicionais:
	• Flexibilidade (sem mensalidade, paga quando usar)
	• Preço mais acessível
	• Experiência completa em um dia
	• Localização conveniente
Vs. Day Use de Hotéis:
	• Foco em esporte e lazer ativo
	• Público jovem e famílias
	• Integração com quadras esportivas
	• Ambiente mais descontraído
Vs. Parques Aquáticos:
	• Experiência mais intimista (menor capacidade)
	• Serviço mais personalizado
	• Alimentação de qualidade inclusa
	• Preço mais competitivo



