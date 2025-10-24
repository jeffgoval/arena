'use client';

import { GerenciadorTemplates } from '@/components/admin/GerenciadorTemplates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  BarChart3,
  Smartphone,
  Mail,
  Bell
} from 'lucide-react';
import {
  useNotificacoesStats,
  useNotificacoesByTipo,
  useNotificacoesByCanal
} from '@/hooks/core/useNotificacoesStats';
import {
  NotificacoesStatsSkeleton,
  NotificacoesTiposSkeleton,
  NotificacoesCanaisSkeleton
} from '@/components/shared/loading/NotificacoesSkeleton';

const TIPO_CONFIG = {
  lembrete_45min: {
    icon: Clock,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Lembrete 45min',
    subtitle: 'Antes do jogo',
  },
  lembrete_10min: {
    icon: Clock,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Lembrete 10min',
    subtitle: 'Último aviso',
  },
  aceite_convite: {
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Aceite Convite',
    subtitle: 'Confirmações',
  },
  avaliacao_pos_jogo: {
    icon: Star,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Avaliação',
    subtitle: 'Pós-jogo',
  },
};

const CANAL_CONFIG = {
  whatsapp: {
    icon: Smartphone,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'WhatsApp',
    description: 'Canal principal para notificações instantâneas',
    ativo: true,
  },
  email: {
    icon: Mail,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Email',
    description: 'Backup para notificações importantes',
    ativo: false,
  },
  sms: {
    icon: MessageSquare,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'SMS',
    description: 'Para casos de emergência',
    ativo: false,
  },
};

export default function NotificacoesPage() {
  const { data: stats, isLoading: loadingStats } = useNotificacoesStats();
  const { data: tiposData, isLoading: loadingTipos } = useNotificacoesByTipo();
  const { data: canaisData, isLoading: loadingCanais } = useNotificacoesByCanal();
  return (
    <div className="container-custom page-padding space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="heading-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Sistema de Notificações
          </h1>
          <p className="body-medium text-muted-foreground">
            Gerencie templates e configurações de notificações automáticas
          </p>
        </div>
      </div>

      {/* Cards de Status */}
      {loadingStats ? (
        <NotificacoesStatsSkeleton />
      ) : stats ? (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enviadas</p>
                  <p className="text-2xl font-bold">{stats.totalEnviadas}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendentes}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Entrega</p>
                  <p className="text-2xl font-bold">{stats.taxaEntrega}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Templates Ativos</p>
                  <p className="text-2xl font-bold">{stats.templatesAtivos}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Visão Geral dos Tipos de Notificação */}
      {loadingTipos ? (
        <NotificacoesTiposSkeleton />
      ) : tiposData && tiposData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiposData.map((tipo) => {
                const config = TIPO_CONFIG[tipo.tipo as keyof typeof TIPO_CONFIG];
                if (!config) return null;

                const Icon = config.icon;
                const taxaColor = tipo.taxaEntrega >= 95 ? 'text-green-600' : 'text-yellow-600';

                return (
                  <div key={tipo.tipo} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${config.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{config.title}</h4>
                        <p className="text-sm text-muted-foreground">{config.subtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enviadas:</span>
                        <span className="font-semibold">{tipo.enviadas}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxa de entrega:</span>
                        <span className={`font-semibold ${taxaColor}`}>{tipo.taxaEntrega}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Canais de Comunicação */}
      {loadingCanais ? (
        <NotificacoesCanaisSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Canais de Comunicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(CANAL_CONFIG).map(([canalKey, config]) => {
                const canalData = canaisData?.find(c => c.canal === canalKey);
                const Icon = config.icon;
                const isAtivo = config.ativo && canalData && canalData.total > 0;

                return (
                  <div
                    key={canalKey}
                    className={`text-center p-6 border rounded-lg ${!isAtivo ? 'opacity-60' : ''}`}
                  >
                    <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${config.iconColor}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{config.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {config.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        {isAtivo ? (
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mensagens:</span>
                        <span className="font-semibold">{canalData?.enviadas || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxa de entrega:</span>
                        <span className="font-semibold">
                          {canalData && canalData.total > 0 ? `${canalData.taxaEntrega}%` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gerenciador de Templates */}
      <GerenciadorTemplates />
    </div>
  );
}