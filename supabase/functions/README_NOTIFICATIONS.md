# Edge Functions: Notificações Automáticas

Este guia cobre o deployment e configuração das 3 Edge Functions de notificação automática.

## Funções Criadas

### 1. send-reminder-45min
Envia lembrete 45 minutos antes do jogo começar.

**Cron:** `*/15 * * * *` (a cada 15 minutos)
**Janela de execução:** 40-50 minutos antes do jogo

### 2. send-reminder-10min
Envia lembrete final 10 minutos antes do jogo.

**Cron:** `*/5 * * * *` (a cada 5 minutos)
**Janela de execução:** 8-12 minutos antes do jogo

### 3. send-review-request
Solicita avaliação 2 horas após o jogo terminar.

**Cron:** `*/30 * * * *` (a cada 30 minutos)
**Janela de execução:** 1.5-2.5 horas após o fim

---

## Deploy (todas as funções)

```bash
# 1. Deploy send-reminder-45min
supabase functions deploy send-reminder-45min

# 2. Deploy send-reminder-10min
supabase functions deploy send-reminder-10min

# 3. Deploy send-review-request
supabase functions deploy send-review-request
```

---

## Configurar Variáveis de Ambiente

As 3 funções compartilham as mesmas variáveis:

```bash
supabase secrets set WHATSAPP_ACCESS_TOKEN=your_access_token
supabase secrets set WHATSAPP_PHONE_NUMBER_ID=your_phone_id
supabase secrets set CRON_SECRET_TOKEN=$(openssl rand -hex 32)
supabase secrets set NEXT_PUBLIC_APP_URL=https://arena.com
```

**Nota:** `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são configuradas automaticamente.

---

## Configurar Cron Jobs

No Dashboard do Supabase → Edge Functions:

### send-reminder-45min
- **Cron:** `*/15 * * * *`
- **Descrição:** Lembrete 45min antes do jogo

### send-reminder-10min
- **Cron:** `*/5 * * * *`
- **Descrição:** Lembrete final 10min antes

### send-review-request
- **Cron:** `*/30 * * * *`
- **Descrição:** Solicitar avaliação após jogo

---

## Teste Manual

```bash
# Teste send-reminder-45min
curl -X POST https://your-project.supabase.co/functions/v1/send-reminder-45min \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Teste send-reminder-10min
curl -X POST https://your-project.supabase.co/functions/v1/send-reminder-10min \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Teste send-review-request
curl -X POST https://your-project.supabase.co/functions/v1/send-review-request \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Monitoramento

Verificar logs no Supabase Dashboard → Edge Functions:

**Sucesso:**
- `✅ Reminder sent to [nome]`
- `{ "success": true, "sent": X }`

**Erro:**
- `❌ Failed to send to [nome]`
- `Error processing reservation [id]`

---

## Tabela de Notificações

As funções salvam registros na tabela `notificacoes`:

```sql
SELECT * FROM notificacoes
WHERE tipo IN ('lembrete_45min', 'lembrete_10min', 'solicitar_avaliacao')
ORDER BY created_at DESC
LIMIT 50;
```

---

## Troubleshooting

**Nenhuma notificação enviada:**
- Verificar se há reservas confirmadas nas próximas horas
- Conferir se usuários têm número de WhatsApp cadastrado
- Checar se notificação já foi enviada (`notificacoes` table)

**Erro de autenticação WhatsApp:**
- Verificar `WHATSAPP_ACCESS_TOKEN` está correto
- Confirmar `WHATSAPP_PHONE_NUMBER_ID` está configurado
- Testar manualmente via Graph API Explorer

**Notificação duplicada:**
- As funções verificam tabela `notificacoes` antes de enviar
- Cada notificação é registrada com tipo único por reserva

---

## Próximos Passos

- [ ] Adicionar template de mensagem WhatsApp (opcional)
- [ ] Implementar fallback para Email/SMS
- [ ] Dashboard de métricas de notificações
- [ ] Retry mechanism para falhas de envio
