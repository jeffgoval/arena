'use client';

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
import { useCreditos, useComprarCreditos, PACOTES_CREDITOS } from '@/hooks/core/useCreditos';
import { CreditosPageSkeleton } from '@/components/shared/loading/CreditosSkeleton';
import type { CreditoTipo } from '@/types/creditos.types';

export default function CreditosPage() {
  const { data, isLoading, error } = useCreditos();
  const comprarCreditos = useComprarCreditos();

  if (isLoading) {
    return <CreditosPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container-custom page-padding">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="heading-3 mb-2">Erro ao carregar créditos</h2>
            <p className="text-muted-foreground mb-6">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const saldo = data?.saldo || { total: 0, ativo: 0, expirandoEm30Dias: 0, usado: 0, expirado: 0 };
  const historico = data?.historico || [];
  const creditosAtivos = data?.creditosAtivos || [];
  const creditosExpirandoSoon = data?.creditosExpirandoSoon || [];

  const getTipoIcon = (tipo: CreditoTipo) => {
    switch (tipo) {
      case 'compra':
        return <CreditCard className="h-4 w-4 text-primary" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-success" />;
      case 'indicacao':
        return <ArrowUpRight className="h-4 w-4 text-secondary" />;
      case 'promocao':
        return <Gift className="h-4 w-4 text-warning" />;
      case 'uso':
        return <ArrowDownLeft className="h-4 w-4 text-destructive" />;
      case 'expiracao':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTipoLabel = (tipo: CreditoTipo) => {
    const labels: Record<CreditoTipo, string> = {
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
        return <Badge variant="default" className="bg-success/10 text-success">Ativo</Badge>;
      case 'usado':
        return <Badge variant="secondary">Usado</Badge>;
      case 'expirado':
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatarData = (data: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
  };

  const formatarValor = (valor: number) => {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}R$ ${Math.abs(valor).toFixed(2)}`;
  };

  const handleComprarCreditos = async (pacoteId: string) => {
    try {
      await comprarCreditos.mutateAsync({
        pacoteId,
        metodoPagamento: 'pix', // Por enquanto fixo, depois implementar seleção
        valor: PACOTES_CREDITOS.find(p => p.id === pacoteId)?.valor || 0,
      });
    } catch (error) {
      // Error handling é feito pelo hook
    }
  };

  return (
    <div className="container-custom page-padding space-y-6">
      {/* Cabeçalho */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="heading-2">Meus Créditos</h1>
              <p className="text-muted-foreground">Gerencie seus créditos e histórico de transações</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Saldo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
                <p className="text-2xl font-bold text-success">
                  R$ {saldo.total.toFixed(2)}
                </p>
              </div>
              <Coins className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créditos Ativos</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {saldo.ativo.toFixed(2)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expirando em 30 dias</p>
                <p className="text-2xl font-bold text-warning">
                  R$ {saldo.expirandoEm30Dias.toFixed(2)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usado</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  R$ {saldo.usado.toFixed(2)}
                </p>
              </div>
              <History className="h-8 w-8 text-muted-foreground" />
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

      <Tabs defaultValue="comprar" className="w-full">
        <TabsList>
          <TabsTrigger value="comprar">Comprar Créditos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="ativos">Créditos Ativos</TabsTrigger>
        </TabsList>

        <TabsContent value="comprar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PACOTES_CREDITOS.map((pacote) => (
              <Card 
                key={pacote.id} 
                className={`relative ${pacote.popular ? 'border-primary border-2' : ''}`}
              >
                {pacote.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">{pacote.nome}</CardTitle>
                  <div className="text-center">
                    <span className="text-3xl font-bold">R$ {pacote.valor}</span>
                    <p className="text-sm text-muted-foreground">
                      R$ {pacote.creditos} em créditos
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {pacote.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className={beneficio.includes('+') ? 'text-success font-medium' : ''}>
                          {beneficio}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    disabled={comprarCreditos.isPending}
                    onClick={() => handleComprarCreditos(pacote.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {comprarCreditos.isPending ? 'Processando...' : 'Comprar Agora'}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                {historico.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma transação encontrada.</p>
                    <p className="text-sm">Suas transações aparecerão aqui.</p>
                  </div>
                ) : (
                  historico.map((credito) => (
                  <div key={credito.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTipoIcon(credito.tipo)}
                      <div>
                        <p className="font-medium">{credito.descricao}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatarData(credito.created_at)}</span>
                          {credito.data_expiracao && credito.status === 'ativo' && (
                            <>
                              <span>•</span>
                              <span>Expira em {formatarData(credito.data_expiracao)}</span>
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
                  ))
                )}
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Adquirido em {formatarData(credito.created_at)}</span>
                          {credito.data_expiracao && (
                            <>
                              <span>•</span>
                              <span className={
                                new Date(credito.data_expiracao).getTime() - Date.now() <= 30 * 24 * 60 * 60 * 1000
                                  ? 'text-warning font-medium'
                                  : 'text-muted-foreground'
                              }>
                                Expira em {formatarData(credito.data_expiracao)}
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Você não possui créditos ativos no momento.</p>
                    <p className="text-sm">Compre créditos para começar a usar!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
