# Integrações - Arena Dona Santa

Este documento descreve as integrações implementadas no sistema Arena.

## 🏦 Gateway de Pagamento - Asaas

### Configuração

1. **Variáveis de Ambiente**
```env
ASAAS_API_KEY="your-asaas-api-key"
ASAAS_ENVIRONMENT="sandbox" # ou "production"
ASAAS_WEBHOOK_SECRET="your-webhook-secret"
```

2. **Configuração do Webhook**
- URL: `https://seu-dominio.com/api/webhooks/asaas`
- Eventos: Todos os eventos de pagamento
- Método: POST
- Autenticação: HMAC-SHA256

### Funcionalidades Implementadas

#### ✅ Pagamentos
- **PIX**: QR Code e Copia e Cola
- **Cartão de Crédito**: À vista e parcelado
- **Boleto**: Com vencimento configurável

#### ✅ Pré-autorização (Caução)
- Bloqueio de valor no cartão
- Captura parcial ou total
- Cancelamento automático

#### ✅ Webhooks
- Confirmação automática de pagamentos
- Atualização de status em tempo real
- Processamento de estornos

### Uso Básico

```typescript
import { usePagamentos } from '@/hooks/usePagamentos';

function PagamentoComponent() {
  const { criarPagamento, loading, error } = usePagamentos();

  const handlePagamentoPix = async () => {
    const resultado = await criarPagamento({
      clienteId: 'cliente-id',
      tipoPagamento: 'PIX',
      valor: 100.00,
      dataVencimento: '2024-12-31',
      descricao: 'Reserva Quadra A'
    });

    if (resultado) {
      // Mostrar QR Code PIX
      console.log('QR Code:', resultado.qrCodePix);
    }
  };

  return (
    <button onClick={handlePagamentoPix} disabled={loading}>
      {loading ? 'Processando...' : 'Pagar com PIX'}
    </button>
  );
}
```

### Fluxo de Pagamento

1. **Criação do Cliente** (se não existir)
2. **Criação da Cobrança** no Asaas
3. **Retorno dos Dados** (QR Code, boleto, etc.)
4. **Webhook de Confirmação** quando pago
5. **Atualização do Status** no sistema

### Caução (Pré-autorização)

```typescript
import { useCaucao } from '@/hooks/usePagamentos';

function CaucaoComponent() {
  const { criarCaucao, capturarCaucao, cancelarCaucao } = useCaucao();

  const handleCriarCaucao = async () => {
    const resultado = await criarCaucao(
      'cliente-id',
      200.00, // Valor da caução
      'Caução para reserva',
      dadosCartao,
      dadosPortadorCartao
    );

    // Salvar ID da pré-autorização
    const preAuthId = resultado.id;
  };

  const handleCapturar = async (preAuthId: string) => {
    // Capturar valor total ou parcial
    await capturarCaucao(preAuthId, 50.00); // Captura R$ 50
  };

  const handleCancelar = async (preAuthId: string) => {
    // Cancelar pré-autorização
    await cancelarCaucao(preAuthId);
  };
}
```

## 📱 WhatsApp Business API

### Configuração

1. **Variáveis de Ambiente**
```env
WHATSAPP_ACCESS_TOKEN="your-whatsapp-access-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_VERIFY_TOKEN="your-verify-token"
```

2. **Configuração do Webhook**
- URL: `https://seu-dominio.com/api/whatsapp/webhook`
- Verificação: GET com verify_token
- Mensagens: POST com dados das mensagens

### Funcionalidades Implementadas

#### ✅ Notificações Automáticas
- Confirmação de reserva
- Pagamento recebido
- Lembretes de jogos
- Cancelamentos
- Promoções

#### ✅ Chatbot Inteligente
- Menu interativo
- Respostas automáticas
- Botões e listas
- Encaminhamento para atendimento humano

#### ✅ Envio em Massa
- Campanhas de marketing
- Notificações importantes
- Rate limiting automático

### Uso Básico

```typescript
import { useWhatsApp } from '@/hooks/useWhatsApp';

function NotificacaoComponent() {
  const { notificarReservaConfirmada, loading } = useWhatsApp();

  const handleNotificar = async () => {
    await notificarReservaConfirmada('5511999999999', {
      id: 'reserva-123',
      quadra: 'Quadra A',
      data: '25/10/2024',
      horario: '20:00',
      valor: 100.00
    });
  };

  return (
    <button onClick={handleNotificar} disabled={loading}>
      Notificar Cliente
    </button>
  );
}
```

### Tipos de Mensagem

#### 1. Notificação de Reserva
```typescript
await notificarReservaConfirmada(telefone, {
  id: 'reserva-123',
  quadra: 'Quadra A',
  data: '25/10/2024',
  horario: '20:00',
  valor: 100.00
});
```

#### 2. QR Code PIX
```typescript
await enviarQRCodePix(telefone, {
  valor: 100.00,
  qrCode: 'data:image/png;base64,...',
  pixCopiaECola: '00020126...',
  vencimento: '24 horas'
});
```

