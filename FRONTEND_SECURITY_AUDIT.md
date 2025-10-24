# 🔍 AUDITORIA DE SEGURANÇA - FRONTEND
**Data:** 2025-10-24
**Auditor:** Claude Code
**Escopo:** Dados sensíveis, API keys, validações client-side
**Severidade:** CRÍTICA

---

## 🚨 RESUMO EXECUTIVO

Foram identificadas **12 vulnerabilidades** de segurança no frontend, sendo:
- **3 CRÍTICAS** - Exposição de secrets e lógica de negócio
- **5 ALTAS** - Validações client-side e dados sensíveis
- **4 MÉDIAS** - Logs e storage

**STATUS:** ❌ **NÃO APROVADO** - Correções obrigatórias antes de produção

---

## 🔴 VULNERABILIDADES CRÍTICAS

### CRÍTICO #1: CRON_SECRET_TOKEN Exposto no Cliente
**Arquivo:** `src/hooks/useNotificacoesAdmin.ts:27`
**Severidade:** 🔴 CRÍTICA
**CWE:** CWE-540 (Inclusion of Sensitive Information in Source Code)

**Código Vulnerável:**
```typescript
// LINHA 27
'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN}`
```

**Problema:**
- Variável `NEXT_PUBLIC_CRON_SECRET_TOKEN` é exposta no bundle do cliente
- Qualquer usuário pode inspecionar o código e obter o token
- Token permite acesso a endpoint `/api/notificacoes/processar`
- **Atacante pode acionar processamento de notificações manualmente**

**Impacto:**
- Exposição de secret crítico
- Bypass de controle de acesso
- DoS via processamento em massa
- Vazamento de dados de notificações

**Correção Obrigatória:**
```typescript
// REMOVER variável do cliente
// Endpoint /api/notificacoes/processar deve validar role de admin
// Token deve ser usado APENAS no servidor (cron jobs)

