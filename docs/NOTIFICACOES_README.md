# Sistema de Notificações - Arena

Este documento descreve o sistema completo de notificações em tempo real implementado no Supabase.

## 📋 Visão Geral

O sistema de notificações oferece:
- ✅ Notificações em tempo real
- ✅ Badge de notificações não lidas
- ✅ Centro de notificações
- ✅ Configurações personalizáveis por usuário
- ✅ Templates reutilizáveis
- ✅ Notificações agendadas
- ✅ Sistema de expiração
- ✅ Diferentes tipos e prioridades

## 🗄️ Estrutura das Tabelas

### `notifications`
Tabela principal que armazena todas as notificações.

**Campos principais:**
- `id`: UUID único da notificação
- `user_id`: ID do usuário (referência para auth.users)
- `title`: Título da notificação
- `message`: Mensagem completa
- `type`: Tipo da notificação (system, referral, evaluation, etc.)
- `priority`: Prioridade (low, medium, high, urgent)
- `is_read`: Se foi lida
- `is_archived`: Se foi arquivada
- `action_url`: URL para ação quando clicada
- `data`: Dados adicionais em JSON

### `notification_settings`
Configurações personalizadas por usuário.

**Campos principais:**
- `user_id`: ID do usuário
- `push_enabled`: Notificações push habilitadas
- `email_enabled`: Notificações por email habilitadas
- `[type]_notifications`: Configuração por tipo de notificação
- `quiet_hours_*`: Configurações de horário de silêncio

### `notification_templates`
Templates reutilizáveis para notificações padronizadas.

## 🚀 Funções Principais

### Criar Notificação
```sql
SELECT create_notification(
  user_id UUID,
  title VARCHAR(255),
  message TEXT,
  type notification_type DEFAULT 'system',
  priority notification_priority DEFAULT 'medium',
  data JSONB DEFAULT '{}',
  action_url TEXT DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  scheduled_for TIMESTAMPTZ DEFAULT NULL,
  expires_at TIMESTAMPTZ DEFAULT NULL
);
```

### Usar Template
```sql
SELECT create_notification_from_template(
  'user-uuid'::UUID,
  'referral_received',
  '{"referrer_name": "João", "amount": "500,00"}'::JSONB
);
```

### Marcar como Lida
```sql
SELECT mark_notification_read('notification-uuid'::UUID, 'user-uuid'::UUID);
```

### Obter Contagem Não Lidas
```sql
SELECT get_unread_notifications_count('user-uuid'::UUID);
```

## 📱 Implementação no Frontend

### 1. Badge de Notificações Não Lidas

```typescript
// Hook para contagem em tempo real
const useUnreadNotifications = (userId: string) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const fetchCount = async () => {
      const { data } = await supabase
        .rpc('get_unread_notifications_count', { p_user_id: userId });
      setCount(data || 0);
    };
    
    fetchCount();
    
    // Subscription para atualizações em tempo real
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, fetchCount)
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [userId]);
  
  return count;
};
```

### 2. Centro de Notificações

```typescript
// Hook para listar notificações
const useNotifications = (userId: string, limit = 20) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .rpc('get_user_notifications', {
          p_user_id: userId,
          p_limit: limit,
          p_offset: 0,
          p_include_read: true,
          p_include_archived: false
        });
      setNotifications(data || []);
      setLoading(false);
    };
    
    fetchNotifications();
    
    // Subscription para novas notificações
    const subscription = supabase
      .channel('user-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [userId, limit]);
  
  return { notifications, loading };
};
```

### 3. Marcar como Lida

```typescript
const markAsRead = async (notificationId: string, userId: string) => {
  await supabase.rpc('mark_notification_read', {
    p_notification_id: notificationId,
    p_user_id: userId
  });
};

const markAllAsRead = async (userId: string) => {
  await supabase.rpc('mark_all_notifications_read', {
    p_user_id: userId
  });
};
```

## 🎨 Componente de Exemplo (React)

```tsx
import React from 'react';
import { useUnreadNotifications, useNotifications } from './hooks';

const NotificationCenter = ({ userId }: { userId: string }) => {
  const unreadCount = useUnreadNotifications(userId);
  const { notifications, loading } = useNotifications(userId);
  
  return (
    <div className="notification-center">
      <div className="header">
        <h3>Notificações</h3>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>
      
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              onClick={() => {
                if (!notification.is_read) {
                  markAsRead(notification.id, userId);
                }
                if (notification.action_url) {
                  // Navegar para a URL
                }
              }}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <small>{formatDate(notification.created_at)}</small>
              </div>
              {notification.priority === 'high' && (
                <div className="priority-indicator high" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🔧 Configurações de Usuário

```typescript
// Obter configurações
const getNotificationSettings = async (userId: string) => {
  const { data } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
};

// Atualizar configurações
const updateNotificationSettings = async (userId: string, settings: any) => {
  const { data } = await supabase
    .from('notification_settings')
    .update(settings)
    .eq('user_id', userId);
  return data;
};
```

## 📊 Templates Disponíveis

- `welcome`: Mensagem de boas-vindas
- `referral_received`: Nova indicação recebida
- `referral_approved`: Indicação aprovada
- `evaluation_completed`: Avaliação concluída
- `payment_received`: Pagamento recebido
- `achievement_unlocked`: Conquista desbloqueada
- `reminder_evaluation`: Lembrete de avaliação
- `system_maintenance`: Manutenção do sistema

## 🔄 Tempo Real com Supabase

Para habilitar notificações em tempo real, certifique-se de:

1. Habilitar Realtime no Supabase Dashboard
2. Configurar as políticas RLS corretamente
3. Usar subscriptions nos componentes React

## 🧹 Manutenção

Execute periodicamente:

```sql
-- Limpar notificações expiradas
SELECT cleanup_expired_notifications();

-- Processar notificações agendadas
SELECT process_scheduled_notifications();

-- Arquivar notificações antigas
UPDATE notifications 
SET is_archived = TRUE 
WHERE is_read = TRUE 
  AND created_at < NOW() - INTERVAL '30 days';
```

## 🔒 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Usuários só podem ver suas próprias notificações
- Funções com SECURITY DEFINER para operações controladas
- Validação de permissões em todas as operações

## 📈 Métricas e Analytics

O sistema inclui views e funções para:
- Taxa de leitura de notificações
- Horários de maior engajamento
- Tipos de notificação mais populares
- Estatísticas por usuário

Consulte o arquivo `notifications_usage_examples.sql` para exemplos completos de queries de analytics.