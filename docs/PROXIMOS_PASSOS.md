# Próximos Passos - Frontend + Backend Arena Dona Santa

**Situação Atual:** Frontend 60% mockado, precisa conectar ao Supabase
**Meta:** Sistema funcional em 2-3 semanas

---

## 🎯 O Que Fazer AGORA (Ordem de Prioridade)

### FASE 1: Backend (1 semana) 🔴 COMEÇAR AQUI

#### Passo 1: Verificar Schema do Banco (1-2 dias)

```bash
# Ver se migrations existem
ls supabase/migrations

# Se não existirem, criar schema completo:
npx supabase migration new schema_inicial
```

**Tabelas necessárias (verificar se existem):**
- [ ] `users` (com TODOS os campos: rg, data_nascimento, cep, logradouro, etc.)
- [ ] `quadras`
- [ ] `horarios`
- [ ] `court_blocks`
- [ ] `reservas`
- [ ] `turmas`
- [ ] `turma_membros`
- [ ] `reserva_participantes`
- [ ] `rateios`
- [ ] `convites` ✅ (já existe)
- [ ] `convite_aceites` ✅ (já existe)
- [ ] `pagamentos`
- [ ] `transactions`
- [ ] `system_settings`
- [ ] `avaliacoes`

**Como verificar:**
```sql
-- No Supabase Dashboard > SQL Editor:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Ver colunas de uma tabela:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';
```

#### Passo 2: Row Level Security (1 dia)

**Configurar RLS para cada tabela:**

```sql
-- Exemplo para 'reservas':
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Cliente vê só suas reservas:
CREATE POLICY "Clientes veem suas reservas"
ON reservas FOR SELECT
USING (auth.uid() = user_id);

-- Gestor vê todas:
CREATE POLICY "Gestores veem todas"
ON reservas FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('gestor', 'admin')
  )
);

-- Repetir para todas as tabelas!
```

#### Passo 3: Configurar Variáveis de Ambiente (30min)

```bash
# Arquivo: .env.local

# Supabase (já deve ter)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Asaas (ADICIONAR)
ASAAS_API_KEY=seu_api_key_aqui
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_SECRET=seu_webhook_secret

# WhatsApp (ADICIONAR - opcional por enquanto)
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
```

**Como conseguir tokens Asaas:**
1. Criar conta em https://www.asaas.com/
2. Ativar modo sandbox
3. Copiar API Key do dashboard

---

### FASE 2: Conectar Mockados (1 semana) 🟡

#### Dia 1: Autenticação Real

**Arquivo:** `src/app/(auth)/auth/page.tsx`

**O que mudar:**
```typescript
// LINHA 43-82: DELETAR TUDO e substituir por:

const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.target as HTMLFormElement);
  const email = formData.get('login-email') as string;
  const password = formData.get('login-password') as string;

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    toast({
      title: "Erro",
      description: error.message,
      variant: "destructive"
    });
    setLoading(false);
    return;
  }

  // Buscar perfil real do usuário
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  // Redirecionar baseado no role REAL
  if (profile?.role === 'gestor' || profile?.role === 'admin') {
    router.push('/gestor');
  } else {
    router.push('/cliente');
  }
};
```

**Testar:**
1. Criar usuário manualmente no Supabase Dashboard
2. Tentar fazer login
3. Ver se redireciona corretamente

---

#### Dia 2: Nova Reserva Real

**Arquivo:** `src/app/(dashboard)/cliente/reservas/nova/page.tsx`

