# 💾 Auto-Save - Exemplos Práticos

Exemplos reais de implementação do sistema de auto-save no Arena Dona Santa.

---

## 📋 Exemplo 1: Formulário de Reserva Completo

```tsx
import { useState } from 'react';
import { FormAutoSave, AutoSaveStatus } from './components/common';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { useHashRouter } from './hooks/useHashRouter';

interface BookingFormData {
  courtId: string;
  date: string;
  time: string;
  duration: number;
  paymentMethod: string;
  notes: string;
  players: number;
}

export function BookingFormWithAutoSave() {
  const { navigate } = useHashRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Reserva criada com sucesso!');
        navigate('/meus-jogos');
      } else {
        throw new Error('Erro ao criar reserva');
      }
    } catch (error) {
      toast.error('Erro ao criar reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova Reserva</h1>
        <p className="text-muted-foreground">
          Seus dados serão salvos automaticamente
        </p>
      </div>

      <FormAutoSave
        initialData={{
          courtId: '',
          date: '',
          time: '',
          duration: 60,
          paymentMethod: '',
          notes: '',
          players: 10,
        }}
        options={{
          key: 'booking-form',
          debounceMs: 1000,
          showToast: true,
          validateBeforeSave: (data) => {
            // Only auto-save if essential fields are filled
            return data.courtId !== '' || data.date !== '';
          },
          ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
          onSave: async (data) => {
            // Optional: Save to server
            console.log('Auto-saved:', data);
          },
        }}
        onSubmit={handleSubmit}
        showStatus
        showDraftRestore
      >
        {({ formData, updateField, isDirty }) => (
          <div className="space-y-6">
            {/* Court Selection */}
            <div className="space-y-2">
              <Label htmlFor="court">Quadra *</Label>
              <Select
                value={formData.courtId}
                onValueChange={(value) => updateField('courtId', value)}
              >
                <SelectTrigger id="court">
                  <SelectValue placeholder="Selecione a quadra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Quadra Society - R$ 150/h</SelectItem>
                  <SelectItem value="2">Quadra Arena - R$ 200/h</SelectItem>
                  <SelectItem value="3">Quadra Beach - R$ 180/h</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duração *</Label>
              <RadioGroup
                value={formData.duration.toString()}
                onValueChange={(value) =>
                  updateField('duration', parseInt(value))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="60min" />
                  <Label htmlFor="60min" className="font-normal">
                    1 hora
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90" id="90min" />
                  <Label htmlFor="90min" className="font-normal">
                    1h30
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="120" id="120min" />
                  <Label htmlFor="120min" className="font-normal">
                    2 horas
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Players Count */}
            <div className="space-y-2">
              <Label htmlFor="players">Número de Jogadores</Label>
              <Input
                id="players"
                type="number"
                min="2"
                max="22"
                value={formData.players}
                onChange={(e) =>
                  updateField('players', parseInt(e.target.value) || 10)
                }
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment">Forma de Pagamento</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => updateField('paymentMethod', value)}
              >
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="credit">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit">Cartão de Débito</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Informações adicionais sobre a reserva..."
                rows={4}
              />
            </div>

            {/* Summary */}
            {formData.courtId && formData.date && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-medium">Resumo da Reserva</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium">Quadra:</span>{' '}
                    {formData.courtId === '1'
                      ? 'Quadra Society'
                      : formData.courtId === '2'
                      ? 'Quadra Arena'
                      : 'Quadra Beach'}
                  </p>
                  <p>
                    <span className="font-medium">Data:</span>{' '}
                    {new Date(formData.date).toLocaleDateString('pt-BR')}
                  </p>
                  <p>
                    <span className="font-medium">Horário:</span> {formData.time}
                  </p>
                  <p>
                    <span className="font-medium">Duração:</span>{' '}
                    {formData.duration === 60
                      ? '1 hora'
                      : formData.duration === 90
                      ? '1h30'
                      : '2 horas'}
                  </p>
                  <p>
                    <span className="font-medium">Jogadores:</span>{' '}
                    {formData.players}
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                !formData.courtId ||
                !formData.date ||
                !formData.time ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
            </Button>
          </div>
        )}
      </FormAutoSave>
    </div>
  );
}
```

---

## ⚙️ Exemplo 2: Configurações de Usuário

