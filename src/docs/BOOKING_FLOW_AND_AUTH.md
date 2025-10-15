# 🎯 Fluxo de Reservas e Autenticação

## 📋 Status Atual

### **🔓 Páginas Públicas (Sem Login Necessário):**

1. ✅ **Landing Page** (`/landing`)
2. ✅ **Login** (`/login`)
3. ✅ **Cadastro** (`/cadastro`)
4. ✅ **Invite View** (`/invite-view`) - Ver convites
5. ✅ **Court Details** (`/court-details`) - Ver detalhes da quadra
6. ✅ **FAQ** (`/faq`)
7. ✅ **Terms** (`/terms`)
8. ✅ **404** (`/404`)

### **🔒 Páginas que Requerem Autenticação:**

#### **Cliente:**
- ✅ **Client Dashboard** (`/client-dashboard`)
- ✅ **User Profile** (`/user-profile`)
- ✅ **Teams** (`/teams`)
- ✅ **Transactions** (`/transactions`)
- ✅ **Settings** (`/settings`)
- ✅ **Subscription Management** (`/subscription-management`)

#### **Gestor:**
- ✅ **Manager Dashboard** (`/manager-dashboard`)
- ✅ **Manager Schedule** (`/manager-schedule`)
- ✅ **Manager Courts** (`/manager-courts`)
- ✅ **Manager Clients** (`/manager-clients`)
- ✅ **Manager Reports** (`/manager-reports`)
- ✅ **Manager Settings** (`/manager-settings`)

---

## ⚠️ **PROBLEMA IDENTIFICADO: Booking Flow**

### **Estado Atual:**

```tsx
// AppRouter.tsx - Linha 64-66
{currentPage === ROUTES.BOOKING && (
  <BookingFlow onBack={() => navigate(isAuthenticated ? ROUTES.CLIENT_DASHBOARD : ROUTES.LANDING)} />
)}
```

**Problemas:**
1. ❌ **Booking não está em `PUBLIC_ROUTES`** - Mas também não verifica autenticação
2. ❌ **Qualquer pessoa pode acessar** `/booking`
3. ❌ **Não redireciona para login** se não autenticado
4. ❌ **UX confusa** - Usuário não logado pode começar a fazer reserva

### **Comportamento Atual:**

```
Usuário NÃO logado:
1. Acessa Landing Page
2. Clica "Fazer Reserva"
3. ✅ Navega para /booking (PERMITIDO)
4. ✅ Escolhe quadra, data, horário
5. ❌ Ao tentar confirmar: ???
   - Deveria redirecionar para Login
   - Deveria salvar dados da reserva
   - Deveria retornar após login
```

---

## ✅ Soluções Recomendadas

### **Opção 1: Booking Requer Login (Recomendado para B2C)**

**Fluxo:**
```
Usuário clica "Fazer Reserva" → Verifica autenticação:
  ✅ Logado → Booking Flow
  ❌ Não logado → Login com redirect
```

**Implementação:**
```tsx
// AppRouter.tsx
{currentPage === ROUTES.BOOKING && (
  isAuthenticated ? (
    <BookingFlow onBack={() => navigate(ROUTES.CLIENT_DASHBOARD)} />
  ) : (
    // Redirecionar para login
    (() => {
      navigate(ROUTES.LOGIN);
      toast.info("Faça login para fazer uma reserva");
      return null;
    })()
  )
)}
```

**Vantagens:**
- ✅ Seguro - Só usuários autenticados reservam
- ✅ Simples - Não precisa salvar estado
- ✅ Claro - Usuário sabe que precisa estar logado

**Desvantagens:**
- ❌ Friccão - Força login antes de ver disponibilidade
- ❌ Conversão - Pode perder usuários indecisos

---

### **Opção 2: Booking Público com Login ao Confirmar (Melhor UX)**

**Fluxo:**
```
Usuário NÃO logado:
1. Vê quadras disponíveis
2. Escolhe data/horário
3. Vê preço
4. Clica "Confirmar" → Pede login
5. Após login → Retorna para confirmação
```

