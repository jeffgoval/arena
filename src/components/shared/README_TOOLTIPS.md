# Sistema de Tooltips Contextuais - Arena

Este documento explica como usar o sistema completo de tooltips implementado para melhorar a experiência do usuário.

## 🎯 Visão Geral

O sistema de tooltips do Arena oferece:
- ✅ Tooltips básicos com diferentes variantes
- ✅ Tooltips específicos para funcionalidades do Arena
- ✅ Tooltips interativos com ações
- ✅ Sistema de tour guiado para onboarding
- ✅ Tooltips inline para informações detalhadas
- ✅ Validação de formulários com tooltips
- ✅ Tooltips de progresso e status

## 📚 Componentes Principais

### 1. ContextualTooltip
Tooltip básico com diferentes variantes e estilos.

```tsx
import { ContextualTooltip } from '@/components/shared/ContextualTooltip';

<ContextualTooltip
  content="Informação importante sobre esta funcionalidade"
  variant="info"
  showIcon={true}
  side="top"
  maxWidth="md"
>
  <Button>Hover me</Button>
</ContextualTooltip>
```

**Variantes disponíveis:**
- `default` - Tooltip padrão
- `info` - Informação (azul)
- `warning` - Aviso (amarelo)
- `success` - Sucesso (verde)
- `error` - Erro (vermelho)
- `tip` - Dica (roxo)
- `feature` - Nova funcionalidade (índigo)
- `premium` - Funcionalidade premium (gradiente dourado)

### 2. HelpTooltip
Ícone de ajuda com tooltip informativo.

```tsx
import { HelpTooltip } from '@/components/shared/ContextualTooltip';

<div className="flex items-center gap-2">
  <span>Campo complexo</span>
  <HelpTooltip
    content="Explicação detalhada sobre este campo e como preenchê-lo corretamente."
    variant="info"
    maxWidth="lg"
  />
</div>
```

### 3. FeatureTooltip
Tooltip para destacar funcionalidades novas ou premium.

```tsx
import { FeatureTooltip } from '@/components/shared/ContextualTooltip';

<FeatureTooltip
  title="Nova Funcionalidade"
  description="Esta funcionalidade foi recém-lançada e vai melhorar sua experiência."
  isNew={true}
>
  <Button>Nova Feature</Button>
</FeatureTooltip>

<FeatureTooltip
  title="Funcionalidade Premium"
  description="Disponível apenas para usuários premium."
  isPremium={true}
>
  <Button>Premium Feature</Button>
</FeatureTooltip>
```

### 4. StatusTooltip
Tooltip para mostrar status com cores e ícones apropriados.

```tsx
import { StatusTooltip } from '@/components/shared/ContextualTooltip';

<StatusTooltip
  status="success"
  title="Operação Concluída"
  description="Todos os processos foram finalizados com sucesso."
>
  <Badge variant="success">Ativo</Badge>
</StatusTooltip>
```

### 5. InlineTooltip
Tooltip que aparece inline com o conteúdo, ideal para informações detalhadas.

```tsx
import { InlineTooltip } from '@/components/shared/InlineTooltip';

<InlineTooltip
  content={
    <div>
      <h4>Título da Informação</h4>
      <p>Descrição detalhada...</p>
    </div>
  }
  trigger="click"
  persistent={true}
  actions={[
    {
      label: "Entendi",
      onClick: () => console.log("Clicou")
    }
  ]}
>
  <Button>Clique para info</Button>
</InlineTooltip>
```

**Triggers disponíveis:**
- `hover` - Aparece ao passar o mouse
- `click` - Aparece ao clicar
- `focus` - Aparece ao focar o elemento

### 6. DefinitionTooltip
Tooltip para definições de termos técnicos.

```tsx
import { DefinitionTooltip } from '@/components/shared/InlineTooltip';

<p>
  O <DefinitionTooltip
    term="Rateio"
    definition="Sistema que divide automaticamente os custos entre participantes."
    learnMoreUrl="/ajuda/rateio"
  /> facilita o pagamento em grupo.
</p>
```

### 7. ValidationTooltip
Tooltip para mostrar erros de validação em formulários.

```tsx
import { ValidationTooltip } from '@/components/shared/InlineTooltip';

<ValidationTooltip
  errors={["Campo obrigatório", "Formato inválido"]}
  isVisible={showErrors}
>
  <Input 
    className={showErrors ? "border-red-500" : ""}
    placeholder="Digite seu email"
  />
</ValidationTooltip>
```

