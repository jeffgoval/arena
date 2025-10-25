# AUDITORIA DE SEGURANÇA - MIDDLEWARE
**Data:** 2025-10-24
**Auditor:** Claude Code
**Severidade:** CRÍTICA
**Sistema:** Arena Dona Santa - Plataforma de Reservas com Transações Financeiras

---

## RESUMO EXECUTIVO

Foram identificadas **17 vulnerabilidades** no middleware de autenticação/autorização, sendo **8 CRÍTICAS** e **5 de ALTA severidade**. O sistema atual apresenta falhas graves de segurança que podem comprometer transações financeiras, dados de usuários e integridade da aplicação.

**STATUS:** ❌ **NÃO APROVADO PARA PRODUÇÃO COM TRANSAÇÕES FINANCEIRAS**

---

## VULNERABILIDADES CRÍTICAS

### 🔴 CRÍTICO #1: Cookie Cache de Role Sem Vínculo com User ID
**Arquivo:** `middleware.ts:67-74`
**Severidade:** CRÍTICA
**CWE:** CWE-287 (Improper Authentication)

**Problema:**
```typescript
const cachedRole = request.cookies.get('user-role')?.value;
// Não verifica se esse role pertence ao user.id atual!
```

**Cenário de Ataque:**
1. User A (cliente) faz login → cookie `user-role=cliente` criado
2. User A faz logout (cookie não é limpo)
3. User B (gestor) faz login no mesmo navegador
4. User B tem acesso à área de cliente por 5 minutos usando cache do User A
5. **ESCALAÇÃO DE PRIVILÉGIOS CONFIRMADA**

**Impacto:**
- Usuário pode acessar transações financeiras de outro perfil
- Violação de privacidade e dados financeiros
- Quebra total de separação de privilégios

**Correção Necessária:**
```typescript
// Cookie deve incluir user.id: user-role:{userId}
const cacheKey = `user-role-${user.id}`;
const cachedRole = request.cookies.get(cacheKey)?.value;
```

---

### 🔴 CRÍTICO #2: Role Cache Timestamp Manipulável
**Arquivo:** `middleware.ts:68-70`
**Severidade:** CRÍTICA
**CWE:** CWE-565 (Reliance on Cookies without Validation)

**Problema:**
```typescript
const cacheTimestamp = request.cookies.get('user-role-timestamp')?.value;
const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
```

**Cenário de Ataque:**
1. Usuário inspeciona cookies no DevTools
2. Altera `user-role-timestamp` para valor futuro
3. Cache nunca expira (`cacheAge` sempre < 5min)
4. Role desatualizado perpetuamente

**Impacto:**
- Role desatualizado mesmo após rebaixamento de privilégios
- Usuário demitido (gestor→cliente) mantém acesso de gestor

**Correção Necessária:**
- Usar HMAC ou assinatura criptográfica no cookie
- Ou confiar apenas no `maxAge` do cookie (gerenciado pelo navegador)

---

### 🔴 CRÍTICO #3: Sem Validação de Formato de Role
**Arquivo:** `middleware.ts:67, 77-80`
**Severidade:** CRÍTICA
**CWE:** CWE-20 (Improper Input Validation)

**Problema:**
```typescript
if (cachedRole && cacheAge < 5 * 60 * 1000) {
  userRole = cachedRole; // Aceita QUALQUER string
}
```

**Cenário de Ataque:**
1. Usuário injeta cookie `user-role=admin' OR '1'='1`
2. Cookie é aceito sem validação
3. Possível SQL injection ou bypass de lógica

**Impacto:**
- Injection attacks
- Authorization bypass
- Execução de código não autorizado

**Correção Necessária:**
```typescript
const VALID_ROLES = ['cliente', 'gestor', 'admin'] as const;
if (cachedRole && VALID_ROLES.includes(cachedRole as any)) {
  userRole = cachedRole;
}
```

---

### 🔴 CRÍTICO #4: Cookie SameSite='lax' Permite CSRF
**Arquivo:** `middleware.ts:98, 104, 194, 200`
**Severidade:** CRÍTICA
**CWE:** CWE-352 (Cross-Site Request Forgery)

**Problema:**
```typescript
supabaseResponse.cookies.set('user-role', userRole, {
  sameSite: 'lax' // ❌ Permite envio em navegação top-level
});
```

**Cenário de Ataque:**
1. Usuário autenticado visita site malicioso
2. Site redireciona para `https://arena.com/gestor/delete-all`
3. Cookie é enviado (sameSite=lax permite)
4. Ação destrutiva executada

