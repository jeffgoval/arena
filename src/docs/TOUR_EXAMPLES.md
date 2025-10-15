# 🎓 Tour e Tooltips - Exemplos de Implementação

Exemplos práticos de como implementar tours e tooltips no Arena Dona Santa.

---

## 📱 Exemplo 1: Tour Completo do Cliente

```tsx
import { Tour, FeatureHighlight } from './components/common';
import { useAuth } from './contexts/AuthContext';

export function ClientDashboardWithTour() {
  const { user } = useAuth();

  // Check if user is new (created in last 24h)
  const isNewUser = user?.createdAt && 
    Date.now() - new Date(user.createdAt).getTime() < 24 * 60 * 60 * 1000;

  const clientTour = [
    {
      id: 'welcome',
      target: '#dashboard-header',
      title: `Bem-vindo, ${user?.name}!`,
      content: 'Seja bem-vindo ao Arena Dona Santa. Vamos fazer um tour rápido?',
      placement: 'bottom' as const,
    },
    {
      id: 'create-booking',
      target: '#create-booking-btn',
      title: 'Reserve sua Quadra',
      content: 'Clique aqui para ver os horários disponíveis e fazer sua reserva.',
      placement: 'bottom' as const,
      action: {
        label: 'Ver Horários',
        onClick: () => navigate('/reservar'),
      },
    },
    {
      id: 'upcoming-games',
      target: '#upcoming-games-section',
      title: 'Seus Próximos Jogos',
      content: 'Aqui você acompanha todas as suas reservas e pode convidar amigos.',
      placement: 'top' as const,
    },
    {
      id: 'invite-friends',
      target: '#invite-button',
      title: 'Convide Amigos',
      content: 'Mande convites por WhatsApp e monte sua equipe!',
      placement: 'left' as const,
    },
    {
      id: 'credits',
      target: '#credits-display',
      title: 'Seus Créditos',
      content: 'Gerencie seu saldo e veja o histórico de transações.',
      placement: 'right' as const,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Tour Component */}
      <Tour
        id="client-dashboard-tour-v1"
        steps={clientTour}
        autoStart={isNewUser}
        onComplete={() => {
          toast.success('Tour concluído! Você está pronto para começar.');
        }}
        onSkip={() => {
          // Track analytics
          analytics.track('tour_skipped', { tourId: 'client-dashboard' });
        }}
      />

      {/* Dashboard Header */}
      <div id="dashboard-header" className="mb-8">
        <h1>Meu Dashboard</h1>
        <p className="text-muted-foreground">
          Olá, {user?.name}! Bem-vindo de volta.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Create Booking */}
        <button
          id="create-booking-btn"
          className="p-6 border rounded-lg hover:bg-muted"
        >
          <Calendar className="w-8 h-8 mb-2" />
          <h3>Reservar Quadra</h3>
        </button>

        {/* My Teams - With Feature Highlight */}
        <FeatureHighlight
          id="teams-feature-highlight"
          title="Turmas Fixas"
          description="Crie turmas e reserve automaticamente para seu grupo toda semana!"
          badge="Novo"
        >
          <button className="p-6 border rounded-lg hover:bg-muted">
            <Users className="w-8 h-8 mb-2" />
            <h3>Minhas Turmas</h3>
          </button>
        </FeatureHighlight>

        {/* Referral */}
        <button className="p-6 border rounded-lg hover:bg-muted">
          <Gift className="w-8 h-8 mb-2" />
          <h3>Indicar Amigos</h3>
        </button>
      </div>

      {/* Upcoming Games */}
      <div id="upcoming-games-section" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2>Próximos Jogos</h2>
          <button id="invite-button" className="btn-primary">
            Convidar Amigos
          </button>
        </div>
        <UpcomingGamesList />
      </div>

      {/* Credits */}
      <div id="credits-display">
        <CreditsCard />
      </div>
    </div>
  );
}
```

---

## 🏢 Exemplo 2: Tour do Gestor

