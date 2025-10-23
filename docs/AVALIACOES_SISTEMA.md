# Sistema de Avaliações

Sistema completo de avaliações pós-jogo implementado.

## ✅ Funcionalidades Implementadas

### 1. Formulário de Avaliação
- **Componente**: `AvaliacaoForm`
- Sistema de 5 estrelas interativo
- Feedback visual (hover e seleção)
- Campo de comentário opcional (500 caracteres)
- Validação com Zod
- Estados de loading

### 2. Visualização de Avaliações
- **Componente**: `AvaliacaoCard`
- Exibe nome do usuário, data, rating e comentário
- Design responsivo e limpo
- Informações da quadra

### 3. Estatísticas de Satisfação
- **Componente**: `AvaliacaoStatsComponent`
- Média geral com visualização de estrelas
- Distribuição por rating (1-5 estrelas)
- Resumo de avaliações positivas, neutras e negativas
- Percentuais calculados automaticamente

### 4. Avaliações por Quadra
- **Componente**: `QuadraAvaliacoes`
- Média de cada quadra
- Total de avaliações por quadra
- Barra de progresso visual
- Ordenação por melhor avaliação

### 5. Lista com Filtros
- **Componente**: `AvaliacoesList`
- Filtro por rating (1-5 estrelas ou todas)
- Ordenação por data (mais recentes primeiro)
- Paginação
- Estados de loading e vazio

## 📁 Estrutura de Arquivos

```
src/
├── components/modules/core/avaliacoes/
│   ├── AvaliacaoForm.tsx          # Formulário de avaliação
│   ├── AvaliacaoCard.tsx          # Card individual
│   ├── AvaliacaoStats.tsx         # Estatísticas gerais
│   ├── AvaliacoesList.tsx         # Lista com filtros
│   ├── QuadraAvaliacoes.tsx       # Avaliações por quadra
│   └── index.ts                   # Exports
│
├── types/avaliacoes.types.ts      # Tipos TypeScript
├── lib/validations/avaliacao.schema.ts  # Schemas Zod
├── hooks/core/useAvaliacoes.ts    # Hook customizado
│
├── app/
│   ├── (gestor)/gestor/avaliacoes/page.tsx  # Página do gestor
│   ├── (cliente)/avaliar/[reservaId]/page.tsx  # Página de avaliação
│   └── api/
│       ├── avaliacoes/
│       │   ├── route.ts           # POST/GET avaliações
│       │   └── stats/route.ts     # GET estatísticas
│       └── reservas/[reservaId]/info/route.ts  # Info da reserva
│
└── supabase/migrations/
    └── 20241022000006_create_reviews_table.sql
```

## 🗄️ Banco de Dados

### Tabela: `reviews`

```sql
- id (UUID, PK)
- reserva_id (UUID, FK -> reservations)
- user_id (UUID, FK -> profiles)
- rating (INTEGER, 1-5)
- comentario (TEXT, opcional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

UNIQUE(reserva_id, user_id) -- Cada usuário avalia uma vez
```

### Índices
- `idx_reviews_reserva_id`
- `idx_reviews_user_id`
- `idx_reviews_rating`
- `idx_reviews_created_at`

### RLS (Row Level Security)
- ✅ Todos podem ver avaliações
- ✅ Apenas organizador/participante pode avaliar
- ✅ Apenas dono pode editar/deletar sua avaliação
- ✅ Uma avaliação por usuário por reserva

## 🔌 API Endpoints

### POST /api/avaliacoes
Criar nova avaliação

**Body:**
```json
{
  "reserva_id": "uuid",
  "rating": 5,
  "comentario": "Excelente experiência!"
}
```

**Validações:**
- Usuário autenticado
- Reserva existe
- Usuário é organizador ou participante
- Não existe avaliação prévia

### GET /api/avaliacoes
Listar avaliações com filtros

**Query Params:**
- `quadra_id` (opcional)
- `user_id` (opcional)
- `rating` (opcional)
- `limit` (opcional, padrão: 50)

### GET /api/avaliacoes/stats
Obter estatísticas gerais