**Implementação:**
```tsx
// BookingFlow.tsx - No step final
const handleConfirmBooking = () => {
  if (!isAuthenticated) {
    // Salvar dados da reserva no localStorage
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    
    // Redirecionar para login com mensagem
    toast.info("Faça login para confirmar sua reserva");
    navigate(ROUTES.LOGIN);
  } else {
    // Processar reserva normalmente
    proceedToPayment();
  }
};

// Login.tsx - Após login bem-sucedido
const handleLoginSuccess = () => {
  // Verificar se há reserva pendente
  const pendingBooking = localStorage.getItem('pendingBooking');
  
  if (pendingBooking) {
    localStorage.removeItem('pendingBooking');
    toast.success("Login realizado! Finalize sua reserva.");
    navigate(ROUTES.BOOKING);
  } else {
    navigate(ROUTES.CLIENT_DASHBOARD);
  }
};
```

**Vantagens:**
- ✅ UX melhor - Usuário vê antes de se comprometer
- ✅ Conversão - Mais provável completar reserva
- ✅ Transparência - Vê preços e disponibilidade

**Desvantagens:**
- ⚠️ Complexidade - Precisa salvar/restaurar estado
- ⚠️ Edge cases - Lidar com dados expirados

---

### **Opção 3: Híbrido - Mostrar com CTA para Login (Compromise)**

**Fluxo:**
```
Landing Page:
- Botão "Ver Quadras Disponíveis" (público)
- Botão "Fazer Reserva" (requer login)

Court Details (público):
- Ver fotos, descrição, localização
- Ver ALGUNS horários disponíveis
- Botão "Reservar Agora" → Login
```

**Implementação:**
```tsx
// CourtDetails.tsx
<Button 
  onClick={() => {
    if (!isAuthenticated) {
      toast.info("Faça login para fazer uma reserva");
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.BOOKING);
    }
  }}
>
  Reservar Agora
</Button>

// Mostrar preview de horários (apenas visualização)
<div className="opacity-60 pointer-events-none">
  <SchedulePreview />
  <div className="text-center mt-4">
    <Button onClick={() => navigate(ROUTES.LOGIN)}>
      Fazer login para ver todos os horários
    </Button>
  </div>
</div>
```

**Vantagens:**
- ✅ Transparência - Usuário vê o que terá
- ✅ Conversão - Preview motiva cadastro
- ✅ Segurança - Login antes de booking completo

---

## 🎯 Recomendação Final

### **Implementar Opção 2 (Booking Público + Login ao Confirmar)**

**Razões:**
1. ✅ **Melhor UX** - Usuário explora antes de se comprometer
2. ✅ **Maior conversão** - Vê preços reais antes de criar conta
3. ✅ **Padrão de mercado** - Airbnb, Booking.com, etc.
4. ✅ **SEO** - Páginas de quadras indexáveis
5. ✅ **Marketing** - Pode compartilhar links diretos

**Fluxo Completo:**

```
┌─────────────────────────────────────────────────────────┐
│ 1. LANDING PAGE (Público)                               │
│    - Ver quadras                                        │
│    - Ver preços                                         │
│    - [Fazer Reserva] ou [Login]                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. BOOKING FLOW - Step 1 (Público)                      │
│    ✅ Escolher quadra                                   │
│    ✅ Ver fotos e detalhes                              │
│    [Continuar]                                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. BOOKING FLOW - Step 2 (Público)                      │
│    ✅ Escolher data                                     │
│    ✅ Escolher horário                                  │
│    ✅ Ver disponibilidade em tempo real                │
│    [Continuar]                                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. BOOKING FLOW - Step 3 (Público)                      │
│    ✅ Ver resumo                                        │
│    ✅ Ver preço total                                   │
│    ✅ Ver políticas de cancelamento                    │
│    [Confirmar Reserva]                                  │
└─────────────────────────────────────────────────────────┘
                        ↓
              ┌─────────────────┐
              │ Está logado?    │
              └─────────────────┘
                   ↓         ↓
              SIM  │         │  NÃO
                   ↓         ↓
    ┌──────────────┘         └──────────────┐
    ↓                                       ↓
┌─────────────────┐           ┌─────────────────────────┐
│ 5A. PAYMENT     │           │ 5B. LOGIN               │
│    Pagar agora  │           │    Salvar reserva       │
└─────────────────┘           │    [Login] ou [Criar]   │
                              └─────────────────────────┘
                                          ↓
                              ┌─────────────────────────┐
                              │ Após login:             │
                              │ Restaurar reserva       │
                              │ Ir para Payment         │
                              └─────────────────────────┘
```

