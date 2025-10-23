# Sistema de Notificações Automáticas - Arena Dona Santa

Este documento descreve o sistema completo de notificações automáticas implementado no Arena Dona Santa, incluindo templates de mensagens, lembretes e avaliações pós-jogo.

## 📋 Visão Geral

O sistema de notificações automáticas é responsável por:

- **Lembretes automáticos** (45min e 10min antes do jogo)
- **Notificações de aceite de convite** para jogos em grupo
- **Avaliações pós-jogo** para feedback dos clientes
- **Templates personalizáveis** para todas as mensagens
- **Processamento automático** via cron jobs
- **Integração completa** com pagamentos e reservas

## 🏗️ Arquitetura

### Componentes Principais

1. **NotificacaoService** - Serviço principal para gerenciar notificações
2. **Templates** - Sistema de templates personalizáveis
3. **Cron Jobs** - Processamento automático de notificações pendentes
4. **Webhooks** - Integração com eventos de pagamento
5. **WhatsApp Integration** - Envio das mensagens

### Fluxo de Funcionamento

```
Reserva Confirmada → Agendar Lembretes → Cron Job → Enviar WhatsApp
       ↓                    ↓               ↓            ↓
   Pagamento OK      Banco de Dados    Processar     Notificar Cliente
```

## 📊 Banco de Dados

### Tabela: `notificacoes_agendadas`

