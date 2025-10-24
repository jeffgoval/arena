'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Link2, Users, Calendar, DollarSign, Copy, Check, Ban, ExternalLink } from 'lucide-react';
import { useReserva } from '@/hooks/core/useReservas';
import { useConvitesReserva, useCancelarConvite } from '@/hooks/core/useConvites';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { CONVITE_STATUS_LABELS, CONVITE_STATUS_COLORS } from '@/types/convites.types';

export const dynamic = 'force-dynamic';

export default function ConvitesReservaPage() {
  const params = useParams();
  const reserva_id = params?.id as string;

  const { data: reserva, isLoading: isLoadingReserva } = useReserva(reserva_id);
  const { data: convites, isLoading: isLoadingConvites } = useConvitesReserva(reserva_id);
  const cancelarConvite = useCancelarConvite();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const { handleError, handleSuccess } = useErrorHandler();

  const handleCancelar = async (convite_id: string) => {
    if (!confirm('Deseja realmente cancelar este convite? Esta ação não pode ser desfeita.')) return;

    try {
      await cancelarConvite.mutateAsync(convite_id);
      handleSuccess('Convite cancelado com sucesso');
    } catch (error) {
      handleError(error, 'CancelarConvite', 'Erro ao cancelar convite');
    }
  };

  if (isLoadingReserva || isLoadingConvites) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-dark/70 font-semibold">Carregando convites...</p>
        </div>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Reserva não encontrada</h2>
          <Link href="/cliente/reservas">
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all mt-4">
              Voltar para Reservas
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const dataReserva = new Date(reserva.data + 'T00:00:00');
  const dataFormatada = dataReserva.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/cliente/reservas/${reserva_id}`}>
            <button className="flex items-center gap-2 text-dark/60 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Voltar para Reserva</span>
            </button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-dark">Convites</h1>
              <p className="text-dark/60 mt-1">{dataFormatada}</p>
            </div>
            <Link href={`/cliente/reservas/${reserva_id}/convites/criar`}>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all">
                <Plus className="h-5 w-5" />
                Novo Convite
              </button>
            </Link>
          </div>
        </div>

        {/* Info da Reserva */}
        <div className="bg-white rounded-2xl border-2 border-dark/10 p-6 mb-6">
          <h2 className="text-xl font-bold text-dark mb-3">Detalhes da Reserva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-dark/60">Quadra</p>
              <p className="font-bold text-dark">{reserva.quadra?.nome}</p>
            </div>
            <div>
              <p className="text-dark/60">Horário</p>
              <p className="font-bold text-dark">
                {reserva.horario?.hora_inicio} - {reserva.horario?.hora_fim}
              </p>
            </div>
            <div>
              <p className="text-dark/60">Participantes Atuais</p>
              <p className="font-bold text-dark">{reserva.total_participantes || 0} pessoas</p>
            </div>
            <div>
              <p className="text-dark/60">Valor Total</p>
              <p className="font-bold text-dark">R$ {reserva.valor_total?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Lista de Convites */}
        {!convites || convites.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-12 text-center">
            <Link2 className="h-16 w-16 mx-auto text-dark/20 mb-4" />
            <h3 className="text-xl font-bold text-dark mb-2">Nenhum convite criado</h3>
            <p className="text-dark/60 mb-6">
              Crie convites para compartilhar vagas desta reserva com outras pessoas
            </p>
            <Link href={`/cliente/reservas/${reserva_id}/convites/criar`}>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all">
                <Plus className="h-5 w-5" />
                Criar Primeiro Convite
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {convites.map((convite) => {
              const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/convite/${convite.token}`;
              const vagasRestantes = convite.vagas_disponiveis - convite.total_aceites;
              const dataExpiracao = convite.data_expiracao
                ? new Date(convite.data_expiracao).toLocaleDateString('pt-BR')
                : null;

              return (
                <div key={convite.id} className="bg-white rounded-2xl border-2 border-dark/10 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-dark">Convite #{convite.token}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CONVITE_STATUS_COLORS[convite.status]}`}>
                          {CONVITE_STATUS_LABELS[convite.status]}
                        </span>
                      </div>

                      {convite.mensagem && (
                        <p className="text-sm text-dark/60 mb-3 italic">"{convite.mensagem}"</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-dark/80">
                            <strong>{convite.total_aceites}</strong> de <strong>{convite.vagas_disponiveis}</strong> vagas
                          </span>
                        </div>

                        {convite.valor_por_pessoa && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-dark/80">
                              R$ {convite.valor_por_pessoa.toFixed(2)} por pessoa
                            </span>
                          </div>
                        )}

                        {dataExpiracao && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-dark/80">
                              Expira em {dataExpiracao}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Link e Ações */}
                  {convite.status === 'ativo' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={link}
                          readOnly
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-dark/10 bg-gray text-dark/60 text-sm font-mono"
                        />
                        <button
                          onClick={() => copyLink(convite.token)}
                          className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                        >
                          {copiedToken === convite.token ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar Link
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-dark/5 hover:bg-dark/10 text-dark font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Abrir Link
                        </a>
                        {vagasRestantes > 0 && (
                          <button
                            onClick={() => handleCancelar(convite.id)}
                            disabled={cancelarConvite.isPending}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            <Ban className="w-4 h-4" />
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {convite.status !== 'ativo' && (
                    <div className="p-3 bg-dark/5 rounded-xl text-center">
                      <p className="text-sm text-dark/60">
                        {convite.status === 'completo'
                          ? 'Todas as vagas foram preenchidas'
                          : 'Este convite foi cancelado ou expirou'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
