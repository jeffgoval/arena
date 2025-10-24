"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, Edit, Trash2, UserCheck, UserX, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TurmaSkeletonList } from "@/components/shared/loading/TurmaSkeleton";
import { useTurmas, useDeleteTurma } from "@/hooks/core/useTurmas";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function TurmasPage() {
  const { data: turmas, isLoading } = useTurmas();
  const deleteTurma = useDeleteTurma();
  const { handleError, handleSuccess } = useErrorHandler();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a turma "${nome}"?`)) return;

    setDeletingId(id);
    try {
      await deleteTurma.mutateAsync(id);
      handleSuccess(`A turma "${nome}" foi excluída com sucesso.`, "Turma excluída");
    } catch (error) {
      handleError(error, 'DeleteTurma', 'Erro ao excluir turma');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom page-padding space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-2">Minhas Turmas</h1>
            <p className="body-medium text-muted-foreground">Gerencie seus times fixos</p>
          </div>
          <Link href="/cliente/turmas/criar">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              Nova Turma
            </Button>
          </Link>
        </div>

        {/* Skeleton Loading */}
        <TurmaSkeletonList count={6} />
      </div>
    );
  }

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2">Minhas Turmas</h1>
          <p className="body-medium text-muted-foreground">Gerencie seus times fixos</p>
        </div>
        <Link href="/cliente/turmas/criar">
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            Nova Turma
          </Button>
        </Link>
      </div>

      {/* Teams List */}
      {!turmas || turmas.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <CardTitle className="heading-3 mb-2">Nenhuma turma cadastrada</CardTitle>
            <CardDescription className="body-medium mb-6">
              Crie sua primeira turma para organizar seus times fixos
            </CardDescription>
            <Link href="/cliente/turmas/criar">
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Criar Primeira Turma
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma: any) => {
            // Calculate member statistics
            const totalMembros = turma.turma_membros?.length || 0;
            const membrosFixos = turma.turma_membros?.filter((m: any) => m.status === 'fixo').length || 0;
            const membrosVariaveis = turma.turma_membros?.filter((m: any) => m.status === 'variavel').length || 0;

            return (
              <Card key={turma.id} className="card-interactive border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="heading-4">{turma.nome}</CardTitle>
                  <CardDescription>
                    {turma.descricao || 'Sem descrição'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-xl">
                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold text-foreground">{totalMembros}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                      <UserCheck className="w-5 h-5 mx-auto text-success mb-1" />
                      <p className="text-2xl font-bold text-foreground">{membrosFixos}</p>
                      <p className="text-xs text-muted-foreground">Fixos</p>
                    </div>
                    <div className="text-center">
                      <UserX className="w-5 h-5 mx-auto text-warning mb-1" />
                      <p className="text-2xl font-bold text-foreground">{membrosVariaveis}</p>
                      <p className="text-xs text-muted-foreground">Variáveis</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/cliente/turmas/${turma.id}/editar`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(turma.id, turma.nome)}
                      disabled={deletingId === turma.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {deletingId === turma.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      {turmas && turmas.length > 0 && (
        <Card className="border-info/20 bg-info/5 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-info font-semibold mb-1">
                  Sobre Membros Fixos e Variáveis
                </p>
                <p className="text-sm text-info/80">
                  <strong>Fixos</strong> são sempre incluídos nas reservas automaticamente.
                  <strong> Variáveis</strong> podem ser incluídos opcionalmente a cada jogo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
