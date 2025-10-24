'use client';

import { DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote, Users, Download, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useResumoFinanceiro, useTransacoesFinanceiras, useMetodosPagamento } from '@/hooks/core/useFinanceiro';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { FinanceiroResumoSkeleton, FinanceiroTransacoesSkeleton, FinanceiroMetodosSkeleton } from '@/components/shared/loading/FinanceiroSkeleton';

export default function FinanceiroPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'receita' | 'despesa' | 'todos'>('todos');
  const [periodoFilter, setPeriodoFilter] = useState<'mes-atual' | 'mes-anterior' | 'trimestre' | 'ano'>('mes-atual');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toast } = useToast();

  // Buscar dados
  const { data: resumo, isLoading: isLoadingResumo } = useResumoFinanceiro();
  const { data: transacoes, isLoading: isLoadingTransacoes } = useTransacoesFinanceiras({
    periodo: periodoFilter,
    tipo: tipoFilter,
    busca: debouncedSearchTerm,
  });
  const { data: metodosPagamento, isLoading: isLoadingMetodos } = useMetodosPagamento();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'receita' ?
      <TrendingUp className="w-4 h-4 text-green-600" /> :
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const handleExport = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A exportação de relatórios estará disponível em breve.',
    });
  };

  const handleRelatorio = (tipo: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: `O relatório "${tipo}" estará disponível em breve.`,
    });
  };

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            Financeiro
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle financeiro e relatórios da arena
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Resumo Financeiro */}
      {isLoadingResumo ? (
        <FinanceiroResumoSkeleton />
      ) : resumo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(resumo.receitaTotal)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita do Mês</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(resumo.receitaMes)}
                  </p>
                  {resumo.crescimentoMes !== 0 && (
                    <p className={`text-xs flex items-center mt-1 ${
                      resumo.crescimentoMes > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {resumo.crescimentoMes > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(resumo.crescimentoMes).toFixed(1)}%
                    </p>
                  )}
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lucro do Mês</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(resumo.lucroMes)}
                  </p>
                </div>
                <Banknote className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(resumo.ticketMedio)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Tabs defaultValue="transacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="metodos">Métodos de Pagamento</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        {/* Transações */}
        <TabsContent value="transacoes" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={tipoFilter} onValueChange={(v: any) => setTipoFilter(v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="receita">Receitas</SelectItem>
                    <SelectItem value="despesa">Despesas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={periodoFilter} onValueChange={(v: any) => setPeriodoFilter(v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes-atual">Mês Atual</SelectItem>
                    <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                    <SelectItem value="trimestre">Trimestre</SelectItem>
                    <SelectItem value="ano">Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Transações */}
          {isLoadingTransacoes ? (
            <FinanceiroTransacoesSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes ({transacoes?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {transacoes && transacoes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transacoes.map((transacao) => (
                        <TableRow key={transacao.id}>
                          <TableCell>{formatDate(transacao.data)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTipoIcon(transacao.tipo)}
                              <span className="capitalize">{transacao.tipo}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{transacao.descricao}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {transacao.metodo}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transacao.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma transação encontrada.</p>
                    <p className="text-sm">Tente ajustar os filtros de busca.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Métodos de Pagamento */}
        <TabsContent value="metodos" className="space-y-6">
          {isLoadingMetodos ? (
            <FinanceiroMetodosSkeleton />
          ) : metodosPagamento && metodosPagamento.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metodosPagamento.map((metodo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <span className="font-medium">{metodo.metodo}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${metodo.percentual}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {metodo.percentual}%
                        </span>
                        <span className="font-bold text-green-600 w-24 text-right">
                          {formatCurrency(metodo.valor)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum método de pagamento encontrado.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRelatorio('Relatório Mensal')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Mensal
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRelatorio('Fluxo de Caixa')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Fluxo de Caixa
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRelatorio('Receitas por Quadra')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Receitas por Quadra
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRelatorio('Análise de Clientes')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Análise de Clientes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo do Período</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResumo ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </div>
                ) : resumo ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Receitas:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(resumo.receitaMes)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Despesas:</span>
                      <span className="font-bold text-red-600">
                        {formatCurrency(resumo.despesasMes)}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Lucro Líquido:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(resumo.lucroMes)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
