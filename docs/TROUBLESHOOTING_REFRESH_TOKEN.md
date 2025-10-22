# Troubleshooting: "Invalid Refresh Token" Error

## 🐛 Erro Completo

```
AuthApiError: Invalid Refresh Token: Refresh Token Not Found
```

---

## ✅ Soluções Implementadas

### 1. **SessionGuard Component** (Automático)

O componente `SessionGuard` foi adicionado ao root layout e **automaticamente**:

- ✅ Detecta sessões inválidas ao carregar a página
- ✅ Limpa tokens corrompidos do localStorage
- ✅ Redireciona para `/auth` quando necessário
- ✅ Monitora mudanças de estado de autenticação

**Localização:** `src/components/auth/SessionGuard.tsx`

**Como funciona:**
```tsx
// Já está ativo no layout raiz (src/app/layout.tsx)
<SessionGuard />
```

### 2. **Configuração Melhorada do Supabase Client**

Configurações adicionadas para melhor gerenciamento de sessão:

```typescript
{
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
}
```

**Localização:** `src/lib/supabase/client.ts`

### 3. **Função de Limpeza Manual**

Se precisar limpar a sessão manualmente:

```typescript
import { clearSupabaseSession } from '@/lib/supabase/client';

await clearSupabaseSession();
```

---

## 🔧 Soluções Manuais (Se o problema persistir)

### Opção 1: Limpar Cache do Navegador

1. Abra o DevTools (F12)
2. Vá em **Application** → **Storage**
3. Clique em **Clear site data**
4. Recarregue a página (Ctrl+Shift+R)

### Opção 2: Limpar localStorage via Console

Cole no Console do navegador:

```javascript
// Limpar todos os tokens do Supabase
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('sb-')) {
    localStorage.removeItem(key);
  }
});

// Recarregar página
location.reload();
```

### Opção 3: Modo Anônimo

Teste em uma janela anônima (Ctrl+Shift+N) para verificar se o problema é com cookies/cache.

---

## 🕵️ Causas Comuns

### 1. **Usuário Deletado no Dashboard**

**Problema:** Você deletou um usuário no Supabase Dashboard mas o token ainda existe nos cookies.

**Solução:**
```bash
# Via Console
await clearSupabaseSession();

# Ou limpar localStorage manualmente (veja acima)
```

### 2. **Múltiplos Ambientes**

**Problema:** Você está alternando entre ambientes (local, staging, produção) com diferentes bancos Supabase.

**Solução:**
- Limpe o localStorage ao trocar de ambiente
- Use diferentes navegadores para diferentes ambientes
- Configure `.env.local` corretamente

### 3. **Token Expirado Durante Desenvolvimento**

**Problema:** O servidor de desenvolvimento parou e foi reiniciado, mas o token antigo ainda está nos cookies.

**Solução:**
- Reinicie o servidor: `npm run dev`
- Limpe o cache: `rd /s /q .next` (Windows) ou `rm -rf .next` (Unix)
- Faça logout e login novamente

### 4. **Configuração Incorreta do Supabase**

**Problema:** Variáveis de ambiente incorretas ou faltando.

**Solução:**

Verifique se `.env.local` tem:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-anon-key]
```

Reinicie o servidor após alterar `.env`:
```bash
# Parar servidor (Ctrl+C)
npm run dev
```

---

## 🧪 Como Testar se o Problema Foi Resolvido

### Teste 1: Recarregar Página

1. Acesse qualquer página autenticada
2. Recarregue (F5)
3. **Esperado:** Não deve aparecer erro de refresh token

### Teste 2: Logout/Login

1. Faça logout
2. Faça login novamente
3. **Esperado:** Login funciona sem erros

### Teste 3: Console Limpo

1. Abra DevTools (F12)
2. Vá em Console
3. Recarregue a página
4. **Esperado:** Não deve ter erros relacionados a "refresh token"

### Teste 4: Verificar localStorage

```javascript
// Cole no Console
Object.keys(localStorage).filter(k => k.startsWith('sb-'))
```

**Esperado:**
- Deve retornar array vazio `[]` quando não logado
- Deve retornar chaves do Supabase quando logado

---

## 🚨 Se Nada Funcionar

### 1. Resetar Completamente o Supabase Local

```bash
# Parar servidor Next.js (Ctrl+C)

# Limpar build
rd /s /q .next

# Limpar node_modules e reinstalar
rd /s /q node_modules
npm install

# Reiniciar servidor
npm run dev
```

### 2. Verificar Configuração do Supabase Dashboard

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Authentication** → **Settings**
3. Verifique:
   - ✅ **Enable email confirmations** (pode desabilitar em dev)
   - ✅ **Secure email change** está configurado
   - ✅ **Session timeout** não está muito curto

### 3. Criar Novo Usuário de Teste

Se o problema for específico de um usuário:

1. Delete o usuário problemático no Dashboard
2. Limpe localStorage: `clearSupabaseSession()`
3. Crie novo usuário via formulário de cadastro
4. Teste novamente

---

## 📊 Logs Úteis para Debug

### Ver Tokens Ativos

```javascript
// Console do navegador
const supabase = createClient();
const { data } = await supabase.auth.getSession();
console.log('Session:', data.session);
```

### Monitorar Mudanças de Auth

```javascript
// Console do navegador
const supabase = createClient();
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth Event:', event);
  console.log('Session:', session);
});
```

---

## ✅ Checklist de Verificação

- [ ] SessionGuard está ativo no layout
- [ ] `.env.local` está configurado corretamente
- [ ] localStorage foi limpo
- [ ] Cache do navegador foi limpo
- [ ] Servidor foi reiniciado após mudanças
- [ ] Testado em janela anônima
- [ ] Usuário não foi deletado no Dashboard
- [ ] Token não expirou durante desenvolvimento

---

## 📞 Ainda com Problemas?

Se após todas as soluções o erro persistir:

1. Verifique os logs do servidor Next.js
2. Verifique os logs do Supabase Dashboard (Logs & Reports)
3. Crie um novo projeto Supabase de teste
4. Verifique se não é um problema de rede/firewall

---

**✨ O SessionGuard deve resolver automaticamente 99% dos casos deste erro!**
