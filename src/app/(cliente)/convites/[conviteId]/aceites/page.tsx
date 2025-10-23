'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, 
  AlertCircle, 
  Users, 
  Mail, 
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Convite, ConviteAceite } from '@/types/convites.types';
import { CONVITE_STATUS_LABELS, CONVITE_STATUS_COLORS } from '@/types/convites.types';

export default function ConviteAceitesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [convite, setConvite] = useState<Convite | null>(null);
  const [aceites, setAceites] = useState<ConviteAceite[]>([]);
  const [loading, setLoading] = useState(true);

  const conviteId = params.conviteId as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/convites/${conviteId}/aceites`);
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }

        const data = await response.json();
        setConvite(data.convite);
        setAceites(data.aceites);
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os aceites do convite',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (conviteId) {
      fetchData();
    }
  }, [conviteId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!convite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Convite não encontrado</h2>
            <p className="text-muted-foreground">
              Não foi possível encontrar este convite.
            </p>
            <Button 
              onClick={() => router.push('/cliente/convites')}
              className="mt-4"
            >
              Voltar para Convites
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vagasOcupadas = convite.vagas_totais - convite.vagas_disponiveis;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        onClick={() => router.push('/cliente/convites')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Convites
      </Button>

      {/* Informações do Convite */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {convite.reserva?.quadra?.nome || 'Quadra'}
              </CardTitle>
              <p className="text-muted-foreground">
                {convite.reserva?.quadra?.tipo || 'Tipo não especificado'}
              </p>
            </div>
            <Badge className={CONVITE_STATUS_COLORS[convite.status]}>
              {CONVITE_STATUS_LABELS[convite.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>
                {convite.reserva?.data 
                  ? format(new Date(convite.reserva.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  : 'Data não disponível'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>
                {convite.reserva?.horario?.hora_inicio || '--:--'} às{' '}
                {convite.reserva?.horario?.hora_fim || '--:--'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span>
                {vagasOcupadas} / {convite.vagas_totais} vagas ocupadas
              </span>
            </div>
          </div>

          {convite.mensagem && (
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="text-sm text-muted-foreground italic">
                "{convite.mensagem}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Aceites */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pessoas que Aceitaram ({aceites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aceites.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Ninguém aceitou este convite ainda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {aceites.map((aceite) => (
                <div
                  key={aceite.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{aceite.nome}</p>
                      {aceite.confirmado ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {aceite.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{aceite.email}</span>
                        </div>
                      )}
                      {aceite.whatsapp && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{aceite.whatsapp}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-sm text-muted-foreground">
                    {format(new Date(aceite.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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
