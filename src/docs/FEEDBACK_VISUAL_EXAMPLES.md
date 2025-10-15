# 🎯 Exemplos Práticos de Feedback Visual

Exemplos reais de como usar o sistema de feedback visual no Arena Dona Santa.

---

## 📋 Exemplo 1: Lista de Reservas Completa

```tsx
import { useState } from 'react';
import {
  OptimizedList,
  InteractiveButton,
  SuccessButton,
  HoldButton,
  ListItemSkeleton,
  ContextualLoading,
} from './components/common';
import { useOptimisticList } from './hooks/useOptimisticUI';
import { useOptimizedData } from './hooks/useOptimizedData';
import { Calendar, Trash2, CheckCircle } from 'lucide-react';

function BookingsListOptimized() {
  // Fetch com cache
  const {
    data: initialBookings = [],
    isLoading,
    error,
    refresh,
  } = useOptimizedData('/api/bookings');

  // Optimistic UI
  const {
    list: bookings,
    isOptimistic,
    updateItem,
    removeItem,
  } = useOptimisticList(initialBookings);

  // Loading state com skeleton contextual
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (bookings.length === 0) {
    return (
      <ContextualLoading
        icon={<Calendar className="w-12 h-12 text-primary" />}
        message="Nenhuma reserva encontrada"
        submessage="Suas futuras reservas aparecerão aqui"
      />
    );
  }

  // Confirmar reserva
  const handleConfirm = async (id: string) => {
    await updateItem(
      id,
      { status: 'confirmed', confirmedAt: new Date().toISOString() },
      async () => {
        await fetch(`/api/bookings/${id}/confirm`, { method: 'POST' });
      }
    );
  };

  // Cancelar reserva
  const handleCancel = async (id: string) => {
    await removeItem(id, async () => {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    });
  };

  return (
    <OptimizedList
      items={bookings}
      renderItem={(booking) => (
        <div
          className={cn(
            'p-4 border rounded-lg transition-all',
            isOptimistic && 'opacity-70 pointer-events-none'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{booking.courtName}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.date).toLocaleDateString('pt-BR')} às{' '}
                {booking.time}
              </p>
              <Badge variant={booking.status} className="mt-2">
                {booking.status}
              </Badge>
            </div>

            <div className="flex gap-2">
              {/* Botão de confirmar com success state */}
              {booking.status === 'pending' && (
                <SuccessButton
                  isSuccess={booking.status === 'confirmed'}
                  successText="Confirmada!"
                  onClick={() => handleConfirm(booking.id)}
                  variant="primary"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar
                </SuccessButton>
              )}

              {/* Botão de cancelar com hold protection */}
              <HoldButton
                variant="destructive"
                size="sm"
                holdDuration={1000}
                onHoldComplete={() => handleCancel(booking.id)}
              >
                <Trash2 className="w-4 h-4" />
                Segurar p/ Cancelar
              </HoldButton>
            </div>
          </div>
        </div>
      )}
      getItemKey={(booking) => booking.id}
      loading={isLoading}
      error={error}
      onRetry={refresh}
    />
  );
}
```

---

## 🏟️ Exemplo 2: Formulário de Reserva Multi-Step

```tsx
import { useState } from 'react';
import {
  StepProgress,
  InteractiveButton,
  SlideButton,
  FormSkeleton,
  LinearProgress,
} from './components/common';
import { useOptimisticUI } from './hooks/useOptimisticUI';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface BookingFormData {
  courtId: string;
  date: string;
  time: string;
  duration: number;
  paymentMethod: string;
}

function BookingFormMultiStep() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    data: formData,
    optimisticFieldUpdate,
    isOptimistic,
  } = useOptimisticUI<BookingFormData>({
    courtId: '',
    date: '',
    time: '',
    duration: 60,
    paymentMethod: '',
  });

  const steps = [
    { id: '1', label: 'Quadra', description: 'Escolha a quadra' },
    { id: '2', label: 'Horário', description: 'Data e horário' },
    { id: '3', label: 'Pagamento', description: 'Forma de pagamento' },
    { id: '4', label: 'Confirmação', description: 'Revisar dados' },
  ];

  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  // Auto-save com optimistic update
  const handleFieldChange = async (field: keyof BookingFormData, value: any) => {
    await optimisticFieldUpdate(
      field,
      value,
      async () => {
        // Auto-save no backend
        await fetch('/api/bookings/draft', {
          method: 'POST',
          body: JSON.stringify({ [field]: value }),
        });
      }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      // Success!
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress bar */}
      <LinearProgress
        value={progress}
        showLabel
        label={`Passo ${step} de ${totalSteps}`}
        variant="success"
      />

      {/* Step indicator */}
      <StepProgress
        steps={steps}
        currentStep={step}
        completedSteps={Array.from({ length: step - 1 }, (_, i) => i + 1)}
      />

      {/* Form content */}
      <div className="border rounded-lg p-6">
        {step === 1 && (
          <CourtSelection
            value={formData.courtId}
            onChange={(v) => handleFieldChange('courtId', v)}
          />
        )}
        
        {step === 2 && (
          <TimeSelection
            date={formData.date}
            time={formData.time}
            onDateChange={(v) => handleFieldChange('date', v)}
            onTimeChange={(v) => handleFieldChange('time', v)}
          />
        )}
        
        {step === 3 && (
          <PaymentMethodSelection
            value={formData.paymentMethod}
            onChange={(v) => handleFieldChange('paymentMethod', v)}
          />
        )}
        
        {step === 4 && (
          <BookingConfirmation data={formData} />
        )}

        {/* Auto-save indicator */}
        {isOptimistic && (
          <p className="text-xs text-muted-foreground mt-4">
            💾 Salvando automaticamente...
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        {step > 1 && (
          <InteractiveButton
            variant="outline"
            onClick={() => setStep(step - 1)}
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Voltar
          </InteractiveButton>
        )}

        <div className="ml-auto">
          {step < totalSteps ? (
            <SlideButton
              variant="primary"
              onClick={() => setStep(step + 1)}
              slideIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continuar
            </SlideButton>
          ) : (
            <SuccessButton
              variant="primary"
              isLoading={loading}
              loadingText="Finalizando..."
              onClick={handleSubmit}
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar Reserva
            </SuccessButton>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Exemplo 3: Dashboard com Skeleton Contextual

```tsx
import {
  DashboardStatsSkeleton,
  ChartSkeleton,
  TableSkeleton,
  CardSkeleton,
  ContextualLoading,
} from './components/common';
import { useOptimizedData } from './hooks/useOptimizedData';
import { usePrefetch } from './hooks/usePrefetch';
import { BarChart3 } from 'lucide-react';

