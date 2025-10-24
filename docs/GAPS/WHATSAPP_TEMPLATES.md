# WhatsApp Business API Templates

## Templates Necessários

De acordo com o GAP1.md, os seguintes templates precisam ser criados e aprovados na Meta:

### 1. Template de Lembrete (45min antes)
- **Nome:** `lembrete_45min`
- **Categoria:** `UTILITY`
- **Idioma:** `pt_BR`
- **Conteúdo:**
```
⏰ *Lembrete de Jogo*

Olá {{1}}! Seu jogo começa em 45 minutos.

📍 *Local:* {{2}}
🕐 *Horário:* {{3}} - {{4}}
📅 *Data:* {{5}}
📌 *Endereço:* {{6}}

Lembre-se:
✅ Chegue com 10-15min de antecedência
✅ Traga água e toalha
✅ Use roupas e calçados adequados

Nos vemos lá! ⚽🎾
```

### 2. Template de Lembrete Final (10min antes)
- **Nome:** `lembrete_10min`
- **Categoria:** `UTILITY`
- **Idioma:** `pt_BR`
- **Conteúdo:**
```
⏰ *ATENÇÃO!*

Olá {{1}}! Seu jogo começa em 10 MINUTOS!

📍 {{2}}
🕐 {{3}}

⚠️ Esteja pronto! Nos vemos já! 🏃‍♂️⚽
```

### 3. Template de Aceite de Convite
- **Nome:** `aceite_convite`
- **Categoria:** `UTILITY`
- **Idioma:** `pt_BR`
- **Conteúdo:**
```
✅ *Convite Aceito!*

{{1}} aceitou seu convite!

📍 *Quadra:* {{2}}
📅 *Data:* {{3}}
⏰ *Horário:* {{4}}

Prepare-se para um ótimo jogo! 🎾
```

### 4. Template de Avaliação Pós-Jogo
- **Nome:** `avaliacao_pos_jogo`
- **Categoria:** `UTILITY`
- **Idioma:** `pt_BR`
- **Conteúdo:**
```
⭐ *Como foi seu jogo?*

Olá {{1}}!

Esperamos que tenha curtido seu jogo na {{2}}.

Sua opinião é muito importante para nós! Avalie sua experiência:

🔗 {{3}}

São apenas 2 minutos! 😊

Obrigado!
Equipe Arena Dona Santa
```

### 5. Template de Confirmação de Reserva
- **Nome:** `confirmacao_reserva`
- **Categoria:** `UTILITY`
- **Idioma:** `pt_BR`
- **Conteúdo:**
```
🎾 *Reserva Confirmada!*

Sua reserva foi confirmada com sucesso:

📍 *Quadra:* {{1}}
📅 *Data:* {{2}}
⏰ *Horário:* {{3}}
💰 *Valor:* R$ {{4}}

*ID da Reserva:* {{5}}

Chegue com 15 minutos de antecedência. Bom jogo! 🏆
```

## Instruções para Criação

1. Acesse o [Meta Business Suite](https://business.facebook.com/)
2. Vá para "WhatsApp Manager"
3. Selecione sua conta de WhatsApp Business
4. Vá para "Templates de Mensagens"
5. Clique em "Criar Template"
6. Preencha os campos conforme especificado acima
7. Envie para aprovação
8. Aguarde a aprovação (pode levar de 24-48 horas)

## Variáveis Obrigatórias

- `{{1}}` - Nome do destinatário
- `{{2}}` - Nome da quadra/local
- `{{3}}` - Data
- `{{4}}` - Horário de início
- `{{5}}` - Horário de fim (quando aplicável)
- `{{6}}` - Endereço (quando aplicável)

## Status de Aprovação

| Template | Status | Data de Criação | Data de Aprovação |
|----------|--------|-----------------|-------------------|
| lembrete_45min | ❌ Não criado | - | - |
| lembrete_10min | ❌ Não criado | - | - |
| aceite_convite | ❌ Não criado | - | - |
| avaliacao_pos_jogo | ❌ Não criado | - | - |
| confirmacao_reserva | ❌ Não criado | - | - |

## Próximos Passos

1. Criar todos os templates acima na plataforma Meta
2. Aguardar aprovação
3. Atualizar o código para usar os templates aprovados
4. Testar envio de mensagens com templates