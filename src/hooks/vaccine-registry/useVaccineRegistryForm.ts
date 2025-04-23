import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Vaccine } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { IUserProfile } from "@/lib/client/IUserProfile";

import { fetchUsers } from "@/lib/client/getUsers";
import { getPetsByUserId } from "@/lib/pets/getPetsByUserId";
import { toast } from "@/lib/toast";
import { getVaccinesBySpecies } from "@/lib/vaccine/getVaccinesBySpecies";
import useDebounce from "@/hooks/useDebounce";

export const vaccineRegistrySchema = z.object({
  vaccineId: z.number().min(1, "La vacuna es obligatoria"),
  dose: z.coerce.number().positive("La dosis debe ser mayor a 0"),
  applicationDate: z.string().min(1, "La fecha de aplicación es obligatoria"),
  expectedDate: z.string().min(1, "La fecha esperada es obligatoria"),
  petId: z.number().optional(),
  clientId: z.number().optional(),
});

export type VaccineRegistryFormValues = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryCreateForm = (
  token?: string,
  selectedClientId?: number
) => {
  const form = useForm<VaccineRegistryFormValues>({
    resolver: zodResolver(vaccineRegistrySchema),
    defaultValues: {
      dose: 1,
      applicationDate: "",
      expectedDate: "",
    },
  });

  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<IUserProfile[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [hasSelectedClient, setHasSelectedClient] = useState(false);

  const [petLabels, setPetLabels] = useState<{ id: number; label: string; speciesId: number }[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [petSearch, setPetSearch] = useState("");

  const [vaccineSearch, setVaccineSearch] = useState("");
  const [isLoadingVaccines, setIsLoadingVaccines] = useState(false);
  const [vaccineOptions, setVaccineOptions] = useState<Vaccine[]>([]);
  const [hasSelectedVaccine, setHasSelectedVaccine] = useState(false);

  const debouncedClientSearch = useDebounce(clientSearch, 500);
  const debouncedVaccineSearch = useDebounce(vaccineSearch, 500);

  const onClientSelect = useCallback(async (client: IUserProfile) => {
    form.setValue("clientId", client.id);
    setClientSearch(client.fullName);
    setHasSelectedClient(true);
    setClients([]);
    setIsLoadingPets(true);

    try {
      const pets = await getPetsByUserId(client.id, token || "");
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
  }, [form, token]);

  useEffect(() => {
    if (!token || hasSelectedClient ) return;
  
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
    if (!selectedClientId || !token || hasSelectedClient) return;

    const autoSelect = async () => {
      try {
        const { data } = await fetchUsers(1, "", token);
        const client = data.find((c: IUserProfile) => c.id === selectedClientId);
        if (client) await onClientSelect(client);
      } catch {
        toast("error", "No se pudo cargar el cliente inicial");
      }
    };

    autoSelect();
  }, [selectedClientId, token, hasSelectedClient, onClientSelect]);

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

  const clearSelectedClient = () => {
    form.setValue("clientId", undefined);
    setClientSearch("");
    setClients([]);
    setPetLabels([]);
    setSelectedPetId(null);
    setHasSelectedClient(false);
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
    setHasSelectedVaccine,
    petSearch,
    setPetSearch,
    hasSelectedVaccine,
    hasSelectedClient,
    setHasSelectedClient,
    clearSelectedClient,
  };
};
