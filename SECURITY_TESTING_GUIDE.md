# GUIA DE TESTES DE SEGURANÇA - MIDDLEWARE
**Data:** 2025-10-24
**Sistema:** Arena Dona Santa - Plataforma de Reservas com Transações Financeiras
**Versão:** v2.0 (Pós-Auditoria)

---

## RESUMO DAS CORREÇÕES IMPLEMENTADAS

### ✅ Vulnerabilidades Críticas Corrigidas

| # | Vulnerabilidade | Status | Correção |
|---|----------------|--------|----------|
| 1 | Cookie cache sem vínculo ao user.id | ✅ CORRIGIDO | Cookies agora incluem user.id no nome |
| 2 | Timestamp manipulável | ✅ CORRIGIDO | Validação com parseInt(radix) e verificação de sanidade |
| 3 | Sem validação de formato de role | ✅ CORRIGIDO | Whitelist com VALID_ROLES |
| 4 | SameSite='lax' (CSRF) | ✅ CORRIGIDO | Alterado para 'strict' |
| 5 | Sem invalidação em logout | ✅ CORRIGIDO | Endpoint de logout limpa cache |
| 6 | Código duplicado | ✅ CORRIGIDO | Função getRoleWithCache() |
| 7 | Path traversal | ✅ CORRIGIDO | normalizePathname() |
| 8 | Sem verificação de ban/status | ✅ CORRIGIDO | Verifica banned e status |

### ✅ Vulnerabilidades de Alta Severidade Corrigidas

| # | Vulnerabilidade | Status | Correção |
|---|----------------|--------|----------|
| 9 | Sem error handling | ✅ CORRIGIDO | Try-catch em todas queries |
| 10 | Sem rate limiting | ⚠️ PARCIAL | Necessita implementação externa |
| 11 | JWT metadata sem validação | ✅ CORRIGIDO | Sempre valida contra banco |
| 12 | parseInt sem radix | ✅ CORRIGIDO | parseInt(x, 10) |
| 13 | Timing attacks | ⚠️ MITIGADO | Logging consistente |

### ✅ Melhorias Adicionais

- ✅ Logging de segurança completo
- ✅ Headers de segurança (X-Frame-Options, CSP, etc.)
- ✅ Fail-safe em build-time
- ✅ Documentação inline completa

---

## TESTES DE SEGURANÇA OBRIGATÓRIOS

### 1. Teste de Isolamento de Cache entre Usuários

**Objetivo:** Verificar que User A não pode acessar cache de User B

**Procedimento:**
```bash
# Terminal 1 - User A (Cliente)
1. Fazer login como cliente (user_a@email.com)
2. Navegar para /cliente/reservas
3. Inspecionar cookies no DevTools:
   - Verificar cookie: user-role-{userId_A}=cliente
   - Verificar cookie: user-role-ts-{userId_A}={timestamp}
4. Fazer logout
5. Verificar que cookies user-role-* foram DELETADOS

# Terminal 2 - User B (Gestor)
6. NO MESMO NAVEGADOR, fazer login como gestor (user_b@email.com)
7. Inspecionar cookies:
   - Verificar cookie: user-role-{userId_B}=gestor
   - NÃO deve existir cookie user-role-{userId_A}
8. Tentar acessar /cliente/turmas/criar
9. Deve ser REDIRECIONADO para /gestor (não deve ter acesso)
```

**Resultado Esperado:**
- ✅ Cada usuário tem cookies únicos por ID
- ✅ Logout limpa cookies
- ✅ User B não herda cache de User A
- ✅ Redirecionamento automático funciona

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 2. Teste de Validação de Role (Injection)

**Objetivo:** Verificar que roles inválidos são rejeitados

**Procedimento:**
```bash
# No DevTools (Console)
1. Fazer login como cliente
2. No DevTools > Application > Cookies
3. Editar cookie user-role-{userId}:
   - Tentar: "admin' OR '1'='1"
   - Tentar: "super_admin"
   - Tentar: "gestor; DROP TABLE users;"
4. Navegar para /gestor
```

**Resultado Esperado:**
- ✅ Middleware rejeita role inválido
- ✅ Redirecionado para /auth
- ✅ Cookie de role é DELETADO
- ✅ Log de segurança gerado:
  ```
  [SECURITY] Invalid role format detected: {userId: ..., invalidRole: ...}
  ```

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 3. Teste de Path Traversal

