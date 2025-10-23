"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupForm } from "@/components/auth/SignupForm";
import { IndicacoesService } from "@/services/indicacoes.service";
import type { SignupFormData } from "@/lib/validations/auth.schema";

type AuthMode = "login" | "register" | "forgot";

function AuthPageContent() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoIndicacao = searchParams.get('codigo');
  const { toast } = useToast();

  // Efeito para mudar para aba de cadastro se houver código de indicação
  useEffect(() => {
    if (codigoIndicacao) {
      setMode("register");
      toast({
        title: "Código de indicação detectado!",
        description: "Complete seu cadastro para ganhar créditos.",
      });
    }
  }, [codigoIndicacao, toast]);

  // Login direto sem API para demo
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('login-email') as string;
    const password = formData.get('login-password') as string;

    // Validação básica
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Email e senha são obrigatórios",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Verificar credenciais para demo
    const validCredentials = [
      { email: 'cliente@arena.com', role: 'cliente', path: '/cliente' },
      { email: 'gestor@arena.com', role: 'gestor', path: '/gestor' },
      { email: 'admin@arena.com', role: 'admin', path: '/gestor' }
    ];

    const user = validCredentials.find(u => u.email === email);

    if (!user) {
      toast({
        title: "Erro",
        description: "Email não encontrado. Use: cliente@arena.com, gestor@arena.com ou admin@arena.com",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Redirecionar diretamente sem delay
    router.push(user.path);
  };

  // Cadastro com integração do sistema de indicação
  const handleSignupSubmit = async (data: SignupFormData & { codigoIndicacao?: string }) => {
    setSignupLoading(true);

    try {
      // Simular criação de usuário (aqui você integraria com Supabase Auth)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Se houver código de indicação, aplicar
      if (data.codigoIndicacao) {
        // Simular ID do usuário criado
        const novoUsuarioId = 'user-' + Date.now();
        
        const sucesso = await IndicacoesService.aplicarCodigoIndicacao(
          data.codigoIndicacao,
          novoUsuarioId
        );

        if (sucesso) {
          toast({
            title: "Sucesso!",
            description: "Conta criada com sucesso! Código de indicação aplicado e créditos concedidos!",
          });
        } else {
          toast({
            title: "Sucesso!",
            description: "Conta criada com sucesso!",
          });
          toast({
            title: "Aviso",
            description: "Não foi possível aplicar o código de indicação.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Sucesso!",
          description: "Conta criada com sucesso!",
        });
      }

      // Redirecionar para área do cliente
      router.push('/cliente');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    alert("Email de recuperação enviado!");
    setMode("login");
    setLoading(false);
  };

  if (mode === "forgot") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-strong">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="heading-4">Recuperar Senha</CardTitle>
              <CardDescription className="body-small">
                Digite seu email para receber o link de recuperação
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("login")}
                  className="flex-1"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>

                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Email"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo e Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block group">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
          </Link>

          <div>
            <h1 className="heading-3 gradient-text">Arena Dona Santa</h1>
            <p className="body-small text-muted-foreground">
              Sua plataforma de reservas esportivas
            </p>
          </div>
        </div>

        {/* Card Principal */}
        <Card className="shadow-strong border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="heading-4">
              {mode === "login" ? "Bem-vindo de volta!" : "Criar conta"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Entre com suas credenciais para continuar"
                : "Preencha os dados para criar sua conta"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm">Entrar</TabsTrigger>
                <TabsTrigger value="register" className="text-sm">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        name="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>💡 <strong>Contas de Teste:</strong></p>
                      <p>• Cliente: cliente@arena.com (senha: 123456)</p>
                      <p>• Gestor: gestor@arena.com (senha: 123456)</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  {codigoIndicacao && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        🎉 Código de indicação <strong>{codigoIndicacao}</strong> será aplicado ao seu cadastro!
                      </p>
                    </div>
                  )}
                  
                  <SignupForm 
                    onSubmit={handleSignupSubmit}
                    loading={signupLoading}
                    codigoIndicacaoInicial={codigoIndicacao || undefined}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Link para voltar */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