```sql
CREATE TABLE notificacoes_agendadas (
  id UUID PRIMARY KEY,
  reserva_id UUID NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL,
  enviado BOOLEAN DEFAULT FALSE,
  tentativas INTEGER DEFAULT 0,
  dados_template JSONB NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `templates_notificacao`

```sql
CREATE TABLE templates_notificacao (
  id UUID PRIMARY KEY,
  tipo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  template TEXT NOT NULL,
  variaveis TEXT[] NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📝 Templates de Mensagem

### 1. Lembrete 45 Minutos

**Tipo:** `lembrete_45min`

**Template:**
```
⏰ *Lembrete de Jogo*

Seu jogo é em 45 minutos!

📍 *Quadra:* {{quadra}}
📅 *Data:* {{data}}
⏰ *Horário:* {{horario}}
👥 *Participantes:* {{participantes}}

Prepare-se e chegue com antecedência. Nos vemos lá! 🎾
```

**Variáveis:** `quadra`, `data`, `horario`, `participantes`

### 2. Lembrete 10 Minutos

**Tipo:** `lembrete_10min`

**Template:**
```
🚨 *ÚLTIMO LEMBRETE*

Seu jogo é em 10 minutos!

📍 *Quadra:* {{quadra}}
⏰ *Horário:* {{horario}}

Venha rapidamente! O jogo está prestes a começar! 🏃‍♂️🎾
```

**Variáveis:** `quadra`, `horario`

### 3. Aceite de Convite

**Tipo:** `aceite_convite`

**Template:**
```
✅ *Convite Aceito!*

{{nomeConvidado}} aceitou seu convite para jogar!

📍 *Quadra:* {{quadra}}
📅 *Data:* {{data}}
⏰ *Horário:* {{horario}}
👥 *Participantes confirmados:* {{participantesConfirmados}}/{{totalParticipantes}}

{{#temVagas}}
🔄 *Ainda há vagas disponíveis!* Convide mais amigos.
{{/temVagas}}

Prepare-se para um ótimo jogo! 🎾
```

**Variáveis:** `nomeConvidado`, `quadra`, `data`, `horario`, `participantesConfirmados`, `totalParticipantes`, `temVagas`

### 4. Avaliação Pós-Jogo

**Tipo:** `avaliacao_pos_jogo`

**Template:**
```
🏆 *Como foi seu jogo?*

Esperamos que tenha se divertido na {{quadra}}!

⭐ *Avalie sua experiência:*
• Qualidade da quadra
• Atendimento
• Facilidades

📝 *Deixe seu feedback:*
{{linkAvaliacao}}

Sua opinião é muito importante para melhorarmos sempre! 🙏

*Próximo jogo:* Reserve já sua próxima partida!
{{linkReserva}}
```

**Variáveis:** `quadra`, `linkAvaliacao`, `linkReserva`

## 🔧 Configuração

### 1. Variáveis de Ambiente

```env
# Token para autenticação do cron job
CRON_SECRET_TOKEN="seu-token-secreto-aqui"

# URL da aplicação
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"

# Configurações do WhatsApp (já existentes)
WHATSAPP_ACCESS_TOKEN="seu-token-whatsapp"
WHATSAPP_PHONE_NUMBER_ID="seu-phone-id"

# Configurações do Supabase (já existentes)
NEXT_PUBLIC_SUPABASE_URL="sua-url-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-supabase"
```

### 2. Executar Migração do Banco

```bash
# Aplicar a migração no Supabase
supabase db push

# Ou executar manualmente o SQL
psql -h seu-host -U seu-usuario -d seu-banco -f supabase/migrations/20241023_notificacoes_sistema.sql
```

### 3. Configurar Cron Job

```bash
# Tornar o script executável
chmod +x scripts/setup-cron.sh

# Executar configuração automática
./scripts/setup-cron.sh

# Ou configurar manualmente
crontab -e
# Adicionar linha:
* * * * * cd /path/to/project && node scripts/cron-notificacoes.js >> /var/log/arena-notificacoes.log 2>&1
```

## 🚀 Uso da API

### 1. Agendar Lembretes para Reserva

```typescript
import { useNotificacoes } from '@/hooks/useNotificacoes';

const { agendarLembretes } = useNotificacoes();

await agendarLembretes('reserva-id', {
  telefone: '5511999999999',
  quadra: 'Quadra A',
  data: new Date('2024-10-25T20:00:00'),
  horario: '20:00',
  participantes: ['João', 'Maria']
});
```

### 2. Notificar Aceite de Convite

```typescript
const { notificarAceiteConvite } = useNotificacoes();

await notificarAceiteConvite({
  telefoneOrganizador: '5511999999999',
  nomeConvidado: 'João Silva',
  quadra: 'Quadra B',
  data: new Date('2024-10-25T19:00:00'),
  horario: '19:00',
  participantesConfirmados: 3,
  totalParticipantes: 4
});
```

### 3. Gerenciar Templates

```typescript
import { useTemplatesNotificacao } from '@/hooks/useNotificacoes';

const { 
  templates, 
  carregarTemplates, 
  atualizarTemplate, 
  testarTemplate 
} = useTemplatesNotificacao();

// Carregar templates
await carregarTemplates();

// Atualizar template
await atualizarTemplate('lembrete_45min', {
  template: 'Nova mensagem personalizada...',
  ativo: true
});

// Testar template
await testarTemplate('lembrete_45min', {
  quadra: 'Quadra A',
  data: '25/10/2024',
  horario: '20:00',
  participantes: 4
}, '5511999999999');
```

## 📡 Endpoints da API

### Processar Notificações Pendentes

```http
POST /api/notificacoes/processar
Authorization: Bearer {CRON_SECRET_TOKEN}
```

### Listar Templates

```http
GET /api/notificacoes/templates
```

### Atualizar Template

```http
PUT /api/notificacoes/templates
Content-Type: application/json

{
  "tipo": "lembrete_45min",
  "template": {
    "titulo": "Novo título",
    "template": "Nova mensagem...",
    "ativo": true
  }
}
```

### Testar Template

```http
POST /api/notificacoes/testar
Content-Type: application/json

{
  "tipo": "lembrete_45min",
  "telefone": "5511999999999",
  "dadosTeste": {
    "quadra": "Quadra A",
    "data": "25/10/2024",
    "horario": "20:00",
    "participantes": 4
  }
}
```

### Obter Estatísticas

```http
GET /api/notificacoes/estatisticas?dataInicio=2024-10-01&dataFim=2024-10-31
```

## 🎯 Integração com Reservas

### Fluxo Automático

1. **Pagamento Confirmado** (Webhook Asaas)
   - Confirma reserva no banco
   - Envia notificação de pagamento
   - Agenda lembretes automáticos

2. **45 Minutos Antes** (Cron Job)
   - Processa notificações pendentes
   - Envia lembrete via WhatsApp

3. **10 Minutos Antes** (Cron Job)
   - Envia último lembrete

4. **2 Horas Depois** (Cron Job)
   - Envia solicitação de avaliação

### Cancelamento de Reserva

```typescript
// Cancelar todas as notificações de uma reserva
await notificacaoService.cancelarNotificacoesReserva('reserva-id');
```

## 📊 Monitoramento

### Logs do Cron Job

```bash
# Visualizar logs em tempo real
tail -f /var/log/arena-notificacoes.log

# Verificar últimas execuções
tail -n 50 /var/log/arena-notificacoes.log
```

### Estatísticas de Envio

```typescript
const estatisticas = await obterEstatisticas(
  new Date('2024-10-01'),
  new Date('2024-10-31')
);

console.log(estatisticas);
// {
//   total: 150,
//   enviadas: 145,
//   pendentes: 3,
//   falharam: 2,
//   porTipo: {
//     lembrete_45min: { total: 50, enviadas: 48, taxa: 96.0 },
//     lembrete_10min: { total: 50, enviadas: 49, taxa: 98.0 },
//     avaliacao_pos_jogo: { total: 50, enviadas: 48, taxa: 96.0 }
//   }
// }
```

## 🔧 Administração

### Componente de Gerenciamento

```typescript
import { GerenciadorTemplates } from '@/components/admin/GerenciadorTemplates';

// Usar no painel administrativo
<GerenciadorTemplates />
```

### Funcionalidades do Painel

- ✅ Visualizar todos os templates
- ✅ Editar templates em tempo real
- ✅ Ativar/desativar templates
- ✅ Testar envio de mensagens
- ✅ Visualizar estatísticas
- ✅ Monitorar taxa de entrega

## 🚨 Troubleshooting

### Notificações Não Enviadas

1. **Verificar Cron Job**
   ```bash
   crontab -l | grep cron-notificacoes
   ```

2. **Verificar Logs**
   ```bash
   tail -f /var/log/arena-notificacoes.log
   ```

3. **Testar Manualmente**
   ```bash
   node scripts/cron-notificacoes.js
   ```

### Templates Não Funcionando

1. **Verificar Sintaxe**
   - Variáveis devem usar `{{variavel}}`
   - Condicionais: `{{#condicao}}...{{/condicao}}`

2. **Testar Template**
   ```typescript
   await testarTemplate('tipo', dadosTeste, telefone);
   ```

### WhatsApp Não Envia

1. **Verificar Tokens**
   ```env
   WHATSAPP_ACCESS_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   ```

2. **Verificar Rate Limits**
   - WhatsApp tem limite de mensagens por minuto
   - Sistema implementa delay automático

## 📈 Melhorias Futuras

### Funcionalidades Planejadas

- [ ] **Notificações por Email** como backup
- [ ] **Templates com Imagens** e botões interativos
- [ ] **Segmentação de Usuários** para mensagens personalizadas
- [ ] **A/B Testing** de templates
- [ ] **Dashboard Analytics** com métricas detalhadas
- [ ] **Integração com CRM** para histórico completo
- [ ] **Notificações Push** para app mobile
- [ ] **Chatbot Inteligente** com IA

### Otimizações

- [ ] **Cache de Templates** para melhor performance
- [ ] **Retry Logic** mais inteligente
- [ ] **Batch Processing** para envios em massa
- [ ] **Webhook Reliability** com confirmação de entrega

## 🔒 Segurança

### Medidas Implementadas

- ✅ **Autenticação de Cron Job** com token secreto
- ✅ **Validação de Webhooks** com assinatura HMAC
- ✅ **Rate Limiting** para evitar spam
- ✅ **Sanitização de Dados** nos templates
- ✅ **Logs Seguros** sem dados sensíveis

### Boas Práticas

- 🔐 Manter tokens em variáveis de ambiente
- 🔐 Rotacionar tokens periodicamente
- 🔐 Monitorar logs de segurança
- 🔐 Validar todos os inputs
- 🔐 Implementar rate limiting

## 📞 Suporte

### Contatos

- **Desenvolvedor:** Equipe Arena Dona Santa
- **Documentação:** Este arquivo
- **Issues:** GitHub Issues
- **Logs:** `/var/log/arena-notificacoes.log`

### Comandos Úteis

```bash
# Verificar status do cron
systemctl status cron

# Reiniciar cron
sudo systemctl restart cron

# Testar conectividade WhatsApp
curl -X GET "https://graph.facebook.com/v18.0/me" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"

# Verificar banco de dados
psql -c "SELECT COUNT(*) FROM notificacoes_agendadas WHERE enviado = false;"
```

---

**Última atualização:** 23/10/2024  
**Versão:** 1.0.0  
**Status:** ✅ Implementado e Testado