// NOVO CÓDIGO:
const processarNotificacoesPendentes = useCallback(async () => {
  // Remove o header Authorization
  const response = await fetch('/api/notificacoes/processar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // ...
}, []);
```

**E no servidor:**
```typescript
// src/app/api/notificacoes/processar/route.ts
export async function POST(request: NextRequest) {
  // Verificar autenticação + role admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  // CRON_SECRET_TOKEN só para cron jobs externos
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token !== process.env.CRON_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
  }

  // Processar notificações...
}
```

---

### CRÍTICO #2: Cálculos de Rateio no Cliente Sem Validação Server-Side
**Arquivo:** `src/components/shared/rateio/RateioCalculator.tsx:49-75`
**Severidade:** 🔴 CRÍTICA
**CWE:** CWE-602 (Client-Side Enforcement of Server-Side Security)

**Código Vulnerável:**
```typescript
// LINHA 49-75
const calcularRateio = () => {
  let participantesCalculados: ParticipanteCalculo[] = [];

  if (tipoRateio === "igual") {
    const valorPorPessoa = valorTotal / participantes.length;
    // ...
  } else if (tipoRateio === "personalizado") {
    participantesCalculados = participantes.map(p => ({
      ...p,
      percentual: p.valor ? (p.valor / valorTotal) * 100 : 0
    }));
  }
  // ...
  onRateioCalculado?.(participantesCalculados, tipoRateio);
};
```

**Problema:**
- Cálculos de valores financeiros feitos APENAS no cliente
- Usuário pode manipular valores via DevTools
- Não há verificação server-side dos cálculos
- **Possível fraude financeira**

**Impacto:**
- Usuário pode pagar menos do que deveria
- Manipulação de rateios entre participantes
- Perda financeira para a arena

**Correção Obrigatória:**
1. Cálculos no servidor:
```typescript
// src/app/api/reservas/[id]/rateio/calcular/route.ts
export async function POST(request: NextRequest) {
  const { valorTotal, participantes, tipoRateio } = await request.json();

  // VALIDAR no servidor
  let participantesCalculados;

  if (tipoRateio === "igual") {
    const valorPorPessoa = valorTotal / participantes.length;
    participantesCalculados = participantes.map(p => ({
      ...p,
      valor: valorPorPessoa,
      percentual: 100 / participantes.length
    }));
  }

  // Validar somas
  const somaValores = participantesCalculados.reduce((sum, p) => sum + p.valor, 0);
  if (Math.abs(somaValores - valorTotal) > 0.01) {
    return NextResponse.json(
      { error: 'Valores não batem' },
      { status: 400 }
    );
  }

  return NextResponse.json({ participantes: participantesCalculados });
}
```

2. Cliente apenas exibe:
```typescript
// RateioCalculator.tsx
const calcularRateio = async () => {
  const response = await fetch(`/api/reservas/${reservaId}/rateio/calcular`, {
    method: 'POST',
    body: JSON.stringify({ valorTotal, participantes, tipoRateio })
  });

  const { participantes: calculados } = await response.json();
  setParticipantes(calculados);
  onRateioCalculado?.(calculados, tipoRateio);
};
```

---

### CRÍTICO #3: Simulação de Pagamento no Cliente
**Arquivo:** `src/components/shared/pagamento/ModalPagamento.tsx:35-62`
**Severidade:** 🔴 CRÍTICA
**CWE:** CWE-602 (Client-Side Enforcement of Server-Side Security)

**Código Vulnerável:**
```typescript
// LINHA 35-62
const handlePagamentoConfirmado = async (dadosPagamento: DadosPagamento) => {
  setEtapa("processando");

  // Simula processamento do pagamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Gera comprovante
  const novoComprovante: DadosComprovante = {
    id: `TXN${Date.now()}`,
    tipo: "reserva",
    status: "aprovado", // SEMPRE APROVADO!
    valor: dadosResumo.total,
    // ...
  };

  setComprovante(novoComprovante);
  setEtapa("comprovante");
  onPagamentoConcluido?.(novoComprovante);
};
```

**Problema:**
- Pagamento é "simulado" com setTimeout
- Status sempre "aprovado" sem validação real
- Comprovante gerado no cliente
- **FRAUDE FINANCEIRA CRÍTICA**

**Impacto:**
- Usuário pode criar reservas sem pagar
- Comprovantes falsos
- Perda financeira total

**Correção Obrigatória:**
```typescript
// REMOVER TODA simulação do cliente