**Response:**
```json
{
  "mediaGeral": 4.6,
  "totalAvaliacoes": 342,
  "distribuicao": [
    { "rating": 5, "quantidade": 180, "percentual": 52.6 },
    { "rating": 4, "quantidade": 120, "percentual": 35.1 },
    ...
  ],
  "porQuadra": [
    {
      "quadra_id": "uuid",
      "quadra_nome": "Society 1",
      "media": 4.8,
      "total": 125
    },
    ...
  ]
}
```

### GET /api/reservas/[reservaId]/info
Informações da reserva para avaliação

**Response:**
```json
{
  "id": "uuid",
  "quadra_nome": "Society 1",
  "data": "2024-10-22",
  "ja_avaliada": false
}
```

## 🎯 Fluxo de Uso

### Para o Cliente:
1. Após o jogo, recebe link: `/avaliar/[reservaId]`
2. Acessa a página de avaliação
3. Seleciona rating (1-5 estrelas)
4. Adiciona comentário (opcional)
5. Envia avaliação
6. Recebe confirmação e é redirecionado

### Para o Gestor:
1. Acessa `/gestor/avaliacoes`
2. Visualiza estatísticas gerais
3. Vê distribuição por rating
4. Analisa avaliações por quadra
5. Lê comentários dos clientes
6. Filtra por rating específico

## 🎨 Componentes UI

### AvaliacaoForm
- Sistema de estrelas interativo
- Hover effect
- Labels descritivos (Péssimo, Ruim, Regular, Bom, Excelente)
- Contador de caracteres
- Validação em tempo real

### AvaliacaoCard
- Avatar do usuário
- Nome e data
- Rating visual com estrelas
- Comentário formatado
- Nome da quadra

### AvaliacaoStats
- Card de média geral com estrelas
- Gráfico de distribuição com Progress bars
- Resumo categorizado (positivas, neutras, negativas)
- Percentuais calculados

## 🔄 Hook: useAvaliacoes

```typescript
const {
  avaliacoes,        // Lista de avaliações
  stats,             // Estatísticas
  loading,           // Estado de loading
  error,             // Mensagem de erro
  createAvaliacao,   // Criar avaliação
  fetchAvaliacoes,   // Buscar avaliações
  fetchStats,        // Buscar estatísticas
} = useAvaliacoes();
```

## 📊 Tipos TypeScript

```typescript
type AvaliacaoRating = 1 | 2 | 3 | 4 | 5;

interface Avaliacao {
  id: string;
  reserva_id: string;
  user_id: string;
  rating: AvaliacaoRating;
  comentario?: string;
  created_at: string;
  user?: { nome_completo: string };
  reserva?: { data: string; quadra?: { nome: string } };
}

interface AvaliacaoStats {
  mediaGeral: number;
  totalAvaliacoes: number;
  distribuicao: Array<{
    rating: AvaliacaoRating;
    quantidade: number;
    percentual: number;
  }>;
  porQuadra: Array<{
    quadra_id: string;
    quadra_nome: string;
    media: number;
    total: number;
  }>;
}
```

## ✅ Checklist de Implementação

- [x] Tabela `reviews` no banco
- [x] RLS policies configuradas
- [x] Tipos TypeScript
- [x] Schemas de validação
- [x] Componente de formulário
- [x] Componente de card
- [x] Componente de estatísticas
- [x] Lista com filtros
- [x] Avaliações por quadra
- [x] Hook customizado
- [x] API de criação
- [x] API de listagem
- [x] API de estatísticas
- [x] Página do gestor
- [x] Página do cliente
- [x] Validações de permissão
- [x] Feedback visual
- [x] Estados de loading
- [x] Tratamento de erros

## 🚀 Próximos Passos

### Melhorias Futuras:
1. **Notificação automática** via WhatsApp após o jogo
2. **Resposta do gestor** aos comentários
3. **Moderação** de comentários inadequados
4. **Exportação** de relatórios em PDF
5. **Gráficos avançados** com Chart.js
6. **Análise de sentimento** dos comentários
7. **Badges** para quadras bem avaliadas
8. **Ranking** de quadras por satisfação

## 📝 Notas

- Cada usuário pode avaliar uma reserva apenas uma vez
- Avaliações são permanentes (não podem ser deletadas, apenas editadas)
- Apenas organizador e participantes podem avaliar
- Comentários têm limite de 500 caracteres
- Estatísticas são calculadas em tempo real
- Sistema preparado para escala (índices otimizados)