**O que mudar:**
```typescript
// LINHA 1: ADICIONAR imports
import { useQuadras } from '@/hooks/core/useQuadras';
import { useHorarios } from '@/hooks/core/useHorarios';
import { useCreateReserva } from '@/hooks/core/useReservas';
import { useState } from 'react';

// LINHA 9: ADICIONAR dentro do componente
export default function NovaReservaPage() {
  const [quadraSelecionada, setQuadraSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');

  const { data: quadras, isLoading: loadingQuadras } = useQuadras();
  const { data: horarios, isLoading: loadingHorarios } = useHorarios(quadraSelecionada, dataSelecionada);
  const createReserva = useCreateReserva();

  const handleSubmit = async () => {
    try {
      await createReserva.mutateAsync({
        quadra_id: quadraSelecionada,
        data: dataSelecionada,
        horario_id: horarioSelecionado,
        tipo: 'avulsa',
        observacoes
      });

      router.push('/cliente/reservas');
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao criar reserva", variant: "destructive" });
    }
  };

  // LINHA 44-48: MUDAR select hardcoded para:
  <select
    className="w-full p-3 border border-border rounded-lg"
    value={quadraSelecionada}
    onChange={(e) => setQuadraSelecionada(e.target.value)}
  >
    <option value="">Selecione uma quadra</option>
    {quadras?.map(q => (
      <option key={q.id} value={q.id}>{q.nome}</option>
    ))}
  </select>

  // LINHA 84: MUDAR Button para:
  <Button
    className="w-full"
    onClick={handleSubmit}
    disabled={createReserva.isPending}
  >
    {createReserva.isPending ? 'Criando...' : 'Confirmar Reserva'}
  </Button>
}
```

**Verificar se hooks existem:**
```bash
# Se não existirem, criar:
# src/hooks/core/useReservas.ts
export function useCreateReserva() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (data) => {
      const { data: reserva, error } = await supabase
        .from('reservas')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return reserva;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    }
  });
}
```

---

#### Dia 3: Agenda Gestor Real

**Arquivo:** `src/app/(gestor)/gestor/agenda/page.tsx`

**O que mudar:**
```typescript
// LINHA 56-121: DELETAR TUDO (dados mockados)
// const [reservations, setReservations] = useState<Reservation[]>([ ... ]);

// SUBSTITUIR POR:
const { data: reservasData } = useReservasGestor({
  data_inicio: currentWeek[0].toISOString().split('T')[0],
  data_fim: currentWeek[6].toISOString().split('T')[0]
});

const reservations = useMemo(() => {
  if (!reservasData) return [];

  return reservasData.map(r => ({
    id: r.id,
    court: r.quadra.nome,
    day: new Date(r.data).getDay(),
    time: r.horario.hora_inicio,
    organizer: r.user.nome_completo,
    participants: r.total_participantes || 0,
    status: r.status,
    phone: r.user.whatsapp,
    email: r.user.email,
    notes: r.observacoes
  }));
}, [reservasData]);
```

**Hook já existe! Só usar:**
```typescript
// src/hooks/core/useReservasGestor.ts (JÁ EXISTE)
```

---

#### Dia 4-5: Quadras e Reservas Gestor

**Mesmo padrão:**
1. Remover dados mockados
2. Usar hooks que já existem
3. Mapear dados para UI

---

### FASE 3: Implementar Faltantes (1 semana) 🔵

#### Sistema de Pagamento

**Criar arquivos:**
```
src/app/(dashboard)/cliente/pagamento/[reservaId]/
├── page.tsx (seleção de método)
├── pix/page.tsx (QR Code)
└── cartao/page.tsx (form Asaas)
```

**Componentes:**
```bash
npm install qrcode.react jspdf

# Criar:
src/components/pagamento/
├── FormPagamentoPix.tsx
├── FormPagamentoCartao.tsx
├── SaldoCreditos.tsx
└── ComprovantePagamento.tsx
```

**Service já existe:**
```typescript
// src/services/pagamentoService.ts (JÁ IMPLEMENTADO)
import { pagamentoService } from '@/services/pagamentoService';

// Usar:
await pagamentoService.createPixPayment({
  reserva_id,
  valor,
  user_id
});
```

#### Cadastro Completo

**Expandir:** `src/components/auth/SignupForm.tsx`