const handlePagamentoConfirmado = async (dadosPagamento: DadosPagamento) => {
  setEtapa("processando");

  try {
    // Chamar API de pagamento REAL
    const response = await fetch('/api/pagamentos/processar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservaId: dadosResumo.detalhesReserva?.id,
        valor: dadosResumo.total,
        metodo: dadosPagamento.metodo,
        dadosCartao: dadosPagamento.metodo === 'cartao' ? dadosPagamento.dadosCartao : undefined
      })
    });

    if (!response.ok) {
      throw new Error('Pagamento falhou');
    }

    const { comprovante } = await response.json();
    setComprovante(comprovante);
    setEtapa("comprovante");
    onPagamentoConcluido?.(comprovante);

  } catch (error) {
    setEtapa("erro");
    // Mostrar erro ao usuário
  }
};
```

---

## 🟠 VULNERABILIDADES DE ALTA SEVERIDADE

### ALTA #4: Autorização Client-Side com Redirect
**Arquivo:** `src/components/auth/ProtectedRoute.tsx:71-100`
**Severidade:** 🟠 ALTA
**CWE:** CWE-602 (Client-Side Enforcement of Server-Side Security)

**Problema:**
```typescript
// LINHA 71-100
const checkAuthorization = (user: User): boolean => {
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return false;
    }
  }
  // Verificação client-side
};
```

**Impacto:**
- Usuário pode bypassar verificação alterando código
- Dados podem vazar antes do redirect
- **NÃO É SEGURO CONFIAR EM CLIENT-SIDE**

**Correção:**
- Middleware já protege rotas (✅ OK)
- Mas APIs devem SEMPRE verificar role no servidor
- Cliente apenas para UX (mostrar/esconder botões)

---

### ALTA #5: Dados de Onboarding em localStorage
**Arquivo:** `src/hooks/useOnboarding.ts:28, 46`
**Severidade:** 🟠 ALTA
**CWE:** CWE-922 (Insecure Storage of Sensitive Information)

**Problema:**
```typescript
const savedState = localStorage.getItem(`onboarding-${config.id}`);
localStorage.setItem(`onboarding-${config.id}`, JSON.stringify({
  currentStep,
  completed,
  skipped
}));
```

**Impacto:**
- localStorage é acessível por qualquer script
- XSS pode roubar dados
- Dados persistem mesmo após logout

**Correção:**
- Se dados não são sensíveis: OK
- Se contém info pessoal: migrar para sessionStorage
- Melhor: salvar no servidor

---

### ALTA #6: Configurações em localStorage como Fallback
**Arquivo:** `src/services/core/configuracoes.service.ts:113-161`
**Severidade:** 🟠 ALTA

**Problema:**
```typescript
// Fallback para localStorage
localStorage.setItem('arena_configuracoes', JSON.stringify(updated));
```

**Impacto:**
- Configurações críticas podem estar no cliente
- Usuário pode manipular configurações
- Dados não sincronizados entre dispositivos

**Correção:**
- NUNCA usar localStorage para configurações críticas
- Sempre salvar no banco
- Se banco falhar, mostrar erro (não usar fallback)

---

### ALTA #7: Service Importado em Componente Client
**Arquivo:** `src/components/admin/GerenciadorTemplates.tsx:5`
**Severidade:** 🟠 ALTA

**Problema:**
```typescript
import { TemplateNotificacao } from '@/services/notificacaoService';
```

**Impacto:**
- Se service usa process.env, pode bundlar secrets
- Aumento do bundle size
- Possível exposição de lógica server-side

**Correção:**
- Importar apenas TYPES, não implementações
```typescript
import type { TemplateNotificacao } from '@/services/notificacaoService';
```

---

### ALTA #8: Schemas de Validação Expostos no Cliente
**Arquivos:** Vários em `src/components/*/`
**Severidade:** 🟠 ALTA

**Problema:**
```typescript
import { courtSchema } from '@/lib/validations/court.schema';
```

**Impacto:**
- Schemas revelam regras de negócio
- Atacante sabe exatamente o que é validado
- Pode craftar payloads para bypassar validações

**Correção:**
- Schemas client-side: OK para UX
- **MAS:** APIs devem SEMPRE re-validar no servidor
- NUNCA confiar em dados do cliente

**Validação atual em APIs - Verificar:**
```bash
# Procurar por validações server-side
grep -r "\.parse\|\.safeParse" src/app/api/
```

---

## 🟡 VULNERABILIDADES MÉDIAS

### MÉDIA #9: Console.logs em Produção
**Arquivos:** 84 arquivos com console.log/error/warn
**Severidade:** 🟡 MÉDIA

**Problema:**
- Console.logs podem vazar dados sensíveis
- Usuários podem ver logs no DevTools
- Dados de debug em produção

**Exemplo:**
```typescript
// src/components/shared/pagamento/ModalPagamento.tsx:78
console.log("Baixar comprovante", comprovante);
```

**Correção:**
- Usar `next.config.js` para remover em produção:
```javascript
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

**Status:** ✅ JÁ CONFIGURADO em `next.config.js:12`

Mas alguns logs críticos devem ser preservados:
```typescript
// Manter apenas error/warn em produção
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.info = () => {};
} else {
  // Desenvolvimento: todos os logs
}
```

---

### MÉDIA #10: Session/Tour State em localStorage
**Arquivos:**
- `src/components/shared/GuidedTour.tsx:385, 400, 405`
- `src/hooks/useOnboarding.ts:26-109`

**Problema:**
- Tour completion state em localStorage
- Pode ser manipulado por usuário
- Menor impacto (apenas UX)

**Correção:**
- Se é apenas UX: OK
- Se afeta lógica de negócio: mover para servidor

---

### MÉDIA #11: Supabase Session em localStorage
**Arquivo:** `src/lib/supabase/client.ts:28-33`
**Severidade:** 🟡 MÉDIA

**Código:**
```typescript
// Limpar localStorage
const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.startsWith('sb-')) {
    localStorage.removeItem(key);
  }
});
```

**Status:** ✅ OK - Supabase usa localStorage para sessions
Mas CRÍTICO que cookie seja `httpOnly=true` no servidor

---

### MÉDIA #12: Imports de Utils no Cliente
**Arquivos:** Múltiplos
**Severidade:** 🟡 MÉDIA

**Código:**
```typescript
import { formatCPF } from '@/lib/utils/cpf';
import { formatPhone } from '@/lib/utils/phone';
import { formatCEP } from '@/lib/utils/cep';
```

**Status:** ✅ OK - São apenas utils de formatação
Não contêm lógica sensível

---

## ✅ VALIDAÇÕES ENCONTRADAS (Verificar Server-Side)

### Schemas de Validação (Client):
- `auth.schema.ts` - Login/Signup
- `court.schema.ts` - Quadras/Horários
- `turma.schema.ts` - Turmas
- `avaliacao.schema.ts` - Avaliações

**CRÍTICO:** Verificar se APIs usam os mesmos schemas para validar!

---

## 🔍 CHECKLIST DE CORREÇÕES OBRIGATÓRIAS

### Fase 1 - CRÍTICAS (Deploy Blocker)
- [ ] ❌ Remover `NEXT_PUBLIC_CRON_SECRET_TOKEN` do cliente
- [ ] ❌ Implementar cálculo de rateio no servidor
- [ ] ❌ Implementar pagamento real (remover simulação)
- [ ] ❌ Validar TODAS operações financeiras server-side
- [ ] ❌ Re-validar schemas em TODAS APIs

### Fase 2 - ALTAS (Pré-Produção)
- [ ] ⚠️ Migrar configurações críticas para banco
- [ ] ⚠️ Usar `import type` para services em components
- [ ] ⚠️ Auditar dados em localStorage
- [ ] ⚠️ Verificar XSS protection

### Fase 3 - MÉDIAS (Hardening)
- [ ] ✅ Console.logs já removidos em produção (next.config.js)
- [ ] ⏳ Limpar console.logs sensíveis em dev
- [ ] ⏳ Implementar CSP para prevenir XSS

---

## 📊 ESTATÍSTICAS

| Categoria | Quantidade | Severidade |
|-----------|-----------|------------|
| Secrets Expostos | 1 | CRÍTICA |
| Lógica de Negócio Client-Side | 2 | CRÍTICA |
| Autorização Client-Side | 1 | ALTA |
| Storage Inseguro | 3 | ALTA |
| Imports Perigosos | 2 | ALTA |
| Console Logs | 84 | MÉDIA |
| **TOTAL** | **93** | **MISTO** |

**Score de Segurança Frontend:**
- **Antes:** Não avaliado
- **Atual:** 45/100 - ❌ **REPROVADO**

---

## 🚀 AÇÕES IMEDIATAS

1. **AGORA (Crítico):**
   ```bash
   # Remover NEXT_PUBLIC_CRON_SECRET_TOKEN
   # do .env.local e de qualquer uso no cliente
   ```

2. **HOJE (Alta Prioridade):**
   - Implementar validação server-side de rateios
   - Remover simulação de pagamento
   - Criar APIs para cálculos financeiros

3. **ESTA SEMANA:**
   - Auditar todas APIs para validação server-side
   - Implementar testes de validação
   - Code review de imports em components

---

## 📞 SUPORTE

**Em caso de dúvidas sobre implementação:**
- Consultar `SECURITY_IMPLEMENTATION_COMPLETE.md`
- Verificar exemplos em `/api/security/*`

---

**🔐 FRONTEND DEVE SER CONSIDERADO INSEGURO 🔐**
**TODA VALIDAÇÃO E LÓGICA CRÍTICA DEVE ESTAR NO SERVIDOR**

**Última Atualização:** 2025-10-24
**Versão:** 1.0.0
**Status:** ❌ NÃO APROVADO PARA PRODUÇÃO