**Objetivo:** Verificar que encoding de URL não bypassa autorização

**Procedimento:**
```bash
# Como gestor logado
1. Tentar acessar:
   - /cliente%2F..%2Fgestor
   - /cliente/../gestor
   - /cliente%252F..%252Fgestor (double encoding)
   - /cliente%00/gestor (null byte)
   - /cliente\gestor (backslash)
```

**Resultado Esperado:**
- ✅ Todas tentativas resultam em redirect para /gestor
- ✅ Nenhum acesso à área de cliente
- ✅ Logs de segurança gerados

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 4. Teste de CSRF com SameSite=strict

**Objetivo:** Verificar que cookies não são enviados em navegação cross-site

**Procedimento:**
```bash
# Setup
1. Fazer login no sistema (https://arena.sistemasdigitais.com)
2. Criar página HTML maliciosa em outro domínio:

<!-- malicious.html -->
<html>
<body onload="document.forms[0].submit()">
  <form action="https://arena.sistemasdigitais.com/gestor/delete" method="POST">
    <input type="hidden" name="action" value="delete_all">
  </form>
</body>
</html>

3. Hospedar em http://localhost:8000/malicious.html
4. Abrir malicious.html enquanto LOGADO no sistema
```

**Resultado Esperado:**
- ✅ Request é enviado MAS cookies NÃO são incluídos
- ✅ Servidor retorna 401/403 (não autenticado)
- ✅ Ação destrutiva NÃO é executada

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 5. Teste de Usuário Banido

**Objetivo:** Verificar que usuários banidos não têm acesso

**Procedimento:**
```bash
# Setup database
1. No Supabase SQL Editor:
   UPDATE users SET banned = true WHERE email = 'test@email.com';

2. Fazer login como test@email.com
3. Tentar acessar /cliente/reservas
```

**Resultado Esperado:**
- ✅ Redirecionado para /auth
- ✅ Mensagem: "Conta suspensa" ou similar
- ✅ Log gerado:
  ```
  [SECURITY] Banned user attempted access: {userId: ...}
  ```

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 6. Teste de Timestamp Manipulation

**Objetivo:** Verificar que manipular timestamp não estende cache

**Procedimento:**
```bash
# No DevTools
1. Fazer login
2. Inspecionar cookie user-role-ts-{userId}
3. Copiar valor atual (ex: 1698765432000)
4. Editar para valor futuro: 9999999999999
5. Recarregar página
6. Verificar se role ainda é válido
```

**Resultado Esperado:**
- ✅ Middleware detecta timestamp inválido (futuro)
- ✅ Cache é ignorado
- ✅ Nova query ao banco é feita
- ✅ Timestamp é sobrescrito com valor correto

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 7. Teste de Error Handling em Database Failure

**Objetivo:** Verificar comportamento quando banco falha

**Procedimento:**
```bash
# Setup (simular falha)
1. Temporariamente alterar SUPABASE_URL no .env.local para valor inválido
2. Fazer login (se possível, ou usar sessão existente)
3. Navegar para /cliente
```

**Resultado Esperado:**
- ✅ Middleware não crasha
- ✅ Usuário é redirecionado para /auth
- ✅ Log de erro gerado:
  ```
  [SECURITY] Database query failed: {userId: ..., error: ...}
  ```
- ✅ Resposta HTTP 302/401 (não 500)

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 8. Teste de Privilege Escalation

**Objetivo:** Verificar que cliente não pode acessar área de gestor

**Procedimento:**
```bash
# Como cliente logado
1. Acessar diretamente /gestor
2. Acessar /gestor/turmas
3. Acessar /gestor/metricas
4. Verificar logs de segurança
```

**Resultado Esperado:**
- ✅ TODOS acessos resultam em redirect para /cliente
- ✅ Logs gerados:
  ```
  [SECURITY] Unauthorized access attempt: {
    userId: ...,
    role: 'cliente',
    attemptedPath: '/gestor',
    reason: 'Insufficient privileges for /gestor'
  }
  ```

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 9. Teste de Logout e Session Cleanup

**Objetivo:** Verificar que logout limpa TODOS os dados de sessão

