"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Trophy, 
  CreditCard, 
  Gift,
  Star,
  Clock,
  MapPin,
  DollarSign,
  HelpCircle,
  Info,
  Play
} from "lucide-react";

// Importar todos os componentes de tooltip
import { 
  ContextualTooltip, 
  HelpTooltip, 
  FeatureTooltip, 
  StatusTooltip 
} from "@/components/shared/ContextualTooltip";
import { 
  InlineTooltip, 
  DefinitionTooltip, 
  ValidationTooltip,
  ProgressTooltip 
} from "@/components/shared/InlineTooltip";
import { GuidedTour, useGuidedTour } from "@/components/shared/GuidedTour";
import {
  ReservaTooltip,
  RateioTooltip,
  IndicacoesTooltip,
  TurmasTooltip,
  CreditosTooltip,
  ReservaStatusTooltip,
  PontuacaoTooltip,
  HorarioTooltip,
  LocalizacaoTooltip,
  PrecoTooltip,
  MetaProgressoTooltip,
  NovidadeTooltip,
  AjudaContextual
} from "@/components/shared/ArenaTooltips";

export default function TooltipsExemploPage() {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  
  // Tour guiado
  const tour = useGuidedTour("tooltips-demo");

  const tourSteps = [
    {
      id: "step-1",
      target: "#tooltip-basicos",
      title: "Tooltips Básicos",
      content: "Estes são os tooltips básicos do sistema. Passe o mouse sobre os elementos para ver as informações.",
      placement: "bottom" as const
    },
    {
      id: "step-2", 
      target: "#tooltip-arena",
      title: "Tooltips do Arena",
      content: "Tooltips específicos para funcionalidades do Arena, com informações contextuais sobre reservas, rateios e mais.",
      placement: "bottom" as const
    },
    {
      id: "step-3",
      target: "#tooltip-interativos",
      title: "Tooltips Interativos",
      content: "Tooltips que permitem interação, como validação de formulários e progresso de metas.",
      placement: "top" as const
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = ["Campo obrigatório", "Formato inválido"];
    setFormErrors(errors);
    setShowValidation(true);
  };

  return (
    <div className="mobile-padding py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mobile-heading">Sistema de Tooltips</h1>
          <p className="mobile-body text-muted-foreground">
            Demonstração completa dos tooltips contextuais do Arena
          </p>
        </div>
        
        <Button onClick={tour.start} className="md:w-auto">
          <Play className="w-4 h-4 mr-2" />
          Iniciar Tour
        </Button>
      </div>

      {/* Tooltips Básicos */}
      <Card id="tooltip-basicos">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Tooltips Básicos
            <HelpTooltip
              content="Estes são os componentes básicos de tooltip que podem ser usados em qualquer lugar da aplicação."
              variant="info"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tooltip Contextual */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip Contextual</h3>
            <div className="flex flex-wrap gap-4">
              <ContextualTooltip
                content="Tooltip padrão com informações básicas"
                variant="default"
              >
                <Button variant="outline">Padrão</Button>
              </ContextualTooltip>

              <ContextualTooltip
                content="Informação importante sobre esta funcionalidade"
                variant="info"
                showIcon={true}
              >
                <Button variant="outline">
                  <Info className="w-4 h-4 mr-2" />
                  Info
                </Button>
              </ContextualTooltip>

              <ContextualTooltip
                content="Atenção! Esta ação pode ter consequências"
                variant="warning"
                showIcon={true}
              >
                <Button variant="outline">Aviso</Button>
              </ContextualTooltip>

              <ContextualTooltip
                content="Operação realizada com sucesso!"
                variant="success"
                showIcon={true}
              >
                <Button variant="outline">Sucesso</Button>
              </ContextualTooltip>

              <ContextualTooltip
                content="Erro ao processar a solicitação"
                variant="error"
                showIcon={true}
              >
                <Button variant="outline">Erro</Button>
              </ContextualTooltip>
            </div>
          </div>

          {/* Feature Tooltip */}
          <div className="space-y-3">
            <h3 className="font-semibold">Feature Tooltips</h3>
            <div className="flex flex-wrap gap-4">
              <FeatureTooltip
                title="Nova Funcionalidade"
                description="Esta é uma funcionalidade recém-lançada que vai melhorar sua experiência."
                isNew={true}
              >
                <Button>
                  <Star className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              </FeatureTooltip>

              <FeatureTooltip
                title="Funcionalidade Premium"
                description="Esta funcionalidade está disponível apenas para usuários premium."
                isPremium={true}
              >
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Premium
                </Button>
              </FeatureTooltip>
            </div>
          </div>

          {/* Status Tooltip */}
          <div className="space-y-3">
            <h3 className="font-semibold">Status Tooltips</h3>
            <div className="flex flex-wrap gap-4">
              <StatusTooltip
                status="success"
                title="Operação Concluída"
                description="Todos os processos foram finalizados com sucesso."
              >
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Ativo
                </Badge>
              </StatusTooltip>

              <StatusTooltip
                status="warning"
                title="Atenção Necessária"
                description="Esta operação requer sua atenção."
              >
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pendente
                </Badge>
              </StatusTooltip>

              <StatusTooltip
                status="error"
                title="Erro Detectado"
                description="Houve um problema que precisa ser resolvido."
              >
                <Badge variant="destructive">
                  Erro
                </Badge>
              </StatusTooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tooltips Específicos do Arena */}
      <Card id="tooltip-arena">
        <CardHeader>
          <CardTitle>Tooltips do Arena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Funcionalidades Principais */}
          <div className="space-y-3">
            <h3 className="font-semibold">Funcionalidades Principais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ReservaTooltip>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-xs">Reservas</span>
                </Button>
              </ReservaTooltip>

              <RateioTooltip>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-xs">Rateio</span>
                </Button>
              </RateioTooltip>

              <TurmasTooltip>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-xs">Turmas</span>
                </Button>
              </TurmasTooltip>

              <IndicacoesTooltip>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Gift className="w-6 h-6" />
                  <span className="text-xs">Indicações</span>
                </Button>
              </IndicacoesTooltip>
            </div>
          </div>

          {/* Status de Reservas */}
          <div className="space-y-3">
            <h3 className="font-semibold">Status de Reservas</h3>
            <div className="flex flex-wrap gap-4">
              <ReservaStatusTooltip status="confirmada">
                <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
              </ReservaStatusTooltip>

              <ReservaStatusTooltip status="pendente">
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </ReservaStatusTooltip>

              <ReservaStatusTooltip status="em_andamento">
                <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>
              </ReservaStatusTooltip>

              <ReservaStatusTooltip status="cancelada">
                <Badge variant="destructive">Cancelada</Badge>
              </ReservaStatusTooltip>
            </div>
          </div>

          {/* Informações Contextuais */}
          <div className="space-y-3">
            <h3 className="font-semibold">Informações Contextuais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span>Seus Créditos</span>
                  <CreditosTooltip>
                    <span className="font-semibold text-primary cursor-help">
                      R$ 150,00
                    </span>
                  </CreditosTooltip>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span>Pontuação</span>
                  <PontuacaoTooltip>
                    <span className="font-semibold text-primary cursor-help flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      1,250 pts
                    </span>
                  </PontuacaoTooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Local */}
          <div className="space-y-3">
            <h3 className="font-semibold">Informações de Local</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <HorarioTooltip
                horarios={{
                  abertura: "06:00",
                  fechamento: "23:00",
                  dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
                }}
              >
                <div className="p-4 border rounded-lg cursor-help">
                  <Clock className="w-5 h-5 mb-2 text-primary" />
                  <span className="text-sm">Horário</span>
                </div>
              </HorarioTooltip>

              <LocalizacaoTooltip
                endereco="Rua das Flores, 123 - Centro"
                distancia="2.5 km"
              >
                <div className="p-4 border rounded-lg cursor-help">
                  <MapPin className="w-5 h-5 mb-2 text-primary" />
                  <span className="text-sm">Localização</span>
                </div>
              </LocalizacaoTooltip>

              <PrecoTooltip
                preco={80}
                descricao="Preço por hora"
                promocao={{
                  precoOriginal: 100,
                  desconto: 20
                }}
              >
                <div className="p-4 border rounded-lg cursor-help">
                  <DollarSign className="w-5 h-5 mb-2 text-primary" />
                  <span className="text-sm">Preço</span>
                </div>
              </PrecoTooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tooltips Interativos */}
      <Card id="tooltip-interativos">
        <CardHeader>
          <CardTitle>Tooltips Interativos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tooltip Inline */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip Inline</h3>
            <div className="space-y-4">
              <InlineTooltip
                content={
                  <div className="space-y-2">
                    <h4 className="font-semibold">Informação Detalhada</h4>
                    <p>Este é um tooltip inline que aparece quando você clica no elemento.</p>
                    <p className="text-xs text-muted-foreground">
                      Você pode incluir qualquer conteúdo aqui, incluindo botões e links.
                    </p>
                  </div>
                }
                trigger="click"
                persistent={true}
                actions={[
                  {
                    label: "Entendi",
                    onClick: () => console.log("Clicou em entendi")
                  },
                  {
                    label: "Saiba mais",
                    onClick: () => console.log("Clicou em saiba mais"),
                    variant: "outline"
                  }
                ]}
              >
                <Button variant="outline">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Clique para mais info
                </Button>
              </InlineTooltip>
            </div>
          </div>

          {/* Definition Tooltip */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip de Definição</h3>
            <div className="text-sm">
              O <DefinitionTooltip
                term="Rateio"
                definition="Sistema que divide automaticamente os custos de uma reserva entre todos os participantes, facilitando o pagamento e controle financeiro."
                learnMoreUrl="https://arena.com/ajuda/rateio"
              /> é uma das principais funcionalidades da plataforma Arena.
            </div>
          </div>

          {/* Validation Tooltip */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip de Validação</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <ValidationTooltip
                  errors={formErrors}
                  isVisible={showValidation}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    className={showValidation && formErrors.length > 0 ? "border-red-500" : ""}
                  />
                </ValidationTooltip>
              </div>
              <Button type="submit">Validar</Button>
            </form>
          </div>

          {/* Progress Tooltip */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip de Progresso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetaProgressoTooltip
                meta={{
                  nome: "Meta de Reservas",
                  atual: 7,
                  total: 10,
                  recompensa: "R$ 50 em créditos"
                }}
              >
                <div className="p-4 border rounded-lg cursor-help">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Reservas do Mês</span>
                    <span className="text-xs text-muted-foreground">7/10</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[70%]" />
                  </div>
                </div>
              </MetaProgressoTooltip>

              <ProgressTooltip
                current={3}
                total={5}
                label="Indicações"
                details="Faltam apenas 2 indicações para ganhar o bônus!"
              >
                <div className="p-4 border rounded-lg cursor-help">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Programa de Indicações</span>
                    <span className="text-xs text-muted-foreground">3/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[60%]" />
                  </div>
                </div>
              </ProgressTooltip>
            </div>
          </div>

          {/* Novidade */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip de Novidade</h3>
            <NovidadeTooltip>
              <Button className="relative">
                Nova Funcionalidade
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </Button>
            </NovidadeTooltip>
          </div>
        </CardContent>
      </Card>

      {/* Tour Guiado */}
      <GuidedTour
        steps={tourSteps}
        isOpen={tour.isOpen}
        onClose={tour.close}
        onComplete={tour.complete}
        autoPlay={false}
        showProgress={true}
        showStepNumbers={true}
      />
    </div>
  );
}