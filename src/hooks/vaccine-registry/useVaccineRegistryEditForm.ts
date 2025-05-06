import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { IUserProfile } from "@/lib/client/IUserProfile";
import { PetData } from "@/lib/pets/IPet";
import { Vaccine, VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";

import { fetchUsers } from "@/lib/client/getUsers";
import {
  getPetsByUserId,
  getPetsByNameAndUserIdFull,
} from "@/lib/pets/getPetsByUserId";
import { toast } from "@/lib/toast";
import { getVaccinesBySpecies } from "@/lib/vaccine/getVaccinesBySpecies";
import useDebounce from "@/hooks/useDebounce";
import { getClientById } from "@/lib/client/getClientById";

type Option = { id: number; label: string };
type PetOption = Option & { speciesId: number };

export const vaccineRegistrySchema = z
  .object({
    vaccineId: z
      .number({ invalid_type_error: "Debe seleccionar una vacuna", required_error: "La vacuna es obligatoria" })
      .refine((val) => !isNaN(val), { message: "Debe seleccionar una vacuna" }),

    petId: z
      .number({ invalid_type_error: "Debe seleccionar una mascota", required_error: "La mascota es obligatoria" })
      .refine((val) => !isNaN(val), { message: "Debe seleccionar una mascota" }),

    clientId: z
      .number({ invalid_type_error: "Debe seleccionar un cliente", required_error: "El cliente es obligatorio" })
      .refine((val) => !isNaN(val), { message: "Debe seleccionar un cliente" }),

    dose: z.coerce
      .number()
      .positive("La dosis debe ser mayor a 0")
      .refine((val) => !isNaN(val), {
        message: "Debe ser un número válido",
      }),

    applicationDate: z
      .string()
      .min(1, "La fecha de aplicación es obligatoria"),

    expectedDate: z
      .string()
      .min(1, "La fecha esperada es obligatoria"),
  })
  .refine((data) => {
    const application = new Date(data.applicationDate);
    const expected = new Date(data.expectedDate);
    return expected > application;
  }, {
    message: "La fecha esperada debe ser posterior a la fecha de aplicación",
    path: ["expectedDate"],
  });

export type VaccineRegistryFormValues = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryEditForm = (
  token: string,
  initialData: VaccineRecord,
  clientId: number,
  petId: number
) => {
  const form = useForm<VaccineRegistryFormValues>({
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

  const { setValue, clearErrors } = form;

  const [clients, setClients] = useState<Option[]>([]);
  const [pets, setPets] = useState<PetOption[]>([]);
  const [vaccines, setVaccines] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const [clientSearch, setClientSearch] = useState("");
  const [petSearch, setPetSearch] = useState("");
  const [vaccineSearch, setVaccineSearch] = useState("");

  const [hasSelectedClient, setHasSelectedClient] = useState(true);
  const [hasSelectedPet, setHasSelectedPet] = useState(true);
  const [hasSelectedVaccine, setHasSelectedVaccine] = useState(true);

  const [selectedPetId, setSelectedPetId] = useState<number | null>(petId);
  const [isLoadingVaccines, setIsLoadingVaccines] = useState(false);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const debouncedClientSearch = useDebounce(clientSearch, 500);
  const debouncedPetSearch = useDebounce(petSearch, 500);
  const debouncedVaccineSearch = useDebounce(vaccineSearch, 500);


  const onClientSelect = useCallback(
    async (client: IUserProfile) => {
      form.setValue("clientId", client.id);
      setClientSearch(client.fullName);
      setHasSelectedClient(true);
      setClients([]);
      setIsLoadingPets(true);

      try {
        const pets = await getPetsByUserId(client.id, token || "");
        const labels = pets
          .filter((pet: { id: number; }) => typeof pet.id === "number")
          .map((pet: PetData) => ({
            id: pet.id as number,
            label: `${pet.name} (${pet.race?.name || "sin raza"})`,
            speciesId: pet.species.id,
          }));

        setPets(labels);
      } catch {
        toast("error", "No se pudieron cargar las mascotas");
      } finally {
        setIsLoadingPets(false);
      }
    },
    [form, token]
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const client = await getClientById(clientId, token);
        if (client) {
          setClientSearch(`${client.fullName} - ${client.ruc}`);
          setClients([
            {
              id: client.id,
              label: `${client.fullName} - ${client.ruc}`,
            },
          ]);

        }
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

        const vaccineRes = await getVaccinesBySpecies(token, selectedPet.speciesId, 1);
        const vaccineList: Option[] = vaccineRes.data.map((v: Vaccine) => ({
          id: v.id,
          label: `${v.name} (${v.manufacturer.name})`,
        }));
        setVaccines(vaccineList);
        const selectedVaccine = vaccineList.find((v) => v.id === initialData.vaccineId);
        if (selectedVaccine) setVaccineSearch(selectedVaccine.label);
      } catch {
        toast("error", "Error al cargar los datos para edición");
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchAll();
  }, [clientId, petId, initialData.vaccineId, loading, setValue, token]);

  useEffect(() => {
    if (!token) return;

    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const { data } = await fetchUsers(1, debouncedClientSearch, token);
        setClients(data.map((c: IUserProfile) => ({
          id: c.id,
          label: `${c.fullName} - ${c.ruc}`,
        })));
      } catch {
        toast("error", "Error al cargar clientes");
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, [debouncedClientSearch, token]);

  useEffect(() => {
    if (!token || !hasSelectedClient || clientId == null || hasSelectedPet) return;

    const search = debouncedPetSearch.trim();

    const fetchPets = async () => {
      setIsLoadingPets(true);
      try {
        let labels;

        if (search === "") {
          const pets = await getPetsByUserId(clientId, token);
          labels = pets
            .filter((pet: { id: number }) => typeof pet.id === "number")
            .map((pet: PetData) => ({
              id: pet.id,
              label: `${pet.name} (${pet.race?.name || "sin raza"})`,
              speciesId: pet.species.id,
            }));
        } else {
          const res = await getPetsByNameAndUserIdFull(clientId, token, 1, search);
          labels = res.data
            .filter((pet) => typeof pet.id === "number")
            .map((pet: PetData) => ({
              id: pet.id,
              label: `${pet.name} (${pet.race?.name || "sin raza"})`,
              speciesId: pet.species.id,
            }));
        }

        setPets(labels);
      } catch {
        toast("error", "No se pudieron obtener las mascotas");
      } finally {
        setIsLoadingPets(false);
      }
    };

    fetchPets();
  }, [debouncedPetSearch, token, clientId, hasSelectedClient, hasSelectedPet]);


  useEffect(() => {
    if (!token || !selectedPetId || hasSelectedVaccine) return;

    const selectedPet = pets.find((p) => p.id === selectedPetId);
    if (!selectedPet?.speciesId) return;

    const fetchVaccines = async () => {
      setIsLoadingVaccines(true);
      try {
        const res = await getVaccinesBySpecies(token, selectedPet.speciesId, 1, {
          name: debouncedVaccineSearch,
        });
        setVaccines(res.data.map((v: Vaccine) => ({
          id: v.id,
          label: `${v.name} (${v.manufacturer.name})`,
        })));
      } catch {
        toast("error", "Error al obtener vacunas");
      } finally {
        setIsLoadingVaccines(false);
      }
    };

    fetchVaccines();
  }, [debouncedVaccineSearch, token, selectedPetId, pets, hasSelectedVaccine]);


  const clearField = (field: keyof VaccineRegistryFormValues) => {
    setValue(field, NaN);
    clearErrors(field);
  };

  const clearSelectedClient = () => {
    form.setValue("clientId", NaN);
    setClientSearch("");
    setClients([]);
    setPets([]);
    setSelectedPetId(null);
    setHasSelectedClient(false);
  };

  const handleClientInputChange = (value: string) => {
    setClientSearch(value);

    if (value.trim() === "") {
      // Limpieza total si se borra el cliente
      clearField("clientId");
      clearField("petId");
      clearField("vaccineId");

      setHasSelectedClient(false);
      setHasSelectedPet(false);
      setHasSelectedVaccine(false);

      setClients([]);
      setPets([]);
      setVaccines([]);

      setPetSearch("");
      setVaccineSearch("");
      setSelectedPetId(null);
    } else {
      // Búsqueda activa: limpiar mascotas y vacunas
      clearField("petId");
      clearField("vaccineId");

      setHasSelectedClient(false);
      setHasSelectedPet(false);
      setHasSelectedVaccine(false);

      setPetSearch("");
      setVaccineSearch("");
      setPets([]);
      setVaccines([]);
    }
  };



  const handlePetInputChange = (value: string) => {
    setPetSearch(value);

    if (value.trim() === "") {
      clearField("petId");
      setSelectedPetId(null);

      // LIMPIAR VACUNA SI SE BORRA MASCOTA
      clearField("vaccineId");
      setVaccineSearch("");
      setVaccines([]);
      setHasSelectedVaccine(false);
    } else {
      // SI SE ESTÁ ESCRIBIENDO UNA MASCOTA NUEVA, TAMBIÉN LIMPIAR VACUNA
      clearField("vaccineId");
      setVaccineSearch("");
      setVaccines([]);
      setHasSelectedVaccine(false);
    }

    setHasSelectedPet(false);
  };


  const handleVaccineInputChange = (value: string) => {
    setVaccineSearch(value);
    if (value.trim() === "") {
      clearField("vaccineId");
    }
    setHasSelectedVaccine(false);
  };

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
    hasSelectedClient,
    setHasSelectedClient,
    hasSelectedPet,
    setHasSelectedPet,
    hasSelectedVaccine,
    setHasSelectedVaccine,
    selectedPetId,
    setSelectedPetId,
    clearSelectedClient,
    clearField,
    handleClientInputChange,
    handlePetInputChange,
    handleVaccineInputChange,
    isLoadingClients,
    isLoadingPets,
    isLoadingVaccines,
    onClientSelect
  };
};
