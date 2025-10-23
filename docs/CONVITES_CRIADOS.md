# Página de Convites Criados

## Visão Geral

A página "Convites Criados" (`/cliente/convites`) permite que os organizadores visualizem e gerenciem todos os convites públicos que criaram para suas reservas.

## Funcionalidades Implementadas

### 1. Listagem de Convites
- Exibe todos os convites criados pelo usuário logado
- Mostra informações detalhadas de cada convite:
  - Nome e tipo da quadra
  - Data e horário da reserva
  - Status do convite (ativo, completo, expirado)
  - Vagas disponíveis e ocupadas
  - Valor por pessoa (se definido)
  - Mensagem personalizada
  - Total de aceites

### 2. Filtros por Status
- **Todos**: Exibe todos os convites
- **Ativo**: Convites que ainda estão aceitando participantes
- **Completo**: Convites que atingiram o número máximo de vagas
- **Expirado**: Convites desativados ou que passaram da data

### 3. Estatísticas
Painel com métricas importantes:
- Total de convites criados
- Convites ativos
- Total de aceites recebidos
- Taxa de aceite (percentual de vagas preenchidas)

### 4. Ações Rápidas
Para cada convite, o usuário pode:
- **Copiar Link**: Copia o link público do convite para compartilhar
- **Ver Aceites**: Navega para página detalhada com lista de participantes
- **Desativar**: Marca o convite como expirado (apenas para convites ativos)

### 5. Página de Aceites
Ao clicar em "Ver Aceites", o usuário acessa `/cliente/convites/[conviteId]/aceites` que mostra:
- Informações completas do convite
- Lista de todas as pessoas que aceitaram
- Dados de contato (nome, email, WhatsApp)
- Status de confirmação
- Data e hora do aceite

## Estrutura de Arquivos

```
src/
├── app/
│   ├── (cliente)/
│   │   └── convites/
│   │       ├── page.tsx                           # Página principal
│   │       └── [conviteId]/
│   │           └── aceites/
│   │               └── page.tsx                   # Página de aceites
│   └── api/
│       └── convites/
│           ├── route.ts                           # GET: Listar convites
│           └── [conviteId]/
│               ├── aceites/
│               │   └── route.ts                   # GET: Listar aceites
│               └── desativar/
│                   └── route.ts                   # POST: Desativar convite
├── components/
│   └── convites/
│       ├── ConviteCard.tsx                        # Card individual do convite
│       ├── ConvitesStats.tsx                      # Painel de estatísticas
│       ├── ConvitesFiltros.tsx                    # Filtros de status
│       └── index.ts                               # Exports
├── hooks/
│   └── useConvites.ts                             # Hook customizado
└── types/
    └── convites.types.ts                          # Tipos TypeScript (já existia)
```

## APIs Criadas

### GET /api/convites
Retorna todos os convites do usuário logado com estatísticas.

**Query Parameters:**
- `status` (opcional): Filtrar por status específico

**Response:**
```json
{
  "convites": [...],
  "stats": {
    "total": 10,
    "ativos": 5,
    "completos": 3,
    "expirados": 2,
    "totalAceites": 25,
    "taxaAceite": 62.5
  }
}
```

### GET /api/convites/[conviteId]/aceites
Retorna os detalhes do convite e lista de aceites.

**Response:**
```json
{
  "convite": {...},
  "aceites": [...]
}
```

### POST /api/convites/[conviteId]/desativar
Desativa um convite (marca como expirado).

**Response:**
```json
{
  "success": true
}
```

## Componentes

### ConviteCard
Card visual que exibe informações de um convite com ações rápidas.

**Props:**
- `convite`: Dados do convite
- `onCopiarLink`: Callback para copiar link
- `onVerAceites`: Callback para ver aceites
- `onDesativar`: Callback para desativar

### ConvitesStats
Painel de estatísticas com 4 cards informativos.

**Props:**
- `stats`: Objeto com estatísticas calculadas

### ConvitesFiltros
Botões de filtro por status.

**Props:**
- `statusAtivo`: Status atualmente selecionado
- `onStatusChange`: Callback quando status muda

## Hook useConvites

Hook customizado que gerencia o estado e ações dos convites.

**Retorna:**
- `convites`: Array de convites
- `stats`: Estatísticas calculadas
- `loading`: Estado de carregamento
- `error`: Mensagem de erro (se houver)
- `fetchConvites`: Função para buscar convites
- `desativarConvite`: Função para desativar convite
- `copiarLink`: Função para copiar link do convite

## Validações e Segurança

1. **Autenticação**: Todas as APIs verificam se o usuário está autenticado
2. **Autorização**: Apenas o criador do convite pode:
   - Ver seus convites
   - Ver os aceites
   - Desativar o convite
3. **Validação de Status**: Só é possível desativar convites com status "ativo"

## Melhorias Futuras

- [ ] Adicionar paginação para grandes volumes de convites
- [ ] Permitir editar convites ativos
- [ ] Enviar notificações quando alguém aceita o convite
- [ ] Exportar lista de aceites (CSV/PDF)
- [ ] Adicionar busca por nome da quadra ou data
- [ ] Gráficos de evolução de aceites ao longo do tempo
- [ ] Integração com WhatsApp para envio automático do link

## Testes Recomendados

1. Criar um convite e verificar se aparece na listagem
2. Testar filtros de status
3. Copiar link e verificar se funciona
4. Desativar um convite ativo
5. Verificar se convites de outros usuários não aparecem
6. Testar página de aceites com e sem participantes
7. Verificar responsividade em mobile
