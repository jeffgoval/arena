# Documento de Design

## Overview

Este documento descreve o design da solução para corrigir o erro "Erro ao criar cliente no sistema de pagamento" que ocorre durante a compra de créditos. A solução envolve melhorias no tratamento de erros, validação de dados, logging e implementação de retry logic para tornar o processo de criação de clientes mais robusto.

## Análise do Problema Atual

### Fluxo Atual
1. Usuário clica em "Comprar Créditos"
2. Hook `useComprarCreditos` faz POST para `/api/creditos/comprar`
3. API route busca dados do usuário no Supabase
4. API route chama `pagamentoService.criarOuAtualizarCliente()`
5. Serviço chama `asaasAPI.createCustomer()` ou `asaasAPI.updateCustomer()`
6. **ERRO OCORRE AQUI** - Asaas retorna erro mas não sabemos exatamente qual

### Problemas Identificados
1. **Falta de validação prévia**: Não validamos dados antes de enviar para Asaas
2. **Logs insuficientes**: Não temos detalhes do erro retornado pela Asaas
3. **Tratamento de erro genérico**: Mensagem "Erro ao criar cliente" não ajuda o usuário
4. **Sem retry**: Falhas temporárias causam erro permanente
5. **Campos vazios**: Enviamos strings vazias que a Asaas pode rejeitar

## Architecture

### Componentes Afetados

```
┌─────────────────────┐
│  useComprarCreditos │  (Hook React)
│     (Frontend)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  /api/creditos/     │  (API Route)
│     comprar         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  pagamentoService   │  (Service Layer)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    asaasAPI         │  (API Client)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Asaas External    │
│       API           │
└─────────────────────┘
```

### Camadas de Validação

```
┌──────────────────────────────────────┐
│  1. Validação no Frontend            │
│     - Campos obrigatórios            │
│     - Formato de CPF                 │
└──────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│  2. Validação na API Route           │
│     - Usuário autenticado            │
│     - Dados completos                │
└──────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│  3. Validação no Service             │
│     - Sanitização de dados           │
│     - Remoção de campos vazios       │
└──────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│  4. Validação na Asaas API           │
│     - Regras de negócio Asaas        │
└──────────────────────────────────────┘
```

## Components and Interfaces

### 1. Validador de Dados do Cliente

Novo módulo para validar dados antes de enviar para Asaas:

```typescript
// src/lib/validators/clienteValidator.ts

interface ValidacaoResultado {
  valido: boolean;
  erros: string[];
  avisos: string[];
}

class ClienteValidator {
  validarDadosCliente(cliente: Cliente): ValidacaoResultado
  validarCPF(cpf: string): boolean
  validarEmail(email: string): boolean
  validarTelefone(telefone: string): boolean
  sanitizarDados(cliente: Cliente): Cliente
}
```

### 2. Melhorias no AsaasAPI

Adicionar retry logic e melhor tratamento de erros:

```typescript
// src/lib/asaas.ts

interface AsaasErrorResponse {
  errors: Array<{
    code: string;
    description: string;
  }>;
}

class AsaasAPI {
  // Novo método com retry
  private async requestWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 2
  ): Promise<T>
  
  // Melhorar tratamento de erro
  private handleError(error: any, defaultMessage: string): Error
  
  // Adicionar logs detalhados
  private logRequest(method: string, url: string, data?: any): void
  private logResponse(status: number, data: any): void
  private logError(error: any): void
}
```

### 3. Melhorias no PagamentoService

Adicionar validação e sanitização:

```typescript
// src/services/pagamentoService.ts

class PagamentoService {
  async criarOuAtualizarCliente(cliente: Cliente): Promise<string> {
    // 1. Validar dados
    const validacao = clienteValidator.validarDadosCliente(cliente);
    if (!validacao.valido) {
      throw new ValidationError(validacao.erros);
    }
    
    // 2. Sanitizar dados
    const clienteSanitizado = clienteValidator.sanitizarDados(cliente);
    
    // 3. Tentar criar/atualizar com retry
    // 4. Retornar ID do cliente
  }
}
```

### 4. Melhorias na API Route

Adicionar validações e logs mais detalhados:

```typescript
// src/app/api/creditos/comprar/route.ts

export async function POST(request: NextRequest) {
  try {
    // 1. Validar campos obrigatórios
    // 2. Buscar usuário
    // 3. Validar CPF obrigatório
    // 4. Criar cliente com tratamento de erro detalhado
    // 5. Processar pagamento
  } catch (error) {
    // Log detalhado do erro
    // Retornar mensagem apropriada ao usuário
  }
}
```

