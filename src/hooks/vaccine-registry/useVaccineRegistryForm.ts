import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { VaccineRecord, Vaccine } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { IUserProfile } from "@/lib/client/IUserProfile";

import { fetchUsers } from "@/lib/client/getUsers";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { toast } from "@/lib/toast";
import { getVaccinesBySpecies } from "@/lib/vaccine/getVaccinesBySpecies";
import useDebounce from "@/hooks/useDebounce";

export const vaccineRegistrySchema = z.object({
  vaccineId: z.number().min(1, "La vacuna es obligatoria"),
  dose: z.coerce
    .number()
    .positive("La dosis debe ser un número mayor a 0")
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debe ser un número válido mayor a 0",
    }),
  applicationDate: z.string().min(1, "La fecha de aplicación es obligatoria"),
  expectedDate: z.string().min(1, "La fecha esperada es obligatoria"),
  petId: z.number().optional(),
  petSearch: z.string().optional(),
  clientId: z.number().optional(),
});

export type VaccineRegistryFormValues = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryForm = (
  initialData?: VaccineRecord,
  token?: string
) => {
  const form = useForm<VaccineRegistryFormValues>({
    resolver: zodResolver(vaccineRegistrySchema),
    defaultValues: {
      petSearch: "",
      vaccineId: initialData?.vaccineId || undefined,
      dose: initialData?.dose || 1,
      applicationDate: initialData?.applicationDate?.slice(0, 16) || "",
      expectedDate: initialData?.expectedDate?.slice(0, 16) || "",
    },
  });

  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<IUserProfile[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [hasSelectedClient, setHasSelectedClient] = useState(false);

  const [petLabels, setPetLabels] = useState<{ id: number; label: string; speciesId: number }[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [petSearch, setPetSearch] = useState("");
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const [vaccineSearch, setVaccineSearch] = useState("");
  const [isLoadingVaccines, setIsLoadingVaccines] = useState(false);
  const [vaccineOptions, setVaccineOptions] = useState<Vaccine[]>([]);
  const [hasSelectedVaccine, setHasSelectedVaccine] = useState(false);

  const debouncedClientSearch = useDebounce(clientSearch, 500);
  const debouncedVaccineSearch = useDebounce(vaccineSearch, 500);

  const resetClient = () => {
    setHasSelectedClient(false);
    setClientSearch("");
    setClients([]);
    setPetLabels([]);
    setSelectedPetId(null);
    setVaccineOptions([]);
  };
  
  useEffect(() => {
    if (!token || hasSelectedClient) return;

    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const { data } = await fetchUsers(1, debouncedClientSearch, token);
        setClients(data);
      } catch {
        toast("error", "Error al cargar clientes");
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, [debouncedClientSearch, token, hasSelectedClient]);

  useEffect(() => {
    if (!token || !selectedPetId || hasSelectedVaccine) return;

    const selectedPet = petLabels.find((p) => p.id === selectedPetId);
    if (!selectedPet?.speciesId) return;

    const fetchVaccines = async () => {
      setIsLoadingVaccines(true);
      try {
        const res = await getVaccinesBySpecies(token, selectedPet.speciesId, 1, {
          name: debouncedVaccineSearch,
        });
        setVaccineOptions(res.data);
      } catch {
        toast("error", "Error al obtener vacunas");
      } finally {
        setIsLoadingVaccines(false);
      }
    };

    fetchVaccines();
  }, [debouncedVaccineSearch, token, selectedPetId, petLabels, hasSelectedVaccine]);

  const onClientSelect = async (client: IUserProfile) => {
    form.setValue("clientId", client.id);
    setClientSearch(client.fullName);
    setHasSelectedClient(true);
    setClients([]);
    setIsLoadingPets(true);

    if (!token || !client) return;
    try {
      const pets = await getPetsByUserId(client.id, token);
      const labels = pets.map((pet: PetData) => ({
        id: pet.id,
        label: `${client.fullName} | ${pet.name}`,
        speciesId: pet.species.id,
      }));
      setPetLabels(labels);
    } catch {
      toast("error", "No se pudieron cargar las mascotas");
    } finally {
      setIsLoadingPets(false);
    }
  };
  

  return {
    form,
    clientSearch,
    setClientSearch,
    clients,
    isLoadingClients,
    onClientSelect,
    petLabels,
    isLoadingPets,
    vaccineSearch,
    setVaccineSearch,
    isLoadingVaccines,
    vaccineOptions,
    selectedPetId,
    setSelectedPetId,
    hasSelectedClient,
    petSearch,
    setPetSearch,
    setHasSelectedVaccine,
  };  
};