```tsx
import { usePreferences } from './hooks/useFormAutoSave';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { toast } from 'sonner@2.0.3';

interface UserPreferences {
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  notificationSound: boolean;

  // Display
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en' | 'es';
  compactView: boolean;

  // Booking
  autoConfirmBookings: boolean;
  defaultDuration: number;
  preferredCourts: string[];
  
  // Privacy
  profilePublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
}

export function UserPreferencesPage() {
  const {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  } = usePreferences<UserPreferences>('user-preferences', {
    // Defaults
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    notificationSound: true,
    theme: 'system',
    language: 'pt',
    compactView: false,
    autoConfirmBookings: false,
    defaultDuration: 60,
    preferredCourts: [],
    profilePublic: true,
    showEmail: false,
    showPhone: false,
  });

  const handleReset = () => {
    if (confirm('Deseja resetar todas as preferências para os valores padrão?')) {
      resetPreferences();
      toast.success('Preferências resetadas');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Suas preferências são salvas automaticamente
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Gerencie como você recebe notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notif">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receba atualizações por email
              </p>
            </div>
            <Switch
              id="email-notif"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                updatePreference('emailNotifications', checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notif">Notificações por SMS</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes por SMS
              </p>
            </div>
            <Switch
              id="sms-notif"
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) =>
                updatePreference('smsNotifications', checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="whatsapp-notif">Notificações por WhatsApp</Label>
              <p className="text-sm text-muted-foreground">
                Receba mensagens no WhatsApp
              </p>
            </div>
            <Switch
              id="whatsapp-notif"
              checked={preferences.whatsappNotifications}
              onCheckedChange={(checked) =>
                updatePreference('whatsappNotifications', checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-notif">Som de Notificação</Label>
              <p className="text-sm text-muted-foreground">
                Tocar som ao receber notificações
              </p>
            </div>
            <Switch
              id="sound-notif"
              checked={preferences.notificationSound}
              onCheckedChange={(checked) =>
                updatePreference('notificationSound', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Personalize como o sistema é exibido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Tema</Label>
            <RadioGroup
              value={preferences.theme}
              onValueChange={(value) =>
                updatePreference('theme', value as any)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="font-normal">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="font-normal">
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="font-normal">
                  Sistema
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Idioma</Label>
            <RadioGroup
              value={preferences.language}
              onValueChange={(value) =>
                updatePreference('language', value as any)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pt" id="pt" />
                <Label htmlFor="pt" className="font-normal">
                  Português
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en" className="font-normal">
                  English
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="es" id="es" />
                <Label htmlFor="es" className="font-normal">
                  Español
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact">Visualização Compacta</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar mais informações em menos espaço
              </p>
            </div>
            <Switch
              id="compact"
              checked={preferences.compactView}
              onCheckedChange={(checked) =>
                updatePreference('compactView', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>
            Configurações padrão para reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-confirm">Confirmação Automática</Label>
              <p className="text-sm text-muted-foreground">
                Confirmar automaticamente novas reservas
              </p>
            </div>
            <Switch
              id="auto-confirm"
              checked={preferences.autoConfirmBookings}
              onCheckedChange={(checked) =>
                updatePreference('autoConfirmBookings', checked)
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Duração Padrão</Label>
            <RadioGroup
              value={preferences.defaultDuration.toString()}
              onValueChange={(value) =>
                updatePreference('defaultDuration', parseInt(value))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="60min-pref" />
                <Label htmlFor="60min-pref" className="font-normal">
                  1 hora
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="90" id="90min-pref" />
                <Label htmlFor="90min-pref" className="font-normal">
                  1h30
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="120" id="120min-pref" />
                <Label htmlFor="120min-pref" className="font-normal">
                  2 horas
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacidade</CardTitle>
          <CardDescription>
            Controle quem pode ver suas informações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Perfil Público</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que outros usuários vejam seu perfil
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={preferences.profilePublic}
              onCheckedChange={(checked) =>
                updatePreference('profilePublic', checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Mostrar Email</Label>
              <p className="text-sm text-muted-foreground">
                Exibir seu email no perfil público
              </p>
            </div>
            <Switch
              id="show-email"
              checked={preferences.showEmail}
              onCheckedChange={(checked) =>
                updatePreference('showEmail', checked)
              }
              disabled={!preferences.profilePublic}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-phone">Mostrar Telefone</Label>
              <p className="text-sm text-muted-foreground">
                Exibir seu telefone no perfil público
              </p>
            </div>
            <Switch
              id="show-phone"
              checked={preferences.showPhone}
              onCheckedChange={(checked) =>
                updatePreference('showPhone', checked)
              }
              disabled={!preferences.profilePublic}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          Resetar Configurações
        </Button>
      </div>
    </div>
  );
}
```

---

## 📦 Exemplo 3: Gerenciador de Armazenamento nas Configurações

```tsx
import { LocalStorageManager } from './components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { UserPreferencesPage } from './UserPreferencesPage';

export function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>

      <Tabs defaultValue="preferences">
        <TabsList>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <UserPreferencesPage />
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Gerenciar Armazenamento Local
              </h2>
              <p className="text-muted-foreground">
                Gerencie dados salvos localmente no seu navegador
              </p>
            </div>

            <LocalStorageManager
              namespace="app"
              showQuota
              showCleanup
              showExportImport
            />
          </div>
        </TabsContent>

        <TabsContent value="account">
          {/* Account settings */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

**Dúvidas?** Consulte `/docs/AUTO_SAVE_GUIDE.md`
