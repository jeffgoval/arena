# Componentes de Rateio

Componentes para calcular e visualizar divisão de custos entre participantes.

## Componentes

### 1. RateioCalculator
Calculadora interativa para configurar rateio entre participantes.

**Props:**
- `valorTotal: number` - Valor total a ser dividido
- `participantesIniciais?: ParticipanteCalculo[]` - Lista inicial de participantes
- `onRateioCalculado?: (participantes, tipo) => void` - Callback quando o rateio é calculado
- `className?: string` - Classes CSS adicionais

**Interface ParticipanteCalculo:**
```tsx
interface ParticipanteCalculo {
  id: string;
  nome: string;
  email?: string;
  valor?: number;
  percentual?: number;
}
```

**Tipos de Rateio:**
- `igual` - Divide o valor igualmente entre todos
- `personalizado` - Define valor específico para cada pessoa
- `percentual` - Define percentual para cada pessoa

**Exemplo de uso:**
```tsx
import { RateioCalculator } from "@/components/shared/rateio";

function ConfigurarRateio() {
  const handleRateioCalculado = (participantes, tipo) => {
    console.log("Rateio configurado:", { participantes, tipo });
  };

  return (
    <RateioCalculator
      valorTotal={120.00}
      onRateioCalculado={handleRateioCalculado}
    />
  );
}
```

---

### 2. RateioVisualizer
Visualização do rateio configurado com status de pagamento.

**Props:**
- `configuracao: ConfiguracaoRateio` - Configuração do rateio
- `mostrarStatus?: boolean` - Exibir status de pagamento (padrão: false)
- `compacto?: boolean` - Modo compacto (padrão: false)
- `className?: string` - Classes CSS adicionais

**Interface ConfiguracaoRateio:**
```tsx
interface ConfiguracaoRateio {
  tipo: "igual" | "personalizado" | "percentual";
  valorTotal: number;
  participantes: ParticipanteRateio[];
  organizador?: {
    id: string;
    nome: string;
  };
}

interface ParticipanteRateio {
  id: string;
  nome: string;
  email?: string;
  valorPagar: number;
  percentual: number;
  statusPagamento?: "pago" | "pendente" | "atrasado";
  dataPagamento?: string;
}
```

**Exemplo de uso:**
```tsx
import { RateioVisualizer } from "@/components/shared/rateio";

function VisualizarRateio() {
  const configuracao = {
    tipo: "igual",
    valorTotal: 120.00,
    participantes: [
      {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        valorPagar: 40.00,
        percentual: 33.33,
        statusPagamento: "pago",
        dataPagamento: "22/10/2025"
      },
      {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        valorPagar: 40.00,
        percentual: 33.33,
        statusPagamento: "pendente"
      },
      {
        id: "3",
        nome: "Pedro Costa",
        email: "pedro@email.com",
        valorPagar: 40.00,
        percentual: 33.34,
        statusPagamento: "pendente"
      }
    ],
    organizador: {
      id: "1",
      nome: "João Silva"
    }
  };

  return (
    <RateioVisualizer
      configuracao={configuracao}
      mostrarStatus={true}
    />
  );
}
```

**Modo Compacto:**
```tsx
<RateioVisualizer
  configuracao={configuracao}
  compacto={true}
  mostrarStatus={true}
/>
```

---

## Fluxo Completo

Exemplo de como combinar os componentes em um fluxo de reserva com rateio:

```tsx
import { useState } from "react";
import { RateioCalculator, RateioVisualizer } from "@/components/shared/rateio";
import type { ParticipanteCalculo, ConfiguracaoRateio } from "@/components/shared/rateio";

function ReservaComRateio() {
  const [etapa, setEtapa] = useState<"calcular" | "visualizar">("calcular");
  const [configuracao, setConfiguracao] = useState<ConfiguracaoRateio | null>(null);
  
  const valorReserva = 120.00;

  const handleRateioCalculado = (participantes: ParticipanteCalculo[], tipo: TipoRateio) => {
    // Converte participantes calculados para configuração de rateio
    const config: ConfiguracaoRateio = {
      tipo,
      valorTotal: valorReserva,
      participantes: participantes.map(p => ({
        ...p,
        valorPagar: p.valor || 0,
        percentual: p.percentual || 0,
        statusPagamento: "pendente"
      })),
      organizador: {
        id: participantes[0].id,
        nome: participantes[0].nome
      }
    };
    
    setConfiguracao(config);
    setEtapa("visualizar");
  };

  return (
    <div className="space-y-6">
      {etapa === "calcular" && (
        <RateioCalculator
          valorTotal={valorReserva}
          onRateioCalculado={handleRateioCalculado}
        />
      )}

      {etapa === "visualizar" && configuracao && (
        <>
          <RateioVisualizer
            configuracao={configuracao}
            mostrarStatus={true}
          />
          <Button onClick={() => setEtapa("calcular")}>
            Editar Rateio
          </Button>
        </>
      )}
    </div>
  );
}
```

---

## Casos de Uso

### 1. Divisão Igual
Ideal para grupos onde todos pagam o mesmo valor:
```tsx
// 4 pessoas dividindo R$ 200,00
// Cada um paga: R$ 50,00
```

### 2. Valores Personalizados
Quando cada pessoa tem um valor específico:
```tsx
// João: R$ 80,00 (organizador)
// Maria: R$ 40,00
// Pedro: R$ 40,00
// Total: R$ 160,00
```

### 3. Por Percentual
Quando a divisão é proporcional:
```tsx
// João: 50% = R$ 60,00
// Maria: 30% = R$ 36,00
// Pedro: 20% = R$ 24,00
// Total: R$ 120,00
```

---

## Validações

O RateioCalculator valida automaticamente:

1. **Divisão Igual**: Sempre válida
2. **Valores Personalizados**: Soma dos valores deve ser igual ao total
3. **Por Percentual**: Soma dos percentuais deve ser 100%

Mensagens de erro são exibidas quando a validação falha.