#### 3. Lembrete de Jogo
```typescript
await enviarLembreteJogo(telefone, {
  quadra: 'Quadra A',
  data: 'Hoje',
  horario: '20:00',
  participantes: ['João', 'Maria', 'Pedro']
});
```

### Chatbot - Fluxo de Conversação

```
Usuário: "Oi"
Bot: Menu com opções (Nova Reserva, Minhas Reservas, Suporte)

Usuário: Clica "Nova Reserva"
Bot: Link para o site + telefone de contato

Usuário: Clica "Suporte"
Bot: Submenu (Horários, Endereço, Atendente)

Usuário: "reserva"
Bot: Opções de reserva (Nova, Ver, Cancelar)
```

### Envio em Massa

```typescript
import { useMarketingWhatsApp } from '@/hooks/useWhatsApp';

function CampanhaComponent() {
  const { enviarCampanha } = useMarketingWhatsApp();

  const handleCampanha = async () => {
    const telefones = ['5511999999999', '5511888888888'];
    
    await enviarCampanha(telefones, {
      titulo: 'Promoção Especial',
      descricao: 'Desconto em todas as quadras!',
      desconto: 20,
      validadeAte: '31/12/2024',
      codigoCupom: 'ARENA20'
    });
  };
}
```

## 🔄 Integração entre Pagamentos e WhatsApp

### Fluxo Automático

1. **Pagamento Criado** → Enviar QR Code PIX via WhatsApp
2. **Pagamento Confirmado** → Notificar confirmação + Confirmar reserva
3. **Pagamento Vencido** → Notificar vencimento + Cancelar reserva
4. **1 hora antes do jogo** → Enviar lembrete automático

### Implementação

```typescript
// No webhook do Asaas
async function processarPagamentoConfirmado(payment: any) {
  // 1. Atualizar status no banco
  await updatePaymentStatus(payment.id, 'CONFIRMED');
  
  // 2. Confirmar reserva
  const reserva = await confirmReservation(payment.externalReference);
  
  // 3. Notificar via WhatsApp
  await whatsappService.notificarReservaConfirmada(
    reserva.cliente.telefone,
    {
      id: reserva.id,
      quadra: reserva.quadra.nome,
      data: formatDate(reserva.data),
      horario: reserva.horario,
      valor: payment.value
    }
  );
  
  // 4. Agendar lembrete
  await scheduleReminder(reserva);
}
```

## 📊 Monitoramento e Logs

### Logs de Pagamento
- Todas as transações são logadas
- Webhooks são validados e registrados
- Erros são capturados e notificados

### Logs de WhatsApp
- Mensagens enviadas e recebidas
- Status de entrega
- Erros de API

### Métricas
- Taxa de conversão de pagamentos
- Taxa de entrega de mensagens
- Tempo de resposta das APIs

## 🔒 Segurança

### Asaas
- Validação de assinatura HMAC-SHA256
- Ambiente sandbox para testes
- Chaves de API seguras

### WhatsApp
- Token de verificação
- Rate limiting
- Validação de origem

### Dados Sensíveis
- Dados de cartão nunca armazenados
- Tokens em variáveis de ambiente
- Logs sem informações sensíveis

## 🚀 Deploy e Configuração

### 1. Configurar Webhooks

**Asaas:**
```bash
curl -X POST https://www.asaas.com/api/v3/webhooks \
  -H "access_token: $ASAAS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arena Webhooks",
    "url": "https://seu-dominio.com/api/webhooks/asaas",
    "events": ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"],
    "enabled": true
  }'
```

**WhatsApp:**
```bash
curl -X POST "https://graph.facebook.com/v18.0/$PHONE_NUMBER_ID/webhooks" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -d "callback_url=https://seu-dominio.com/api/whatsapp/webhook" \
  -d "verify_token=$WHATSAPP_VERIFY_TOKEN"
```

### 2. Testar Integrações

```bash
# Testar webhook Asaas
curl -X POST http://localhost:3000/api/webhooks/asaas \
  -H "Content-Type: application/json" \
  -d '{"event": "PAYMENT_CONFIRMED", "payment": {...}}'

# Testar WhatsApp
curl -X POST http://localhost:3000/api/whatsapp/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "5511999999999",
    "tipo": "texto",
    "dados": {"mensagem": "Teste de integração"}
  }'
```

## 📞 Suporte

### Asaas
- Documentação: https://docs.asaas.com
- Suporte: suporte@asaas.com
- Sandbox: https://sandbox.asaas.com

### WhatsApp Business API
- Documentação: https://developers.facebook.com/docs/whatsapp
- Suporte: Meta Business Support
- Teste: WhatsApp Business API Test

### Problemas Comuns

1. **Webhook não recebido**: Verificar URL e certificado SSL
2. **Pagamento não confirmado**: Verificar logs do Asaas
3. **WhatsApp não envia**: Verificar tokens e rate limits
4. **Erro de validação**: Verificar assinatura do webhook