**Procedimento:**
```bash
# Antes do logout
1. Fazer login
2. Inspecionar cookies (DevTools > Application > Cookies):
   - Anotar: sb-access-token, sb-refresh-token, user-role-*, etc.

# Logout
3. Clicar em "Sair"
4. Verificar response do POST /api/auth/logout
5. Inspecionar cookies novamente

# Após logout
6. Tentar acessar /cliente/reservas
7. Verificar que é redirecionado para /auth
```

**Resultado Esperado:**
- ✅ Response 200 do logout
- ✅ TODOS cookies deletados:
  - sb-access-token ❌
  - sb-refresh-token ❌
  - user-role-{userId} ❌
  - user-role-ts-{userId} ❌
- ✅ Acesso a rotas protegidas resulta em redirect para /auth
- ✅ Log gerado:
  ```
  [SECURITY] User logged out successfully: {userId: ...}
  ```

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

### 10. Teste de Headers de Segurança

**Objetivo:** Verificar que headers de segurança estão presentes

**Procedimento:**
```bash
# Usar curl ou DevTools Network
curl -I https://arena.sistemasdigitais.com/cliente

# Verificar headers:
```

**Headers Esperados:**
```
Cache-Control: no-store, no-cache, must-revalidate, private
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Resultado Real:** [ ] PASSOU [ ] FALHOU

---

## TESTES AUTOMATIZADOS (OPCIONAL)

### Script de Teste de Segurança

```javascript
// test-middleware-security.mjs
import { test } from 'node:test';
import assert from 'node:assert';

test('Role cache is isolated by user ID', async () => {
  // TODO: Implementar com Playwright ou Puppeteer
});

test('Invalid roles are rejected', async () => {
  // TODO: Implementar
});

test('CSRF protection works', async () => {
  // TODO: Implementar
});
```

---

## CHECKLIST DE APROVAÇÃO PARA PRODUÇÃO

### Fase 1 - Segurança Crítica
- [ ] Teste 1: Isolamento de cache (PASSOU)
- [ ] Teste 2: Validação de role (PASSOU)
- [ ] Teste 3: Path traversal (PASSOU)
- [ ] Teste 4: CSRF protection (PASSOU)
- [ ] Teste 5: Usuário banido (PASSOU)
- [ ] Teste 9: Logout completo (PASSOU)

### Fase 2 - Hardening
- [ ] Teste 6: Timestamp manipulation (PASSOU)
- [ ] Teste 7: Error handling (PASSOU)
- [ ] Teste 8: Privilege escalation (PASSOU)
- [ ] Teste 10: Security headers (PASSOU)

### Fase 3 - Monitoramento
- [ ] Logs de segurança sendo coletados
- [ ] Alertas configurados para tentativas de acesso não autorizado
- [ ] Dashboard de monitoramento ativo

### Fase 4 - Compliance
- [ ] Documentação de segurança completa
- [ ] Política de privacidade atualizada
- [ ] Termos de uso incluem cláusulas de segurança
- [ ] LGPD compliance verificado

---

## PRÓXIMOS PASSOS (RECOMENDAÇÕES)

### Curto Prazo (1 semana)
1. ✅ Executar TODOS os testes manuais acima
2. ⚠️ Implementar rate limiting (Vercel Edge Config ou Redis)
3. ⚠️ Configurar monitoring de logs (Sentry, LogRocket)
4. ⚠️ Adicionar testes automatizados E2E

### Médio Prazo (1 mês)
5. ⚠️ Penetration testing por empresa especializada
6. ⚠️ Auditoria de compliance (LGPD, PCI-DSS se aplicável)
7. ⚠️ Implementar 2FA (autenticação de dois fatores)
8. ⚠️ Bug bounty program (opcional)

### Longo Prazo (3 meses)
9. ⚠️ Security headers avançados (CSP completo)
10. ⚠️ Web Application Firewall (WAF)
11. ⚠️ DDoS protection (Cloudflare, Vercel Enterprise)
12. ⚠️ SOC 2 certification (se aplicável)

---

## CONTATOS DE EMERGÊNCIA

**Em caso de incidente de segurança:**
1. Desabilitar middleware temporariamente (alterar matcher para [])
2. Notificar equipe de desenvolvimento
3. Revisar logs de segurança
4. Gerar relatório de incidente
5. Aplicar hotfix se necessário

**Responsáveis:**
- Security Lead: [NOME]
- DevOps: [NOME]
- CTO: [NOME]

---

**Assinado:** Claude Code Security Team
**Data:** 2025-10-24
**Versão:** 1.0
