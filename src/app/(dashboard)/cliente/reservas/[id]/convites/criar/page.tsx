'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Link2, Users, MessageSquare, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { useReserva } from '@/hooks/core/useReservas';
import { useCreateConvite } from '@/hooks/core/useConvites';

export const dynamic = 'force-dynamic';

export default function CriarConvitePage() {
  const router = useRouter();
  const params = useParams();
  const reserva_id = params?.id as string;

  const { data: reserva, isLoading } = useReserva(reserva_id);
  const createConvite = useCreateConvite();

  const [vagas, setVagas] = useState<number>(5);
  const [mensagem, setMensagem] = useState<string>('');
  const [valorSugerido, setValorSugerido] = useState<number | undefined>(undefined);
  const [diasValidade, setDiasValidade] = useState<number>(7);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createConvite.mutateAsync({
        reserva_id,
        vagas_disponiveis: vagas,
        mensagem: mensagem || '',
        valor_por_pessoa: valorSugerido,
        dias_validade: diasValidade,
      });

      router.push(`/cliente/reservas/${reserva_id}/convites`);
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      alert('Erro ao criar convite. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-dark/70 font-semibold">Carregando...</p>
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

  const dataReserva = new Date(reserva.data + 'T00:00:00');
  const dataFormatada = dataReserva.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/cliente/reservas/${reserva_id}/convites`}>
            <button className="flex items-center gap-2 text-dark/60 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Voltar</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-dark">Criar Convite</h1>
          <p className="text-dark/60 mt-1">Gere um link único para compartilhar vagas da sua reserva</p>
        </div>

        {/* Info da Reserva */}
        <div className="bg-primary/5 rounded-2xl border-2 border-primary/20 p-6 mb-6">
          <h3 className="font-bold text-dark mb-3">Reserva</h3>
          <div className="space-y-1 text-sm">
            <p className="text-dark/80">
              <strong>Quadra:</strong> {reserva.quadra?.nome}
            </p>
            <p className="text-dark/80">
              <strong>Data:</strong> {dataFormatada}
            </p>
            <p className="text-dark/80">
              <strong>Horário:</strong> {reserva.horario?.hora_inicio} - {reserva.horario?.hora_fim}
            </p>
            <p className="text-dark/80">
              <strong>Valor Total:</strong> R$ {reserva.valor_total?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vagas Disponíveis */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-dark">Vagas Disponíveis</h2>
            </div>
            <p className="text-sm text-dark/60 mb-3">
              Quantas pessoas podem aceitar este convite?
            </p>
            <input
              type="number"
              min="1"
              max="50"
              value={vagas}
              onChange={(e) => setVagas(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all font-bold text-lg"
              required
            />
          </div>

          {/* Mensagem Personalizada */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-dark">
                Mensagem Personalizada <span className="text-dark/40 text-sm">(Opcional)</span>
              </h2>
            </div>
            <p className="text-sm text-dark/60 mb-3">
              Adicione uma mensagem que será exibida para os convidados
            </p>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Ex: Pessoal, vamos jogar no sábado! Quem tá dentro?"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all resize-none"
            />
            <p className="text-xs text-dark/40 mt-1">{mensagem.length}/500 caracteres</p>
          </div>

          {/* Valor Sugerido */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-dark">
                Valor por Pessoa <span className="text-dark/40 text-sm">(Opcional)</span>
              </h2>
            </div>
            <p className="text-sm text-dark/60 mb-3">
              Sugira um valor que cada pessoa deverá contribuir
            </p>
            <div className="flex items-center gap-2">
              <span className="text-dark/60 font-semibold">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorSugerido || ''}
                onChange={(e) => setValorSugerido(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all font-bold"
              />
            </div>
            {reserva.valor_total && vagas > 0 && (
              <p className="text-xs text-dark/40 mt-2">
                Sugestão: R$ {(reserva.valor_total / (vagas + (reserva.total_participantes || 1))).toFixed(2)} por pessoa
                (baseado no valor total dividido por {vagas + (reserva.total_participantes || 1)} pessoas)
              </p>
            )}
          </div>

          {/* Validade */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-dark">Validade do Convite</h2>
            </div>
            <p className="text-sm text-dark/60 mb-3">
              Por quantos dias o convite ficará disponível?
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={diasValidade}
                onChange={(e) => setDiasValidade(Number(e.target.value))}
                className="w-24 px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all font-bold text-center"
                required
              />
              <span className="text-dark/60 font-semibold">dias</span>
            </div>
            <p className="text-xs text-dark/40 mt-2">
              O convite expirará em {new Date(Date.now() + diasValidade * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Botão de Criar */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <button
              type="submit"
              disabled={createConvite.isPending}
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Link2 className="w-5 h-5" />
              {createConvite.isPending ? 'Criando convite...' : 'Criar Convite'}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-semibold mb-1">Como funciona?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Você receberá um link único para compartilhar</li>
                <li>• Os convidados poderão aceitar até preencher todas as vagas</li>
                <li>• Quem aceitar será adicionado automaticamente como participante</li>
                <li>• Você pode criar múltiplos convites para a mesma reserva</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
