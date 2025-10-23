'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Home,
} from 'lucide-react';
import { useConviteByToken, useAceitarConvite } from '@/hooks/core/useConvites';
import { QUADRA_TIPO_LABELS, type QuadraTipo } from '@/types/quadras.types';

export const dynamic = 'force-dynamic';

export default function ConvitePublicoPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const { data: convite, isLoading } = useConviteByToken(token);
  const aceitarConvite = useAceitarConvite();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [aceito, setAceito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert('Por favor, informe seu nome');
      return;
    }

    try {
      await aceitarConvite.mutateAsync({
        token,
        data: { nome, email: email || '', whatsapp: whatsapp || '' },
      });

      setAceito(true);
    } catch (error: any) {
      console.error('Erro ao aceitar convite:', error);
      alert(error.message || 'Erro ao aceitar convite. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-dark/70 font-semibold">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (!convite) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-8">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-dark mb-2">Convite não encontrado</h2>
            <p className="text-dark/60 mb-6">
              Este link de convite não é válido ou não existe mais.
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto">
                <Home className="w-4 h-4" />
                Ir para Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (convite.status !== 'ativo') {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-8">
            <AlertCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-dark mb-2">Convite Indisponível</h2>
            <p className="text-dark/60 mb-6">
              {convite.status === 'completo'
                ? 'Todas as vagas deste convite já foram preenchidas.'
                : 'Este convite expirou ou foi cancelado.'}
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto">
                <Home className="w-4 h-4" />
                Ir para Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (aceito) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Presença Confirmada! 🎉</h2>
            <p className="text-dark/60 mb-6">
              Você foi adicionado à reserva com sucesso. O organizador já foi notificado.
            </p>

            <div className="bg-primary/5 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-dark mb-2">Detalhes da Reserva:</p>
              <div className="text-sm text-dark/70 space-y-1">
                <p>
                  <strong>Data:</strong>{' '}
                  {convite.reserva?.data &&
                    new Date(convite.reserva.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                </p>
                <p>
                  <strong>Horário:</strong> {convite.reserva?.horario?.hora_inicio} -{' '}
                  {convite.reserva?.horario?.hora_fim}
                </p>
                <p>
                  <strong>Local:</strong> {convite.reserva?.quadra?.nome}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <button className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Ir para Home
                </button>
              </Link>

              <Link href="/auth">
                <button className="w-full px-6 py-3 bg-dark/5 hover:bg-dark/10 text-dark font-semibold rounded-xl transition-all">
                  Criar Conta / Fazer Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const vagasRestantes = convite.vagas_disponiveis - convite.total_aceites;
  const dataReserva = convite.reserva?.data
    ? new Date(convite.reserva.data + 'T00:00:00')
    : null;
  const dataFormatada = dataReserva?.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">Você foi convidado!</h1>
          <p className="text-dark/60">
            {convite.organizador?.nome_completo || 'Alguém'} está te convidando para jogar
          </p>
        </div>

        {/* Mensagem do Organizador */}
        {convite.mensagem && (
          <div className="bg-secondary/10 rounded-2xl border-2 border-secondary/20 p-6 mb-6">
            <p className="text-dark/80 italic text-center">"{convite.mensagem}"</p>
          </div>
        )}

        {/* Detalhes da Reserva */}
        <div className="bg-white rounded-2xl border-2 border-dark/10 p-6 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">Detalhes</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-dark/60">Quadra</p>
                <p className="font-bold text-dark">
                  {convite.reserva?.quadra?.nome} -{' '}
                  {convite.reserva?.quadra?.tipo && QUADRA_TIPO_LABELS[convite.reserva.quadra.tipo as QuadraTipo]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-dark/60">Data</p>
                <p className="font-bold text-dark">{dataFormatada}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-dark/60">Horário</p>
                <p className="font-bold text-dark">
                  {convite.reserva?.horario?.hora_inicio} - {convite.reserva?.horario?.hora_fim}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-dark/60">Vagas Disponíveis</p>
                <p className="font-bold text-dark">
                  {vagasRestantes} de {convite.vagas_disponiveis} vagas
                </p>
              </div>
            </div>

            {convite.valor_por_pessoa && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-dark/60">Valor Sugerido</p>
                  <p className="font-bold text-dark">R$ {convite.valor_por_pessoa.toFixed(2)} por pessoa</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Aceite */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-dark/10 p-6 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4">Confirmar Presença</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Email <span className="text-dark/40 font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                WhatsApp <span className="text-dark/40 font-normal">(opcional)</span>
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 rounded-xl border-2 border-dark/10 focus:border-primary outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={aceitarConvite.isPending}
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              {aceitarConvite.isPending ? 'Confirmando...' : 'Confirmar Presença'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-dark/60 mb-2">Já tem conta?</p>
          <Link href="/auth">
            <button className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Fazer Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
