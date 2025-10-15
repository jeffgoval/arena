# 🔍 Exemplos Práticos - Busca e Filtros

Exemplos reais de implementação do sistema de busca e filtros no Arena Dona Santa.

---

## 📋 Exemplo 1: Dashboard de Reservas com Busca e Filtros

```tsx
import { useState } from 'react';
import {
  GlobalSearchBar,
  SmartFilters,
  OptimizedList,
} from './components/common';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { useSmartFilters, useCommonFilters } from './hooks/useSmartFilters';
import { useOptimizedData } from './hooks/useOptimizedData';

function BookingsDashboard() {
  // Fetch bookings
  const { data: bookings = [], isLoading } = useOptimizedData('/api/bookings');

  // Global search
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
  } = useGlobalSearch();

  // Filters
  const { statusFilter, courtFilter, timeOfDayFilter } = useCommonFilters();
  const {
    activeFilters,
    hasActiveFilters,
    clearFilters,
  } = useSmartFilters([statusFilter, courtFilter, timeOfDayFilter], {
    persistKey: 'bookings-filters',
  });

  // Apply search and filters
  const filteredBookings = bookings
    .filter(booking => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          booking.courtName.toLowerCase().includes(searchLower) ||
          booking.customerName.toLowerCase().includes(searchLower) ||
          booking.status.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(booking => {
      // Active filters
      if (!hasActiveFilters) return true;

      return activeFilters.every(filter => {
        switch (filter.filterId) {
          case 'status':
            return Array.isArray(filter.value)
              ? filter.value.includes(booking.status)
              : filter.value === booking.status;
          
          case 'court':
            return Array.isArray(filter.value)
              ? filter.value.includes(booking.courtId)
              : filter.value === booking.courtId;
          
          case 'timeOfDay':
            const hour = new Date(booking.startTime).getHours();
            if (filter.value.includes('morning')) return hour >= 6 && hour < 12;
            if (filter.value.includes('afternoon')) return hour >= 12 && hour < 18;
            if (filter.value.includes('evening')) return hour >= 18 && hour <= 23;
            return true;
          
          default:
            return true;
        }
      });
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>Reservas</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredBookings.length} de {bookings.length} reservas
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por quadra, cliente, status..."
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      {/* Filters */}
      <SmartFilters
        configs={[statusFilter, courtFilter, timeOfDayFilter]}
        persistKey="bookings-filters"
        showSavedFilters
      />

      {/* Results */}
      <OptimizedList
        items={filteredBookings}
        renderItem={(booking) => (
          <BookingCard booking={booking} />
        )}
        getItemKey={(booking) => booking.id}
        loading={isLoading}
        emptyMessage="Nenhuma reserva encontrada"
      />
    </div>
  );
}
```

---

## 🏟️ Exemplo 2: Busca Global no Header

```tsx
import { GlobalSearchBar } from './components/common';
import { useHashRouter } from './hooks/useHashRouter';
import { SearchResult } from './hooks/useGlobalSearch';

function AppHeader() {
  const { navigate } = useHashRouter();

  const handleResultClick = (result: SearchResult) => {
    // Handle navigation based on result type
    switch (result.type) {
      case 'booking':
        navigate('/meus-jogos');
        // Optionally scroll to specific booking
        setTimeout(() => {
          document.getElementById(result.id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
        break;

      case 'court':
        navigate(`/reservar?court=${result.id}`);
        break;

      case 'user':
        if (result.metadata?.role === 'client') {
          navigate(`/perfil/${result.id}`);
        } else {
          // Open user details modal
          openUserModal(result.id);
        }
        break;

      case 'team':
        navigate(`/turmas?team=${result.id}`);
        break;

      case 'transaction':
        navigate(`/transacoes?id=${result.id}`);
        break;

      case 'page':
        navigate(result.url || '/');
        break;

      default:
        console.warn('Unknown result type:', result.type);
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">
              Arena Dona Santa
            </h1>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-2xl">
            <GlobalSearchBar
              placeholder="Buscar reservas, quadras, usuários... (⌘K)"
              onResultClick={handleResultClick}
              showShortcut
            />
          </div>

          {/* User Menu */}
          <div className="flex-shrink-0">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 💰 Exemplo 3: Histórico de Transações com Filtros Avançados

```tsx
import { useState, useMemo } from 'react';
import {
  SmartFilters,
  OptimizedList,
  CardSkeleton,
} from './components/common';
import { useSmartFilters } from './hooks/useSmartFilters';
import { useOptimizedData } from './hooks/useOptimizedData';
import { FilterConfig } from './hooks/useSmartFilters';

