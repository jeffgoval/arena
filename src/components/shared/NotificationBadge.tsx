'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Settings, CheckCheck, Trash2 } from 'lucide-react';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { NotificationItem } from './NotificationItem';
import Link from 'next/link';

export function NotificationBadge() {
  const [open, setOpen] = useState(false);
  const { loading } = useNotificacoes();

  const notificacoesRecentes: any[] = [];
  const naoLidas: number = 0;
  const marcarTodasComoLidas = () => {};
  const limparTodasLidas = () => {};

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Bell className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {naoLidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {naoLidas > 99 ? '99+' : naoLidas}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
            <div className="flex items-center gap-2">
              {naoLidas > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={marcarTodasComoLidas}
                  className="h-8 px-2"
                >
                  <CheckCheck className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={limparTodasLidas}
                className="h-8 px-2"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Link href="/notificacoes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
          {naoLidas > 0 && (
            <p className="text-sm text-muted-foreground">
              {naoLidas} não lida{naoLidas > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-80">
          {notificacoesRecentes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="p-2">
              {notificacoesRecentes.map((notificacao) => (
                <NotificationItem
                  key={notificacao.id}
                  notificacao={notificacao}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {notificacoesRecentes.length > 5 && (
          <div className="p-3 border-t">
            <Link href="/notificacoes">
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => setOpen(false)}
              >
                Ver todas as notificações
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}