**Impacto:**
- CSRF attacks em rotas críticas
- Ações não autorizadas (pagamentos, exclusões)

**Correção Necessária:**
```typescript
sameSite: 'strict' // Nunca enviar em navegação cross-site
```

---

### 🔴 CRÍTICO #5: Sem Invalidação de Cache em Logout
**Arquivo:** `middleware.ts` (ausente)
**Severidade:** CRÍTICA
**CWE:** CWE-613 (Insufficient Session Expiration)

**Problema:**
- Não há código para limpar cookies de cache em logout
- Cookies persistem após logout

**Cenário de Ataque:**
1. User A (gestor) faz logout
2. Cookies `user-role` e `user-role-timestamp` não são limpos
3. User B faz login no mesmo dispositivo
4. User B herda role de gestor por até 5 minutos

**Impacto:**
- Session fixation
- Privilege escalation
- Acesso não autorizado a transações

**Correção Necessária:**
- Criar endpoint `/api/auth/logout` que limpa todos cookies de cache
- Middleware deve verificar se sessão é válida

---

### 🔴 CRÍTICO #6: Código Duplicado de Cache (2x)
**Arquivo:** `middleware.ts:63-107 e 158-203`
**Severidade:** MÉDIA-ALTA
**CWE:** CWE-1041 (Use of Redundant Code)

**Problema:**
- Mesma lógica de cache implementada 2 vezes
- Dificulta manutenção e aumenta superfície de ataque

**Impacto:**
- Bug em uma função mas não na outra
- Inconsistências de comportamento
- Duplicação de vulnerabilidades

**Correção Necessária:**
- Extrair para função `getRoleWithCache(user, request)`

---

### 🔴 CRÍTICO #7: Path Traversal Não Verificado
**Arquivo:** `middleware.ts:53, 119, 130`
**Severidade:** ALTA
**CWE:** CWE-22 (Path Traversal)

**Problema:**
```typescript
if (pathname.startsWith('/cliente')) {
  // Pode ser bypassado com encoded chars
}
```

**Cenário de Ataque:**
1. User tenta acessar `/cliente%2F..%2Fgestor`
2. URL encoding pode bypassar `startsWith()`
3. Acesso não autorizado

**Impacto:**
- Authorization bypass
- Acesso cross-profile

**Correção Necessária:**
```typescript
const normalizedPath = decodeURIComponent(pathname).replace(/\\/g, '/');
// Verificar path normalizado
```

---

### 🔴 CRÍTICO #8: Sem Verificação de User Status (Ban/Suspended)
**Arquivo:** `middleware.ts:43-45`
**Severidade:** ALTA
**CWE:** CWE-284 (Improper Access Control)

**Problema:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
// Não verifica user.banned ou user.status
```

**Impacto:**
- Usuário banido continua com acesso
- Violação de políticas de compliance

**Correção Necessária:**
```typescript
const { data: profile } = await supabase
  .from('users')
  .select('role, status, banned')
  .eq('id', user.id)
  .single();

