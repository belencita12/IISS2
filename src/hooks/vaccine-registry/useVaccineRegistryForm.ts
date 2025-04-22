// hooks/vaccine-registry/useVaccineRegistryForm.ts

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { fetchUsers } from "@/lib/client/getUsers";
import { IUserProfile } from "@/lib/client/IUserProfile";

export const vaccineRegistrySchema = z.object({
  vaccineId: z
    .number({ invalid_type_error: "Debe seleccionar una vacuna" })
    .min(1, "La vacuna es obligatoria"),
  dose: z
    .number({ invalid_type_error: "Debe ingresar un número" })
    .min(1, "La dosis es obligatoria"),
  applicationDate: z
    .string()
    .min(1, "La fecha de aplicación es obligatoria"),
  expectedDate: z
    .string()
    .min(1, "La fecha esperada es obligatoria"),
  petId: z
    .number({ invalid_type_error: "Debe seleccionar una mascota" })
    .min(1, "La mascota es obligatoria")
    .optional(),
    petSearch: z.string().optional(),
});

export type VaccineRegistryFormValues = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryForm = (
  initialData?: VaccineRecord,
  petId?: number,
  token?: string,
  petOptions?: PetData[]
) => {
  const form = useForm<VaccineRegistryFormValues>({
    resolver: zodResolver(vaccineRegistrySchema),
    defaultValues: {
      petId: initialData?.petId || petId || undefined,
      petSearch: "",
      vaccineId: initialData?.vaccineId || undefined,
      dose: initialData?.dose || 1,
      applicationDate: initialData?.applicationDate?.slice(0, 16) || "",
      expectedDate: initialData?.expectedDate?.slice(0, 16) || "",
    },
  });

  const [petLabels, setPetLabels] = useState<{ id: number; label: string }[]>(
    []
  );

  useEffect(() => {
    const loadClientNames = async () => {
      if (!token || !petOptions) return;
  
      try {
        const allClients: { data: IUserProfile[] } = await fetchUsers(1, "", token);
        const clientMap: Record<number, string> = {};
        allClients.data.forEach((user) => {
          clientMap[user.id] = user.fullName;
        });
  
        const petsWithLabels = petOptions
          .filter((pet): pet is PetData & { id: number } => typeof pet.id === "number")
          .map((pet) => ({
            id: pet.id,
            label: `${clientMap[pet.userId] || "Dueño desconocido"} | ${pet.name}`,
          }));
  
        setPetLabels(petsWithLabels);
      } catch (err) {
        console.error("Error cargando clientes para mascotas:", err);
      }
    };
  
    loadClientNames();
  }, [token, petOptions]);
  

  return {
    ...form,
    petLabels,
  };
};
