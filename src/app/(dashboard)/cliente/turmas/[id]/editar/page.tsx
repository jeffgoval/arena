'use client';

export const runtime = 'edge';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTurma, useUpdateTurma } from '@/hooks/core/useTurmas';
import { FormTurma } from '@/components/modules/core/turmas/FormTurma';
import type { TeamFormData } from '@/lib/validations/turma.schema';

export const dynamic = 'force-dynamic';

export default function EditarTurmaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: turma, isLoading } = useTurma(id);
  const updateTurma = useUpdateTurma();

  const handleSubmit = async (data: TeamFormData) => {
    await updateTurma.mutateAsync({ id, data });
    router.push('/cliente/turmas');
  };

  const handleCancel = () => {
    router.push('/cliente/turmas');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-dark/70 font-semibold">Carregando turma...</p>
        </div>
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark/70 font-semibold">Turma não encontrada</p>
          <Link href="/cliente/turmas" className="text-primary hover:text-primary/80 font-semibold mt-4 inline-block">
            Voltar para Turmas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cliente/turmas" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-4">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Turmas
          </Link>
          <h1 className="text-3xl font-bold text-dark">Editar Turma</h1>
          <p className="text-dark/60 mt-1">{turma.nome}</p>
        </div>

        {/* Card com Formulário */}
        <div className="bg-white rounded-2xl p-8 border-2 border-dark/10">
          <FormTurma
            turma={turma}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
