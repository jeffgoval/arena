"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useQuadras } from "@/hooks/core/useQuadras";
import { useHorariosDisponiveis } from "@/hooks/core/useHorarios";
import { useTurmas } from "@/hooks/core/useTurmas";
import { useCreateReserva } from "@/hooks/core/useReservas";
import { createReservaSchema, type CreateReservaData } from "@/lib/validations/reserva.schema";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/auth/useUser";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { ModalPagamento } from "@/components/shared/pagamento/ModalPagamento";
import type { DadosResumo } from "@/components/shared/pagamento/ResumoFinanceiro";
import type { DadosComprovante } from "@/components/shared/pagamento/ComprovantePagamento";
import type { Reserva } from "@/types/reservas.types";

export default function NovaReservaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: userData } = useUser();

  const [selectedQuadra, setSelectedQuadra] = useState<string>("");
  const [selectedHorario, setSelectedHorario] = useState<string>("");
  const [selectedData, setSelectedData] = useState<string>("");
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [reservaCriada, setReservaCriada] = useState<Reserva | null>(null);

  const { data: quadras, isLoading: isLoadingQuadras } = useQuadras();
  const { data: horarios, isLoading: isLoadingHorarios } = useHorariosDisponiveis(
    selectedQuadra || undefined,
    selectedData || undefined
  );
  const { data: turmas } = useTurmas();
  const createReserva = useCreateReserva();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateReservaData>({
    resolver: zodResolver(createReservaSchema),
    defaultValues: {
      tipo: "avulsa",
      observacoes: "",
      turma_id: "",
    },
  });

  // Watch form values for summary
  const watchQuadraId = watch("quadra_id");
  const watchHorarioId = watch("horario_id");
  const watchData = watch("data");

  // Update state when form values change
  useEffect(() => {
    if (watchQuadraId) setSelectedQuadra(watchQuadraId);
  }, [watchQuadraId]);

  useEffect(() => {
    if (watchHorarioId) setSelectedHorario(watchHorarioId);
  }, [watchHorarioId]);

  useEffect(() => {
    if (watchData) setSelectedData(watchData);
  }, [watchData]);

  // Find selected items for display
  const quadraSelecionada = quadras?.find((q) => q.id === selectedQuadra);
  const horarioSelecionado = horarios?.find((h) => h.id === selectedHorario);

  const onSubmit = async (data: CreateReservaData) => {
    try {
      const reserva = await createReserva.mutateAsync(data);

      toast({
        title: "Reserva criada com sucesso!",
        description: "Prossiga para o pagamento para confirmar sua reserva.",
      });

      // Save reservation data and open payment modal
      setReservaCriada(reserva);
      setModalPagamentoAberto(true);
    } catch (error: any) {
      toast({
        title: "Erro ao criar reserva",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  // Prepare payment summary data
  const dadosResumoPagamento: DadosResumo | null = reservaCriada && quadraSelecionada && horarioSelecionado && selectedData
    ? {
        itens: [
          {
            descricao: `Reserva - ${quadraSelecionada.nome}`,
            valor: horarioSelecionado.valor_avulsa,
            quantidade: 1,
          }
        ],
        subtotal: horarioSelecionado.valor_avulsa,
        desconto: 0,
        taxas: 0,
        total: horarioSelecionado.valor_avulsa,
        detalhesReserva: {
          id: reservaCriada.id,
          quadra: quadraSelecionada.nome,
          data: format(new Date(selectedData + "T00:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
          horario: `${horarioSelecionado.hora_inicio} - ${horarioSelecionado.hora_fim}`,
        },
      }
    : null;

  const handlePagamentoConcluido = (comprovante: DadosComprovante) => {
    console.log('[NovaReserva] Pagamento concluído! Comprovante:', comprovante);

    // NÃO fechar o modal aqui!
    // O modal vai mostrar a tela de comprovante
    // O usuário vai fechar clicando no botão "Concluir" do comprovante

    // Mostrar toast informando que está pronto
    toast({
      title: comprovante.status === 'aprovado' ? "Pagamento confirmado!" : "Pagamento em processamento",
      description: comprovante.status === 'aprovado'
        ? "Sua reserva foi confirmada com sucesso."
        : "Aguardando confirmação do pagamento.",
    });
  };

  const handleFecharModalPagamento = () => {
    console.log('[NovaReserva] Fechando modal de pagamento...');

    // Se já criou uma reserva e processou pagamento, redirecionar
    if (reservaCriada) {
      console.log('[NovaReserva] Redirecionando para lista de reservas...');
      setModalPagamentoAberto(false);
      router.push("/cliente/reservas");
    } else {
      // Se não processou pagamento ainda, apenas fechar
      setModalPagamentoAberto(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/cliente/reservas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="heading-2">Nova Reserva</h1>
          <p className="body-medium text-muted-foreground">Reserve uma quadra para seu jogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="heading-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Detalhes da Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Data */}
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Jogo *</Label>
                  <Input
                    id="data"
                    type="date"
                    min={today}
                    {...register("data")}
                    className={errors.data ? "border-destructive" : ""}
                  />
                  {errors.data && (
                    <p className="text-sm text-destructive">{errors.data.message}</p>
                  )}
                </div>

                {/* Quadra */}
                <div className="space-y-2">
                  <Label htmlFor="quadra">Quadra *</Label>
                  {isLoadingQuadras ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Carregando quadras...</span>
                    </div>
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        setValue("quadra_id", value);
                        // Reset horario when quadra changes
                        setValue("horario_id", "");
                        setSelectedHorario("");
                      }}
                    >
                      <SelectTrigger className={errors.quadra_id ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione uma quadra" />
                      </SelectTrigger>
                      <SelectContent>
                        {quadras?.map((quadra) => (
                          <SelectItem key={quadra.id} value={quadra.id}>
                            {quadra.nome} - {quadra.tipo.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.quadra_id && (
                    <p className="text-sm text-destructive">{errors.quadra_id.message}</p>
                  )}
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário *</Label>
                  {!selectedQuadra || !selectedData ? (
                    <p className="text-sm text-muted-foreground">
                      Selecione uma quadra e data primeiro
                    </p>
                  ) : isLoadingHorarios ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Carregando horários disponíveis...</span>
                    </div>
                  ) : horarios && horarios.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum horário disponível para esta data
                    </p>
                  ) : (
                    <Select onValueChange={(value) => setValue("horario_id", value)}>
                      <SelectTrigger className={errors.horario_id ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {horarios?.map((horario) => (
                          <SelectItem key={horario.id} value={horario.id}>
                            {horario.hora_inicio} - {horario.hora_fim} (R${" "}
                            {horario.valor_avulsa.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.horario_id && (
                    <p className="text-sm text-destructive">{errors.horario_id.message}</p>
                  )}
                </div>

                {/* Turma (opcional) */}
                <div className="space-y-2">
                  <Label htmlFor="turma">Vincular Turma (opcional)</Label>
                  <Select onValueChange={(value) => setValue("turma_id", value === "none" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sem turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem turma</SelectItem>
                      {turmas?.map((turma) => (
                        <SelectItem key={turma.id} value={turma.id}>
                          {turma.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    {...register("observacoes")}
                    placeholder="Informações adicionais sobre o jogo..."
                    className="h-20"
                  />
                  {errors.observacoes && (
                    <p className="text-sm text-destructive">{errors.observacoes.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="border-0 shadow-soft sticky top-24">
              <CardHeader>
                <CardTitle className="heading-3">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quadraSelecionada && horarioSelecionado && selectedData ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{quadraSelecionada.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(selectedData + "T00:00:00"), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {horarioSelecionado.hora_inicio} - {horarioSelecionado.hora_fim}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Valor da quadra</span>
                        <span className="font-semibold">
                          R$ {horarioSelecionado.valor_avulsa.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          R$ {horarioSelecionado.valor_avulsa.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Criando reserva...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Confirmar Reserva
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Preencha os campos para ver o resumo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Payment Modal */}
      {dadosResumoPagamento && (
        <ModalPagamento
          aberto={modalPagamentoAberto}
          onFechar={handleFecharModalPagamento}
          dadosResumo={dadosResumoPagamento}
          saldoDisponivel={userData?.profile?.saldo_creditos || 0}
          onPagamentoConcluido={handlePagamentoConcluido}
        />
      )}
    </div>
  );
}