```tsx
import { Tour, TourTrigger } from './components/common';

export function ManagerDashboardWithTour() {
  const managerTour = [
    {
      id: 'overview',
      target: '#kpi-cards',
      title: 'Visão Geral',
      content: 'Acompanhe as principais métricas do seu negócio em tempo real.',
      placement: 'bottom' as const,
    },
    {
      id: 'calendar',
      target: '#schedule-calendar',
      title: 'Agenda de Reservas',
      content: 'Gerencie todas as reservas em um calendário visual e intuitivo.',
      placement: 'top' as const,
    },
    {
      id: 'quick-booking',
      target: '#quick-booking-btn',
      title: 'Reserva Rápida',
      content: 'Crie novas reservas rapidamente para clientes presenciais.',
      placement: 'bottom' as const,
      action: {
        label: 'Experimentar',
        onClick: () => setShowQuickBookingModal(true),
      },
    },
    {
      id: 'clients',
      target: '#clients-tab',
      title: 'Gestão de Clientes',
      content: 'Gerencie cadastros, créditos e histórico de todos os clientes.',
      placement: 'right' as const,
    },
    {
      id: 'reports',
      target: '#reports-section',
      title: 'Relatórios Avançados',
      content: 'Gere relatórios detalhados de ocupação, receita e performance.',
      placement: 'left' as const,
    },
  ];

  return (
    <div className="p-6">
      {/* Manual Tour Trigger */}
      <div className="flex justify-between items-center mb-6">
        <h1>Dashboard do Gestor</h1>
        <TourTrigger
          tourId="manager-dashboard-tour"
          steps={managerTour}
          className="btn-outline"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Tour do Sistema
        </TourTrigger>
      </div>

      {/* Tour (manual start) */}
      <Tour
        id="manager-dashboard-tour"
        steps={managerTour}
        autoStart={false}
      />

      {/* KPIs */}
      <div id="kpi-cards" className="grid grid-cols-4 gap-4 mb-8">
        <KPICard title="Ocupação Hoje" value="85%" />
        <KPICard title="Receita Mês" value="R$ 45.200" />
        <KPICard title="Reservas Hoje" value="24" />
        <KPICard title="Novos Clientes" value="8" />
      </div>

      {/* Calendar */}
      <div id="schedule-calendar" className="mb-8">
        <ScheduleCalendar />
      </div>

      {/* Quick Booking */}
      <button id="quick-booking-btn" className="btn-primary mb-8">
        Nova Reserva Rápida
      </button>

      {/* Tabs */}
      <Tabs>
        <TabsList>
          <TabsTrigger id="clients-tab">Clientes</TabsTrigger>
          <TabsTrigger>Quadras</TabsTrigger>
          <TabsTrigger>Configurações</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Reports */}
      <div id="reports-section" className="mt-8">
        <ReportsSection />
      </div>
    </div>
  );
}
```

---

## 💡 Exemplo 3: Tooltips Contextuais em Formulário

```tsx
import { InlineHelp, ContextualTooltip } from './components/common';

export function BookingFormWithTooltips() {
  return (
    <form className="space-y-6">
      {/* Court Selection with Inline Help */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          Quadra
          <InlineHelp
            id="court-selection-help"
            content="Cada quadra tem características diferentes. Veja os detalhes clicando em 'Ver Mais'."
          />
        </label>
        <CourtSelector />
      </div>

      {/* Date/Time with Contextual Tooltip */}
      <div>
        <label className="mb-2">Data e Horário</label>
        <ContextualTooltip
          id="peak-hours-tip"
          content="💡 Dica: Horários após 18h costumam ter maior demanda. Reserve com antecedência!"
          placement="right"
          showOnce={true}
          trigger="auto"
        >
          <DateTimePicker />
        </ContextualTooltip>
      </div>

      {/* Duration */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          Duração
          <InlineHelp
            id="duration-help"
            content="Você pode estender a reserva depois se houver disponibilidade."
          />
        </label>
        <select>
          <option>1 hora</option>
          <option>1h30</option>
          <option>2 horas</option>
        </select>
      </div>

      {/* Recurring Booking - New Feature */}
      <ContextualTooltip
        id="recurring-booking-feature"
        content="🎉 Novo! Crie reservas recorrentes e jogue no mesmo horário toda semana!"
        placement="top"
        showOnce={true}
        trigger="auto"
      >
        <div>
          <label className="mb-2">Tipo de Reserva</label>
          <select>
            <option>Avulsa</option>
            <option value="recurring">
              Recorrente (Semanal) ✨
            </option>
          </select>
        </div>
      </ContextualTooltip>

      {/* Payment Method */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          Forma de Pagamento
          <InlineHelp
            id="payment-help"
            content="PIX tem confirmação instantânea. Cartão de crédito pode levar até 2 dias úteis."
          />
        </label>
        <PaymentMethodSelector />
      </div>

      <button type="submit">Confirmar Reserva</button>
    </form>
  );
}
```

---

## 🎁 Exemplo 4: Feature Highlights

