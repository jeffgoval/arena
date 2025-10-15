# 🚀 Guia de Implementação - Melhorias de UX

Este guia prático mostra como implementar as melhorias de UX recomendadas na auditoria.

---

## 📦 Componentes Prontos para Uso

### 1. Command Palette (⌘K)

**Status:** ✅ Implementado  
**Arquivo:** `/components/common/CommandPalette.tsx`

#### Como usar:

```tsx
// Em App.tsx ou AppContent
import { CommandPalette } from "./components/common/CommandPalette";

function AppContent() {
  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Adicionar antes do conteúdo principal */}
      <CommandPalette onNavigate={navigate} />
      
      {/* Resto da aplicação */}
    </>
  );
}
```

**Atalhos disponíveis:**
- `⌘K` / `Ctrl+K` - Abrir command palette
- `n` - Nova reserva
- `g d` - Ir para dashboard
- `g j` - Ir para jogos
- `g t` - Ir para times
- `p` - Perfil

---

### 2. Smart Empty States

**Status:** ✅ Implementado  
**Arquivo:** `/components/common/SmartEmptyState.tsx`

#### Como usar:

```tsx
import { SmartEmptyState } from "./components/common";

// Em vez de:
{bookings.length === 0 && (
  <p>Nenhuma reserva encontrada</p>
)}

// Use:
{bookings.length === 0 && (
  <SmartEmptyState
    type="no-bookings"
    primaryAction={{
      label: "Fazer Reserva",
      onClick: () => navigate("booking"),
      icon: Calendar,
    }}
  />
)}
```

**Tipos disponíveis:**
- `no-bookings` - Lista de reservas vazia
- `no-results` - Busca sem resultados
- `no-internet` - Sem conexão
- `no-invitations` - Sem convites
- `no-teammates` - Time vazio
- `no-transactions` - Sem transações
- `error` - Erro genérico

---

### 3. Auto-Save Hook

**Status:** ✅ Implementado  
**Arquivo:** `/hooks/useAutoSave.ts`

#### Como usar em formulários:

```tsx
import { useAutoSave } from "../hooks/useAutoSave";

function BookingForm() {
  const [formData, setFormData] = useState({
    court: "",
    date: "",
    time: "",
  });

  const { isSaving, lastSaved } = useAutoSave(
    formData,
    async (data) => {
      // Salvar no localStorage ou API
      localStorage.setItem("booking-draft", JSON.stringify(data));
    },
    { delay: 2000 } // Auto-save após 2s de inatividade
  );

  return (
    <form>
      {/* Campos do formulário */}
      
      {/* Indicador de auto-save */}
      <div className="text-xs text-muted-foreground">
        {isSaving ? (
          <>Salvando rascunho...</>
        ) : lastSaved ? (
          <>Salvo {formatTimeAgo(lastSaved)}</>
        ) : null}
      </div>
    </form>
  );
}
```

---

### 4. Persisted State Hook

**Status:** ✅ Implementado  
**Arquivo:** `/hooks/usePersistedState.ts`

#### Como usar para preferências:

```tsx
import { usePersistedState } from "../hooks/usePersistedState";

function Dashboard() {
  // Estado sincronizado com localStorage
  const [layout, setLayout] = usePersistedState("dashboard-layout", "grid");
  const [collapsed, setCollapsed] = usePersistedState("sidebar-collapsed", false);

  return (
    <div>
      <button onClick={() => setLayout(layout === "grid" ? "list" : "grid")}>
        Alternar Layout
      </button>
      {/* Layout persiste entre reloads */}
    </div>
  );
}
```

---

### 5. Focus Trap Hook

**Status:** ✅ Implementado  
**Arquivo:** `/hooks/useFocusTrap.ts`

#### Como usar em modais:

```tsx
import { useFocusTrap } from "../hooks/useFocusTrap";

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Trap focus enquanto modal estiver aberto
  useFocusTrap(modalRef, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent ref={modalRef}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

---

### 6. URL Search Params Hook

**Status:** ✅ Implementado  
**Arquivo:** `/hooks/useSearchParams.ts`

#### Como usar para estado na URL:

```tsx
import { useSearchParams } from "../hooks/useSearchParams";

function ClientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const handleTabChange = (tab: string) => {
    // Atualiza URL: /dashboard?tab=jogos
    setSearchParams({ tab });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      {/* Agora pode compartilhar URL com tab específica */}
    </Tabs>
  );
}
```

---

## 🎨 Padrões de UX Recomendados

### 1. Skeleton Screens

Use os componentes de skeleton já existentes:

```tsx
import { GameCardSkeleton, CourtCardSkeleton } from "./components/common";

{isLoading ? (
  <GameCardSkeleton />
) : (
  <GameCard data={game} />
)}
```

Para criar novos skeletons:

```tsx
import { Skeleton } from "./components/ui/skeleton";

function BookingCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
    </Card>
  );
}
```

---

### 2. Optimistic UI

Padrão para ações instantâneas:

```tsx
const handleCancelBooking = async (id: number) => {
  // 1. Atualizar UI imediatamente
  setBookings(prev => 
    prev.map(b => b.id === id ? { ...b, status: "canceling" } : b)
  );
  
  // 2. Feedback visual
  toast.loading("Cancelando...", { id });
  
  try {
    // 3. Request real
    await cancelBooking(id);
    
    // 4. Confirmar sucesso
    setBookings(prev => prev.filter(b => b.id !== id));
    toast.success("Cancelado!", { id });
  } catch {
    // 5. Reverter em caso de erro
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, status: "confirmed" } : b)
    );
    toast.error("Erro ao cancelar", { id });
  }
};
```

---

### 3. Toast com Undo

```tsx
import { toast } from "sonner@2.0.3";

