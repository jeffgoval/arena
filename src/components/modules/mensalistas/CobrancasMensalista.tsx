'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    CreditCard,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Plus,
    Filter,
    Download
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Cobranca {
    id: string;
    mensalistaId: string;
    nomeMensalista: string;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
    mesReferencia: string;
    observacoes?: string;
    metodoPagamento?: 'pix' | 'cartao' | 'dinheiro' | 'transferencia';
}

export function CobrancasMensalista() {
    const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const [filtroMes, setFiltroMes] = useState<string>('todos');
    const [loading, setLoading] = useState(true);

    // Simular dados de cobranças
    useEffect(() => {
        const cobrancasSimuladas: Cobranca[] = [
            {
                id: '1',
                mensalistaId: 'mens1',
                nomeMensalista: 'João Silva',
                valor: 150.00,
                dataVencimento: '2024-11-05',
                dataPagamento: '2024-11-03',
                status: 'pago',
                mesReferencia: '2024-11',
                metodoPagamento: 'pix',
                observacoes: 'Pagamento via PIX'
            },
            {
                id: '2',
                mensalistaId: 'mens2',
                nomeMensalista: 'Maria Santos',
                valor: 200.00,
                dataVencimento: '2024-11-10',
                status: 'pendente',
                mesReferencia: '2024-11'
            }
        ];

        setTimeout(() => {
            setCobrancas(cobrancasSimuladas);
            setLoading(false);
        }, 1000);
    }, []);
    // Filtrar cobranças
    const cobrancasFiltradas = cobrancas.filter(cobranca => {
        const matchStatus = filtroStatus === 'todos' || cobranca.status === filtroStatus;
        const matchMes = filtroMes === 'todos' || cobranca.mesReferencia === filtroMes;
        return matchStatus && matchMes;
    });

    // Estatísticas
    const stats = {
        total: cobrancas.length,
        pendentes: cobrancas.filter(c => c.status === 'pendente').length,
        pagas: cobrancas.filter(c => c.status === 'pago').length,
        vencidas: cobrancas.filter(c => c.status === 'vencido').length,
        valorTotal: cobrancas.reduce((acc, c) => acc + c.valor, 0),
        valorPago: cobrancas.filter(c => c.status === 'pago').reduce((acc, c) => acc + c.valor, 0),
        valorPendente: cobrancas.filter(c => c.status === 'pendente').reduce((acc, c) => acc + c.valor, 0)
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pago':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'pendente':
                return <Clock className="h-4 w-4 text-orange-600" />;
            case 'vencido':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'cancelado':
                return <AlertTriangle className="h-4 w-4 text-gray-600" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pago':
                return 'Pago';
            case 'pendente':
                return 'Pendente';
            case 'vencido':
                return 'Vencido';
            case 'cancelado':
                return 'Cancelado';
            default:
                return status;
        }
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'pago':
                return 'default';
            case 'pendente':
                return 'secondary';
            case 'vencido':
                return 'destructive';
            case 'cancelado':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const marcarComoPago = (id: string) => {
        setCobrancas(prev =>
            prev.map(c =>
                c.id === id
                    ? { ...c, status: 'pago' as const, dataPagamento: new Date().toISOString() }
                    : c
            )
        );
    }; if (
        loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando cobranças...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Cobranças de Mensalistas</h2>
                    <p className="text-muted-foreground">
                        Gerencie as cobranças mensais dos seus mensalistas
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Cobrança
                    </Button>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Cobranças</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor Total</p>
                                <p className="text-2xl font-bold">R$ {stats.valorTotal.toFixed(2)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor Pago</p>
                                <p className="text-2xl font-bold text-green-600">R$ {stats.valorPago.toFixed(2)}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor Pendente</p>
                                <p className="text-2xl font-bold text-orange-600">R$ {stats.valorPendente.toFixed(2)}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>      {/* F
iltros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="status">Status</Label>
                            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Status</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="pago">Pago</SelectItem>
                                    <SelectItem value="vencido">Vencido</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="mes">Mês de Referência</Label>
                            <Select value={filtroMes} onValueChange={setFiltroMes}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os meses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Meses</SelectItem>
                                    <SelectItem value="2024-11">Novembro 2024</SelectItem>
                                    <SelectItem value="2024-10">Outubro 2024</SelectItem>
                                    <SelectItem value="2024-09">Setembro 2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Lista de Cobranças */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Cobranças</CardTitle>
                    <CardDescription>
                        {cobrancasFiltradas.length} cobrança(s) encontrada(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {cobrancasFiltradas.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhuma cobrança encontrada.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cobrancasFiltradas.map((cobranca) => (
                                <div
                                    key={cobranca.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-medium">{cobranca.nomeMensalista}</h4>
                                            {getStatusIcon(cobranca.status)}
                                            <Badge variant={getStatusVariant(cobranca.status)}>
                                                {getStatusLabel(cobranca.status)}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Venc: {format(new Date(cobranca.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                R$ {cobranca.valor.toFixed(2)}
                                            </div>
                                            <div>
                                                Ref: {format(new Date(cobranca.mesReferencia + '-01'), 'MMMM yyyy', { locale: ptBR })}
                                            </div>
                                        </div>

                                        {cobranca.dataPagamento && (
                                            <div className="text-xs text-green-600 mt-1">
                                                Pago em {format(new Date(cobranca.dataPagamento), 'dd/MM/yyyy', { locale: ptBR })}
                                                {cobranca.metodoPagamento && ` via ${cobranca.metodoPagamento.toUpperCase()}`}
                                            </div>
                                        )}

                                        {cobranca.observacoes && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {cobranca.observacoes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        {cobranca.status === 'pendente' && (
                                            <Button
                                                size="sm"
                                                onClick={() => marcarComoPago(cobranca.id)}
                                            >
                                                Marcar como Pago
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                            Detalhes
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}