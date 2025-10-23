'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  Gift, 
  Settings, 
  Users, 
  GraduationCap,
  X,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import type { Notificacao } from '@/types/notificacoes.types';
import Link from 'next/link';

interface NotificationItemProps {
  notificacao: Notificacao;
  onClose?: () => void;
  showActions?: boolean;
}

export function NotificationItem({ 
  notificacao, 
  onClose, 
  showActions = true 
}: NotificationItemProps) {
  const marcarComoLida = (id: string) => {};
  const removerNotificacao = (id: string) => {};

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'reserva':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'pagamento':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'indicacao':
        return <Gift className="h-4 w-4 text-purple-600" />;
      case 'sistema':
        return <Settings className="h-4 w-4 text-gray-600" />;
      case 'mensalista':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'turma':
        return <GraduationCap className="h-4 w-4 text-indigo-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950';
      case 'alta':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'media':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'baixa':
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleClick = () => {
    if (!notificacao.lida) {
      marcarComoLida(notificacao.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removerNotificacao(notificacao.id);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notificacao.acao?.callback) {
      notificacao.acao.callback();
    }
    onClose?.();
  };

  return (
    <div
      className={`
        p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-muted/50
        ${getPriorityColor(notificacao.prioridade)}
        ${!notificacao.lida ? 'bg-opacity-100' : 'bg-opacity-50'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getIcon(notificacao.tipo)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">
              {notificacao.titulo}
            </h4>
            {!notificacao.lida && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {notificacao.descricao}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notificacao.data), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {notificacao.tipo}
              </Badge>
              
              {notificacao.prioridade === 'urgente' && (
                <Badge variant="destructive" className="text-xs">
                  Urgente
                </Badge>
              )}
            </div>
          </div>

          {/* Ação da notificação */}
          {notificacao.acao && (
            <div className="mt-2">
              {notificacao.acao.tipo === 'link' && notificacao.acao.url ? (
                <Link href={notificacao.acao.url}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleAction}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {notificacao.acao.texto || 'Ver mais'}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleAction}
                >
                  {notificacao.acao.texto || 'Ação'}
                </Button>
              )}
            </div>
          )}
        </div>
        
        {showActions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}