'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Users,
  DollarSign,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Ban,
  Edit,
  Link2,
} from 'lucide-react';
import { useReserva, useCancelReserva, useVincularTurma, useAddParticipant, useRemoveParticipant } from '@/hooks/core/useReservas';
import { useTurmas } from '@/hooks/core/useTurmas';
import { RESERVA_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/types/reservas.types';
import { QUADRA_TIPO_LABELS, type QuadraTipo } from '@/types/quadras.types';

export const dynamic = 'force-dynamic';

export default function GerenciarReservaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: reserva, isLoading } = useReserva(id);
  const { data: turmas } = useTurmas();
  const cancelReserva = useCancelReserva();
  const vincularTurma = useVincularTurma();
  const addParticipant = useAddParticipant();
  const removeParticipant = useRemoveParticipant();

  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [novoParticipante, setNovoParticipante] = useState({ nome: '', email: '', whatsapp: '' });
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-dark/70 font-semibold">Carregando reserva...</p>
        </div>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
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

  const handleCancelReserva = async () => {
    try {
      await cancelReserva.mutateAsync(id);
      router.push('/cliente/reservas');
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      alert('Erro ao cancelar reserva');
    }
  };

  const handleVincularTurma = async () => {
    if (!turmaSelecionada) {
      alert('Selecione uma turma');
      return;
    }

    try {
      await vincularTurma.mutateAsync({
        reserva_id: id,
        turma_id: turmaSelecionada === 'remover' ? null : turmaSelecionada,
      });
      setTurmaSelecionada('');
    } catch (error) {
      console.error('Erro ao vincular turma:', error);
      alert('Erro ao vincular turma');
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novoParticipante.nome) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      await addParticipant.mutateAsync({
        reserva_id: id,
        data: novoParticipante,
      });
      setNovoParticipante({ nome: '', email: '', whatsapp: '' });
      setShowAddParticipant(false);
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      alert('Erro ao adicionar participante');
    }
  };

  const handleRemoveParticipant = async (participante_id: string) => {
    if (!confirm('Deseja remover este participante?')) return;

    try {
      await removeParticipant.mutateAsync({
        reserva_id: id,
        participante_id,
      });
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      alert('Erro ao remover participante');
    }
  };

  const dataReserva = new Date(reserva.data + 'T00:00:00');
  const dataFormatada = dataReserva.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isPast = new Date(reserva.data) < new Date();
  const canEdit = reserva.status !== 'cancelada' && !isPast;

  return (
    <div className="min-h-screen bg-gray p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cliente/reservas">
            <button className="flex items-center gap-2 text-dark/60 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Voltar</span>
            </button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-dark">Gerenciar Reserva</h1>
              <p className="text-dark/60 mt-1">{dataFormatada}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-xl font-bold text-sm ${
                reserva.status === 'confirmada'
                  ? 'bg-green-100 text-green-700'
                  : reserva.status === 'pendente'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {RESERVA_STATUS_LABELS[reserva.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalhes da Reserva */}
            <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
              <h2 className="text-xl font-bold text-dark mb-4">Detalhes da Reserva</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-dark/60">Quadra</p>
                    <p className="font-bold text-dark">
                      {reserva.quadra?.nome} - {reserva.quadra?.tipo && QUADRA_TIPO_LABELS[reserva.quadra.tipo as QuadraTipo]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-dark/60">Data</p>
                    <p className="font-bold text-dark">{dataFormatada}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-dark/60">Horário</p>
                    <p className="font-bold text-dark">
                      {reserva.horario?.hora_inicio} - {reserva.horario?.hora_fim}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-dark/60">Valor Total</p>
                    <p className="font-bold text-dark text-2xl">R$ {reserva.valor_total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {reserva.observacoes && (
                <div className="mt-4 p-4 bg-gray rounded-xl">
                  <p className="text-sm text-dark/60 mb-1">Observações</p>
                  <p className="text-dark">{reserva.observacoes}</p>
                </div>
              )}
            </div>

            {/* Turma Vinculada */}
            <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
              <h2 className="text-xl font-bold text-dark mb-4">Turma Vinculada</h2>

              {reserva.turma ? (
                <div className="p-4 bg-secondary/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-bold text-dark">{reserva.turma.nome}</p>
                        <p className="text-sm text-dark/60">
                          {reserva.turma.total_membros || 0} membro(s) na turma
                        </p>
                      </div>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => {
                          setTurmaSelecionada('remover');
                          handleVincularTurma();
                        }}
                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                      >
                        Desvincular
                      </button>
                    )}
                  </div>
                </div>
              ) : canEdit ? (
                <div>
                  <p className="text-dark/60 mb-3 text-sm">
                    Vincule uma turma para adicionar membros fixos automaticamente
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border-2 border-dark/10 focus:border-primary outline-none"
                    >
                      <option value="">Selecione uma turma</option>
                      {turmas?.map((turma) => (
                        <option key={turma.id} value={turma.id}>
                          {turma.nome} ({turma.total_fixos || 0} fixos)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleVincularTurma}
                      disabled={!turmaSelecionada || vincularTurma.isPending}
                      className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                    >
                      Vincular
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-dark/60 text-sm">Nenhuma turma vinculada</p>
              )}
            </div>

            {/* Participantes */}
            <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">
                  Participantes ({reserva.participantes?.length || 0})
                </h2>
                {canEdit && (
                  <button
                    onClick={() => setShowAddParticipant(!showAddParticipant)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Adicionar
                  </button>
                )}
              </div>

              {/* Formulário Adicionar Participante */}
              {showAddParticipant && (
                <form onSubmit={handleAddParticipant} className="mb-4 p-4 bg-gray rounded-xl">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nome *"
                      value={novoParticipante.nome}
                      onChange={(e) => setNovoParticipante({ ...novoParticipante, nome: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-dark/10 focus:border-primary outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email (opcional)"
                      value={novoParticipante.email}
                      onChange={(e) => setNovoParticipante({ ...novoParticipante, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-dark/10 focus:border-primary outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp (opcional)"
                      value={novoParticipante.whatsapp}
                      onChange={(e) => setNovoParticipante({ ...novoParticipante, whatsapp: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-dark/10 focus:border-primary outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={addParticipant.isPending}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                      >
                        {addParticipant.isPending ? 'Adicionando...' : 'Adicionar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddParticipant(false)}
                        className="px-4 py-2 bg-dark/10 hover:bg-dark/20 text-dark font-semibold rounded-xl transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Lista de Participantes */}
              {!reserva.participantes || reserva.participantes.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-dark/20 mb-2" />
                  <p className="text-dark/60">Nenhum participante adicionado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reserva.participantes.map((participante) => (
                    <div
                      key={participante.id}
                      className="flex items-center justify-between p-4 bg-gray rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-dark">{participante.nome}</p>
                        <div className="flex items-center gap-3 text-sm text-dark/60 mt-1">
                          {participante.email && <span>{participante.email}</span>}
                          {participante.whatsapp && <span>{participante.whatsapp}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              participante.status_pagamento === 'pago'
                                ? 'bg-green-100 text-green-700'
                                : participante.status_pagamento === 'pendente'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {PAYMENT_STATUS_LABELS[participante.status_pagamento]}
                          </span>
                          {participante.valor_rateio && (
                            <span className="text-xs text-dark/60">
                              R$ {participante.valor_rateio.toFixed(2)}
                            </span>
                          )}
                          {participante.percentual_rateio && (
                            <span className="text-xs text-dark/60">
                              {participante.percentual_rateio}%
                            </span>
                          )}
                        </div>
                      </div>
                      {canEdit && (
                        <button
                          onClick={() => handleRemoveParticipant(participante.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar de Ações */}
          <div className="space-y-4">
            {/* Rateio */}
            {canEdit && reserva.participantes && reserva.participantes.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
                <h3 className="font-bold text-dark mb-3">Configurar Rateio</h3>
                <p className="text-sm text-dark/60 mb-4">
                  Configure como o valor será dividido entre os participantes
                </p>
                <Link href={`/cliente/reservas/${id}/rateio`}>
                  <button className="w-full px-4 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {reserva.rateio_configurado ? 'Editar Rateio' : 'Configurar Rateio'}
                  </button>
                </Link>
              </div>
            )}

            {/* Convites */}
            {canEdit && (
              <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
                <h3 className="font-bold text-dark mb-3">Convites</h3>
                <p className="text-sm text-dark/60 mb-4">
                  Crie links para compartilhar vagas desta reserva
                </p>
                <Link href={`/cliente/reservas/${id}/convites`}>
                  <button className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Gerenciar Convites
                  </button>
                </Link>
              </div>
            )}

            {/* Status do Rateio */}
            {reserva.rateio_configurado && (
              <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-900 mb-1">Rateio Configurado</p>
                    <p className="text-sm text-green-800">
                      Modo: {reserva.rateio_modo === 'fixo' ? 'Valor Fixo' : 'Percentual'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cancelar Reserva */}
            {canEdit && (
              <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
                <h3 className="font-bold text-red-900 mb-2">Cancelar Reserva</h3>
                <p className="text-sm text-red-800 mb-4">
                  Esta ação não pode ser desfeita. A reserva será cancelada permanentemente.
                </p>
                {!showConfirmCancel ? (
                  <button
                    onClick={() => setShowConfirmCancel(true)}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Cancelar Reserva
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-red-900 font-semibold">Tem certeza?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelReserva}
                        disabled={cancelReserva.isPending}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                      >
                        Sim, cancelar
                      </button>
                      <button
                        onClick={() => setShowConfirmCancel(false)}
                        className="flex-1 px-4 py-2 bg-dark/10 hover:bg-dark/20 text-dark font-semibold rounded-xl transition-all"
                      >
                        Não
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info sobre reserva passada/cancelada */}
            {!canEdit && (
              <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-900 mb-1">Reserva Finalizada</p>
                    <p className="text-sm text-blue-800">
                      {reserva.status === 'cancelada'
                        ? 'Esta reserva foi cancelada'
                        : 'Esta reserva já foi realizada'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