function TransactionHistory() {
  // Fetch transactions
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useOptimizedData('/api/transactions');

  // Filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: 'paymentStatus',
      label: 'Status Pagamento',
      type: 'multiselect',
      options: [
        { id: 'paid', label: 'Pago', value: 'paid', count: 45 },
        { id: 'pending', label: 'Pendente', value: 'pending', count: 12 },
        { id: 'cancelled', label: 'Cancelado', value: 'cancelled', count: 5 },
      ],
    },
    {
      id: 'paymentMethod',
      label: 'Método de Pagamento',
      type: 'multiselect',
      options: [
        { id: 'pix', label: 'PIX', value: 'pix' },
        { id: 'credit', label: 'Cartão de Crédito', value: 'credit' },
        { id: 'debit', label: 'Cartão de Débito', value: 'debit' },
        { id: 'cash', label: 'Dinheiro', value: 'cash' },
      ],
    },
    {
      id: 'amount',
      label: 'Valor',
      type: 'range',
      min: 0,
      max: 1000,
    },
    {
      id: 'type',
      label: 'Tipo',
      type: 'multiselect',
      options: [
        { id: 'booking', label: 'Reserva', value: 'booking' },
        { id: 'subscription', label: 'Assinatura', value: 'subscription' },
        { id: 'credit', label: 'Crédito', value: 'credit' },
      ],
    },
  ];

  const {
    activeFilters,
    hasActiveFilters,
    activeCount,
    clearFilters,
  } = useSmartFilters(filterConfigs, {
    persistKey: 'transaction-filters',
  });

  // Apply filters
  const filteredTransactions = useMemo(() => {
    if (!hasActiveFilters) return transactions;

    return transactions.filter(transaction => {
      return activeFilters.every(filter => {
        switch (filter.filterId) {
          case 'paymentStatus':
            return Array.isArray(filter.value)
              ? filter.value.includes(transaction.status)
              : transaction.status === filter.value;

          case 'paymentMethod':
            return Array.isArray(filter.value)
              ? filter.value.includes(transaction.paymentMethod)
              : transaction.paymentMethod === filter.value;

          case 'amount':
            const [min, max] = filter.value;
            return transaction.amount >= min && transaction.amount <= max;

          case 'type':
            return Array.isArray(filter.value)
              ? filter.value.includes(transaction.type)
              : transaction.type === filter.value;

          default:
            return true;
        }
      });
    });
  }, [transactions, activeFilters, hasActiveFilters]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.status === 'paid') {
          acc.paid += t.amount;
        } else if (t.status === 'pending') {
          acc.pending += t.amount;
        }
        acc.total += t.amount;
        return acc;
      },
      { paid: 0, pending: 0, total: 0 }
    );
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">
            R$ {totals.total.toFixed(2)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pago</p>
          <p className="text-2xl font-bold text-success">
            R$ {totals.paid.toFixed(2)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pendente</p>
          <p className="text-2xl font-bold text-warning">
            R$ {totals.pending.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-4">
        <SmartFilters
          configs={filterConfigs}
          persistKey="transaction-filters"
          showSavedFilters
        />

        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} de {transactions.length} transações
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Limpar {activeCount} filtro{activeCount > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Erro ao carregar transações</p>
        </div>
      ) : (
        <OptimizedList
          items={filteredTransactions}
          renderItem={(transaction) => (
            <TransactionCard transaction={transaction} />
          )}
          getItemKey={(transaction) => transaction.id}
          emptyMessage="Nenhuma transação encontrada"
        />
      )}
    </div>
  );
}
```

---

## 🎯 Exemplo 4: Busca com Typeahead (Autocomplete)

```tsx
import { useTypeahead } from './hooks/useGlobalSearch';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2 } from 'lucide-react';

function CourtSearchWithAutocomplete() {
  const {
    query,
    setQuery,
    results: courts,
    isLoading,
    hasResults,
  } = useTypeahead(
    async (q) => {
      // Fetch from API
      const res = await fetch(`/api/courts/search?q=${q}`);
      return res.json();
    },
    { debounceMs: 300, minQueryLength: 2 }
  );

  const [showResults, setShowResults] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Buscar quadras..."
          className="w-full pl-10 pr-10 py-3 border rounded-lg"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
        )}
      </div>

      <AnimatePresence>
        {showResults && hasResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {courts.map((court) => (
              <button
                key={court.id}
                onMouseDown={() => {
                  // Select court
                  selectCourt(court);
                  setShowResults(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
              >
                <img
                  src={court.imageUrl}
                  alt={court.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{court.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {court.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">
                    R$ {court.pricePerHour}/h
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 📱 Exemplo 5: Filtros Mobile-Friendly

```tsx
import { useState } from 'react';
import { SmartFilters } from './components/common';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { Filter } from 'lucide-react';

function MobileFilterSheet({ configs, onFilterChange }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-4">Filtrar resultados</h2>
          
          <SmartFilters
            configs={configs}
            onFilterChange={(filters) => {
              onFilterChange(filters);
              // Auto-close on mobile after applying filters
              if (window.innerWidth < 768) {
                setOpen(false);
              }
            }}
          />

          <div className="mt-6 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

## 🎯 Checklist de Implementação

Ao adicionar busca e filtros em uma nova página:

- [ ] **Busca**
  - [ ] Implementar campo de busca
  - [ ] Adicionar debounce (300ms)
  - [ ] Definir campos searcháveis
  - [ ] Testar com query vazio
  - [ ] Loading state

- [ ] **Filtros**
  - [ ] Definir FilterConfigs
  - [ ] Implementar lógica de filtro
  - [ ] Adicionar persist key (se necessário)
  - [ ] Clear filters button
  - [ ] Active filter tags

- [ ] **UX**
  - [ ] Empty states
  - [ ] Loading states
  - [ ] Error states
  - [ ] Contadores de resultados
  - [ ] Keyboard shortcuts

- [ ] **Performance**
  - [ ] Memoização de resultados
  - [ ] Virtual scrolling (se > 50 items)
  - [ ] Lazy loading
  - [ ] Debounce configurado

- [ ] **Mobile**
  - [ ] Responsivo
  - [ ] Bottom sheet para filtros
  - [ ] Touch-friendly
  - [ ] Swipe gestures (se aplicável)

---

**Dúvidas?** Consulte `/docs/SEARCH_FILTERS_GUIDE.md`
