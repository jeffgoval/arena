# Scripts de Desenvolvimento

## 🚀 test-and-push

Script para **testar build local antes de fazer push** ao GitHub, evitando falhas no Vercel.

### Uso

**Windows (PowerShell/CMD):**
```bash
test-and-push.bat "sua mensagem de commit"
```

**Linux/Mac/Git Bash:**
```bash
./test-and-push.sh "sua mensagem de commit"
```

### O que o script faz:

1. ✅ Verifica se há mudanças para commitar
2. 📝 Mostra arquivos modificados
3. 🏗️  Executa `npm run build` localmente
4. ❌ Se build falhar: **PARA** e mostra erro
5. ✅ Se build passar: faz `git add`, `commit` e `push`
6. 🎉 Código vai para produção apenas se build passou!

### Exemplos

```bash
# Exemplo 1: Fix simples
./test-and-push.sh "Fix: corrigir erro no formulário"

# Exemplo 2: Nova feature
test-and-push.bat "Feature: adicionar dashboard de métricas"

# Exemplo 3: Refatoração
./test-and-push.sh "Refactor: migrar hooks para React Query"
```

### Benefícios

- 🛡️ **Proteção**: Nunca mais push com build quebrado
- ⚡ **Velocidade**: Descobre erros em ~30s (vs. 3min no Vercel)
- 💰 **Economia**: Evita deploys desperdiçados no Vercel
- 🎯 **Confiança**: Push apenas código que funciona

### Erros Comuns

**"Build falhou":**
- Veja o output do TypeScript
- Corrija os erros
- Rode o script novamente

**"Nenhuma mudança":**
- Você não tem arquivos modificados
- Use `git status` para verificar

**"Permissão negada" (Linux/Mac):**
```bash
chmod +x test-and-push.sh
```

---

## 📦 Outros Scripts

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção local
npm run lint         # Linter ESLint
```

### Supabase
```bash
# Verificar tabelas
node scripts/check-creditos-table.mjs
node scripts/check-codigos-indicacao-table.mjs

# Debug
node scripts/debug-signup.ts
```

---

**Dica:** Sempre use `test-and-push` em vez de `git push` diretamente! 🎯
