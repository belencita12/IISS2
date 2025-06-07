import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vaccine } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import {
  getPetsByUserId,
  getPetsByNameAndUserIdFull,
} from "@/lib/pets/getPetsByUserId";
import { toast } from "@/lib/toast";
import { getVaccinesBySpecies } from "@/lib/vaccine/getVaccinesBySpecies";
import useDebounce from "@/hooks/useDebounce";

export const vaccineRegistrySchema = z
  .object({
    vaccineId: z
      .number({
        invalid_type_error: "Debe seleccionar una vacuna",
        required_error: "La vacuna es obligatoria",
      })
      .refine((val) => !isNaN(val), { message: "Debe seleccionar una vacuna" }),

    petId: z
      .number({
        invalid_type_error: "Debe seleccionar una mascota",
        required_error: "La mascota es obligatoria",
      })
      .refine((val) => !isNaN(val), {
        message: "Debe seleccionar una mascota",
      }),

    clientId: z
      .number({
        invalid_type_error: "Debe seleccionar un cliente",
        required_error: "El cliente es obligatorio",
      })
      .refine((val) => !isNaN(val), { message: "Debe seleccionar un cliente" }),

    dose: z.coerce
      .number()
      .positive("La dosis debe ser mayor a 0")
      .refine((val) => !isNaN(val), {
        message: "Debe ser un número válido",
      }),

    applicationDate: z.string().min(1, "La fecha de aplicación es obligatoria"),

    expectedDate: z.string().min(1, "La fecha esperada es obligatoria"),
  })
  .refine(
    (data) => {
      const application = new Date(data.applicationDate);
      const expected = new Date(data.expectedDate);
      return expected > application;
    },
    {
      message: "La fecha esperada debe ser posterior a la fecha de aplicación",
      path: ["expectedDate"], // Aplica el error al campo visual "expectedDate"
    }
  );

export type VaccineRegistryFormValues = z.infer<typeof vaccineRegistrySchema>;

export const useVaccineRegistryCreateForm = (token?: string) => {
  const form = useForm<VaccineRegistryFormValues>({
    resolver: zodResolver(vaccineRegistrySchema),
    defaultValues: {
      dose: 1,
      applicationDate: "",
      expectedDate: "",
    },
  });

  const [hasSelectedClient, setHasSelectedClient] = useState(false);
  const [hasSelectedPet, setHasSelectedPet] = useState(false);

  const [pets, setPets] = useState<PetData[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);
  const [petSearch, setPetSearch] = useState("");

  const [vaccineSearch, setVaccineSearch] = useState("");
  const [isLoadingVaccines, setIsLoadingVaccines] = useState(false);
  const [vaccineOptions, setVaccineOptions] = useState<Vaccine[]>([]);
  const [hasSelectedVaccine, setHasSelectedVaccine] = useState(false);

  const debouncedPetSearch = useDebounce(petSearch, 500);
  const debouncedVaccineSearch = useDebounce(vaccineSearch, 500);

  useEffect(() => {
    if (!token || !selectedPet || hasSelectedVaccine) return;

    if (!selectedPet?.species.id) return;

    const fetchVaccines = async () => {
      setIsLoadingVaccines(true);
      try {
        const res = await getVaccinesBySpecies(
          token,
          selectedPet?.species.id,
          1,
          {
            name: debouncedVaccineSearch,
          }
        );
        setVaccineOptions(res.data);
      } catch {
        toast("error", "Error al obtener vacunas");
      } finally {
        setIsLoadingVaccines(false);
      }
    };

    fetchVaccines();
  }, [debouncedVaccineSearch, token, selectedPet, pets, hasSelectedVaccine]);

  const petLabels = pets.map((pet) => ({
    id: pet.id as number,
    label: `${pet.name} (${pet.species.name} - ${pet.race.name}) - Dueño: ${pet.owner.name}`,
    speciesId: pet.species.id,
  }));

  useEffect(() => {
    if (!token || hasSelectedPet) return;

    const search = debouncedPetSearch.trim();

    const fetchPets = async () => {
      setIsLoadingPets(true);
      try {
        if (search === "") {
          const petsData = await getPetsByUserId(undefined, token);
          setPets(petsData);
        } else {
          const petsData = await getPetsByNameAndUserIdFull(
            undefined,
            token,
            1,
            search
          );
          setPets(petsData.data);
        }
      } catch {
        toast("error", "No se pudieron obtener las mascotas");
      } finally {
        setIsLoadingPets(false);
      }
    };

    fetchPets();
  }, [debouncedPetSearch, token, hasSelectedClient, hasSelectedPet]);

  const clearField = (field: keyof VaccineRegistryFormValues) => {
    form.setValue(field, NaN);
    form.clearErrors(field);
  };

  const handlePetInputChange = (value: string) => {
    setPetSearch(value);
    clearField("petId");
    clearField("vaccineId");
    setSelectedPet(null);
    setVaccineOptions([]);
    setHasSelectedVaccine(false);
    setVaccineSearch("");
    setHasSelectedPet(false);
  };

  const handleVaccineInputChange = (value: string) => {
    setVaccineSearch(value);
    if (value.trim() === "") clearField("vaccineId");
    setHasSelectedVaccine(false);
  };

  return {
    form,
    petLabels,
    pets,
    isLoadingPets,
    vaccineSearch,
    setVaccineSearch,
    isLoadingVaccines,
    vaccineOptions,
    selectedPet,
    setSelectedPet,
    setHasSelectedVaccine,
    petSearch,
    setPetSearch,
    hasSelectedVaccine,
    hasSelectedClient,
    setHasSelectedClient,
    clearField,
    handlePetInputChange,
    handleVaccineInputChange,
    setHasSelectedPet,
  };
};
