"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthMode = "login" | "register" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  // Login direto sem API para demo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('login-email') as string || formData.get('email') as string;
    const password = formData.get('login-password') as string || formData.get('password') as string;

    // Validação básica
    if (!email || !password) {
      alert('Email e senha são obrigatórios');
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
      alert('Email não encontrado. Use: cliente@arena.com, gestor@arena.com ou admin@arena.com');
      setLoading(false);
      return;
    }

    // Redirecionar diretamente sem delay
    router.push(user.path);
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                    {/* Dados Pessoais */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
                        <User className="w-4 h-4 text-primary" />
                        Dados Pessoais
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="nome_completo">Nome completo *</Label>
                        <Input
                          id="nome_completo"
                          type="text"
                          placeholder="João da Silva"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input
                            id="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rg">RG</Label>
                          <Input
                            id="rg"
                            type="text"
                            placeholder="MG-00.000.000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="data_nascimento">Data de nascimento *</Label>
                        <Input
                          id="data_nascimento"
                          type="date"
                          required
                        />
                      </div>
                    </div>

                    {/* Contato */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Contato
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="(33) 99999-9999"
                          required
                        />
                      </div>
                    </div>

                    {/* Endereço */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Endereço
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          type="text"
                          placeholder="00000-000"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logradouro">Logradouro *</Label>
                        <Input
                          id="logradouro"
                          type="text"
                          placeholder="Rua, Avenida, etc"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="numero">Número *</Label>
                          <Input
                            id="numero"
                            type="text"
                            placeholder="123"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complemento">Complemento</Label>
                          <Input
                            id="complemento"
                            type="text"
                            placeholder="Apto, Bloco"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="bairro">Bairro *</Label>
                          <Input
                            id="bairro"
                            type="text"
                            placeholder="Centro"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cidade">Cidade *</Label>
                          <Input
                            id="cidade"
                            type="text"
                            placeholder="Governador Valadares"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Input
                          id="estado"
                          type="text"
                          placeholder="MG"
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>

                    {/* Segurança */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b pb-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Segurança
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="password">Senha *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            className="pr-10"
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

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repita a senha"
                            className="pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="pt-4 border-t">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  </div>
                </form>
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
