import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

console.log(`
🔐 Gerador de Chave de API do Asaas (Apenas para Teste)

Para configurar corretamente a integração com o Asaas, você precisa:

1. Acesse o painel do Asaas em: https://www.asaas.com/
2. Faça login ou crie uma conta
3. Vá para Configurações > API
4. Crie uma nova chave de API
5. Copie a chave e substitua no arquivo .env:

ASAAS_API_KEY=sua_chave_aqui

⚠️  Importante:
- A chave deve começar com "aact_" para sandbox ou "aacc_" para produção
- Mantenha sua chave em segredo e nunca a compartilhe publicamente
- Para ambiente de desenvolvimento, use o modo sandbox

🧪 Para testes, você pode usar esta chave de exemplo (não é válida):
ASAAS_API_KEY=aact_hmlg_00000000000000000000000000000000000:00000000-0000-0000-0000-000000000000

🔧 Após atualizar a chave, reinicie o servidor de desenvolvimento.
`);