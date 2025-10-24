'use client';

export const runtime = 'edge';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTurma, useUpdateTurma } from '@/hooks/core/useTurmas';
import { FormTurma } from '@/components/modules/core/turmas/FormTurma';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { TeamFormData } from '@/lib/validations/turma.schema';

export const dynamic = 'force-dynamic';

export default function EditarTurmaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: turma, isLoading } = useTurma(id);
  const updateTurma = useUpdateTurma();
  const { handleError, handleSuccess } = useErrorHandler();

  const handleSubmit = async (data: TeamFormData) => {
    try {
      await updateTurma.mutateAsync({ id, data });
      handleSuccess(`Turma "${data.nome}" atualizada com sucesso!`, 'Turma atualizada');
      router.push('/cliente/turmas');
    } catch (error) {
      handleError(error, 'UpdateTurma', 'Erro ao atualizar turma');
    }
  };

  const handleCancel = () => {
    router.push('/cliente/turmas');
  };

  if (isLoading) {
    return (
      <div className="container-custom page-padding space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/cliente/turmas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="heading-2">Editar Turma</h1>
            <p className="body-medium text-muted-foreground">Carregando dados da turma...</p>
          </div>
        </div>

        {/* Loading Card */}
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">Carregando turma...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="container-custom page-padding space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/cliente/turmas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="heading-2">Editar Turma</h1>
            <p className="body-medium text-muted-foreground">Turma não encontrada</p>
          </div>
        </div>

        {/* Error Card */}
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <CardTitle className="heading-3 mb-2">Turma não encontrada</CardTitle>
            <p className="text-muted-foreground mb-6">A turma que você está procurando não existe ou foi removida.</p>
            <Link href="/cliente/turmas">
              <Button>Voltar para Turmas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/cliente/turmas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="heading-2">Editar Turma</h1>
          <p className="body-medium text-muted-foreground">{turma.nome}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="heading-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Informações da Turma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormTurma
            turma={turma}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
