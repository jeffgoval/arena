/**
 * Teste de Integração Supabase
 * Verifica se os repositórios Supabase estão funcionando
 */

import { ServiceContainer } from './config/ServiceContainer';

export async function testSupabaseIntegration() {
  console.log('🧪 Iniciando testes de integração Supabase...\n');

  try {
    // Inicializar container com backend Supabase
    const container = ServiceContainer.getInstance('supabase');
    console.log('✅ ServiceContainer inicializado com backend Supabase');

    // Teste 1: Buscar todas as quadras
    console.log('\n📍 Teste 1: Buscando todas as quadras...');
    const courtService = container.getCourtService();
    const courts = await courtService.getAllCourts();
    console.log(`✅ ${courts.length} quadras encontradas:`, courts);

    // Teste 2: Buscar todas as reservas
    console.log('\n📅 Teste 2: Buscando todas as reservas...');
    const bookingService = container.getBookingService();
    const bookings = await bookingService.getAllBookings();
    console.log(`✅ ${bookings.length} reservas encontradas:`, bookings);

    // Teste 3: Buscar todos os usuários
    console.log('\n👥 Teste 3: Buscando todos os usuários...');
    const authService = container.getAuthService();
    const users = await authService.getAllUsers();
    console.log(`✅ ${users.length} usuários encontrados:`, users);

    // Teste 4: Buscar todas as transações
    console.log('\n💰 Teste 4: Buscando todas as transações...');
    const transactionService = container.getTransactionService();
    const transactions = await transactionService.getAllTransactions();
    console.log(`✅ ${transactions.length} transações encontradas:`, transactions);

    // Teste 5: Buscar todos os times
    console.log('\n👥 Teste 5: Buscando todos os times...');
    const teamService = container.getTeamService();
    const teams = await teamService.getAllTeams();
    console.log(`✅ ${teams.length} times encontrados:`, teams);

    console.log('\n✅ TODOS OS TESTES PASSARAM! Supabase está funcionando corretamente!');
    return true;
  } catch (error) {
    console.error('\n❌ ERRO NOS TESTES:', error);
    return false;
  }
}

// Executar testes se for chamado diretamente
if (import.meta.hot) {
  testSupabaseIntegration();
}

