'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvaliacaoForm } from '@/components/modules/core/avaliacoes';
import { useCreateAvaliacao } from '@/hooks/core/useAvaliacoes';
import { useToast } from '@/hooks/use-toast';
import type { CreateAvaliacaoData } from '@/lib/validations/avaliacao.schema';

interface ReservaInfo {
  id: string;
  quadra_nome: string;
  data: string;
  ja_avaliada: boolean;
}

export default function AvaliarReservaPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createAvaliacao, isPending: loading } = useCreateAvaliacao();
  
  const [reservaInfo, setReservaInfo] = useState<ReservaInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [success, setSuccess] = useState(false);

  const reservaId = params.reservaId as string;

  useEffect(() => {
    const fetchReservaInfo = async () => {
      try {
        const response = await fetch(`/api/reservas/${reservaId}/info`);
        if (!response.ok) throw new Error('Reserva não encontrada');
        
        const data = await response.json();
        setReservaInfo(data);
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as informações da reserva',
          variant: 'destructive',
        });
      } finally {
        setLoadingInfo(false);
      }
    };

    if (reservaId) {
      fetchReservaInfo();
    }
  }, [reservaId, toast]);

  const handleSubmit = async (data: CreateAvaliacaoData) => {
    try {
      await createAvaliacao(data);
      setSuccess(true);
      toast({
        title: 'Avaliação enviada!',
        description: 'Obrigado pelo seu feedback.',
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/cliente/reservas');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua avaliação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (loadingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!reservaInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Reserva não encontrada</h2>
            <p className="text-muted-foreground">
              Não foi possível encontrar esta reserva.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reservaInfo.ja_avaliada) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Já avaliado</h2>
            <p className="text-muted-foreground">
              Você já avaliou esta reserva. Obrigado pelo seu feedback!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Avaliação enviada!</h2>
            <p className="text-muted-foreground">
              Obrigado pelo seu feedback. Redirecionando...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Avalie sua experiência</CardTitle>
        </CardHeader>
        <CardContent>
          <AvaliacaoForm
            reservaId={reservaId}
            quadraNome={reservaInfo.quadra_nome}
            dataReserva={reservaInfo.data}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
