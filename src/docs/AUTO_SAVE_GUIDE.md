# 💾 Auto-Save e Persistência - Guia Completo

Sistema completo de auto-save de formulários e sincronização com localStorage implementado para o Arena Dona Santa.

---

## ✅ Implementado

### 1. 💾 **Form Auto-Save**
- Auto-save automático com debounce
- Rascunhos salvos localmente
- Restauração de rascunhos
- Detecção de mudanças
- Aviso ao sair com mudanças não salvas
- Validação antes de salvar

### 2. 🔄 **LocalStorage Sync**
- Sincronização entre tabs
- Versionamento de dados
- Namespace para organização
- Quota monitoring
- Cleanup automático
- Export/Import de dados

### 3. 📋 **Draft Management**
- Gerenciamento de múltiplos rascunhos
- Metadados (timestamp, versão)
- TTL (Time to Live)
- Lista de rascunhos
- Exclusão de rascunhos expirados

### 4. ⚙️ **Preferences**
- Persistência de preferências
- Update individual ou em lote
- Reset para padrões
- Sincronização automática

---

## 🎣 Hooks

### useFormAutoSave

Hook principal para auto-save de formulários.

```tsx
import { useFormAutoSave } from './hooks/useFormAutoSave';

interface BookingForm {
  courtId: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

function BookingForm() {
  const {
    formData,
    updateField,
    updateFields,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    hasDraft,
    restoreDraft,
    discardDraft,
    saveDraft,
  } = useFormAutoSave<BookingForm>(
    {
      courtId: '',
      date: '',
      time: '',
      duration: 60,
      notes: '',
    },
    {
      key: 'booking-form',
      debounceMs: 1000,
      showToast: true,
      onSave: async (data) => {
        // Optional: Save to server
        await api.saveDraft(data);
      },
      validateBeforeSave: (data) => {
        // Validate before saving
        return data.courtId !== '' && data.date !== '';
      },
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  );

  return (
    <form>
      {/* Restore draft banner */}
      {hasDraft && (
        <div>
          <p>Rascunho encontrado</p>
          <button onClick={restoreDraft}>Restaurar</button>
          <button onClick={discardDraft}>Descartar</button>
        </div>
      )}

      {/* Form fields */}
      <input
        value={formData.courtId}
        onChange={(e) => updateField('courtId', e.target.value)}
      />

      {/* Auto-save status */}
      {isSaving && <p>Salvando...</p>}
      {lastSaved && <p>Salvo {lastSaved.toLocaleString()}</p>}
      {hasUnsavedChanges && <p>Alterações não salvas</p>}
    </form>
  );
}
```

**Options:**
- `key` - Chave única para o formulário (obrigatório)
- `debounceMs` - Tempo de debounce (default: 1000ms)
- `onSave` - Callback ao salvar
- `onRestore` - Callback ao restaurar rascunho
- `showToast` - Mostrar toast de auto-save (default: true)
- `validateBeforeSave` - Validação antes de salvar
- `ttl` - Time to live em ms (default: 7 dias)
- `enabled` - Habilitar/desabilitar auto-save (default: true)

**Returns:**
- `formData` - Dados do formulário
- `setFormData` - Setter para dados
- `isSaving` - Estado de saving
- `lastSaved` - Data do último save
- `hasUnsavedChanges` - Se tem mudanças não salvas
- `hasDraft` - Se tem rascunho disponível
- `updateField(field, value)` - Atualizar campo
- `updateFields(updates)` - Atualizar múltiplos campos
- `saveDraft()` - Salvar manualmente
- `restoreDraft()` - Restaurar rascunho
- `discardDraft()` - Descartar rascunho
- `clearAutoSave()` - Limpar auto-save
- `reset(newData?)` - Resetar formulário
- `isDirty` - Alias para hasUnsavedChanges
- `canRestore` - Alias para hasDraft

### useDraftManager

Hook para gerenciar múltiplos rascunhos.

```tsx
import { useDraftManager } from './hooks/useFormAutoSave';

function DraftManagerPage() {
  const {
    drafts,
    getDraft,
    deleteDraft,
    deleteAllDrafts,
    deleteExpiredDrafts,
    count,
  } = useDraftManager('form-draft');

  return (
    <div>
      <h2>Rascunhos ({count})</h2>
      
      <button onClick={() => deleteExpiredDrafts()}>
        Limpar Expirados
      </button>
      
      <button onClick={deleteAllDrafts}>
        Limpar Todos
      </button>

      {drafts.map(draft => (
        <div key={draft.key}>
          <p>{draft.metadata.formId}</p>
          <p>{new Date(draft.metadata.savedAt).toLocaleString()}</p>
          <button onClick={() => deleteDraft(draft.key)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### usePreferences

Hook simples para persistir preferências.

```tsx
import { usePreferences } from './hooks/useFormAutoSave';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  notifications: boolean;
  emailAlerts: boolean;
}

