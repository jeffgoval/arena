"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Trash2, ArrowLeft, Loader2, CheckCircle2, UserCheck, UserX } from "lucide-react";
import { useCreateTurma } from "@/hooks/core/useTurmas";
import { teamFormSchema, type TeamFormData } from "@/lib/validations/turma.schema";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CriarTurmaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createTurma = useCreateTurma();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      membros: [
        {
          nome: "",
          email: "",
          whatsapp: "",
          status: "fixo",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "membros",
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      const turma = await createTurma.mutateAsync(data);

      toast({
        title: "Turma criada com sucesso!",
        description: `A turma "${data.nome}" foi criada com ${data.membros.length} membro(s).`,
      });

      // Redirect to turmas list
      router.push("/cliente/turmas");
    } catch (error: any) {
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const addMember = () => {
    append({
      nome: "",
      email: "",
      whatsapp: "",
      status: "fixo",
    });
  };

  return (
    <div className="container-custom page-padding space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/cliente/turmas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="heading-2">Criar Nova Turma</h1>
          <p className="body-medium text-muted-foreground">Monte seu time fixo para facilitar as reservas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-4xl space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="heading-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Informações da Turma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Turma *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Ex: Time dos Amigos"
                  className={errors.nome ? "border-destructive" : ""}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  {...register("descricao")}
                  placeholder="Descreva sua turma..."
                  className="h-20"
                />
                {errors.descricao && (
                  <p className="text-sm text-destructive">{errors.descricao.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="heading-3">Membros da Turma</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addMember} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Membro
                </Button>
              </div>
              {errors.membros && (
                <p className="text-sm text-destructive">{errors.membros.message}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Membro #{index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor={`membros.${index}.nome`}>Nome *</Label>
                        <Input
                          {...register(`membros.${index}.nome`)}
                          placeholder="Nome do jogador"
                          className={errors.membros?.[index]?.nome ? "border-destructive" : ""}
                        />
                        {errors.membros?.[index]?.nome && (
                          <p className="text-sm text-destructive">
                            {errors.membros[index]?.nome?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`membros.${index}.whatsapp`}>WhatsApp</Label>
                        <Input
                          {...register(`membros.${index}.whatsapp`)}
                          placeholder="(33) 99999-9999"
                          className={errors.membros?.[index]?.whatsapp ? "border-destructive" : ""}
                        />
                        {errors.membros?.[index]?.whatsapp && (
                          <p className="text-sm text-destructive">
                            {errors.membros[index]?.whatsapp?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo *</Label>
                        <Select
                          defaultValue={field.status}
                          onValueChange={(value) =>
                            setValue(`membros.${index}.status`, value as "fixo" | "variavel")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixo">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-success" />
                                Fixo
                              </div>
                            </SelectItem>
                            <SelectItem value="variavel">
                              <div className="flex items-center gap-2">
                                <UserX className="w-4 h-4 text-warning" />
                                Variável
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`membros.${index}.email`}>Email</Label>
                      <Input
                        {...register(`membros.${index}.email`)}
                        type="email"
                        placeholder="jogador@example.com"
                        className={errors.membros?.[index]?.email ? "border-destructive" : ""}
                      />
                      {errors.membros?.[index]?.email && (
                        <p className="text-sm text-destructive">
                          {errors.membros[index]?.email?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Nenhum membro adicionado. Clique em "Adicionar Membro".</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-info/20 bg-info/5 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-info font-semibold mb-1">Sobre Membros Fixos e Variáveis</p>
                  <p className="text-sm text-info/80">
                    <strong>Membros Fixos</strong> são sempre incluídos automaticamente nas reservas criadas com esta turma.{" "}
                    <strong>Membros Variáveis</strong> podem ser incluídos opcionalmente a cada jogo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/cliente/turmas" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando turma...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Criar Turma
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
