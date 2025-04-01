"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { registerRace } from "@/lib/pets/registerRace";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";

const raceFormSchema = z.object({
  name: z.string().min(1, "El nombre de la raza es obligatorio"),
  speciesId: z.coerce.number().min(1, "Seleccione una especie válida"),
});

type RaceFormValues = z.infer<typeof raceFormSchema>;

interface RaceFormProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RaceForm = ({ token, isOpen, onClose }: RaceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesList = await getSpecies(token);
        setSpecies(speciesList);
      } catch (error) {
        toast("error", "No se pudieron obtener las especies");
      }
    };
    fetchSpecies();
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
  });

  const onSubmit = async (data: RaceFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        speciesId: Number(data.speciesId),
      };
  
      await registerRace(payload, token);
      toast("success", "Raza registrada con éxito");
      onClose();
    } catch (error: unknown) {
          if (error instanceof Error) {
            toast("error", error.message);
          } else {
            toast("error", "Error inesperado al registrar la raza");
          }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro de Raza</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Nombre</Label>
            <Input {...register("name")} placeholder="Ingrese el nombre de la raza" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Especie</Label>
            <select {...register("speciesId")} className="w-full p-2 border rounded">
              <option value="">Seleccione una especie</option>
              {species.map((specie) => (
                <option key={specie.id} value={specie.id}>{specie.name}</option>
              ))}
            </select>
            {errors.speciesId && <p className="text-red-500">{errors.speciesId.message}</p>}
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registrando..." : "Registrar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