```tsx
import { FeatureHighlight } from './components/common';

export function FeaturesShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Regular Card */}
      <Card>
        <CardTitle>Criar Reserva</CardTitle>
        <CardContent>Reserve sua quadra</CardContent>
      </Card>

      {/* New Feature: Split Payment */}
      <FeatureHighlight
        id="split-payment-dec-2024"
        title="Dividir Pagamento"
        description="Agora você pode dividir o valor da reserva com seus amigos direto no app! Cada um paga sua parte."
        badge="Novo"
      >
        <Card className="border-primary cursor-pointer hover:bg-muted">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Dividir Pagamento
          </CardTitle>
          <CardContent>
            Divida com amigos
          </CardContent>
        </Card>
      </FeatureHighlight>

      {/* New Feature: Referral */}
      <FeatureHighlight
        id="referral-program-nov-2024"
        title="Programa de Indicação"
        description="Indique amigos e ganhe R$ 20 de crédito para cada indicação confirmada!"
        badge="🎁"
      >
        <Card className="border-success cursor-pointer hover:bg-muted">
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Indicar e Ganhar
          </CardTitle>
          <CardContent>
            R$ 20 por indicação
          </CardContent>
        </Card>
      </FeatureHighlight>
    </div>
  );
}
```

---

## 🔄 Exemplo 5: Tour Multi-Step (Fluxo de Reserva)

```tsx
import { Tour } from './components/common';
import { useState } from 'react';

export function BookingFlowWithTour() {
  const [currentStep, setCurrentStep] = useState(1);

  // Adaptar tour baseado no step do fluxo
  const getTourSteps = () => {
    if (currentStep === 1) {
      return [
        {
          id: 'select-court',
          target: '#court-grid',
          title: 'Escolha a Quadra',
          content: 'Veja as características de cada quadra e escolha a que melhor atende.',
          placement: 'top' as const,
        },
        {
          id: 'court-details',
          target: '.court-card:first-child',
          title: 'Detalhes da Quadra',
          content: 'Clique em "Ver Mais" para ver fotos e especificações.',
          placement: 'bottom' as const,
        },
      ];
    } else if (currentStep === 2) {
      return [
        {
          id: 'select-date',
          target: '#date-picker',
          title: 'Escolha a Data',
          content: 'Selecione o dia que deseja jogar.',
          placement: 'left' as const,
        },
        {
          id: 'select-time',
          target: '#time-slots',
          title: 'Horários Disponíveis',
          content: 'Horários em verde estão disponíveis. Clique para selecionar.',
          placement: 'top' as const,
        },
      ];
    } else if (currentStep === 3) {
      return [
        {
          id: 'review',
          target: '#booking-summary',
          title: 'Revise sua Reserva',
          content: 'Confira todos os detalhes antes de confirmar.',
          placement: 'top' as const,
        },
        {
          id: 'payment',
          target: '#payment-section',
          title: 'Pagamento',
          content: 'Escolha como deseja pagar. PIX tem confirmação instantânea!',
          placement: 'right' as const,
        },
      ];
    }
    return [];
  };

  return (
    <>
      {/* Tour específico para cada etapa */}
      <Tour
        id={`booking-flow-step-${currentStep}-tour`}
        steps={getTourSteps()}
        autoStart={false}
      />

      {/* Step 1: Select Court */}
      {currentStep === 1 && (
        <div id="court-grid">
          <CourtGrid />
        </div>
      )}

      {/* Step 2: Select Date/Time */}
      {currentStep === 2 && (
        <>
          <div id="date-picker">
            <DatePicker />
          </div>
          <div id="time-slots">
            <TimeSlotGrid />
          </div>
        </>
      )}

      {/* Step 3: Review & Payment */}
      {currentStep === 3 && (
        <>
          <div id="booking-summary">
            <BookingSummary />
          </div>
          <div id="payment-section">
            <PaymentOptions />
          </div>
        </>
      )}
    </>
  );
}
```

---

## 📊 Exemplo 6: Tooltips para Métricas

```tsx
import { InlineHelp } from './components/common';

export function KPIDashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Occupancy Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Taxa de Ocupação
            <InlineHelp
              id="occupancy-rate-help"
              content="Porcentagem de horários reservados em relação ao total disponível."
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">85%</p>
          <p className="text-sm text-success">↑ 12% vs mês passado</p>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Receita do Mês
            <InlineHelp
              id="revenue-help"
              content="Total de receita confirmada (pagamentos aprovados) no mês atual."
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">R$ 45.200</p>
          <p className="text-sm text-success">↑ R$ 5.400</p>
        </CardContent>
      </Card>

      {/* Average Ticket */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Ticket Médio
            <InlineHelp
              id="avg-ticket-help"
              content="Valor médio gasto por cliente em cada reserva."
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">R$ 188</p>
          <p className="text-sm text-muted-foreground">Estável</p>
        </CardContent>
      </Card>

      {/* Customer Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Retenção
            <InlineHelp
              id="retention-help"
              content="Porcentagem de clientes que fizeram pelo menos 2 reservas."
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">72%</p>
          <p className="text-sm text-success">↑ 8%</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

**Dúvidas?** Consulte `/docs/TOUR_TOOLTIP_GUIDE.md`