### 8. ProgressTooltip
Tooltip para mostrar progresso de metas ou tarefas.

```tsx
import { ProgressTooltip } from '@/components/shared/InlineTooltip';

<ProgressTooltip
  current={7}
  total={10}
  label="Meta de Reservas"
  details="Faltam apenas 3 reservas para ganhar o bônus!"
>
  <div className="progress-bar">
    {/* Barra de progresso */}
  </div>
</ProgressTooltip>
```

## 🏟️ Tooltips Específicos do Arena

### Funcionalidades Principais

```tsx
import {
  ReservaTooltip,
  RateioTooltip,
  TurmasTooltip,
  IndicacoesTooltip
} from '@/components/shared/ArenaTooltips';

// Tooltip para sistema de reservas
<ReservaTooltip>
  <Button>Fazer Reserva</Button>
</ReservaTooltip>

// Tooltip para rateio
<RateioTooltip>
  <Button>Dividir Custos</Button>
</RateioTooltip>
```

### Status de Reservas

```tsx
import { ReservaStatusTooltip } from '@/components/shared/ArenaTooltips';

<ReservaStatusTooltip status="confirmada">
  <Badge>Confirmada</Badge>
</ReservaStatusTooltip>
```

### Informações Contextuais

```tsx
import {
  CreditosTooltip,
  PontuacaoTooltip,
  HorarioTooltip,
  LocalizacaoTooltip,
  PrecoTooltip
} from '@/components/shared/ArenaTooltips';

// Tooltip para créditos
<CreditosTooltip>
  <span>R$ 150,00</span>
</CreditosTooltip>

// Tooltip para horários
<HorarioTooltip
  horarios={{
    abertura: "06:00",
    fechamento: "23:00",
    dias: ["Seg", "Ter", "Qua", "Qui", "Sex"]
  }}
>
  <Clock className="w-5 h-5" />
</HorarioTooltip>

// Tooltip para preços com promoção
<PrecoTooltip
  preco={80}
  promocao={{
    precoOriginal: 100,
    desconto: 20
  }}
>
  <span>R$ 80,00</span>
</PrecoTooltip>
```

## 🎯 Sistema de Tour Guiado

### Configuração Básica

```tsx
import { GuidedTour, useGuidedTour } from '@/components/shared/GuidedTour';

function MyComponent() {
  const tour = useGuidedTour("my-feature-tour");

  const steps = [
    {
      id: "step-1",
      target: "#element-1",
      title: "Primeiro Passo",
      content: "Esta é a explicação do primeiro elemento.",
      placement: "bottom"
    },
    {
      id: "step-2",
      target: "#element-2", 
      title: "Segundo Passo",
      content: "Agora vamos ver este outro elemento.",
      placement: "top"
    }
  ];

  return (
    <>
      <Button onClick={tour.start}>Iniciar Tour</Button>
      
      <GuidedTour
        steps={steps}
        isOpen={tour.isOpen}
        onClose={tour.close}
        onComplete={tour.complete}
        autoPlay={false}
        showProgress={true}
      />
    </>
  );
}
```

### Hooks de Onboarding

```tsx
import { useDashboardOnboarding } from '@/hooks/useOnboarding';

function Dashboard() {
  const onboarding = useDashboardOnboarding();

  useEffect(() => {
    // Tour inicia automaticamente para novos usuários
    if (!onboarding.isCompleted) {
      onboarding.start();
    }
  }, []);

  return (
    <div>
      {/* Conteúdo do dashboard */}
      
      <GuidedTour
        steps={onboarding.steps}
        isOpen={onboarding.isActive}
        onClose={onboarding.skip}
        onComplete={onboarding.complete}
      />
    </div>
  );
}
```

## 🎨 Customização e Estilos

### Classes CSS Personalizadas

```tsx
// Tooltip com estilo customizado
<ContextualTooltip
  content="Conteúdo personalizado"
  className="custom-trigger"
  contentClassName="bg-purple-600 text-white border-purple-700"
>
  <Button>Custom Tooltip</Button>
</ContextualTooltip>
```

### Variantes de Tamanho

```tsx
// Diferentes tamanhos de tooltip
<ContextualTooltip maxWidth="sm">Pequeno</ContextualTooltip>
<ContextualTooltip maxWidth="md">Médio</ContextualTooltip>
<ContextualTooltip maxWidth="lg">Grande</ContextualTooltip>
<ContextualTooltip maxWidth="xl">Extra Grande</ContextualTooltip>
```