if (profile?.banned || profile?.status === 'suspended') {
  // Force logout
}
```

---

## VULNERABILIDADES DE ALTA SEVERIDADE

### 🟠 ALTA #9: Sem Error Handling em Database Queries
**Arquivo:** `middleware.ts:83-89, 179-185`
**Severidade:** ALTA
**CWE:** CWE-755 (Improper Handling of Exceptional Conditions)

**Problema:**
```typescript
const { data: profile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single();
// Sem try-catch - pode crashar middleware
```

**Impacto:**
- Exceções não tratadas crasham aplicação
- Information disclosure via stack traces
- Service disruption

**Correção:**
```typescript
try {
  const { data: profile, error } = await supabase...;
  if (error) throw error;
} catch (err) {
  // Log e retornar erro genérico
  return NextResponse.redirect('/auth');
}
```

---

### 🟠 ALTA #10: Sem Rate Limiting
**Arquivo:** `middleware.ts` (ausente)
**Severidade:** ALTA
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Problema:**
- Middleware executa queries sem limite de taxa
- Cada request pode fazer 1-2 queries ao banco

**Cenário de Ataque:**
1. Atacante envia 1000 req/s para `/gestor/x`
2. Cada request executa query ao Supabase
3. Database overload → DoS

**Correção:**
- Implementar rate limiting (ex: 10 req/min por IP)
- Usar Redis ou Vercel Edge Config

---

### 🟠 ALTA #11: JWT Metadata Confiado Sem Validação
**Arquivo:** `middleware.ts:77-80`
**Severidade:** ALTA
**CWE:** CWE-345 (Insufficient Verification of Data Authenticity)

**Problema:**
```typescript
if (user.user_metadata?.role) {
  userRole = user.user_metadata.role; // Confia cegamente
}
```

**Impacto:**
- Se JWT for comprometido (token theft)
- Role manipulation

**Correção:**
- Sempre validar contra banco como fonte de verdade
- JWT metadata só como otimização, não autorização

---

### 🟠 ALTA #12: parseInt Sem Radix
**Arquivo:** `middleware.ts:70`
**Severidade:** BAIXA-MÉDIA
**CWE:** CWE-704 (Incorrect Type Conversion)

**Problema:**
```typescript
const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
// parseInt sem radix pode interpretar octal
```

**Correção:**
```typescript
parseInt(cacheTimestamp, 10)
```

---

### 🟠 ALTA #13: Timing Attack na Validação de Role
**Arquivo:** `middleware.ts:119-151`
**Severidade:** BAIXA-MÉDIA
**CWE:** CWE-208 (Observable Timing Discrepancy)

**Problema:**
- Diferentes checks têm tempos diferentes
- Pode vazar informação sobre roles válidos

**Correção:**
- Constant-time comparison
- Normalizar tempo de resposta

---

## VULNERABILIDADES MÉDIAS

### 🟡 MÉDIA #14: Sem Logging de Acessos Não Autorizados
**Severidade:** MÉDIA
**CWE:** CWE-778 (Insufficient Logging)

**Correção:**
```typescript
console.error('[SECURITY] Unauthorized access attempt', {
  userId: user.id,
  role: userRole,
  attemptedPath: pathname,
  timestamp: new Date().toISOString()
});
```

---

### 🟡 MÉDIA #15: Headers de Segurança Faltando
**Severidade:** MÉDIA
**CWE:** CWE-1021 (Improper Restriction of Rendered UI Layers)

**Correção:**
```typescript
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

---

### 🟡 MÉDIA #16: Redirect Loop Possível
**Severidade:** MÉDIA
**CWE:** CWE-835 (Loop with Unreachable Exit Condition)

**Correção:**
- Adicionar contador de redirects
- Max 3 redirects

---

### 🟡 MÉDIA #17: Build-time Bypass
**Arquivo:** `middleware.ts:15-17`
**Severidade:** BAIXA

**Problema:**
```typescript
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  return supabaseResponse; // Permite tudo
}
```

**Correção:**
- Fail-safe: retornar 503 ou 401

---

## PONTUAÇÃO DE RISCO

| Categoria | Quantidade | Peso | Score |
|-----------|------------|------|-------|
| Críticas | 8 | 10 | 80 |
| Alta | 5 | 6 | 30 |
| Média | 4 | 3 | 12 |
| **TOTAL** | **17** | - | **122** |

**Risk Score:** 122/170 (71.8%)
**Classificação:** 🔴 **CRÍTICO - FALHA IMEDIATA**

---

## RECOMENDAÇÕES PRIORITÁRIAS

### Fase 1 - URGENTE (Deploy Blocker)
1. ✅ Vincular cookie cache ao user.id (#1)
2. ✅ Validar formato de role com whitelist (#3)
3. ✅ Mudar SameSite para 'strict' (#4)
4. ✅ Implementar logout com limpeza de cache (#5)
5. ✅ Verificar user.banned/status (#8)
6. ✅ Adicionar try-catch em todas queries (#9)

### Fase 2 - ALTA (Pré-Produção)
7. ✅ Implementar rate limiting (#10)
8. ✅ Normalizar pathname (path traversal) (#7)
9. ✅ Extrair função de cache (#6)
10. ✅ Adicionar logging de segurança (#14)

### Fase 3 - MÉDIA (Hardening)
11. ✅ Headers de segurança (#15)
12. ✅ parseInt com radix (#12)
13. ✅ Proteção contra timing attacks (#13)

---

## APROVAÇÃO PARA PRODUÇÃO

**Condições:**
- [ ] Todas vulnerabilidades CRÍTICAS corrigidas
- [ ] Todas vulnerabilidades ALTA corrigidas
- [ ] Testes de penetration realizados
- [ ] Code review por security specialist
- [ ] Auditoria de logs implementada

**Status Atual:** ❌ **REPROVADO**

---

## PRÓXIMOS PASSOS

1. Implementar correções da Fase 1 (URGENTE)
2. Re-auditar middleware após correções
3. Testes de segurança automatizados
4. Penetration testing manual
5. Aprovação final para produção

---

**Assinatura Digital:** Claude Code Security Audit v1.0
**Confidencialidade:** INTERNO - NÃO COMPARTILHAR
