# Componentes de Calendário

Componentes reutilizáveis para seleção de datas, horários e visualização de agenda.

## Componentes

### 1. CalendarioReserva
Calendário mensal para seleção de data com indicação de disponibilidade.

**Props:**
- `dataSelecionada?: Date` - Data atualmente selecionada
- `onDataSelecionada: (data: Date) => void` - Callback quando uma data é selecionada
- `datasIndisponiveis?: Date[]` - Array de datas que não podem ser selecionadas
- `dataMinima?: Date` - Data mínima selecionável (padrão: hoje)
- `dataMaxima?: Date` - Data máxima selecionável
- `className?: string` - Classes CSS adicionais

**Exemplo de uso:**
```tsx
import { CalendarioReserva } from "@/components/shared/calendario";

function MinhaReserva() {
  const [data, setData] = useState<Date>();
  
  return (
    <CalendarioReserva
      dataSelecionada={data}
      onDataSelecionada={setData}
      datasIndisponiveis={[
        new Date(2025, 9, 25),
        new Date(2025, 9, 26)
      ]}
    />
  );
}
```

---

### 2. HorarioSelector
Grid de horários disponíveis com preços e vagas.

**Props:**
- `horarios: Horario[]` - Array de horários disponíveis
- `horarioSelecionado?: string` - ID do horário selecionado
- `onHorarioSelecionado: (horarioId: string) => void` - Callback quando um horário é selecionado
- `mostrarVagas?: boolean` - Exibir contador de vagas (padrão: false)
- `className?: string` - Classes CSS adicionais

**Interface Horario:**
```tsx
interface Horario {
  id: string;
  horaInicio: string;
  horaFim: string;
  preco: number;
  disponivel: boolean;
  vagasDisponiveis?: number;
  capacidadeTotal?: number;
}
```

**Exemplo de uso:**
```tsx
import { HorarioSelector } from "@/components/shared/calendario";

function SelecionarHorario() {
  const [horarioId, setHorarioId] = useState<string>();
  
  const horarios = [
    {
      id: "1",
      horaInicio: "08:00",
      horaFim: "09:00",
      preco: 60,
      disponivel: true,
      vagasDisponiveis: 5,
      capacidadeTotal: 14
    },
    {
      id: "2",
      horaInicio: "09:00",
      horaFim: "10:00",
      preco: 60,
      disponivel: false
    }
  ];
  
  return (
    <HorarioSelector
      horarios={horarios}
      horarioSelecionado={horarioId}
      onHorarioSelecionado={setHorarioId}
      mostrarVagas={true}
    />
  );
}
```

---

### 3. AgendaSemanal
Visualização em grade semanal de eventos/reservas.

**Props:**
- `eventos: EventoAgenda[]` - Array de eventos a exibir
- `onEventoClick?: (evento: EventoAgenda) => void` - Callback quando um evento é clicado
- `semanaInicial?: Date` - Data inicial da semana (padrão: semana atual)
- `className?: string` - Classes CSS adicionais

**Interface EventoAgenda:**
```tsx
interface EventoAgenda {
  id: string;
  titulo: string;
  horaInicio: string;
  horaFim: string;
  data: Date;
  tipo: "reserva" | "bloqueio" | "manutencao";
  status?: "confirmada" | "pendente" | "cancelada";
  cliente?: string;
  quadra?: string;
}
```

**Exemplo de uso:**
```tsx
import { AgendaSemanal } from "@/components/shared/calendario";

function MinhaAgenda() {
  const eventos = [
    {
      id: "1",
      titulo: "Reserva - João Silva",
      horaInicio: "19:00",
      horaFim: "20:00",
      data: new Date(2025, 9, 23),
      tipo: "reserva",
      status: "confirmada",
      cliente: "João Silva",
      quadra: "Quadra Society 1"
    },
    {
      id: "2",
      titulo: "Manutenção Grama",
      horaInicio: "08:00",
      horaFim: "12:00",
      data: new Date(2025, 9, 24),
      tipo: "manutencao"
    }
  ];
  
  return (
    <AgendaSemanal
      eventos={eventos}
      onEventoClick={(evento) => console.log(evento)}
    />
  );
}
```

---

## Fluxo Completo de Reserva

Exemplo de como combinar os componentes:

```tsx
import { useState } from "react";
import { 
  CalendarioReserva, 
  HorarioSelector, 
  type Horario 
} from "@/components/shared/calendario";

function FluxoReserva() {
  const [dataSelecionada, setDataSelecionada] = useState<Date>();
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>();
  
  // Buscar horários disponíveis para a data selecionada
  const horarios: Horario[] = dataSelecionada ? [
    // ... buscar da API
  ] : [];
  
  return (
    <div className="space-y-6">
      <CalendarioReserva
        dataSelecionada={dataSelecionada}
        onDataSelecionada={setDataSelecionada}
      />
      
      {dataSelecionada && (
        <HorarioSelector
          horarios={horarios}
          horarioSelecionado={horarioSelecionado}
          onHorarioSelecionado={setHorarioSelecionado}
          mostrarVagas={true}
        />
      )}
    </div>
  );
}
```
