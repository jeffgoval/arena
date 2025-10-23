'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Percent, AlertCircle, Users, Check } from 'lucide-react';
import { useReserva, useConfigurarRateio } from '@/hooks/core/useReservas';
import type { RateioMode } from '@/types/reservas.types';

export const dynamic = 'force-dynamic';

type ParticipanteRateio = {
  id: string;
  nome: string;
  valor?: number;
  percentual?: number;
};

export default function ConfigurarRateioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: reserva, isLoading } = useReserva(id);
  const configurarRateio = useConfigurarRateio();

  const [modo, setModo] = useState<RateioMode>('percentual');
  const [participantes, setParticipantes] = useState<ParticipanteRateio[]>([]);
  const [error, setError] = useState<string>('');

  // Inicializar participantes com dados da reserva
  useEffect(() => {
    if (reserva?.participantes) {
      const participantesInicial = reserva.participantes.map((p) => ({
        id: p.id,
        nome: p.nome,
        valor: p.valor_rateio || undefined,
        percentual: p.percentual_rateio || undefined,
      }));
      setParticipantes(participantesInicial);

      // Se já tem rateio configurado, usar o modo existente
      if (reserva.rateio_configurado && reserva.rateio_modo) {
        setModo(reserva.rateio_modo);
      }
    }
  }, [reserva]);

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

  if (!reserva || !reserva.participantes || reserva.participantes.length === 0) {
    return (
      <div className="min-h-screen bg-gray p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Adicione participantes primeiro</h2>
          <p className="text-dark/60 mb-6">
            Para configurar o rateio, é necessário ter participantes na reserva
          </p>
          <Link href={`/cliente/reservas/${id}`}>
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all">
              Voltar para Reserva
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const valorTotal = reserva.valor_total;
  const totalParticipantes = participantes.length;

  const calcularTotalPercentual = () => {
    return participantes.reduce((sum, p) => sum + (p.percentual || 0), 0);
  };

  const calcularTotalFixo = () => {
    return participantes.reduce((sum, p) => sum + (p.valor || 0), 0);
  };

  const dividirIgualmente = () => {
    if (modo === 'percentual') {
      const percentualPorPessoa = 100 / totalParticipantes;
      setParticipantes(
        participantes.map((p) => ({
          ...p,
          percentual: Number(percentualPorPessoa.toFixed(2)),
          valor: undefined,
        }))
      );
    } else {
      const valorPorPessoa = valorTotal / totalParticipantes;
      setParticipantes(
        participantes.map((p) => ({
          ...p,
          valor: Number(valorPorPessoa.toFixed(2)),
          percentual: undefined,
        }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (modo === 'percentual') {
      const total = calcularTotalPercentual();
      if (Math.abs(total - 100) > 0.01) {
        setError(`A soma dos percentuais deve ser 100% (atual: ${total.toFixed(2)}%)`);
        return;
      }
    } else {
      const total = calcularTotalFixo();
      if (total > valorTotal) {
        setError(`A soma dos valores (R$ ${total.toFixed(2)}) não pode ser maior que o valor total (R$ ${valorTotal.toFixed(2)})`);
        return;
      }
    }

    // Verificar se todos os participantes têm valor/percentual
    const todosPreenchidos = participantes.every((p) =>
      modo === 'percentual' ? p.percentual !== undefined && p.percentual > 0 : p.valor !== undefined && p.valor > 0
    );

    if (!todosPreenchidos) {
      setError('Todos os participantes devem ter um valor ou percentual atribuído');
      return;
    }

    try {
      await configurarRateio.mutateAsync({
        reserva_id: id,
        config: {
          modo,
          participantes: participantes.map((p) => ({
            participante_id: p.id,
            nome: p.nome,
            valor: modo === 'fixo' ? p.valor : undefined,
            percentual: modo === 'percentual' ? p.percentual : undefined,
          })),
        },
      });

      router.push(`/cliente/reservas/${id}`);
    } catch (error) {
      console.error('Erro ao configurar rateio:', error);
      setError('Erro ao salvar configuração. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/cliente/reservas/${id}`}>
            <button className="flex items-center gap-2 text-dark/60 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Voltar</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-dark">Configurar Rateio</h1>
          <p className="text-dark/60 mt-1">
            Defina como o valor total de R$ {valorTotal.toFixed(2)} será dividido
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modo de Rateio */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Modo de Divisão</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setModo('percentual');
                  setError('');
                }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  modo === 'percentual'
                    ? 'border-primary bg-primary/5'
                    : 'border-dark/10 hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Percent
                    className={`w-5 h-5 mt-0.5 ${modo === 'percentual' ? 'text-primary' : 'text-dark/40'}`}
                  />
                  <div>
                    <p className="font-bold text-dark">Percentual</p>
                    <p className="text-sm text-dark/60">Dividir por % (deve somar 100%)</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModo('fixo');
                  setError('');
                }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  modo === 'fixo' ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <DollarSign className={`w-5 h-5 mt-0.5 ${modo === 'fixo' ? 'text-primary' : 'text-dark/40'}`} />
                  <div>
                    <p className="font-bold text-dark">Valor Fixo</p>
                    <p className="text-sm text-dark/60">Atribuir valores específicos em R$</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={dividirIgualmente}
              className="mt-4 w-full px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold rounded-xl transition-all"
            >
              Dividir Igualmente Entre Todos
            </button>
          </div>

          {/* Lista de Participantes */}
          <div className="bg-white rounded-2xl border-2 border-dark/10 p-6">
            <h2 className="text-xl font-bold text-dark mb-4">
              Participantes ({totalParticipantes})
            </h2>

            <div className="space-y-3">
              {participantes.map((participante, index) => (
                <div key={participante.id} className="flex items-center gap-4 p-4 bg-gray rounded-xl">
                  <div className="flex-1">
                    <p className="font-bold text-dark">{participante.nome}</p>
                  </div>

                  {modo === 'percentual' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={participante.percentual || ''}
                        onChange={(e) => {
                          const novoValor = e.target.value ? Number(e.target.value) : undefined;
                          setParticipantes(
                            participantes.map((p, i) =>
                              i === index ? { ...p, percentual: novoValor, valor: undefined } : p
                            )
                          );
                          setError('');
                        }}
                        placeholder="0"
                        className="w-24 px-3 py-2 rounded-xl border-2 border-dark/10 focus:border-primary outline-none text-right font-bold"
                      />
                      <Percent className="w-4 h-4 text-dark/40" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-dark/60 font-semibold">R$</span>
                      <input
                        type="number"
                        min="0"
                        max={valorTotal}
                        step="0.01"
                        value={participante.valor || ''}
                        onChange={(e) => {
                          const novoValor = e.target.value ? Number(e.target.value) : undefined;
                          setParticipantes(
                            participantes.map((p, i) =>
                              i === index ? { ...p, valor: novoValor, percentual: undefined } : p
                            )
                          );
                          setError('');
                        }}
                        placeholder="0.00"
                        className="w-28 px-3 py-2 rounded-xl border-2 border-dark/10 focus:border-primary outline-none text-right font-bold"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div
            className={`rounded-2xl border-2 p-6 ${
              error ? 'bg-red-50 border-red-200' : 'bg-primary/5 border-primary/20'
            }`}
          >
            <h3 className="font-bold text-dark mb-3">Resumo</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-dark/70">Valor Total:</span>
                <span className="font-bold text-dark">R$ {valorTotal.toFixed(2)}</span>
              </div>

              {modo === 'percentual' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/70">Total Percentual:</span>
                    <span
                      className={`font-bold ${
                        Math.abs(calcularTotalPercentual() - 100) < 0.01 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {calcularTotalPercentual().toFixed(2)}%
                    </span>
                  </div>
                  {Math.abs(calcularTotalPercentual() - 100) < 0.01 && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Check className="w-4 h-4" />
                      <span>Percentuais somam 100%</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/70">Total Atribuído:</span>
                    <span
                      className={`font-bold ${
                        calcularTotalFixo() <= valorTotal ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      R$ {calcularTotalFixo().toFixed(2)}
                    </span>
                  </div>
                  {calcularTotalFixo() < valorTotal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-dark/70">Restante:</span>
                      <span className="font-bold text-amber-600">
                        R$ {(valorTotal - calcularTotalFixo()).toFixed(2)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-100 rounded-xl mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={configurarRateio.isPending}
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {configurarRateio.isPending ? 'Salvando...' : 'Salvar Configuração'}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-semibold mb-1">Dicas</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use o botão "Dividir Igualmente" para distribuir o valor de forma igual</li>
                <li>• No modo Percentual, a soma deve ser exatamente 100%</li>
                <li>• No modo Valor Fixo, a soma não pode exceder o valor total da reserva</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
