# Sistema de Indicações - Arena Dona Santa

## Visão Geral

O Sistema de Indicações permite que usuários indiquem amigos para se cadastrarem na plataforma e ganhem créditos que podem ser utilizados para desconto em reservas de quadras.

## Funcionalidades Implementadas

### ✅ 1. Código de Indicação do Usuário

- **Geração Automática**: Cada usuário recebe um código único de 8 caracteres ao se cadastrar
- **Visualização**: Código exibido na página de indicações com opções de cópia e compartilhamento
- **Compartilhamento**: Botões para compartilhar via WhatsApp, redes sociais ou link direto

**Localização**: `src/components/modules/indicacoes/CodigoIndicacao.tsx`

### ✅ 2. Aplicação de Código ao Cadastrar

- **Integração no Cadastro**: Campo opcional no formulário de cadastro
- **URL com Código**: Suporte a URLs como `/auth/cadastro?codigo=ABC12345`
- **Validação**: Verificação se o código existe e está ativo
- **Aplicação Automática**: Créditos concedidos automaticamente quando indicação é aceita

**Localização**: 
- `src/components/auth/SignupForm.tsx`
- `src/app/(auth)/auth/page.tsx`

### ✅ 3. Visualização de Indicações

- **Dashboard Resumido**: Estatísticas gerais do programa de indicação
- **Lista Detalhada**: Todas as indicações com status e informações
- **Histórico Completo**: Filtros por status, busca por nome/email
- **Progresso de Bônus**: Acompanhamento das metas para bônus extras

**Componentes**:
- `src/components/modules/indicacoes/DashboardIndicacoes.tsx`
- `src/components/modules/indicacoes/ListaIndicacoes.tsx`
- `src/components/modules/indicacoes/HistoricoIndicacoes.tsx`
- `src/components/modules/indicacoes/ProgressoBonusIndicacoes.tsx`

### ✅ 4. Créditos Recebidos

- **Visualização de Créditos**: Lista todos os créditos recebidos
- **Histórico de Uso**: Mostra créditos utilizados e disponíveis
- **Estatísticas**: Resumo de créditos totais, disponíveis e utilizados
- **Uso em Reservas**: Componente para aplicar créditos durante reservas

**Componentes**:
- `src/components/modules/indicacoes/CreditosIndicacao.tsx`
- `src/components/modules/indicacoes/UsarCreditosReserva.tsx`

## Estrutura do Banco de Dados

### Tabelas Principais

1. **`configuracao_indicacao`**: Configurações do sistema (créditos por indicação, dias de expiração, bônus)
2. **`codigos_indicacao`**: Códigos únicos de cada usuário
3. **`indicacoes`**: Registro de todas as indicações feitas
4. **`creditos_indicacao`**: Créditos recebidos por indicações

### Triggers e Funções

- **`gerar_codigo_indicacao()`**: Gera códigos únicos automaticamente
- **`criar_codigo_indicacao_usuario()`**: Trigger para criar código ao cadastrar usuário
- **`processar_indicacao_aceita()`**: Processa créditos quando indicação é aceita
- **`expirar_indicacoes_antigas()`**: Expira indicações pendentes antigas

## API Endpoints

### Indicações
- `GET /api/indicacoes` - Listar indicações do usuário
- `POST /api/indicacoes` - Criar nova indicação

### Código de Indicação
- `GET /api/indicacoes/codigo` - Buscar código do usuário

### Aplicar Código
- `POST /api/indicacoes/aplicar` - Aplicar código de indicação

### Créditos
- `GET /api/indicacoes/creditos` - Buscar créditos do usuário
- `POST /api/indicacoes/creditos` - Usar créditos em reserva

### Estatísticas
- `GET /api/indicacoes/estatisticas` - Estatísticas do usuário

## Como Usar

### Para Indicar um Amigo

1. Acesse a página "Indicações" no menu do cliente
2. Use seu código de indicação para compartilhar com amigos
3. Ou preencha o formulário "Indicar Amigo" com email e nome
4. Acompanhe o status da indicação na lista

### Para Usar um Código de Indicação

1. **No Cadastro**: Use o link compartilhado ou digite o código no campo opcional
2. **Após Cadastro**: Use o formulário "Aplicar Código de Indicação" na página de indicações

### Para Usar Créditos

1. Durante uma reserva, use o componente `UsarCreditosReserva`
2. Selecione quantos créditos deseja usar (máximo: valor da reserva)
3. Confirme a aplicação dos créditos
4. O valor será descontado automaticamente do total

## Configurações do Sistema

### Valores Padrão
- **Créditos por indicação**: 50 créditos (R$ 50,00)
- **Dias para expiração**: 30 dias
- **Bônus por múltiplas indicações**:
  - 5 indicações: +25 créditos
  - 10 indicações: +50 créditos
  - 20 indicações: +100 créditos

### Personalização
As configurações podem ser alteradas na tabela `configuracao_indicacao` no banco de dados.

## Componentes Principais

### Página Principal
```typescript
// src/app/(dashboard)/cliente/indicacoes/page.tsx
export default function IndicacoesPage()
```

### Hook Principal
```typescript
// src/hooks/useIndicacoes.ts
export function useIndicacoes()
```

### Serviço Principal
```typescript
// src/services/indicacoes.service.ts
export class IndicacoesService
```

## Recursos Adicionais

### Notificações
- **Indicação Aceita**: Notifica quando alguém aceita uma indicação
- **Bônus Desbloqueado**: Notifica quando atinge metas de bônus
- **Créditos Próximos ao Vencimento**: Avisa sobre créditos que vão expirar

### Gamificação
- **Metas de Bônus**: Incentiva múltiplas indicações
- **Progresso Visual**: Barras de progresso para próximas metas
- **Badges**: Indicadores de conquistas

### Compartilhamento
- **Link Direto**: URLs com código pré-preenchido
- **Redes Sociais**: Botões para compartilhar em WhatsApp, Facebook, etc.
- **Cópia Rápida**: Copiar código ou link com um clique

## Próximos Passos

### Melhorias Sugeridas
1. **Push Notifications**: Notificações em tempo real
2. **Email Marketing**: Emails automáticos para indicações pendentes
3. **Relatórios Avançados**: Dashboard para gestores
4. **Integração com CRM**: Sincronização com sistemas externos
5. **Programa de Fidelidade**: Níveis VIP baseados em indicações

### Integrações Futuras
- **WhatsApp Business API**: Envio automático de convites
- **Google Analytics**: Tracking de conversões
- **Sistema de Cashback**: Conversão de créditos em dinheiro
- **Marketplace de Benefícios**: Troca de créditos por produtos

## Suporte e Manutenção

### Monitoramento
- Acompanhar taxa de conversão de indicações
- Monitorar uso de créditos
- Verificar indicações expiradas regularmente

### Limpeza de Dados
- Executar `expirar_indicacoes_antigas()` periodicamente
- Arquivar indicações muito antigas
- Limpar notificações lidas antigas

### Backup
- Backup regular das tabelas de indicações
- Histórico de configurações do sistema
- Log de transações de créditos