## Data Models

### Estrutura de Erro Padronizada

```typescript
interface ErroAPI {
  error: string;           // Mensagem para o usuário
  detalhes?: string;       // Detalhes técnicos
  codigo?: string;         // Código do erro
  campo?: string;          // Campo que causou o erro
  sugestao?: string;       // Sugestão de correção
}
```

### Logs Estruturados

```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  component: string;
  action: string;
  userId?: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}
```

## Error Handling

### Categorias de Erro

1. **Erros de Validação (400)**
   - CPF inválido ou ausente
   - Email inválido
   - Campos obrigatórios faltando
   - Resposta: Mensagem específica sobre o campo

2. **Erros de Autenticação (401)**
   - Usuário não autenticado
   - API key inválida
   - Resposta: Redirecionar para login

3. **Erros de Negócio (422)**
   - Cliente já existe com dados conflitantes
   - Pacote inválido
   - Resposta: Mensagem explicativa

4. **Erros de Rede (500/503)**
   - Timeout
   - Conexão recusada
   - Resposta: "Tente novamente em alguns instantes"

5. **Erros da Asaas (500)**
   - Erro interno da Asaas
   - Resposta: Mensagem genérica + log detalhado

### Estratégia de Retry

```typescript
const retryConfig = {
  maxRetries: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  backoffMultiplier: 2,
  initialDelay: 1000, // 1 segundo
  maxDelay: 5000      // 5 segundos
};
```

### Fluxo de Tratamento de Erro

```
┌─────────────────┐
│  Erro Ocorre    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  É erro de      │───Sim──▶ Retornar erro
│  validação?     │          ao usuário
└────────┬────────┘
         │ Não
         ▼
┌─────────────────┐
│  É erro de      │───Sim──▶ Fazer retry
│  rede/timeout?  │          (até 2x)
└────────┬────────┘
         │ Não
         ▼
┌─────────────────┐
│  Log detalhado  │
│  no servidor    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Retornar erro  │
│  genérico ao    │
│  usuário        │
└─────────────────┘
```

## Testing Strategy

### Testes Unitários

1. **ClienteValidator**
   - Validação de CPF válido/inválido
   - Validação de email
   - Sanitização de dados
   - Remoção de campos vazios

2. **AsaasAPI**
   - Retry logic funciona corretamente
   - Erros são tratados apropriadamente
   - Logs são gerados

3. **PagamentoService**
   - Validação antes de chamar API
   - Tratamento de diferentes tipos de erro

### Testes de Integração

1. **Fluxo completo de criação de cliente**
   - Com dados válidos
   - Com CPF inválido
   - Com campos faltando
   - Com erro da Asaas

2. **Retry logic**
   - Timeout é retentado
   - Erro 500 é retentado
   - Erro 400 não é retentado

### Testes Manuais

1. Comprar créditos com usuário que tem todos os dados
2. Comprar créditos com usuário sem CPF
3. Comprar créditos com usuário sem endereço completo
4. Simular erro da Asaas (desconectar rede)

## Implementation Plan

### Fase 1: Diagnóstico e Logging
- Adicionar logs detalhados em todos os pontos
- Capturar e exibir erros específicos da Asaas
- Testar para identificar causa raiz

### Fase 2: Validação
- Criar ClienteValidator
- Adicionar validações na API route
- Sanitizar dados antes de enviar

### Fase 3: Retry Logic
- Implementar retry no AsaasAPI
- Configurar backoff exponencial
- Testar com diferentes cenários

### Fase 4: Melhorias de UX
- Mensagens de erro mais claras
- Sugestões de correção
- Loading states apropriados

### Fase 5: Monitoramento
- Logs estruturados
- Métricas de erro
- Alertas para erros recorrentes

## Decisões de Design

### Por que validar em múltiplas camadas?
- **Frontend**: Feedback imediato ao usuário
- **API Route**: Segurança e validação de negócio
- **Service**: Garantir dados corretos antes de API externa
- **Asaas**: Validação final da API externa

### Por que usar retry apenas para erros de rede?
- Erros de validação (4xx) não vão ser resolvidos com retry
- Erros de rede/timeout (5xx) podem ser temporários
- Evita loops infinitos e custos desnecessários

### Por que sanitizar dados?
- Asaas rejeita strings vazias em campos opcionais
- Melhor enviar `undefined` do que string vazia
- Reduz tamanho do payload

### Por que logs detalhados apenas no servidor?
- Não expor detalhes técnicos ao usuário
- Facilitar debugging sem comprometer segurança
- Logs estruturados permitem análise automatizada