function ManagerDashboard() {
  // Fetch dados com cache
  const {
    data: stats,
    isLoading: loadingStats,
  } = useOptimizedData('/api/stats/summary');

  const {
    data: bookings,
    isLoading: loadingBookings,
  } = useOptimizedData('/api/bookings/today');

  const {
    data: revenue,
    isLoading: loadingRevenue,
  } = useOptimizedData('/api/revenue/monthly');

  // Prefetch relatórios (usuário provavelmente vai clicar)
  usePrefetch('/api/reports/monthly', { strategy: 'idle' });

  // Loading states específicos
  if (loadingStats && loadingBookings && loadingRevenue) {
    return (
      <div className="space-y-6">
        <DashboardStatsSkeleton />
        <div className="grid grid-cols-2 gap-6">
          <ChartSkeleton />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {loadingStats ? (
        <DashboardStatsSkeleton />
      ) : (
        <StatsGrid stats={stats} />
      )}

      {/* Charts e Tabelas */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        {loadingRevenue ? (
          <ChartSkeleton />
        ) : (
          <RevenueChart data={revenue} />
        )}

        {/* Today's Bookings */}
        {loadingBookings ? (
          <TableSkeleton rows={5} />
        ) : bookings.length === 0 ? (
          <ContextualLoading
            icon={<BarChart3 className="w-12 h-12 text-primary" />}
            message="Nenhuma reserva hoje"
            submessage="As reservas de hoje aparecerão aqui"
          />
        ) : (
          <BookingsTable bookings={bookings} />
        )}
      </div>
    </div>
  );
}
```

---

## 🔄 Exemplo 4: Upload de Arquivos com Progress

```tsx
import { useState } from 'react';
import {
  UploadProgress,
  MultiStepProgress,
  InteractiveButton,
  SuccessButton,
} from './components/common';
import { Upload } from 'lucide-react';

interface UploadFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

function FileUploader() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);

  const handleFileSelect = async (files: FileList) => {
    const newUploads = Array.from(files).map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: formatBytes(file.size),
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Simulate upload progress
    for (const upload of newUploads) {
      simulateUpload(upload.id);
    }
  };

  const simulateUpload = (id: string) => {
    const interval = setInterval(() => {
      setUploads(prev => prev.map(u => {
        if (u.id !== id) return u;
        
        const newProgress = u.progress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...u, progress: 100, status: 'success' as const };
        }
        
        return { ...u, progress: newProgress };
      }));
    }, 200);
  };

  const handleProcessFiles = async () => {
    setProcessing(true);
    setProcessingSteps([
      { label: 'Validando arquivos', inProgress: true, estimatedTime: '~5s' },
      { label: 'Otimizando imagens', completed: false, estimatedTime: '~10s' },
      { label: 'Gerando thumbnails', completed: false, estimatedTime: '~5s' },
      { label: 'Salvando no servidor', completed: false, estimatedTime: '~8s' },
    ]);

    // Simulate processing steps
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingSteps(prev => prev.map((s, i) =>
      i === 0 ? { ...s, completed: true, inProgress: false } :
      i === 1 ? { ...s, inProgress: true } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingSteps(prev => prev.map((s, i) =>
      i <= 1 ? { ...s, completed: true, inProgress: false } :
      i === 2 ? { ...s, inProgress: true } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingSteps(prev => prev.map((s, i) =>
      i <= 2 ? { ...s, completed: true, inProgress: false } :
      i === 3 ? { ...s, inProgress: true } : s
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingSteps(prev => prev.map(s => ({ ...s, completed: true, inProgress: false })));
    
    setProcessing(false);
  };

  const allUploadsComplete = uploads.every(u => u.status === 'success');
  const hasUploads = uploads.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Upload area */}
      <div
        className="border-2 border-dashed rounded-lg p-12 text-center"
        onDrop={(e) => {
          e.preventDefault();
          handleFileSelect(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">Arraste arquivos aqui</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ou clique para selecionar
        </p>
        <InteractiveButton
          variant="primary"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) handleFileSelect(target.files);
            };
            input.click();
          }}
        >
          Selecionar Arquivos
        </InteractiveButton>
      </div>

      {/* Upload progress */}
      {hasUploads && (
        <div className="space-y-3">
          <h3 className="font-semibold">Uploads em andamento</h3>
          {uploads.map(upload => (
            <UploadProgress
              key={upload.id}
              fileName={upload.name}
              fileSize={upload.size}
              progress={upload.progress}
              status={upload.status}
              onCancel={() => {
                setUploads(prev => prev.filter(u => u.id !== upload.id));
              }}
              onRetry={() => simulateUpload(upload.id)}
            />
          ))}
        </div>
      )}

      {/* Processing steps */}
      {processing && (
        <div className="space-y-3">
          <h3 className="font-semibold">Processando arquivos...</h3>
          <MultiStepProgress steps={processingSteps} />
        </div>
      )}

      {/* Action buttons */}
      {allUploadsComplete && !processing && (
        <SuccessButton
          variant="primary"
          onClick={handleProcessFiles}
          isSuccess={processingSteps.every(s => s.completed)}
          successText="Processamento completo!"
        >
          <CheckCircle className="w-4 h-4" />
          Processar Arquivos
        </SuccessButton>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

---

## ⚡ Exemplo 5: Toggle com Optimistic UI

```tsx
import { Switch } from './components/ui/switch';
import { useOptimisticToggle } from './hooks/useOptimisticUI';
import { Badge } from './components/ui/badge';

function NotificationSettings() {
  const {
    value: emailEnabled,
    isOptimistic: emailOptimistic,
    toggle: toggleEmail,
  } = useOptimisticToggle(
    user.settings.emailEnabled,
    async (value) => {
      await api.updateSettings({ emailEnabled: value });
    },
    {
      successMessage: 'Configuração atualizada!',
    }
  );

  const {
    value: smsEnabled,
    isOptimistic: smsOptimistic,
    toggle: toggleSms,
  } = useOptimisticToggle(
    user.settings.smsEnabled,
    async (value) => {
      await api.updateSettings({ smsEnabled: value });
    }
  );

  return (
    <div className="space-y-4">
      {/* Email notifications */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Notificações por E-mail</h4>
            {emailOptimistic && (
              <Badge variant="secondary" className="animate-pulse">
                Salvando...
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Receba atualizações sobre suas reservas
          </p>
        </div>
        <Switch
          checked={emailEnabled}
          onCheckedChange={toggleEmail}
          disabled={emailOptimistic}
        />
      </div>

      {/* SMS notifications */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Notificações por SMS</h4>
            {smsOptimistic && (
              <Badge variant="secondary" className="animate-pulse">
                Salvando...
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Receba lembretes por mensagem de texto
          </p>
        </div>
        <Switch
          checked={smsEnabled}
          onCheckedChange={toggleSms}
          disabled={smsOptimistic}
        />
      </div>
    </div>
  );
}
```

---

## 🎯 Checklist de Implementação

Ao criar um novo componente com feedback visual, verifique:

- [ ] **Loading States**
  - [ ] Skeleton apropriado para o conteúdo
  - [ ] Contextual loading com mensagem clara
  - [ ] Loading não bloqueia toda a UI

- [ ] **Progress Indicators**
  - [ ] Progress bar para % conhecida
  - [ ] Indeterminate para % desconhecida
  - [ ] Step progress para multi-etapa

- [ ] **Button States**
  - [ ] Ripple effect ativo
  - [ ] Loading state com spinner
  - [ ] Success state com checkmark
  - [ ] Disabled state claro

- [ ] **Optimistic UI**
  - [ ] Updates instantâneos
  - [ ] Rollback automático em erro
  - [ ] Visual feedback (opacity 70%)
  - [ ] Toast notifications

- [ ] **Microinteractions**
  - [ ] Hover states
  - [ ] Click animations
  - [ ] Transition suaves (200-300ms)
  - [ ] Haptic feedback (mobile)

---

**Dúvidas?** Consulte `/docs/FEEDBACK_VISUAL_GUIDE.md`
