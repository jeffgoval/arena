'use client';

import { useState, useEffect } from 'react';
import { useTemplatesNotificacao } from '@/hooks/useNotificacoes';
import { TemplateNotificacao } from '@/services/notificacaoService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit, 
  TestTube, 
  Save, 
  BarChart3, 
  MessageSquare,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

export function GerenciadorTemplates() {
  const {
    loading,
    error,
    templates,
    carregarTemplates,
    atualizarTemplate,
    testarTemplate,
    obterEstatisticas
  } = useTemplatesNotificacao();

  const [templateEditando, setTemplateEditando] = useState<TemplateNotificacao | null>(null);
  const [templateTeste, setTemplateTeste] = useState<string>('');
  const [dadosTeste, setDadosTeste] = useState<any>({});
  const [telefoneTeste, setTelefoneTeste] = useState('');
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [dialogTeste, setDialogTeste] = useState(false);
  const [dialogEstatisticas, setDialogEstatisticas] = useState(false);

  useEffect(() => {
    carregarTemplates();
  }, [carregarTemplates]);

  const handleSalvarTemplate = async () => {
    if (!templateEditando) return;

    const sucesso = await atualizarTemplate(templateEditando.tipo, templateEditando);
    if (sucesso) {
      setDialogAberto(false);
      setTemplateEditando(null);
    }
  };

  const handleTestarTemplate = async () => {
    if (!templateTeste || !telefoneTeste) return;

    await testarTemplate(templateTeste, dadosTeste, telefoneTeste);
    setDialogTeste(false);
  };

  const handleCarregarEstatisticas = async () => {
    const dataFim = new Date();
    const dataInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const stats = await obterEstatisticas(dataInicio, dataFim);
    setEstatisticas(stats);
    setDialogEstatisticas(true);
  };

  const getIconeTemplate = (tipo: string) => {
    switch (tipo) {
      case 'lembrete_45min':
      case 'lembrete_10min':
        return <Clock className="h-4 w-4" />;
      case 'aceite_convite':
        return <CheckCircle className="h-4 w-4" />;
      case 'avaliacao_pos_jogo':
        return <Star className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTituloAmigavel = (tipo: string) => {
    const titulos: Record<string, string> = {
      'lembrete_45min': 'Lembrete 45 minutos',
      'lembrete_10min': 'Lembrete 10 minutos',
      'aceite_convite': 'Aceite de Convite',
      'avaliacao_pos_jogo': 'Avaliação Pós-Jogo'
    };
    return titulos[tipo] || tipo;
  };

  const getDadosTesteDefault = (tipo: string) => {
    const dadosDefault: Record<string, any> = {
      'lembrete_45min': {
        quadra: 'Quadra A',
        data: '25/10/2024',
        horario: '20:00',
        participantes: 4
      },
      'lembrete_10min': {
        quadra: 'Quadra A',
        horario: '20:00'
      },
      'aceite_convite': {
        nomeConvidado: 'João Silva',
        quadra: 'Quadra B',
        data: '25/10/2024',
        horario: '19:00',
        participantesConfirmados: 3,
        totalParticipantes: 4,
        temVagas: true
      },
      'avaliacao_pos_jogo': {
        quadra: 'Quadra A',
        linkAvaliacao: 'https://arena.com/avaliacao/123',
        linkReserva: 'https://arena.com/reservas/nova'
      }
    };
    return dadosDefault[tipo] || {};
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciador de Templates</h2>
          <p className="text-gray-600">Configure as mensagens automáticas do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCarregarEstatisticas}
            disabled={loading}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="teste">Teste</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.tipo}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIconeTemplate(template.tipo)}
                      <CardTitle className="text-lg">
                        {getTituloAmigavel(template.tipo)}
                      </CardTitle>
                      <Badge variant={template.ativo ? "default" : "secondary"}>
                        {template.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTemplateEditando({ ...template });
                        setDialogAberto(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Variáveis:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variaveis.map((variavel) => (
                          <Badge key={variavel} variant="outline" className="text-xs">
                            {`{{${variavel}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Preview:</Label>
                      <div className="bg-gray-50 p-3 rounded-md mt-1">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {template.template.substring(0, 200)}
                          {template.template.length > 200 && '...'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testar Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-select">Template</Label>
                <select
                  id="template-select"
                  className="w-full p-2 border rounded-md"
                  value={templateTeste}
                  onChange={(e) => {
                    setTemplateTeste(e.target.value);
                    setDadosTeste(getDadosTesteDefault(e.target.value));
                  }}
                >
                  <option value="">Selecione um template</option>
                  {templates.map((template) => (
                    <option key={template.tipo} value={template.tipo}>
                      {getTituloAmigavel(template.tipo)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="telefone-teste">Telefone de Teste</Label>
                <Input
                  id="telefone-teste"
                  placeholder="5511999999999"
                  value={telefoneTeste}
                  onChange={(e) => setTelefoneTeste(e.target.value)}
                />
              </div>

              {templateTeste && (
                <div>
                  <Label>Dados de Teste (JSON)</Label>
                  <Textarea
                    className="font-mono"
                    rows={8}
                    value={JSON.stringify(dadosTeste, null, 2)}
                    onChange={(e) => {
                      try {
                        setDadosTeste(JSON.parse(e.target.value));
                      } catch (err) {
                        // Ignorar erro de parsing durante digitação
                      }
                    }}
                  />
                </div>
              )}

              <Button
                onClick={handleTestarTemplate}
                disabled={!templateTeste || !telefoneTeste || loading}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {loading ? 'Enviando...' : 'Enviar Teste'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Edição */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Editar Template: {templateEditando && getTituloAmigavel(templateEditando.tipo)}
            </DialogTitle>
          </DialogHeader>
          
          {templateEditando && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={templateEditando.titulo}
                  onChange={(e) => setTemplateEditando({
                    ...templateEditando,
                    titulo: e.target.value
                  })}
                />
              </div>

              <div>
                <Label htmlFor="template">Template</Label>
                <Textarea
                  id="template"
                  rows={12}
                  className="font-mono"
                  value={templateEditando.template}
                  onChange={(e) => setTemplateEditando({
                    ...templateEditando,
                    template: e.target.value
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={templateEditando.ativo}
                  onCheckedChange={(checked) => setTemplateEditando({
                    ...templateEditando,
                    ativo: checked
                  })}
                />
                <Label htmlFor="ativo">Template ativo</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogAberto(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSalvarTemplate}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Estatísticas */}
      <Dialog open={dialogEstatisticas} onOpenChange={setDialogEstatisticas}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estatísticas de Notificações</DialogTitle>
          </DialogHeader>
          
          {estatisticas && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {estatisticas.total}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {estatisticas.enviadas}
                    </div>
                    <div className="text-sm text-gray-600">Enviadas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {estatisticas.pendentes}
                    </div>
                    <div className="text-sm text-gray-600">Pendentes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {estatisticas.falharam}
                    </div>
                    <div className="text-sm text-gray-600">Falharam</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Por Tipo de Template</h4>
                <div className="space-y-2">
                  {Object.entries(estatisticas.porTipo).map(([tipo, stats]: [string, any]) => (
                    <div key={tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        {getIconeTemplate(tipo)}
                        <span>{getTituloAmigavel(tipo)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {stats.enviadas}/{stats.total}
                        </div>
                        <div className="text-xs text-gray-600">
                          {stats.taxa.toFixed(1)}% sucesso
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}