Adicionar campos (componentes JÁ EXISTEM):
```typescript
import { InputCPF } from '@/components/shared/forms/InputCPF';
import { InputCEP } from '@/components/shared/forms/InputCEP';
import { InputWhatsApp } from '@/components/shared/forms/InputWhatsApp';

// Adicionar ao form:
<InputCPF />
<Input name="rg" placeholder="RG" />
<Input type="date" name="data_nascimento" />
<InputCEP onAddressChange={(address) => setAddress(address)} />
<InputWhatsApp />
// ... resto dos campos de endereço
```

---

## 📋 Checklist Rápido

### Backend (fazer PRIMEIRO):
- [ ] Verificar se migrations existem (`ls supabase/migrations`)
- [ ] Se não, criar schema completo no Supabase Dashboard
- [ ] Configurar RLS para todas as tabelas
- [ ] Adicionar tokens Asaas no `.env.local`
- [ ] Testar conexão: `npx supabase status`

### Frontend (depois do backend):
- [ ] Autenticação real (deletar mock, usar Supabase Auth)
- [ ] Nova reserva conectada (usar hooks reais)
- [ ] Agenda gestor conectada (remover mock, usar `useReservasGestor`)
- [ ] Quadras gestor conectadas (remover mock, usar `useQuadras`)
- [ ] Reservas gestor conectadas (remover mock)
- [ ] Criar páginas de pagamento
- [ ] Expandir formulário de cadastro
- [ ] Conectar comprar créditos

### Testes:
- [ ] Login funciona
- [ ] Criar reserva funciona
- [ ] Agenda mostra dados reais
- [ ] Convites funcionam (JÁ FUNCIONA)
- [ ] Turmas funcionam
- [ ] Pagamento Pix gera QR Code
- [ ] RLS bloqueia acessos indevidos

---

## 🚀 Como Começar AGORA

### Opção 1: Você tem schema pronto
```bash
# Ver schema atual
npx supabase db pull

# Aplicar no projeto
npx supabase db push
```

### Opção 2: Não tem schema
```bash
# Criar migration
npx supabase migration new schema_inicial

# Editar arquivo gerado em supabase/migrations/XXXXXXX_schema_inicial.sql
# Copiar SQL do PRD ou criar manualmente

# Aplicar
npx supabase db push
```

### Opção 3: Usar Supabase Dashboard
1. Ir em https://supabase.com/dashboard
2. Selecionar projeto
3. Table Editor > New Table
4. Criar cada tabela manualmente
5. Depois: SQL Editor > gerar types:
```bash
npx supabase gen types typescript --linked > src/types/database.types.ts
```

---

## ⏱️ Estimativa de Tempo

| Tarefa | Tempo | Prioridade |
|--------|-------|-----------|
| Setup backend (migrations + RLS) | 2 dias | 🔴 Crítico |
| Conectar auth real | 4 horas | 🔴 Crítico |
| Conectar nova reserva | 4 horas | 🔴 Crítico |
| Conectar agenda/quadras/reservas gestor | 1 dia | 🟡 Alto |
| Sistema de pagamento completo | 2 dias | 🔴 Crítico |
| Expandir cadastro | 4 horas | 🟡 Alto |
| Testes e ajustes | 1 dia | 🟡 Alto |

**TOTAL:** 7-10 dias de trabalho (1-2 semanas)

---

## 📞 Próximo Passo IMEDIATO

**Escolha um:**

### A) Já tem schema no Supabase?
→ Pule para FASE 2 (conectar mockados)

### B) Não tem schema?
→ Comece pela FASE 1 (criar migrations)

### C) Quer testar rápido?
→ Comece só pela autenticação:
1. Criar usuário manual no Supabase
2. Trocar login mockado (30min)
3. Ver se funciona

---

**Documentos criados:**
- `docs/GAPS_FRONTEND_REAL.md` - Análise detalhada
- `docs/PROXIMOS_PASSOS.md` - Este arquivo

**Quer que eu ajude a:**
- [ ] Criar as migrations Supabase?
- [ ] Conectar a autenticação real?
- [ ] Implementar sistema de pagamento?

**Me diga por onde quer começar!**