function SettingsPage() {
  const {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  } = usePreferences<UserPreferences>('user-settings', {
    theme: 'light',
    language: 'pt',
    notifications: true,
    emailAlerts: true,
  });

  return (
    <div>
      <select
        value={preferences.theme}
        onChange={(e) => updatePreference('theme', e.target.value as any)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <button onClick={resetPreferences}>
        Resetar para Padrões
      </button>
    </div>
  );
}
```

### useLocalStorageSync

Hook avançado para localStorage com sync entre tabs.

```tsx
import { useLocalStorageSync } from './hooks/useLocalStorageSync';

function MyComponent() {
  const {
    value: settings,
    setValue: setSettings,
    removeValue,
    updateField,
    hasValue,
    getSize,
    isHydrated,
  } = useLocalStorageSync({
    key: 'app-settings',
    defaultValue: { theme: 'light', lang: 'pt' },
    syncAcrossTabs: true, // Sync between tabs
    versioning: true, // Add version metadata
  });

  // Will sync across all open tabs
  const handleThemeChange = (theme: string) => {
    updateField('theme', theme);
  };

  return (
    <div>
      {!isHydrated ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Theme: {settings.theme}</p>
          <button onClick={() => handleThemeChange('dark')}>
            Dark Mode
          </button>
        </>
      )}
    </div>
  );
}
```

**Options:**
- `key` - Chave do localStorage
- `defaultValue` - Valor padrão
- `serialize` - Função de serialização customizada
- `deserialize` - Função de deserialização customizada
- `syncAcrossTabs` - Sincronizar entre tabs (default: true)
- `versioning` - Adicionar versionamento (default: false)
- `onError` - Callback de erro
- `compress` - Comprimir dados (default: false)

### useLocalStorageNamespace

Hook para gerenciar múltiplas keys com namespace.

```tsx
import { useLocalStorageNamespace } from './hooks/useLocalStorageSync';

function NamespaceManager() {
  const {
    getKey,
    listKeys,
    clearNamespace,
    getNamespaceSize,
    count,
  } = useLocalStorageNamespace('app');

  // Will list: ['app:settings', 'app:user', 'app:cache']
  const keys = listKeys(); // Returns: ['settings', 'user', 'cache']

  return (
    <div>
      <p>{count} items no namespace</p>
      <p>Tamanho: {getNamespaceSize()} bytes</p>
      
      <ul>
        {keys.map(key => (
          <li key={key}>{key}</li>
        ))}
      </ul>

      <button onClick={clearNamespace}>
        Limpar Namespace
      </button>
    </div>
  );
}
```

### useLocalStorageQuota

Hook para monitorar quota do localStorage.

```tsx
import { useLocalStorageQuota } from './hooks/useLocalStorageSync';

function StorageMonitor() {
  const {
    usage,
    quota,
    usagePercent,
    remaining,
    refresh,
  } = useLocalStorageQuota();

  return (
    <div>
      <h3>Armazenamento</h3>
      <p>Uso: {usage} bytes</p>
      <p>Quota: {quota} bytes</p>
      <p>Porcentagem: {usagePercent.toFixed(1)}%</p>
      <p>Disponível: {remaining} bytes</p>
      
      <button onClick={refresh}>Atualizar</button>
      
      {usagePercent > 80 && (
        <p className="text-destructive">
          Espaço de armazenamento baixo!
        </p>
      )}
    </div>
  );
}
```

### useLocalStorageCleanup

Hook para limpar dados antigos.

```tsx
import { useLocalStorageCleanup } from './hooks/useLocalStorageSync';

function CleanupManager() {
  const {
    cleanupByAge,
    cleanupByPattern,
    cleanupAll,
  } = useLocalStorageCleanup();

  const handleCleanupOld = () => {
    // Remove items older than 30 days
    const removed = cleanupByAge(30 * 24 * 60 * 60 * 1000);
    console.log(`${removed} items removed`);
  };

  const handleCleanupDrafts = () => {
    // Remove all draft keys
    const removed = cleanupByPattern(/^draft-/);
    console.log(`${removed} drafts removed`);
  };

  return (
    <div>
      <button onClick={handleCleanupOld}>
        Limpar dados antigos (30+ dias)
      </button>
      <button onClick={handleCleanupDrafts}>
        Limpar rascunhos
      </button>
      <button onClick={cleanupAll}>
        Limpar tudo
      </button>
    </div>
  );
}
```

---

## 🎨 Componentes

### FormAutoSave

Wrapper para formulários com auto-save automático.

```tsx
import { FormAutoSave } from './components/common';

