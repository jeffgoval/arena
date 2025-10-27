# Guia de Sandbox - Asaas Payment Gateway

Este documento fornece informações completas para testar a integração com o Asaas no ambiente de sandbox.

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Credenciais e URLs](#credenciais-e-urls)
3. [Dados de Teste](#dados-de-teste)
4. [Funcionalidades Disponíveis](#funcionalidades-disponíveis)
5. [Testes por Tipo de Pagamento](#testes-por-tipo-de-pagamento)
6. [Webhooks](#webhooks)
7. [Limitações do Sandbox](#limitações-do-sandbox)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Configuração Inicial

### Variáveis de Ambiente

As seguintes variáveis devem estar configuradas no `.env.local`:

```env
# Asaas Payment Gateway
ASAAS_API_KEY=your-sandbox-api-key
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_SECRET=your-webhook-secret
```

### URLs da API

- **Sandbox:** `https://sandbox.asaas.com/api/v3`
- **Produção:** `https://api.asaas.com/v3`

**Nota:** O ambiente é selecionado automaticamente pela variável `ASAAS_ENVIRONMENT`.

---

## 🔑 Credenciais e URLs

### Painel Sandbox

- **URL:** https://sandbox.asaas.com
- **Login:** Use as credenciais fornecidas ao criar a conta sandbox
- **Dashboard:** Acesse para visualizar pagamentos, clientes e configurações

### Obter API Key

1. Acesse o painel sandbox: https://sandbox.asaas.com
2. Navegue para **Integrações** > **API Keys**
3. Copie a API Key fornecida
4. Cole no `.env.local` como `ASAAS_API_KEY`

### Webhook Secret

1. No painel, acesse **Integrações** > **Webhooks**
2. Defina um token customizado ou use o gerado automaticamente
3. Configure no `.env.local` como `ASAAS_WEBHOOK_SECRET`

---

## 🧪 Dados de Teste

### Cartões de Crédito Válidos (Sandbox)

**Cartão 1: Aprovado Imediato**
```
Número: 5162306219378829
CVV: 318
Validade: 12/2030
Nome: JOAO DA SILVA
Status: Aprovado imediatamente
```

**Cartão 2: Análise Manual (demora 5-10 segundos)**
```
Número: 4111111111111111
CVV: 123
Validade: 12/2030
Nome: MARIA SANTOS
Status: Aguarda análise
```

**Cartão 3: Recusado**
```
Número: 5555555555554444
CVV: 321
Validade: 12/2030
Nome: TESTE RECUSADO
Status: Recusado (insuficiência de fundos)
```

### Dados de Cliente de Teste

```json
{
  "name": "Cliente Teste Sandbox",
  "email": "cliente-teste@asaas.com",
  "cpfCnpj": "24971563792",
  "phone": "11999998888",
  "mobilePhone": "11999998888",
  "postalCode": "01001000",
  "address": "Av. Paulista",
  "addressNumber": "1000",
  "complement": "Sala 01",
  "province": "Bela Vista",
  "city": "São Paulo",
  "state": "SP"
}
```

**CPFs Válidos para Teste:**
- `24971563792`
- `86534145070`
- `13669234630`

### Pré-Autorização (Caução)

**Cartão para Caução:**
```
Número: 5162306219378829
CVV: 318
Validade: 12/2030
Nome: TESTE CAUCAO
```

**Valores Recomendados:**
- Mínimo: R$ 5,00
- Máximo: R$ 10.000,00
- Sugestão: R$ 100,00 para testes

---

## 🎯 Funcionalidades Disponíveis

### 1. Gestão de Clientes

```javascript
// Criar cliente
const customer = await asaasService.createCustomer({
  name: "Cliente Teste",
  cpfCnpj: "24971563792",
  email: "teste@example.com"
});

// Buscar ou criar cliente
const customer = await asaasService.getOrCreateCustomer({
  name: "Cliente Teste",
  cpfCnpj: "24971563792"
});
```

### 2. Pagamento PIX

```javascript
const pixPayment = await asaasService.createPixPayment(
  customerId,
  50.00,
  "Reserva Quadra de Futebol",
  "REF-123"
);

// Retorna: QR Code (base64) e copia-e-cola
console.log(pixPayment.pixTransaction.qrCode.payload);
```

### 3. Pagamento com Cartão

```javascript
const cardPayment = await asaasService.createCreditCardPayment(
  customerId,
  100.00,
  "Mensalidade Academia",
  {
    creditCard: {
      holderName: "JOAO DA SILVA",
      number: "5162306219378829",
      expiryMonth: "12",
      expiryYear: "2030",
      ccv: "318"
    },
    creditCardHolderInfo: { /* ... */ },
    remoteIp: "192.168.1.1"
  }
);
```

### 4. Pré-Autorização (Caução)

```javascript
// Criar pré-autorização
const preAuth = await asaasService.createPreAuthorization({
  customer: customerId,
  value: 100.00,
  description: "Caução Quadra",
  creditCard: { /* ... */ }
});

// Capturar valor parcial (ex: danos)
await asaasService.capturePreAuthorization(preAuth.id, 30.00);

// Liberar sem cobrar
await asaasService.releasePreAuthorization(preAuth.id);
```

### 5. Cancelamento e Estorno

```javascript
// Cancelar pagamento pendente
await asaasService.cancelPayment(paymentId);

// Estornar pagamento recebido
await asaasService.refundPayment(paymentId, 50.00, "Devolução parcial");
```

---

## 💳 Testes por Tipo de Pagamento

### Teste 1: PIX - Fluxo Completo

**Objetivo:** Criar cobrança PIX e simular pagamento

**Passos:**
1. Criar cliente de teste
2. Gerar cobrança PIX de R$ 25,00
3. Salvar QR Code e copia-e-cola
4. No painel Asaas, simular pagamento
5. Validar recebimento do webhook
6. Confirmar atualização de status

**Resultado Esperado:**
- Status inicial: `PENDING`
- Após pagamento: `RECEIVED` → `CONFIRMED`
- Webhook `PAYMENT_RECEIVED` disparado

---

### Teste 2: Cartão - Aprovação Imediata

**Objetivo:** Processar pagamento aprovado instantaneamente

**Passos:**
1. Usar cartão `5162306219378829`
2. Processar cobrança de R$ 50,00
3. Validar aprovação imediata

**Resultado Esperado:**
- Status: `CONFIRMED`
- Processamento: < 2 segundos

---

### Teste 3: Cartão - Parcelamento

**Objetivo:** Testar pagamento parcelado

**Passos:**
1. Usar cartão válido
2. Processar R$ 300,00 em 3x de R$ 100,00
3. Validar cálculo de parcelas

**Resultado Esperado:**
- 3 cobranças criadas
- Valores corretos por parcela

---

### Teste 4: Caução - Captura Parcial

**Objetivo:** Pré-autorizar e capturar apenas parte do valor

**Passos:**
1. Pré-autorizar R$ 100,00
2. Capturar R$ 30,00 (simulando danos)
3. Validar que R$ 70,00 foram liberados

**Resultado Esperado:**
- Status inicial: `AUTHORIZED`
- Após captura: `CONFIRMED`
- Valor cobrado: R$ 30,00

---

### Teste 5: Estorno Total

**Objetivo:** Estornar pagamento já confirmado

**Passos:**
1. Criar e confirmar pagamento de R$ 50,00
2. Estornar valor total
3. Validar mudança de status

**Resultado Esperado:**
- Status: `REFUNDED`
- Webhook `PAYMENT_REFUNDED` disparado

---

## 🔔 Webhooks

### Configuração no Painel

1. Acesse **Integrações** > **Webhooks**
2. Clique em **Novo Webhook**
3. Configure:
   - **URL:** `https://[seu-dominio]/api/pagamentos/webhook`
   - **Versão da API:** v3
   - **Eventos:** Selecione os desejados (ver lista abaixo)
   - **Token de Autenticação:** Defina um secret seguro

### Eventos Disponíveis

```
PAYMENT_CREATED              - Pagamento criado
PAYMENT_AWAITING_PAYMENT     - Aguardando pagamento
PAYMENT_RECEIVED             - Pagamento recebido
PAYMENT_CONFIRMED            - Pagamento confirmado
PAYMENT_OVERDUE              - Pagamento vencido
PAYMENT_DELETED              - Pagamento deletado
PAYMENT_REFUNDED             - Pagamento estornado
PAYMENT_CHARGEBACK_REQUESTED - Chargeback solicitado
```

### Testar Webhooks Localmente

**Opção 1: ngrok**
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3000

# Usar URL fornecida (ex: https://abc123.ngrok.io/api/pagamentos/webhook)
```

**Opção 2: LocalTunnel**
```bash
# Instalar localtunnel
npm install -g localtunnel

# Expor porta local
lt --port 3000 --subdomain arena-asaas-test

# URL: https://arena-asaas-test.loca.lt/api/pagamentos/webhook
```

### Validar Webhook

**Payload Exemplo:**
```json
{
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "pay_123456",
    "customer": "cus_123456",
    "value": 50.00,
    "netValue": 48.50,
    "status": "RECEIVED",
    "billingType": "PIX",
    "description": "Reserva Quadra",
    "externalReference": "RESERVA-001",
    "paymentDate": "2025-01-15"
  }
}
```

**Validação de Assinatura:**
```javascript
const signature = request.headers.get('asaas-access-token');
const expectedSignature = crypto
  .createHmac('sha256', process.env.ASAAS_WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');

if (signature !== expectedSignature) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

---

## ⚠️ Limitações do Sandbox

### O que Funciona

- ✅ Criação de clientes
- ✅ Geração de cobranças (PIX, cartão, boleto)
- ✅ Simulação de pagamentos
- ✅ Pré-autorizações
- ✅ Cancelamentos e estornos
- ✅ Webhooks
- ✅ Consulta de status

### O que NÃO Funciona

- ❌ **Cobranças reais** - Nenhum valor é efetivamente cobrado
- ❌ **Banco

s reais** - Não há integração com instituições financeiras
- ❌ **E-mails de notificação** - Enviados apenas para e-mails de teste
- ❌ **Split de pagamento** - Funcionalidade limitada no sandbox
- ❌ **Transferências bancárias** - Apenas simuladas

### Diferenças entre Sandbox e Produção

| Recurso | Sandbox | Produção |
|---------|---------|----------|
| Cobranças | Simuladas | Reais |
| Cartões | Apenas de teste | Todos os cartões válidos |
| PIX | QR Code fictício | QR Code real do Banco Central |
| Boletos | PDF simulado | Boleto bancário registrado |
| Webhooks | Funcionam normalmente | Funcionam normalmente |
| Taxas | Não cobradas | Cobradas conforme plano |

---

## 🐛 Troubleshooting

### Erro: "Unauthorized" (401)

**Causa:** API Key inválida ou mal configurada

**Solução:**
1. Verificar `.env.local` tem `ASAAS_API_KEY` correto
2. Confirmar que API Key é do ambiente sandbox
3. Gerar nova API Key no painel se necessário

---

### Erro: "Customer not found" (404)

**Causa:** Cliente não existe ou ID incorreto

**Solução:**
1. Criar cliente antes de gerar cobrança
2. Usar `getOrCreateCustomer()` para evitar duplicatas
3. Validar que Customer ID retornado está correto

---

### Webhook não recebido

**Causa:** URL inacessível ou não configurada

**Solução:**
1. Verificar que aplicação está rodando
2. Se local, usar ngrok/localtunnel
3. Confirmar URL no painel Asaas está correta
4. Verificar que endpoint `/api/pagamentos/webhook` existe
5. Checar logs do servidor para erros

---

### Pagamento com status "AWAITING_RISK_ANALYSIS"

**Causa:** Cartão específico requer análise (simulação)

**Solução:**
- No sandbox, aguardar 5-10 segundos
- Status mudará automaticamente para `CONFIRMED` ou `REFUSED`
- Em produção, seguir processo de análise manual da Asaas

---

### Erro: "Invalid credit card"

**Causa:** Cartão de teste incorreto ou formato inválido

**Solução:**
1. Usar apenas cartões de teste listados neste guia
2. Verificar formato: sem espaços, apenas números
3. Validar CVV e validade estão corretos
4. Confirmar que `expiryMonth` é 2 dígitos (01-12)
5. Confirmar que `expiryYear` é 4 dígitos (2024+)

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **API Reference:** https://docs.asaas.com/reference
- **Guias:** https://docs.asaas.com/docs
- **Webhooks:** https://docs.asaas.com/docs/webhooks

### Scripts de Teste

```bash
# Teste completo de integração
node scripts/test-asaas-integration.mjs

# Smoke test (criar em breve)
node scripts/test-asaas-smoke.mjs

# Teste específico de PIX (criar em breve)
node scripts/asaas-test-pix.mjs

# Teste específico de cartão (criar em breve)
node scripts/asaas-test-card.mjs

# Teste de pré-autorização (criar em breve)
node scripts/asaas-test-preauth.mjs
```

### Painel de Logs

No painel Asaas Sandbox, acesse:
- **Cobranças** - Lista todos os pagamentos criados
- **Clientes** - Clientes cadastrados
- **Webhooks** - Histórico de webhooks enviados
- **Logs da API** - Requisições recentes

---

## ✅ Checklist de Testes

Use este checklist para validar a integração:

- [ ] Variáveis de ambiente configuradas
- [ ] Conexão com API estabelecida
- [ ] Cliente criado com sucesso
- [ ] Pagamento PIX gerado com QR Code
- [ ] Pagamento com cartão aprovado
- [ ] Pré-autorização criada
- [ ] Captura parcial executada
- [ ] Captura total executada
- [ ] Cancelamento de pré-autorização
- [ ] Webhooks configurados
- [ ] Webhook recebido e processado
- [ ] Cancelamento de pagamento
- [ ] Estorno total executado
- [ ] Estorno parcial executado
- [ ] Fluxo end-to-end de reserva validado

---

## 📝 Notas Importantes

1. **Não usar em produção:** Dados de sandbox devem ser removidos antes do go-live
2. **Limpar dados regularmente:** O sandbox pode resetar dados periodicamente
3. **Testar exaustivamente:** Sandbox é o momento de testar edge cases
4. **Documentar problemas:** Anotar qualquer comportamento inesperado
5. **Validar com time Asaas:** Dúvidas técnicas podem ser enviadas ao suporte

---

**Última atualização:** 2025-10-27
**Versão da API:** v3
**Ambiente:** Sandbox
