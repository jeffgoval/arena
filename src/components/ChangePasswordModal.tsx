import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form@7.55.0";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { X, Loader2, Check, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch("newPassword", "");

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-destructive";
    if (strength < 75) return "bg-warning";
    return "bg-success";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 50) return "Fraca";
    if (strength < 75) return "Média";
    return "Forte";
  };

  const passwordRules = [
    { label: "Mínimo 8 caracteres", met: newPassword.length >= 8 },
    { label: "Letras maiúsculas e minúsculas", met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
    { label: "Números", met: /[0-9]/.test(newPassword) },
    { label: "Caracteres especiais", met: /[^a-zA-Z0-9]/.test(newPassword) },
  ];

  const onSubmit = async (data: PasswordFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess(true);
    toast.success("Senha alterada com sucesso!");

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-md bg-background border-2 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {!success ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Header */}
                  <div className="border-b p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Trocar Senha</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} type="button">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual *</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          {...register("currentPassword")}
                          placeholder="Digite sua senha atual"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha *</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          {...register("newPassword")}
                          placeholder="Digite sua nova senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                      )}

                      {/* Password Strength */}
                      {newPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Força da senha:</span>
                            <span className={`font-medium ${passwordStrength >= 75 ? "text-success" : passwordStrength >= 50 ? "text-warning" : "text-destructive"}`}>
                              {getStrengthLabel(passwordStrength)}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className={getStrengthColor(passwordStrength)} />
                        </motion.div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")}
                          placeholder="Digite novamente a nova senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Password Rules */}
                    {newPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-muted/50 rounded-lg space-y-2"
                      >
                        <p className="text-sm font-medium mb-2">Sua senha deve ter:</p>
                        {passwordRules.map((rule, index) => (
                          <motion.div
                            key={rule.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            {rule.met ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={rule.met ? "text-foreground" : "text-muted-foreground"}>
                              {rule.label}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t p-6 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1" type="button">
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Alterando...
                        </>
                      ) : (
                        "Alterar Senha"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="p-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
                    className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-4"
                  >
                    <Check className="h-10 w-10 text-success" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Senha Alterada!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground"
                  >
                    Sua senha foi atualizada com sucesso
                  </motion.p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
