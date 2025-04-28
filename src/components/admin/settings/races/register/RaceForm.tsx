"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { Race } from "@/lib/pets/IPet";
import { registerRace } from "@/lib/pets/registerRace";
import { updateRace } from "@/lib/pets/updateRace";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";
import { Modal } from "@/components/global/Modal";


const raceFormSchema = z.object({
  name: z.string().min(1, "El nombre de la raza es obligatorio"),
  speciesId: z.coerce.number().min(1, "Seleccione una especie válida"),
});

type RaceFormValues = z.infer<typeof raceFormSchema>;

interface RaceFormProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: Race | null;
}

export const RaceForm = ({ token, isOpen, onClose, initialData }: RaceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: initialData || { name: "", speciesId: 0 },
  });

  useEffect(() => {
    if (isOpen) {
        const fetchSpecies = async () => {
            try {
                const speciesList = await getSpecies(token);
                setSpecies(speciesList);
            } catch (error: unknown) {
                toast("error", error instanceof Error ? error.message : "Error inesperado");
            }
        };
        fetchSpecies();
    }
}, [token, isOpen]);


const onSubmit = async (data: RaceFormValues) => {
  setIsSubmitting(true);
  try {
    if (initialData) {
      const updatedRace = {
        name: data.name,
        speciesId: data.speciesId,
      };
      await updateRace(initialData.id, updatedRace, token);
      toast("success", "Raza actualizada con éxito");
    } else {
      await registerRace({ name: data.name, speciesId: data.speciesId }, token);
      toast("success", "Raza registrada con éxito");
    }
    onClose();
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast("error", error.message);
    } else {
      toast("error", "Error inesperado al procesar la solicitud.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Raza" : "Registro de Raza" }>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (initialData ? "Actualizando..." : "Registrando...") : (initialData ? "Actualizar" : "Registrar")}
        </Button>
      </div>
    </form>
  </Modal>
);

};
