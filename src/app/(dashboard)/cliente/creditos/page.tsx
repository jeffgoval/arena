'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Coins, 
  Plus, 
  History, 
  Gift, 
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Credito {
  id: string;
  tipo: 'compra' | 'bonus' | 'indicacao' | 'promocao' | 'uso' | 'expiracao';
  valor: number;
  descricao: string;
  data: Date;
  status: 'ativo' | 'usado' | 'expirado';
  dataExpiracao?: Date;
  reservaId?: string;
}

interface SaldoCreditos {
  total: number;
  ativo: number;
  expirandoEm30Dias: number;
  usado: number;
}

export default function CreditosPage() {
  const [saldo, setSaldo] = useState<SaldoCreditos>({
    total: 150.00,
    ativo: 120.00,
    expirandoEm30Dias: 30.00,
    usado: 280.00
  });

  const [historico, setHistorico] = useState<Credito[]>([
    {
      id: '1',
      tipo: 'compra',
      valor: 100.00,
      descricao: 'Compra de créditos - Pacote Premium',
      data: new Date('2024-10-20'),
      status: 'ativo',
      dataExpiracao: new Date('2025-01-20')
    },
    {
      id: '2',
      tipo: 'bonus',
      valor: 50.00,
      descricao: 'Bônus de boas-vindas',
      data: new Date('2024-10-15'),
      status: 'ativo',
      dataExpiracao: new Date('2024-12-15')
    },
    {
      id: '3',
      tipo: 'indicacao',
      valor: 25.00,
      descricao: 'Indicação de amigo - João Silva',
      data: new Date('2024-10-10'),
      status: 'ativo',
      dataExpiracao: new Date('2024-12-10')
    },
    {
      id: '4',
      tipo: 'uso',
      valor: -80.00,
      descricao: 'Usado na reserva #123 - Quadra A',
      data: new Date('2024-10-18'),
      status: 'usado',
      reservaId: '123'
    },
    {
      id: '5',
      tipo: 'promocao',
      valor: 30.00,
      descricao: 'Promoção Black Friday',
      data: new Date('2024-10-05'),
      status: 'expirado',
      dataExpiracao: new Date('2024-10-20')
    }
  ]);

  const [loading, setLoading] = useState(false);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'compra':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-green-600" />;
      case 'indicacao':
        return <ArrowUpRight className="h-4 w-4 text-purple-600" />;
      case 'promocao':
        return <Gift className="h-4 w-4 text-orange-600" />;
      case 'uso':
        return <ArrowDownLeft className="h-4 w-4 text-red-600" />;
      case 'expiracao':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      compra: 'Compra',
      bonus: 'Bônus',
      indicacao: 'Indicação',
      promocao: 'Promoção',
      uso: 'Uso',
      expiracao: 'Expiração'
    };
    return labels[tipo] || tipo;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'usado':
        return <Badge variant="secondary">Usado</Badge>;
      case 'expirado':
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  const formatarValor = (valor: number) => {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}R$ ${Math.abs(valor).toFixed(2)}`;
  };

  const creditosAtivos = historico.filter(c => c.status === 'ativo' && c.valor > 0);
  const creditosExpirandoSoon = creditosAtivos.filter(c => 
    c.dataExpiracao && 
    new Date(c.dataExpiracao).getTime() - Date.now() <= 30 * 24 * 60 * 60 * 1000
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus Créditos</h1>
        <p className="text-gray-600">Gerencie seus créditos e histórico de transações</p>
      </div>

      {/* Cards de Saldo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {saldo.total.toFixed(2)}
                </p>
              </div>
              <Coins className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Créditos Ativos</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {saldo.ativo.toFixed(2)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expirando em 30 dias</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {saldo.expirandoEm30Dias.toFixed(2)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usado</p>
                <p className="text-2xl font-bold text-gray-600">
                  R$ {saldo.usado.toFixed(2)}
                </p>
              </div>
              <History className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {creditosExpirandoSoon.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Você tem R$ {creditosExpirandoSoon.reduce((sum, c) => sum + c.valor, 0).toFixed(2)} em créditos 
            que expiram nos próximos 30 dias. Use-os antes que expirem!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="historico" className="w-full">
        <TabsList>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="ativos">Créditos Ativos</TabsTrigger>
          <TabsTrigger value="comprar">Comprar Créditos</TabsTrigger>
        </TabsList>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historico.map((credito) => (
                  <div key={credito.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTipoIcon(credito.tipo)}
                      <div>
                        <p className="font-medium">{credito.descricao}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{formatarData(credito.data)}</span>
                          {credito.dataExpiracao && credito.status === 'ativo' && (
                            <>
                              <span>•</span>
                              <span>Expira em {formatarData(credito.dataExpiracao)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${credito.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarValor(credito.valor)}
                      </span>
                      {getStatusBadge(credito.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Créditos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditosAtivos.map((credito) => (
                  <div key={credito.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      {getTipoIcon(credito.tipo)}
                      <div>
                        <p className="font-medium">{credito.descricao}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Adquirido em {formatarData(credito.data)}</span>
                          {credito.dataExpiracao && (
                            <>
                              <span>•</span>
                              <span className={
                                new Date(credito.dataExpiracao).getTime() - Date.now() <= 30 * 24 * 60 * 60 * 1000
                                  ? 'text-orange-600 font-medium'
                                  : 'text-gray-600'
                              }>
                                Expira em {formatarData(credito.dataExpiracao)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">
                        R$ {credito.valor.toFixed(2)}
                      </span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {getTipoLabel(credito.tipo)}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {creditosAtivos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Você não possui créditos ativos no momento.</p>
                    <p className="text-sm">Compre créditos para começar a usar!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comprar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Pacote Básico */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Pacote Básico</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">R$ 50</span>
                  <p className="text-sm text-gray-600">R$ 50 em créditos</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    R$ 50 em créditos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Válido por 6 meses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Sem taxa adicional
                  </li>
                </ul>
                <Button className="w-full" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Pacote Premium */}
            <Card className="relative border-blue-500 border-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-center">Pacote Premium</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">R$ 100</span>
                  <p className="text-sm text-gray-600">R$ 110 em créditos</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    R$ 110 em créditos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+R$ 10 de bônus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Válido por 12 meses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Prioridade nas reservas
                  </li>
                </ul>
                <Button className="w-full" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Pacote VIP */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-center">Pacote VIP</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">R$ 200</span>
                  <p className="text-sm text-gray-600">R$ 250 em créditos</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    R$ 250 em créditos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+R$ 50 de bônus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Válido por 18 meses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Acesso a quadras premium
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Desconto em equipamentos
                  </li>
                </ul>
                <Button className="w-full" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Como Ganhar Créditos Grátis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <ArrowUpRight className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Indique Amigos</h4>
                    <p className="text-sm text-gray-600">
                      Ganhe R$ 25 para cada amigo que se cadastrar e fizer sua primeira reserva
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Jogue Regularmente</h4>
                    <p className="text-sm text-gray-600">
                      Ganhe bônus de fidelidade jogando pelo menos 4 vezes por mês
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Gift className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Promoções Especiais</h4>
                    <p className="text-sm text-gray-600">
                      Participe de promoções sazonais e ganhe créditos extras
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Avalie Suas Partidas</h4>
                    <p className="text-sm text-gray-600">
                      Ganhe R$ 5 em créditos para cada avaliação detalhada que fizer
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
