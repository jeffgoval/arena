# 🧭 Navegação Avançada - Exemplos Práticos

Exemplos reais de implementação do sistema de navegação avançada no Arena Dona Santa.

---

## 📱 Exemplo 1: App Mobile com Bottom Navigation e Swipe

```tsx
import { useState } from 'react';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import {
  BottomNavigation,
  SwipePageTransition,
  FloatingBackButton,
} from './components/common';
import { Home, Calendar, Users, User, Bell } from 'lucide-react';

export function MobileApp() {
  const [currentPage, setCurrentPage] = useState<'home' | 'games' | 'teams' | 'profile'>('home');
  const [showBackButton, setShowBackButton] = useState(false);

  // Enable swipe navigation
  useSwipeNavigation(undefined, {
    enabled: true,
    threshold: 50,
    velocityThreshold: 0.3,
  });

  const bottomNavItems = [
    {
      label: 'Início',
      page: 'home' as const,
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'Jogos',
      page: 'games' as const,
      icon: <Calendar className="w-5 h-5" />,
      badge: 3, // Pending bookings
    },
    {
      label: 'Turmas',
      page: 'teams' as const,
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Perfil',
      page: 'profile' as const,
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Floating Back Button (show on detail pages) */}
      <FloatingBackButton
        show={showBackButton}
        onBack={() => setShowBackButton(false)}
      />

      {/* Page Content with Transitions */}
      <SwipePageTransition pageKey={currentPage} enabled>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'games' && <GamesPage />}
        {currentPage === 'teams' && <TeamsPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </SwipePageTransition>

      {/* Bottom Navigation */}
      <BottomNavigation
        items={bottomNavItems}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  );
}
```

---

## 🔗 Exemplo 2: Deep Linking para Convites de Jogo

```tsx
import { useDeepLink } from './hooks/useURLState';
import { useEffect, useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface InviteData {
  inviteId: string;
  gameId: string;
  hostName: string;
  courtName: string;
  date: string;
  time: string;
}

export function GameInvitePage() {
  const {
    deepLinkData,
    createDeepLink,
    hasDeepLink,
  } = useDeepLink<InviteData>();

  const [inviteDetails, setInviteDetails] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load invite details from deep link
  useEffect(() => {
    if (hasDeepLink && deepLinkData) {
      loadInviteDetails(deepLinkData.inviteId)
        .then(setInviteDetails)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [hasDeepLink, deepLinkData]);

  const handleAcceptInvite = async () => {
    if (!inviteDetails) return;

    try {
      await acceptInvite(inviteDetails.inviteId);
      toast.success('Convite aceito!');
      navigate('/meus-jogos');
    } catch (error) {
      toast.error('Erro ao aceitar convite');
    }
  };

  const handleShareInvite = () => {
    if (!inviteDetails) return;

    const link = createDeepLink({
      inviteId: inviteDetails.inviteId,
      gameId: inviteDetails.gameId,
      hostName: inviteDetails.hostName,
      courtName: inviteDetails.courtName,
      date: inviteDetails.date,
      time: inviteDetails.time,
    });

    // Share via Web Share API or copy
    if (navigator.share) {
      navigator.share({
        title: 'Convite para Jogo',
        text: `${inviteDetails.hostName} te convidou para jogar!`,
        url: link,
      });
    } else {
      navigator.clipboard.writeText(link);
      toast.success('Link copiado!');
    }
  };

  if (loading) {
    return <div>Carregando convite...</div>;
  }

  if (!hasDeepLink || !inviteDetails) {
    return <div>Convite inválido ou expirado</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Convite para Jogo</h1>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Anfitrião</p>
            <p className="font-medium">{inviteDetails.hostName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Quadra</p>
            <p className="font-medium">{inviteDetails.courtName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">
                {new Date(inviteDetails.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium">{inviteDetails.time}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleAcceptInvite} className="flex-1">
            Aceitar Convite
          </Button>
          <Button
            variant="outline"
            onClick={handleShareInvite}
            className="flex-1"
          >
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Deep Link Example */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">Link do Convite:</p>
        <code className="text-xs break-all">
          {createDeepLink(inviteDetails)}
        </code>
      </div>
    </div>
  );
}
```