const handleDelete = (item: Booking) => {
  // Remover otimisticamente
  setBookings(prev => prev.filter(b => b.id !== item.id));
  
  // Toast com undo
  toast.success("Reserva cancelada", {
    description: `${item.court} - ${item.date}`,
    action: {
      label: "Desfazer",
      onClick: () => {
        setBookings(prev => [...prev, item]);
        toast.success("Cancelamento desfeito");
      },
    },
    duration: 5000,
  });
};
```

---

### 4. Loading States com Feedback

```tsx
function SubmitButton({ isLoading, children }) {
  return (
    <Button disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
```

---

### 5. Error Recovery

```tsx
import { AlertCircle } from "lucide-react";

function ErrorWithRetry({ error, onRetry }) {
  return (
    <Card className="border-destructive">
      <CardContent className="pt-6 text-center">
        <AlertCircle className="h-10 w-10 mx-auto mb-4 text-destructive" />
        <h3 className="font-semibold mb-2">Algo deu errado</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || "Ocorreu um erro ao carregar os dados"}
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={onRetry}>
            Tentar Novamente
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📱 Mobile-First Patterns

### 1. Touch-Friendly Buttons

```tsx
// Mínimo de 44x44px
<Button 
  size="lg" 
  className="min-h-[44px] min-w-[44px] touch-manipulation"
>
  Confirmar
</Button>
```

### 2. Bottom Sheet para Mobile

```tsx
import { Sheet, SheetContent } from "./components/ui/sheet";
import { useIsMobile } from "./components/ui/use-mobile";

function ResponsiveModal({ children, ...props }) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <Sheet {...props}>
        <SheetContent side="bottom" className="h-[90vh]">
          {children}
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog {...props}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
```

### 3. Input com Teclado Adequado

```tsx
// Telefone
<Input 
  type="tel" 
  inputMode="numeric" 
  pattern="[0-9]*"
/>

// Email
<Input 
  type="email" 
  inputMode="email"
  autoComplete="email"
/>

// Busca
<Input 
  type="search" 
  inputMode="search"
/>
```

---

## ♿ Acessibilidade

### 1. Live Regions

```tsx
function LiveAnnouncer({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Uso
const [announcement, setAnnouncement] = useState("");

const handleBookingCreated = () => {
  setAnnouncement("Nova reserva criada com sucesso");
  setTimeout(() => setAnnouncement(""), 3000);
};
```

### 2. Keyboard Shortcuts Panel

```tsx
import { useEffect, useState } from "react";

function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "?" && e.shiftKey) {
        setIsOpen(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atalhos de Teclado</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Busca Global</span>
            <kbd className="px-2 py-1 rounded bg-muted">⌘K</kbd>
          </div>
          {/* Mais atalhos */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎯 Checklist de Implementação Imediata

### Crítico (Fazer Agora)

- [ ] Adicionar `CommandPalette` no App.tsx
- [ ] Substituir empty states genéricos por `SmartEmptyState`
- [ ] Adicionar `useAutoSave` em formulários longos
- [ ] Implementar optimistic UI em ações principais
- [ ] Aumentar touch targets para 44px mínimo

### Alto (Esta Semana)

- [ ] Adicionar URL state em tabs com `useSearchParams`
- [ ] Implementar focus trap em modais com `useFocusTrap`
- [ ] Adicionar skeleton screens em listas
- [ ] Criar toast com undo para ações destrutivas
- [ ] Adicionar error recovery em requests

### Médio (Próxima Sprint)

- [ ] Implementar data caching com SWR
- [ ] Adicionar prefetch de dados
- [ ] Criar onboarding tour para novos usuários
- [ ] Implementar keyboard shortcuts panel
- [ ] Adicionar responsive modals (bottom sheet mobile)

---

## 📊 Como Medir Sucesso

### Métricas para Acompanhar

```tsx
// Analytics helper
const trackAction = (action: string, metadata?: object) => {
  // Google Analytics, Mixpanel, etc.
  console.log("Action:", action, metadata);
};

// Uso
const handleQuickAction = (actionId: string) => {
  trackAction("quick_action_clicked", { 
    actionId,
    source: "dashboard",
    timestamp: new Date() 
  });
  
  // Executar ação
};
```

### KPIs Recomendados

- **Time to First Action**: Tempo até primeira interação
- **Task Completion Rate**: % de fluxos completados
- **Error Rate**: % de erros encontrados
- **Keyboard Shortcut Usage**: % de usuários usando atalhos
- **Command Palette Usage**: Frequência de uso do ⌘K

---

## 🛠️ Troubleshooting

### Problema: Command Palette não abre

**Solução:**
```tsx
// Verificar se não há conflito com outros event listeners
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    console.log("Key pressed:", e.key, e.metaKey, e.ctrlKey);
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

### Problema: Auto-save muito frequente

**Solução:**
```tsx
// Aumentar delay
const { isSaving } = useAutoSave(data, saveFunc, { 
  delay: 5000 // 5 segundos em vez de 2
});
```

### Problema: Focus trap não funciona

**Solução:**
```tsx
// Garantir que ref está sendo passado corretamente
const modalRef = useRef<HTMLDivElement>(null);

return (
  <DialogContent ref={modalRef}>
    {/* Conteúdo */}
  </DialogContent>
);
```

---

## 📚 Recursos Adicionais

### Documentação

- [Auditoria Completa de UX](/docs/UX_AUDIT_RECOMMENDATIONS.md)
- [Guia de Acessibilidade](/ACCESSIBILITY_GUIDE.md)
- [Guia de Animações](/ANIMATIONS_GUIDE.md)
- [Guia de Performance](/PERFORMANCE_GUIDE.md)

### Inspiração

- [Vercel Design](https://vercel.com/design)
- [Linear](https://linear.app)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Notion](https://notion.so)

---

## 💬 Próximos Passos

1. **Implementar Critical Fixes** (1-2 dias)
   - Command Palette
   - Smart Empty States
   - Auto-save em formulários

2. **UX Enhancements** (3-5 dias)
   - URL state management
   - Focus trap
   - Optimistic UI

3. **Performance** (1 semana)
   - Data caching
   - Prefetch
   - Virtualização

4. **Advanced Features** (2 semanas)
   - Onboarding tour
   - Keyboard shortcuts panel
   - Dashboard customization

---

**Lembre-se:** Implemente de forma incremental. Pequenas melhorias consistentes > grandes mudanças de uma vez.

*Documento atualizado: 14/10/2025*
