import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { useGetSpecies } from "@/hooks/species/useGetSpecies";
import { useGetRaces } from "@/hooks/races/useGetRaces";
import { mapToFormData } from "@/lib/utils";
import { registerPet } from "@/lib/pets/registerPet";
import { image } from "@/lib/schemas";
import { ClientData } from "@/lib/admin/client/IClient";

const petFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  dateOfBirth: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  raceId: z.string().min(1, "La raza es obligatoria"),
  speciesId: z.string().min(1, "Debes seleccionar un tipo de animal"),
  sex: z.string().min(1, "Debes seleccionar un género"),
  weight: z.coerce
    .number()
    .positive("El peso debe ser mayor a 0")
    .min(0.1, "El peso debe ser al menos 0.1 kg"),
  profileImg: image(),
  clientId: z.string().min(1, "Debes seleccionar un cliente"),
});

export type PetFormValues = z.infer<typeof petFormSchema>;

export const usePetRegisterForm = (token: string) => {
  const router = useRouter();

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      raceId: "",
      speciesId: "",
      sex: "",
      weight: 0,
      profileImg: undefined,
      clientId: "",
    },
  });

  const selectedSpeciesId = Number(form.watch("speciesId"));
  const selectedSex = form.watch("sex");

  const { data: species, isLoading: isGettingSpecies } = useGetSpecies({
    token,
  });
  const {
    data: races,
    isLoading: isGettingRaces,
    setQuery: setRacesQuery,
  } = useGetRaces({
    token,
    condition: !!selectedSpeciesId,
  });
  const handleSpeciesChange = (speciesId: string) => {
    form.setValue("speciesId", speciesId, { shouldValidate: true });
    setRacesQuery((prev) => ({ ...prev, speciesId: Number(speciesId) }));
  };
  const handleRaceChange = (raceId: string) => {
    form.setValue("raceId", raceId, { shouldValidate: true });
  };
  const handleImageChange = (file?: File) => {
    form.setValue("profileImg", file, { shouldValidate: true });
  };
  const onSexChange = (sex: string) => {
    form.setValue("sex", sex, { shouldValidate: true });
  };
  const handleClientChange = (client: ClientData) => {
    form.setValue("clientId", client.id.toString(), { shouldValidate: true });
  };
  const onSubmit = async (data: PetFormValues) => {
    const formData = mapToFormData({
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    });
    try {
      await registerPet(formData, token);
      form.reset();
      toast("success", "Mascota registrada con éxito!");
      router.push("/dashboard/settings/pets");
    } catch {
      toast("error", "Hubo un error al registrar la mascota.");
    }
  };
  return {
    ...form,
    species,
    isGettingSpecies,
    races,
    isGettingRaces,
    selectedSpeciesId,
    selectedSex,
    handleSpeciesChange,
    handleRaceChange,
    handleImageChange,
    onSexChange,
    onSubmit,
    handleClientChange,
  };
};
