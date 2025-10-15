import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form@7.55.0";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X, Loader2, Check } from "lucide-react";
import { User } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

const profileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(200, "Bio deve ter no máximo 200 caracteres").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const availableSports = [
  "Futebol Society",
  "Futsal",
  "Vôlei",
  "Basquete",
  "Beach Tennis",
  "Tênis",
  "Padel",
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { updateUser } = useAuth();
  const [selectedSports, setSelectedSports] = useState<string[]>(user.sports);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      birthDate: user.birthDate,
      address: user.address,
      bio: user.bio,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateUser({
      ...data,
      sports: selectedSports,
    });

    setSuccess(true);
    toast.success("Perfil atualizado com sucesso!");

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
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
              className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-background border-2 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {!success ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Header */}
                  <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Editar Perfil</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} type="button">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="João Silva"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="(11) 98765-4321"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...register("birthDate")}
                      />
                      {errors.birthDate && (
                        <p className="text-sm text-destructive">{errors.birthDate.message}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        placeholder="São Paulo, SP"
                      />
                    </div>

                    {/* Sports */}
                    {user.role === "client" && (
                      <div className="space-y-2">
                        <Label>Esportes Favoritos</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableSports.map((sport) => (
                            <motion.button
                              key={sport}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleSport(sport)}
                            >
                              <Badge
                                variant={selectedSports.includes(sport) ? "default" : "outline"}
                                className="cursor-pointer"
                              >
                                {sport}
                              </Badge>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {user.role === "client" && (
                      <div className="space-y-2">
                        <Label htmlFor="bio">Sobre Mim</Label>
                        <Textarea
                          id="bio"
                          {...register("bio")}
                          placeholder="Conte um pouco sobre você..."
                          rows={4}
                          maxLength={200}
                        />
                        {errors.bio && (
                          <p className="text-sm text-destructive">{errors.bio.message}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-background border-t p-6 flex gap-3">
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
                          Salvando...
                        </>
                      ) : (
                        "Salvar Alterações"
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
                    Perfil Atualizado!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground"
                  >
                    Suas informações foram salvas com sucesso
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
