import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { IUserProfile } from "@/lib/client/IUserProfile";
import { PetData } from "@/lib/pets/IPet";
import { Vaccine, VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";

import { fetchUsers } from "@/lib/client/getUsers";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { getVaccinesBySpecies } from "@/lib/vaccine/getVaccinesBySpecies";
import { toast } from "@/lib/toast";

type Option = { id: number; label: string };
type PetOption = Option & { speciesId: number };

export const vaccineRegistrySchema = z.object({
  vaccineId: z.number({
    required_error: "La vacuna es obligatoria",
    invalid_type_error: "La vacuna es obligatoria",
  }).min(1, "La vacuna es obligatoria"),

  petId: z.number({
    required_error: "La mascota es obligatoria",
    invalid_type_error: "La mascota es obligatoria",
  }).min(1, "La mascota es obligatoria"),

  clientId: z.number({
    required_error: "El cliente es obligatorio",
    invalid_type_error: "El cliente es obligatorio",
  }).min(1, "El cliente es obligatorio"),

  dose: z.coerce.number()
    .positive("La dosis debe ser mayor a 0")
    .refine((val) => !isNaN(val), {
      message: "Debe ser un número válido",
    }),

  applicationDate: z.string().min(1, "La fecha de aplicación es obligatoria"),
  expectedDate: z.string().min(1, "La fecha esperada es obligatoria"),
});

export type VaccineRegistryFormData = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryEditForm = (
  token: string,
  initialData: VaccineRecord,
  clientId: number,
  petId: number
) => {
  const [clients, setClients] = useState<Option[]>([]);
  const [pets, setPets] = useState<PetOption[]>([]);
  const [vaccines, setVaccines] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientSearch, setClientSearch] = useState("");
  const [petSearch, setPetSearch] = useState("");
  const [vaccineSearch, setVaccineSearch] = useState("");

  const form = useForm<VaccineRegistryFormData>({
    resolver: zodResolver(vaccineRegistrySchema),
    defaultValues: {
      vaccineId: initialData.vaccineId,
      dose: initialData.dose,
      applicationDate: initialData.applicationDate?.slice(0, 16) || "",
      expectedDate: initialData.expectedDate?.slice(0, 16) || "",
      clientId,
      petId,
    },
  });
  

  const { setValue } = form;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Clientes
        const userRes = await fetchUsers(1, "", token);
        const clientList: Option[] = userRes.data.map((c: IUserProfile) => ({
          id: c.id,
          label: `${c.fullName} - ${c.ruc}`,
        }));
        setClients(clientList);
        const selectedClient = clientList.find((c) => c.id === clientId);
        if (selectedClient) setClientSearch(selectedClient.label);

        // 2. Mascotas
        const petRes = await getPetsByUserId(clientId, token);
        const petList: PetOption[] = petRes.map((p: PetData) => ({
          id: p.id,
          label: `${p.name} (${p.race?.name || "sin raza"})`,
          speciesId: p.species.id,
        }));
        setPets(petList);
        const selectedPet = petList.find((p) => p.id === petId);
        if (!selectedPet) throw new Error("Mascota no encontrada");
        setPetSearch(selectedPet.label);

        // 3. Vacunas
        const vaccineRes = await getVaccinesBySpecies(token, selectedPet.speciesId, 1);
        const vaccineList: Option[] = vaccineRes.data.map((v: Vaccine) => ({
          id: v.id,
          label: `Nombre: ${v.name}`,
        }));
        setVaccines(vaccineList);
        const selectedVaccine = vaccineList.find((v) => v.id === initialData.vaccineId);
        if (selectedVaccine) setVaccineSearch(selectedVaccine.label);

        // Form state
        setValue("clientId", clientId);
        setValue("petId", petId);
        setValue("vaccineId", initialData.vaccineId);
      } catch {
        toast("error", "Error al cargar los datos para edición");
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchAll(); 
  }, [clientId, initialData.vaccineId, loading, petId, setValue, token]); 

  return {
    form,
    clients,
    pets,
    vaccines,
    loading,
    clientSearch,
    setClientSearch,
    petSearch,
    setPetSearch,
    vaccineSearch,
    setVaccineSearch,
  };
};