---

## 🔍 Exemplo 3: Busca com URL State e Filtros

```tsx
import { useURLParams } from './hooks/useURLState';
import { useDebounce } from './hooks/useDebounce';
import { SmartFilters } from './components/common';
import { useEffect, useState } from 'react';

export function BookingsSearchPage() {
  const {
    params,
    setParam,
    setParams,
    clearAll,
  } = useURLParams({
    search: '',
    status: 'all',
    court: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    page: 1,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(params.search, 300);

  // Fetch results when params change
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(
          `/api/bookings/search?${new URLSearchParams({
            q: debouncedSearch,
            status: params.status,
            court: params.court,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            sortBy: params.sortBy,
            page: String(params.page),
          })}`
        );

        const data = await response.json();
        setResults(data.results);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [
    debouncedSearch,
    params.status,
    params.court,
    params.dateFrom,
    params.dateTo,
    params.sortBy,
    params.page,
  ]);

  const handleShareSearch = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link da busca copiado!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Buscar Reservas</h1>
        <p className="text-muted-foreground">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-4">
        <Input
          type="search"
          placeholder="Buscar por quadra, data, cliente..."
          value={params.search}
          onChange={(e) => setParam('search', e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" onClick={handleShareSearch}>
          <Share className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      {/* Filters */}
      <SmartFilters
        configs={[
          {
            id: 'status',
            label: 'Status',
            type: 'multiselect',
            options: [
              { id: 'pending', label: 'Pendente', value: 'pending' },
              { id: 'confirmed', label: 'Confirmada', value: 'confirmed' },
              { id: 'cancelled', label: 'Cancelada', value: 'cancelled' },
            ],
          },
          {
            id: 'court',
            label: 'Quadra',
            type: 'select',
            options: [
              { id: '1', label: 'Quadra Society', value: '1' },
              { id: '2', label: 'Quadra Arena', value: '2' },
            ],
          },
        ]}
        onFilterChange={(filters) => {
          const updates: any = {};
          filters.forEach(filter => {
            updates[filter.filterId] = filter.value;
          });
          setParams(updates);
        }}
      />

      {/* Sort */}
      <div className="flex items-center gap-2">
        <Label>Ordenar por:</Label>
        <Select
          value={params.sortBy}
          onValueChange={(value) => setParam('sortBy', value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Data</SelectItem>
            <SelectItem value="price">Preço</SelectItem>
            <SelectItem value="court">Quadra</SelectItem>
          </SelectContent>
        </Select>

        {params.search || params.status !== 'all' || params.court ? (
          <Button variant="ghost" onClick={clearAll}>
            Limpar Filtros
          </Button>
        ) : null}
      </div>

      {/* Results */}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <BookingCard key={result.id} booking={result} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          disabled={params.page === 1}
          onClick={() => setParam('page', params.page - 1)}
        >
          Anterior
        </Button>
        <span className="px-4 py-2">Página {params.page}</span>
        <Button
          variant="outline"
          onClick={() => setParam('page', params.page + 1)}
        >
          Próxima
        </Button>
      </div>

      {/* URL Preview */}
      <div className="p-4 bg-muted rounded text-xs">
        <p className="font-medium mb-1">URL atual:</p>
        <code className="break-all">{window.location.href}</code>
      </div>
    </div>
  );
}
```

---

## 📚 Exemplo 4: Navegação com Breadcrumbs e Histórico