## 📱 Responsividade Mobile

O sistema de tooltips é otimizado para mobile:

- Tooltips são automaticamente desabilitados em telas pequenas (exceto interativos)
- Tour guiado se adapta ao tamanho da tela
- Touch targets são otimizados para dispositivos móveis
- Animações são suavizadas para melhor performance

```tsx
// Tooltip que funciona em mobile
<ContextualTooltip
  content="Este tooltip funciona em mobile"
  interactive={true} // Permite interação em mobile
>
  <Button>Mobile Friendly</Button>
</ContextualTooltip>
```

## 🔧 Configuração Global

### Provider de Tooltips

O `TooltipProvider` já está configurado globalmente no layout:

```tsx
// src/app/layout.tsx
<TooltipProvider delayDuration={300} skipDelayDuration={100}>
  {children}
</TooltipProvider>
```

### Configurações Padrão

```tsx
// Configurações que podem ser ajustadas
const defaultConfig = {
  delayDuration: 300,      // Delay antes de mostrar
  skipDelayDuration: 100,  // Delay entre tooltips
  side: "top",             // Posição padrão
  align: "center",         // Alinhamento
  sideOffset: 8,           // Distância do elemento
};
```

## 📋 Melhores Práticas

### 1. Quando Usar Cada Tipo

- **ContextualTooltip**: Informações rápidas e contextuais
- **HelpTooltip**: Explicações de campos ou funcionalidades
- **FeatureTooltip**: Destacar novidades ou funcionalidades premium
- **InlineTooltip**: Informações detalhadas que precisam de interação
- **GuidedTour**: Onboarding de novos usuários ou funcionalidades

### 2. Conteúdo dos Tooltips

```tsx
// ✅ Bom - Conciso e útil
<HelpTooltip content="Digite seu CPF sem pontos ou traços" />

// ❌ Ruim - Muito verboso
<HelpTooltip content="Este campo é destinado ao preenchimento do seu número de CPF (Cadastro de Pessoa Física) que deve ser digitado sem a utilização de pontos, traços ou qualquer outro caractere especial..." />
```

### 3. Posicionamento

```tsx
// Considere o contexto e espaço disponível
<ContextualTooltip side="top">    // Quando há espaço acima
<ContextualTooltip side="bottom"> // Quando há espaço abaixo
<ContextualTooltip side="auto">   // Deixe o sistema decidir
```

### 4. Acessibilidade

```tsx
// Sempre forneça alternativas para usuários com deficiência
<ContextualTooltip
  content="Informação importante"
  aria-label="Informação sobre este campo"
>
  <Button aria-describedby="tooltip-id">
    Botão com tooltip
  </Button>
</ContextualTooltip>
```

## 🧪 Testes

### Testando Tooltips

```tsx
// Exemplo de teste com React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('tooltip aparece ao hover', async () => {
  render(
    <ContextualTooltip content="Tooltip content">
      <button>Trigger</button>
    </ContextualTooltip>
  );

  const trigger = screen.getByRole('button');
  fireEvent.mouseEnter(trigger);

  expect(await screen.findByText('Tooltip content')).toBeInTheDocument();
});
```

## 🔍 Debugging

### Ferramenta de Debug

```tsx
// Componente para debugar tooltips
function TooltipDebugger() {
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
      <div>Tooltips ativos: {/* contador */}</div>
      <div>Posição: {/* posição atual */}</div>
    </div>
  );
}
```

### Logs de Desenvolvimento

```tsx
// Habilitar logs em desenvolvimento
const DEBUG_TOOLTIPS = process.env.NODE_ENV === 'development';

if (DEBUG_TOOLTIPS) {
  console.log('Tooltip mostrado:', tooltipId);
}
```

## 📊 Métricas e Analytics

### Tracking de Uso

```tsx
// Exemplo de tracking de tooltips
<ContextualTooltip
  content="Conteúdo do tooltip"
  onShow={() => {
    // Analytics
    gtag('event', 'tooltip_shown', {
      tooltip_id: 'help-reservas',
      page: window.location.pathname
    });
  }}
>
  <Button>Ajuda</Button>
</ContextualTooltip>
```

Este sistema de tooltips oferece uma experiência rica e contextual para os usuários do Arena, melhorando significativamente a usabilidade da plataforma.