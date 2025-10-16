/**
 * Página de Teste - Integração Supabase
 * Testa se os repositórios Supabase estão funcionando
 */

import React, { useState, useEffect } from 'react';
import { ServiceContainer } from '../core/config/ServiceContainer';

export function TestSupabase() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    try {
      setLoading(true);
      setError(null);

      const container = ServiceContainer.getInstance('supabase');
      const testResults: any = {};

      // Teste 1: Quadras
      try {
        const courtService = container.getCourtService();
        const courts = await courtService.getAllCourts();
        testResults.courts = {
          success: true,
          count: courts.length,
          data: courts,
        };
      } catch (err) {
        testResults.courts = { success: false, error: String(err) };
      }

      // Teste 2: Reservas
      try {
        const bookingService = container.getBookingService();
        const bookings = await bookingService.getAllBookings();
        testResults.bookings = {
          success: true,
          count: bookings.length,
          data: bookings,
        };
      } catch (err) {
        testResults.bookings = { success: false, error: String(err) };
      }

      // Teste 3: Usuários
      try {
        const authService = container.getAuthService();
        const users = await authService.getAllUsers();
        testResults.users = {
          success: true,
          count: users.length,
          data: users,
        };
      } catch (err) {
        testResults.users = { success: false, error: String(err) };
      }

      // Teste 4: Transações
      try {
        const transactionService = container.getTransactionService();
        const transactions = await transactionService.getAllTransactions();
        testResults.transactions = {
          success: true,
          count: transactions.length,
          data: transactions,
        };
      } catch (err) {
        testResults.transactions = { success: false, error: String(err) };
      }

      // Teste 5: Times
      try {
        const teamService = container.getTeamService();
        const teams = await teamService.getAllTeams();
        testResults.teams = {
          success: true,
          count: teams.length,
          data: teams,
        };
      } catch (err) {
        testResults.teams = { success: false, error: String(err) };
      }

      setResults(testResults);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Carregando testes...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 Teste de Integração Supabase</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadras */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📍 Quadras</h2>
          {results.courts?.success ? (
            <div>
              <p className="text-green-600 font-bold mb-2">✅ {results.courts.count} quadras encontradas</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(results.courts.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Erro: {results.courts?.error}</p>
          )}
        </div>

        {/* Reservas */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📅 Reservas</h2>
          {results.bookings?.success ? (
            <div>
              <p className="text-green-600 font-bold mb-2">✅ {results.bookings.count} reservas encontradas</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(results.bookings.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Erro: {results.bookings?.error}</p>
          )}
        </div>

        {/* Usuários */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">👥 Usuários</h2>
          {results.users?.success ? (
            <div>
              <p className="text-green-600 font-bold mb-2">✅ {results.users.count} usuários encontrados</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(results.users.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Erro: {results.users?.error}</p>
          )}
        </div>

        {/* Transações */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">💰 Transações</h2>
          {results.transactions?.success ? (
            <div>
              <p className="text-green-600 font-bold mb-2">✅ {results.transactions.count} transações encontradas</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(results.transactions.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Erro: {results.transactions?.error}</p>
          )}
        </div>

        {/* Times */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">👥 Times</h2>
          {results.teams?.success ? (
            <div>
              <p className="text-green-600 font-bold mb-2">✅ {results.teams.count} times encontrados</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(results.teams.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Erro: {results.teams?.error}</p>
          )}
        </div>
      </div>

      <button
        onClick={runTests}
        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        🔄 Recarregar Testes
      </button>
    </div>
  );
}

