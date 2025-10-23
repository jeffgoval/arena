'use client';

import { GerenciadorTemplates } from '@/components/admin/GerenciadorTemplates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Star, 
  BarChart3,
  Settings,
  Smartphone,
  Mail,
  Bell
} from 'lucide-react';

export default function NotificacoesPage() {
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
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enviadas Hoje</p>
                <p className="text-2xl font-bold">127</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">98.5%</p>
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
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visão Geral dos Tipos de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Lembrete 45min</h4>
                  <p className="text-sm text-muted-foreground">Antes do jogo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviadas hoje:</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Lembrete 10min</h4>
                  <p className="text-sm text-muted-foreground">Último aviso</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviadas hoje:</span>
                  <span className="font-semibold">38</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold text-green-600">97%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Aceite Convite</h4>
                  <p className="text-sm text-muted-foreground">Confirmações</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviadas hoje:</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Avaliação</h4>
                  <p className="text-sm text-muted-foreground">Pós-jogo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviadas hoje:</span>
                  <span className="font-semibold">32</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold text-yellow-600">95%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canais de Comunicação */}
      <Card>
        <CardHeader>
          <CardTitle>Canais de Comunicação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Canal principal para notificações instantâneas
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mensagens hoje:</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold">98.5%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg opacity-60">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Backup para notificações importantes
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mensagens hoje:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg opacity-60">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">SMS</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Para casos de emergência
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mensagens hoje:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciador de Templates */}
      <GerenciadorTemplates />

      {/* Configurações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Horários de Envio</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Lembrete Principal</p>
                    <p className="text-sm text-muted-foreground">45 minutos antes</p>
                  </div>
                  <Button variant="outline" size="sm">Alterar</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Lembrete Final</p>
                    <p className="text-sm text-muted-foreground">10 minutos antes</p>
                  </div>
                  <Button variant="outline" size="sm">Alterar</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Avaliação Pós-Jogo</p>
                    <p className="text-sm text-muted-foreground">2 horas depois</p>
                  </div>
                  <Button variant="outline" size="sm">Alterar</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Configurações Gerais</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Processamento Automático</p>
                    <p className="text-sm text-muted-foreground">Cron job ativo</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Tentativas de Reenvio</p>
                    <p className="text-sm text-muted-foreground">Máximo 3 tentativas</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Logs de Sistema</p>
                    <p className="text-sm text-muted-foreground">Últimas 30 dias</p>
                  </div>
                  <Button variant="outline" size="sm">Ver Logs</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}