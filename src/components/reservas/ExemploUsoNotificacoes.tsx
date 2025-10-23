'use client';

import { useState } from 'react';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, MessageSquare, Star } from 'lucide-react';

// Exemplo de como integrar o sistema de notificações em uma reserva
export function ExemploUsoNotificacoes() {
  const { agendarLembretes, notificarAceiteConvite, loading, error } = useNotificacoes();
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // Simular confirmação de reserva com agendamento de lembretes
  const handleConfirmarReserva = async () => {
    try {
      // Dados da reserva (normalmente viriam do formulário/estado)
      const dadosReserva = {
        telefone: '5511999999999',
        quadra: 'Quadra A',
        data: new Date('2024-10-25T20:00:00'), // Hoje às 20:00
        horario: '20:00',
        participantes: ['João Silva', 'Maria Santos']
      };

      // Agendar lembretes automáticos
      const sucesso = await agendarLembretes('reserva-123', dadosReserva);
      
      if (sucesso) {
        setReservaConfirmada(true);
      }
    } catch (err) {
      console.error('Erro ao confirmar reserva:', err);
    }
  };

  // Simular aceite de convite
  const handleAceiteConvite = async () => {
    try {
      await notificarAceiteConvite({
        telefoneOrganizador: '5511888888888',
        nomeConvidado: 'Pedro Costa',
        quadra: 'Quadra B',
        data: new Date('2024-10-26T19:00:00'),
        horario: '19:00',
        participantesConfirmados: 3,
        totalParticipantes: 4
      });
    } catch (err) {
      console.error('Erro ao notificar aceite:', err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sistema de Notificações Automáticas</h2>
        <p className="text-gray-600">
          Exemplo de integração do sistema de notificações com reservas
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Confirmação de Reserva */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Confirmar Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>Quadra:</strong> Quadra A</p>
              <p><strong>Data:</strong> 25/10/2024</p>
              <p><strong>Horário:</strong> 20:00</p>
              <p><strong>Participantes:</strong> João Silva, Maria Santos</p>
            </div>
            
            {!reservaConfirmada ? (
              <Button 
                onClick={handleConfirmarReserva}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Confirmando...' : 'Confirmar Reserva'}
              </Button>
            ) : (
              <div className="space-y-2">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Reserva confirmada! Lembretes automáticos agendados:
                  </AlertDescription>
                </Alert>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Lembrete 45min antes: 19:15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Lembrete 10min antes: 19:50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span>Avaliação pós-jogo: 22:00</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aceite de Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Aceite de Convite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>Organizador:</strong> (11) 88888-8888</p>
              <p><strong>Convidado:</strong> Pedro Costa</p>
              <p><strong>Quadra:</strong> Quadra B</p>
              <p><strong>Data:</strong> 26/10/2024 às 19:00</p>
              <p><strong>Status:</strong> 3/4 participantes confirmados</p>
            </div>
            
            <Button 
              onClick={handleAceiteConvite}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Notificando...' : 'Simular Aceite de Convite'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fluxo de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Notificações Automáticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">1. Pagamento Confirmado</h4>
                <p className="text-sm text-gray-600">
                  Webhook do Asaas confirma pagamento → Reserva confirmada → Lembretes agendados
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">2. Lembrete 45 Minutos</h4>
                <p className="text-sm text-gray-600">
                  Cron job processa notificações → Envia lembrete via WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">3. Lembrete 10 Minutos</h4>
                <p className="text-sm text-gray-600">
                  Último lembrete antes do jogo começar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">4. Avaliação Pós-Jogo</h4>
                <p className="text-sm text-gray-600">
                  2 horas após o jogo → Solicita feedback e avaliação
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemplo de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Mensagens Enviadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
            <h5 className="font-medium text-green-800 mb-2">Lembrete 45 Minutos</h5>
            <div className="text-sm text-green-700 whitespace-pre-line">
{`⏰ *Lembrete de Jogo*

Seu jogo é em 45 minutos!

📍 *Quadra:* Quadra A
📅 *Data:* 25/10/2024
⏰ *Horário:* 20:00
👥 *Participantes:* 2

Prepare-se e chegue com antecedência. Nos vemos lá! 🎾`}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            <h5 className="font-medium text-blue-800 mb-2">Aceite de Convite</h5>
            <div className="text-sm text-blue-700 whitespace-pre-line">
{`✅ *Convite Aceito!*

Pedro Costa aceitou seu convite para jogar!

📍 *Quadra:* Quadra B
📅 *Data:* 26/10/2024
⏰ *Horário:* 19:00
👥 *Participantes confirmados:* 3/4

🔄 *Ainda há vagas disponíveis!* Convide mais amigos.

Prepare-se para um ótimo jogo! 🎾`}
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
            <h5 className="font-medium text-purple-800 mb-2">Avaliação Pós-Jogo</h5>
            <div className="text-sm text-purple-700 whitespace-pre-line">
{`🏆 *Como foi seu jogo?*

Esperamos que tenha se divertido na Quadra A!

⭐ *Avalie sua experiência:*
• Qualidade da quadra
• Atendimento
• Facilidades

📝 *Deixe seu feedback:*
https://arena.com/avaliacao/123

Sua opinião é muito importante para melhorarmos sempre! 🙏

*Próximo jogo:* Reserve já sua próxima partida!
https://arena.com/reservas/nova`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}