---

## 📝 Código de Implementação

### **1. Atualizar config/routes.ts**

```tsx
export const PUBLIC_ROUTES = [
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.CADASTRO,
  ROUTES.INVITE_VIEW,
  ROUTES.COURT_DETAILS,
  ROUTES.FAQ,
  ROUTES.TERMS,
  ROUTES.NOT_FOUND,
  ROUTES.BOOKING,        // ← ADICIONAR
  ROUTES.SUBSCRIPTION_PLANS, // ← Também pode ser público
];
```

### **2. Criar Hook useBookingPersistence**

```tsx
// hooks/useBookingPersistence.ts
import { useState, useEffect } from 'react';

interface BookingData {
  courtId: string;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  timestamp: number;
}

const STORAGE_KEY = 'pendingBooking';
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutos

export function useBookingPersistence() {
  const [pendingBooking, setPendingBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    // Carregar reserva pendente ao montar
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as BookingData;
        
        // Verificar se não expirou
        if (Date.now() - data.timestamp < EXPIRY_TIME) {
          setPendingBooking(data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveBooking = (data: Omit<BookingData, 'timestamp'>) => {
    const bookingData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
    setPendingBooking(bookingData);
  };

  const clearBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPendingBooking(null);
  };

  return { pendingBooking, saveBooking, clearBooking };
}
```

### **3. Atualizar BookingFlow.tsx**

```tsx
import { useBookingPersistence } from '../hooks/useBookingPersistence';
import { useAuth } from '../contexts/AuthContext';

export function BookingFlow({ onBack }: BookingFlowProps) {
  const { isAuthenticated } = useAuth();
  const { pendingBooking, saveBooking, clearBooking } = useBookingPersistence();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    courtId: '',
    date: '',
    timeSlot: '',
    duration: 1,
    price: 0,
  });

  // Restaurar dados ao montar (se houver)
  useEffect(() => {
    if (pendingBooking && isAuthenticated) {
      setBookingData(pendingBooking);
      clearBooking();
      toast.success("Reserva restaurada! Continue de onde parou.");
    }
  }, [pendingBooking, isAuthenticated]);

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      // Salvar e redirecionar para login
      saveBooking(bookingData);
      toast.info("Faça login para confirmar sua reserva", {
        description: "Seus dados foram salvos e você poderá continuar após o login.",
        duration: 5000,
      });
      navigate(ROUTES.LOGIN);
    } else {
      // Processar reserva
      navigate(ROUTES.PAYMENT);
    }
  };

  return (
    // ... resto do componente
  );
}
```

### **4. Atualizar Login.tsx**

```tsx
import { useBookingPersistence } from '../hooks/useBookingPersistence';

export function Login({ onLoginClient, onLoginManager }: LoginProps) {
  const { pendingBooking } = useBookingPersistence();

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(clientEmail, clientPassword, "client");
      
      // Se há reserva pendente
      if (pendingBooking) {
        toast.success("Login realizado! Finalize sua reserva.", {
          description: "Redirecionando para o pagamento...",
        });
        setTimeout(() => navigate(ROUTES.BOOKING), 1000);
      } else {
        toast.success("Login realizado com sucesso!");
        onLoginClient();
      }
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    // ... resto do componente
    
    {pendingBooking && (
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Reserva em Andamento</AlertTitle>
        <AlertDescription>
          Faça login para confirmar sua reserva da{" "}
          <strong>{getCourt(pendingBooking.courtId).name}</strong> para{" "}
          <strong>{formatDate(pendingBooking.date)}</strong> às{" "}
          <strong>{pendingBooking.timeSlot}</strong>.
        </AlertDescription>
      </Alert>
    )}
  );
}
```

### **5. Atualizar Cadastro.tsx**