```tsx
import { useNavigationHistory, useBreadcrumbs } from './hooks/useNavigationHistory';
import { BackButton, Breadcrumbs } from './components/common';
import { useEffect } from 'react';

export function BookingDetailsPage({ bookingId }: { bookingId: string }) {
  const {
    pushHistory,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    getRecentHistory,
  } = useNavigationHistory({
    persistKey: 'booking-navigation',
    trackScrollPosition: true,
  });

  const { breadcrumbs, addBreadcrumb } = useBreadcrumbs();

  useEffect(() => {
    // Add to navigation history
    pushHistory({
      page: 'booking-details',
      title: `Reserva #${bookingId}`,
      params: { id: bookingId },
    });

    // Update breadcrumbs
    addBreadcrumb('Detalhes da Reserva', 'booking-details', {
      id: bookingId,
    });
  }, [bookingId]);

  const recentPages = getRecentHistory(5);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              disabled={!canGoBack}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goForward}
              disabled={!canGoForward}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Recent History Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Histórico
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Páginas Recentes</h4>
              {recentPages.map((entry, index) => (
                <button
                  key={index}
                  onClick={() => navigate(entry.page, entry.params)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-sm"
                >
                  {entry.title || entry.page}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={breadcrumbs}
        onNavigate={(page, params) => navigate(page, params)}
        maxItems={5}
      />

      {/* Page Content */}
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          Reserva #{bookingId}
        </h1>
        
        {/* Booking details... */}
      </div>
    </div>
  );
}
```

---

## 🎯 Exemplo 5: Multi-Step Form com URL State

```tsx
import { useURLParams } from './hooks/useURLState';
import { BackButton } from './components/common';

export function BookingFormWithURLState() {
  const { params, setParam, clearAll } = useURLParams({
    step: '1',
    courtId: '',
    date: '',
    time: '',
    duration: '60',
    paymentMethod: '',
  });

  const currentStep = parseInt(params.step);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setParam('step', String(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setParam('step', String(currentStep - 1));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return params.courtId !== '';
      case 2:
        return params.date !== '' && params.time !== '';
      case 3:
        return params.duration !== '';
      case 4:
        return params.paymentMethod !== '';
      default:
        return false;
    }
  };

  // User can share the form at any step
  const handleShareProgress = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado! Continue de onde parou.');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BackButton
            onBack={currentStep > 1 ? handleBack : undefined}
          />
          <h1 className="text-2xl font-bold">Nova Reserva</h1>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleShareProgress}>
          <Share className="w-4 h-4 mr-2" />
          Salvar Progresso
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Passo {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} />
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <CourtSelection
            value={params.courtId}
            onChange={(value) => setParam('courtId', value)}
          />
        )}

        {currentStep === 2 && (
          <DateTimeSelection
            date={params.date}
            time={params.time}
            onDateChange={(value) => setParam('date', value)}
            onTimeChange={(value) => setParam('time', value)}
          />
        )}

        {currentStep === 3 && (
          <DurationSelection
            value={params.duration}
            onChange={(value) => setParam('duration', value)}
          />
        )}

        {currentStep === 4 && (
          <PaymentMethodSelection
            value={params.paymentMethod}
            onChange={(value) => setParam('paymentMethod', value)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            Voltar
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1"
        >
          {currentStep === totalSteps ? 'Finalizar' : 'Continuar'}
        </Button>
      </div>

      {/* URL State Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-muted rounded text-xs">
          <p className="font-medium mb-2">URL State:</p>
          <pre>{JSON.stringify(params, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 Exemplo 6: Scroll Restoration

```tsx
import { useScrollRestoration } from './hooks/useNavigationHistory';
import { useEffect, useRef } from 'react';

export function InfiniteScrollList() {
  const listRef = useRef<HTMLDivElement>(null);
  const {
    saveScrollPosition,
    restoreScrollPosition,
  } = useScrollRestoration();

  const pageKey = 'infinite-scroll-list';

  // Restore scroll on mount
  useEffect(() => {
    restoreScrollPosition(pageKey, 'auto');
  }, []);

  // Save scroll on unmount or when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(pageKey);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      saveScrollPosition(pageKey);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Also save scroll periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveScrollPosition(pageKey);
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={listRef} className="space-y-4">
      {/* Long list of items */}
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

**Dúvidas?** Consulte `/docs/NAVIGATION_ADVANCED_GUIDE.md`