function MyForm() {
  const handleSubmit = async (data) => {
    await api.createBooking(data);
  };

  return (
    <FormAutoSave
      initialData={{
        courtId: '',
        date: '',
        time: '',
      }}
      options={{
        key: 'booking-form',
        debounceMs: 1000,
        showToast: true,
      }}
      onSubmit={handleSubmit}
      showStatus
      showDraftRestore
    >
      {({ formData, updateField, isDirty }) => (
        <>
          <input
            value={formData.courtId}
            onChange={(e) => updateField('courtId', e.target.value)}
          />
          
          <input
            value={formData.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
          
          <button type="submit" disabled={!isDirty}>
            Salvar
          </button>
        </>
      )}
    </FormAutoSave>
  );
}
```

**Props:**
- `initialData` - Dados iniciais do formulário
- `options` - Opções do useFormAutoSave
- `onSubmit` - Callback ao submeter
- `children` - Render prop com formData, updateField, etc
- `showStatus` - Mostrar status de auto-save (default: true)
- `showDraftRestore` - Mostrar banner de restauração (default: true)
- `className` - Classes CSS

### AutoSaveStatus

Indicador de status de auto-save.

```tsx
import { AutoSaveStatus } from './components/common';

<AutoSaveStatus
  isSaving={isSaving}
  lastSaved={lastSaved}
  hasUnsavedChanges={hasUnsavedChanges}
/>
```

### DraftList

Lista de rascunhos salvos.

```tsx
import { DraftList } from './components/common';
import { useDraftManager } from './hooks/useFormAutoSave';

function DraftsPage() {
  const { drafts, deleteDraft } = useDraftManager();

  const handleRestore = (key) => {
    // Restore draft logic
  };

  return (
    <DraftList
      drafts={drafts}
      onRestore={handleRestore}
      onDelete={deleteDraft}
    />
  );
}
```

### LocalStorageManager

Interface de gerenciamento de localStorage.

```tsx
import { LocalStorageManager } from './components/common';

function SettingsPage() {
  return (
    <LocalStorageManager
      namespace="app"
      showQuota
      showCleanup
      showExportImport
    />
  );
}
```

**Props:**
- `namespace` - Namespace para filtrar (default: 'app')
- `showQuota` - Mostrar quota monitor (default: true)
- `showCleanup` - Mostrar opções de limpeza (default: true)
- `showExportImport` - Mostrar export/import (default: true)

### StorageQuotaIndicator

Indicador simples de quota.

```tsx
import { StorageQuotaIndicator } from './components/common';

<StorageQuotaIndicator />
```

---

## 📋 Exemplos Práticos

### Exemplo 1: Formulário de Reserva com Auto-Save

```tsx
import { FormAutoSave } from './components/common';

interface BookingFormData {
  courtId: string;
  date: string;
  time: string;
  duration: number;
  paymentMethod: string;
  notes: string;
}

function BookingFormPage() {
  const handleSubmit = async (data: BookingFormData) => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success('Reserva criada com sucesso!');
      navigate('/meus-jogos');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Nova Reserva</h1>

      <FormAutoSave
        initialData={{
          courtId: '',
          date: '',
          time: '',
          duration: 60,
          paymentMethod: '',
          notes: '',
        }}
        options={{
          key: 'booking-form',
          debounceMs: 1000,
          showToast: true,
          validateBeforeSave: (data) => {
            // Only save if court and date are selected
            return data.courtId !== '' && data.date !== '';
          },
          ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
        }}
        onSubmit={handleSubmit}
        showStatus
        showDraftRestore
      >
        {({ formData, updateField, updateFields, isDirty }) => (
          <div className="space-y-6">
            {/* Court Selection */}
            <div>
              <Label htmlFor="court">Quadra</Label>
              <Select
                value={formData.courtId}
                onValueChange={(value) => updateField('courtId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a quadra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Quadra Society</SelectItem>
                  <SelectItem value="2">Quadra Arena</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label>Duração</Label>
              <RadioGroup
                value={formData.duration.toString()}
                onValueChange={(value) =>
                  updateField('duration', parseInt(value))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="60" />
                  <Label htmlFor="60">1 hora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90" id="90" />
                  <Label htmlFor="90">1h30</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="120" id="120" />
                  <Label htmlFor="120">2 horas</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Informações adicionais..."
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={!isDirty} className="w-full">
              Confirmar Reserva
            </Button>
          </div>
        )}
      </FormAutoSave>
    </div>
  );
}
```

### Exemplo 2: Preferências de Usuário

```tsx
import { usePreferences } from './hooks/useFormAutoSave';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  autoBookingConfirmation: boolean;
}

function UserPreferencesPage() {
  const {
    preferences,
    updatePreference,
    resetPreferences,
  } = usePreferences<UserPreferences>('user-preferences', {
    emailNotifications: true,
    smsNotifications: false,
    theme: 'light',
    language: 'pt',
    autoBookingConfirmation: true,
  });

  return (
    <div className="space-y-6">
      <h1>Preferências</h1>

      {/* Email Notifications */}
      <div className="flex items-center justify-between">
        <Label htmlFor="email">Notificações por Email</Label>
        <Switch
          id="email"
          checked={preferences.emailNotifications}
          onCheckedChange={(checked) =>
            updatePreference('emailNotifications', checked)
          }
        />
      </div>

      {/* SMS Notifications */}
      <div className="flex items-center justify-between">
        <Label htmlFor="sms">Notificações por SMS</Label>
        <Switch
          id="sms"
          checked={preferences.smsNotifications}
          onCheckedChange={(checked) =>
            updatePreference('smsNotifications', checked)
          }
        />
      </div>

      {/* Theme */}
      <div>
        <Label>Tema</Label>
        <RadioGroup
          value={preferences.theme}
          onValueChange={(value) =>
            updatePreference('theme', value as 'light' | 'dark')
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Reset */}
      <Button variant="outline" onClick={resetPreferences}>
        Resetar para Padrões
      </Button>
    </div>
  );
}
```

### Exemplo 3: Gerenciador de Rascunhos

```tsx
import { DraftList } from './components/common';
import { useDraftManager } from './hooks/useFormAutoSave';

function DraftsPage() {
  const {
    drafts,
    deleteDraft,
    deleteAllDrafts,
    deleteExpiredDrafts,
    count,
  } = useDraftManager('form-draft');

  const handleRestore = (key: string) => {
    const draft = drafts.find(d => d.key === key);
    if (draft) {
      // Navigate to form with draft data
      navigate(`/reservar?draft=${key}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1>Rascunhos Salvos</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => deleteExpiredDrafts()}
          >
            Limpar Expirados
          </Button>
          <Button
            variant="destructive"
            onClick={deleteAllDrafts}
            disabled={count === 0}
          >
            Limpar Todos ({count})
          </Button>
        </div>
      </div>

      <DraftList
        drafts={drafts}
        onRestore={handleRestore}
        onDelete={deleteDraft}
      />
    </div>
  );
}
```

### Exemplo 4: Configurações de Armazenamento

```tsx
import { LocalStorageManager } from './components/common';

function StorageSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1>Gerenciar Armazenamento</h1>
      
      <LocalStorageManager
        namespace="app"
        showQuota
        showCleanup
        showExportImport
      />
    </div>
  );
}
```

---

## 🎯 Boas Práticas

### 1. Use keys únicas
```tsx
// ✅ Good
useFormAutoSave(data, { key: 'booking-form-step-2' });

// ❌ Bad - pode conflitar
useFormAutoSave(data, { key: 'form' });
```

### 2. Valide antes de salvar
```tsx
useFormAutoSave(data, {
  key: 'booking-form',
  validateBeforeSave: (data) => {
    return data.courtId !== '' && data.date !== '';
  },
});
```

### 3. Configure TTL apropriado
```tsx
// Formulários temporários: 1 dia
ttl: 24 * 60 * 60 * 1000

// Formulários importantes: 7 dias
ttl: 7 * 24 * 60 * 60 * 1000

// Rascunhos permanentes: 30 dias
ttl: 30 * 24 * 60 * 60 * 1000
```

### 4. Limpe dados antigos periodicamente
```tsx
useEffect(() => {
  const { deleteExpiredDrafts } = useDraftManager();
  deleteExpiredDrafts(7 * 24 * 60 * 60 * 1000);
}, []);
```

### 5. Monitore quota
```tsx
const { usagePercent } = useLocalStorageQuota();

if (usagePercent > 80) {
  toast.warning('Espaço de armazenamento baixo!');
}
```

---

## 📊 Métricas

| Métrica | Valor | Status |
|---------|-------|--------|
| Auto-save Debounce | 1000ms | ⚡ Otimizado |
| Default TTL | 7 dias | 💾 Adequado |
| Sync Delay | < 100ms | ⚡ Instantâneo |
| Storage Limit | ~5-10MB | 📦 Browser default |

---

## 🐛 Troubleshooting

### Problema: Auto-save não funciona

**Solução:**
- Verifique se `enabled: true`
- Verifique se há console errors
- Confirme que `validateBeforeSave` está retornando true
- Clear localStorage e tente novamente

### Problema: Rascunho não restaura

**Solução:**
- Verifique se rascunho não expirou (TTL)
- Confirme que a key está correta
- Check se `hasDraft` é true

### Problema: Quota excedida

**Solução:**
- Use `useLocalStorageCleanup` para limpar dados antigos
- Reduza TTL de rascunhos
- Export/delete dados desnecessários
- Considere comprimir dados

---

**Status:** ✅ Completo e pronto para produção  
**Performance:** 🚀 Otimizado  
**UX:** 🎨 Intuitivo e seguro
