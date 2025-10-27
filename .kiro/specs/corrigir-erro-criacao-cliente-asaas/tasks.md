# Plano de Implementação

- [x] 1. Adicionar logging detalhado para diagnóstico
  - Adicionar logs na camada AsaasAPI para capturar requisições e respostas completas
  - Adicionar logs no PagamentoService para rastrear fluxo de criação de cliente
  - Adicionar logs na API route para capturar dados do usuário e erros
  - Implementar mascaramento de dados sensíveis (CPF parcial, sem dados de cartão)
  - _Requirements: 1.1, 1.2, 5.1, 5.2, 5.3, 5.4_

- [x] 2. Criar módulo de validação de dados do cliente
  - Criar arquivo `src/lib/validators/clienteValidator.ts`
  - Implementar validação de CPF com algoritmo de dígitos verificadores
  - Implementar validação de email com regex apropriado
  - Implementar validação de telefone (formato brasileiro)
  - Implementar método de sanitização que remove campos vazios e faz trim
  - Criar interface `ValidacaoResultado` com campos valido, erros e avisos
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Melhorar tratamento de erros no AsaasAPI
  - Modificar método `handleError` para extrair mensagens específicas da Asaas
  - Adicionar interface `AsaasErrorResponse` para tipar erros da API
  - Implementar método `logRequest` para registrar todas as requisições
  - Implementar método `logResponse` para registrar todas as respostas
  - Implementar método `logError` para registrar erros com stack trace
  - Atualizar interceptors do axios para usar novos métodos de log
  - _Requirements: 1.2, 3.1, 3.3, 5.1, 5.2_

- [x] 4. Implementar retry logic no AsaasAPI
  - Criar método `requestWithRetry` que aceita função e número de tentativas
  - Implementar backoff exponencial (1s, 2s, 4s)
  - Configurar retry apenas para status codes 408, 429, 500, 502, 503, 504
  - Não fazer retry para erros 4xx (validação)
  - Adicionar logs para cada tentativa de retry
  - Aplicar retry nos métodos `createCustomer` e `updateCustomer`
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Integrar validação no PagamentoService





  - Importar `ClienteValidator` no método `criarOuAtualizarCliente`
  - Validar dados do cliente antes de enviar para Asaas
  - Lançar erro específico se validação falhar com mensagens claras
  - Usar método `sanitizarDados` do validator antes de enviar para API
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1_

- [x] 6. Melhorar validação e mensagens de erro na API route
  - Adicionar validação explícita de CPF antes de criar cliente
  - Retornar erro 400 com mensagem clara se CPF estiver ausente
  - Melhorar bloco catch de criação de cliente para incluir mais detalhes
  - Adicionar campo `sugestao` nas respostas de erro para guiar usuário
  - Diferenciar entre tipos de erro (validação, rede, API externa)
  - Adicionar logs estruturados com userId e timestamp
  - _Requirements: 2.3, 3.1, 3.2, 3.3, 3.4, 5.3_

- [ ] 7. Adicionar validação de CPF no frontend







  - Criar função de validação de CPF em `src/lib/utils/validators.ts`
  - Adicionar validação no formulário de compra antes de submeter
  - Exibir mensagem de erro se CPF for inválido
  - Adicionar máscara de CPF no campo de input
  - _Requirements: 2.1, 3.2_

- [ ] 8. Criar tipos para erros padronizados

  - Criar interface `ErroAPI` em `src/types/errors.types.ts`
  - Criar enum `TipoErro` com categorias (VALIDACAO, REDE, API_EXTERNA, etc)
  - Exportar tipos para uso em toda aplicação
  - _Requirements: 3.4, 5.1_

- [ ]* 9. Adicionar testes para validador de cliente
  - Criar arquivo `src/lib/validators/__tests__/clienteValidator.test.ts`
  - Testar validação de CPF válido e inválido
  - Testar validação de email válido e inválido
  - Testar sanitização de dados (remoção de campos vazios)
  - Testar validação completa de cliente
  - _Requirements: 2.1, 2.2, 2.4_

- [ ]* 10. Adicionar testes para retry logic
  - Criar testes para verificar que retry acontece em erros 5xx
  - Criar testes para verificar que retry NÃO acontece em erros 4xx
  - Testar backoff exponencial
  - Testar limite máximo de tentativas
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 11. Testar fluxo completo manualmente
  - Testar compra com usuário que tem todos os dados completos
  - Testar compra com usuário sem CPF (deve retornar erro claro)
  - Testar compra com usuário sem endereço (deve funcionar)
  - Verificar logs no console do servidor
  - Verificar mensagens de erro no frontend
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 3.2_

- [ ] 12. Documentar solução e criar guia de troubleshooting
  - Criar arquivo `docs/TROUBLESHOOTING_PAGAMENTOS.md`
  - Documentar erros comuns e suas soluções
  - Adicionar exemplos de logs e como interpretá-los
  - Documentar como testar integração com Asaas
  - Adicionar checklist de validação para novos desenvolvedores
  - _Requirements: 1.4, 5.1, 5.2_
