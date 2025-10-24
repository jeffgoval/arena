'use client';

import { Users, GraduationCap, Search, Loader2, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTurmasGestor } from '@/hooks/core/useTurmas';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function TurmasPage() {
    // Hooks de dados
    const { data: turmas, isLoading, error } = useTurmasGestor();

    // Estado local
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Estatísticas calculadas
    const stats = useMemo(() => {
        if (!turmas) return {
            totalTurmas: 0,
            totalMembros: 0,
        };

        return {
            totalTurmas: turmas.length,
            totalMembros: turmas.reduce((acc, t) => acc + (t.total_membros || 0), 0),
        };
    }, [turmas]);

    // Filtros
    const filteredTurmas = useMemo(() => {
        if (!turmas) return [];

        return turmas.filter(turma => {
            const matchesSearch =
                turma.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                turma.organizador?.nome_completo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [turmas, debouncedSearchTerm]);

    return (
        <div className="container-custom page-padding space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-primary" />
                        Turmas
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitore todas as turmas criadas na arena
                    </p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-destructive">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertCircle className="w-6 h-6" />
                            <div>
                                <h3 className="font-semibold">Erro ao carregar turmas</h3>
                                <p className="text-sm text-muted-foreground">
                                    {error instanceof Error ? error.message : 'Ocorreu um erro ao buscar os dados'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <GraduationCap className="w-8 h-8 text-primary mb-2" />
                        <p className="text-3xl font-bold text-foreground">{stats.totalTurmas}</p>
                        <p className="text-sm text-muted-foreground">Total de Turmas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <Users className="w-8 h-8 text-success mb-2" />
                        <p className="text-3xl font-bold text-success">{stats.totalMembros}</p>
                        <p className="text-sm text-muted-foreground">Total de Membros</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Buscar turmas ou organizadores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Turmas */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Turmas ({filteredTurmas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Carregando turmas...</p>
                        </div>
                    ) : filteredTurmas.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhuma turma encontrada.</p>
                            <p className="text-sm">Tente ajustar os filtros ou criar uma nova turma.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Organizador</TableHead>
                                    <TableHead>Membros</TableHead>
                                    <TableHead>Fixos</TableHead>
                                    <TableHead>Variáveis</TableHead>
                                    <TableHead>Criada em</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTurmas.map((turma) => (
                                    <TableRow key={turma.id}>
                                        <TableCell>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-5 h-5 text-primary" />
                                                    <span className="font-semibold">{turma.nome}</span>
                                                </div>
                                                {turma.descricao && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {turma.descricao}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {turma.organizador?.nome_completo || 'N/A'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-semibold">
                                                {turma.total_membros || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {turma.total_fixos || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {turma.total_variaveis || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {format(new Date(turma.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}