```tsx
export function Cadastro({ onComplete }: CadastroProps) {
  const { pendingBooking } = useBookingPersistence();

  const handleComplete = async () => {
    // ... completar cadastro
    
    if (pendingBooking) {
      toast.success("Cadastro realizado! Finalize sua reserva.");
      navigate(ROUTES.BOOKING);
    } else {
      onComplete();
    }
  };

  return (
    // ... resto do componente
    
    {step === 1 && pendingBooking && (
      <Alert className="mb-4 bg-primary/5 border-primary">
        <CheckCircle className="h-4 w-4 text-primary" />
        <AlertTitle>Complete seu cadastro</AlertTitle>
        <AlertDescription>
          Você está a poucos passos de confirmar sua reserva!
        </AlertDescription>
      </Alert>
    )}
  );
}
```

---

## 🎨 Melhorias de UX

### **1. Indicador de Progresso**

```tsx
// Mostrar em todas as páginas do fluxo
<div className="mb-6">
  <div className="flex items-center justify-between text-sm mb-2">
    <span className="font-medium">Seu Progresso</span>
    {!isAuthenticated && (
      <Badge variant="outline">Login necessário ao final</Badge>
    )}
  </div>
  <Progress value={(currentStep / totalSteps) * 100} />
</div>
```

### **2. Mensagens Contextuais**

```tsx
{!isAuthenticated && step === 3 && (
  <Alert className="mt-4">
    <InfoIcon className="h-4 w-4" />
    <AlertTitle>Próximo passo: Login</AlertTitle>
    <AlertDescription>
      Para confirmar sua reserva, você precisará fazer login ou criar uma conta.
      Não se preocupe, salvaremos todos os seus dados!
    </AlertDescription>
  </Alert>
)}
```

### **3. Expiração de Reserva**

```tsx
{pendingBooking && (
  <Alert variant="warning">
    <Clock className="h-4 w-4" />
    <AlertTitle>Reserva Temporária</AlertTitle>
    <AlertDescription>
      Esta reserva expira em{" "}
      <Countdown 
        endTime={pendingBooking.timestamp + EXPIRY_TIME}
        onExpire={clearBooking}
      />
    </AlertDescription>
  </Alert>
)}
```

---

## 📊 Métricas e Analytics

### **Eventos para Trackear:**

```typescript
// Analytics events
track('booking_started', { authenticated: false });
track('booking_step_completed', { step: 1, authenticated: false });
track('booking_login_required', { step: 3 });
track('booking_saved_for_login', { courtId, date });
track('booking_resumed_after_login', { minutesElapsed });
track('booking_completed', { source: 'public_flow' });
```

---

## ✅ Checklist de Implementação

- [ ] Adicionar `ROUTES.BOOKING` em `PUBLIC_ROUTES`
- [ ] Criar hook `useBookingPersistence`
- [ ] Atualizar `BookingFlow` para salvar estado
- [ ] Atualizar `Login` para restaurar reserva
- [ ] Atualizar `Cadastro` para restaurar reserva
- [ ] Adicionar indicadores visuais de progresso
- [ ] Adicionar mensagens contextuais
- [ ] Implementar expiração de 30min
- [ ] Adicionar analytics events
- [ ] Testar fluxo completo:
  - [ ] Não logado → Reserva → Login → Confirmação
  - [ ] Não logado → Reserva → Cadastro → Confirmação
  - [ ] Não logado → Reserva → Abandono → Voltar
  - [ ] Logado → Reserva direta

---

## 🎯 Resultado Esperado

### **Antes:**
```
❌ Booking sem controle de autenticação
❌ Usuário não logado pode começar mas não terminar
❌ Dados perdidos ao redirecionar para login
❌ UX confusa e frustrante
```

### **Depois:**
```
✅ Booking público com login ao confirmar
✅ Dados salvos automaticamente
✅ Restauração após login/cadastro
✅ Mensagens claras em cada etapa
✅ Expiração de 30min para segurança
✅ Analytics completo do funil
```

---

**Status:** 📋 **DOCUMENTADO - Aguardando Implementação**  
**Prioridade:** 🔥 **ALTA** - Fluxo crítico para conversão  
**Complexidade:** ⚠️ **MÉDIA** - Requer mudanças em múltiplos componentes  
**Estimativa:** ~2-3 horas de desenvolvimento  
**Data:** Janeiro 2025
