"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { registerPet } from "@/lib/pets/registerPet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetSpecies } from "@/hooks/species/useGetSpecies";
import { useGetRaces } from "@/hooks/races/useGetRaces";
import FormInput from "@/components/global/FormInput";
import FormSelect from "@/components/global/FormSelect";
import { blockExtraKeysNumber, mapToFormData } from "@/lib/utils";
import { image } from "@/lib/schemas";
import FormImgUploader from "@/components/global/FormImgUploader";
import PetSexSelector from "./PetSexSelector";

const petFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  dateOfBirth: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  raceId: z.string().min(1, "La raza es obligatoria"),
  speciesId: z.string().min(1, "Debes seleccionar un tipo de animal"),
  sex: z.string().min(1, "Debes seleccionar un género"),
  weight: z.coerce
    .number()
    .positive("El peso debe ser un número mayor a 0")
    .min(0.1, "El peso debe ser al menos 0.1 kg"),
  profileImg: image(),
});

type PetFormValues = z.infer<typeof petFormSchema>;
interface AdminPetFormProps {
  token: string;
  clientId: number;
}

export default function PetRegisterForm({
  token,
  clientId,
}: AdminPetFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      raceId: "",
      speciesId: "",
      sex: "",
      profileImg: undefined,
    },
  });

  const selectedSpeciesId = Number(watch("speciesId"));
  const selectedSex = watch("sex");

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
    setValue("speciesId", speciesId, { shouldValidate: true });
    setRacesQuery((prev) => ({ ...prev, speciesId: Number(speciesId) }));
  };

  const handleRaceChange = (raceId: string) => {
    setValue("raceId", raceId, { shouldValidate: true });
  };

  const handleImageChange = (file?: File) => {
    setValue("profileImg", file);
  };

  const onSexChange = (sex: string) => {
    setValue("sex", sex, { shouldValidate: true });
  };

  const onSubmit = async (data: PetFormValues) => {
    const formData = mapToFormData({
      ...data,
      clientId: String(clientId),
      dateOfBirth: new Date(data.dateOfBirth),
    });
    try {
      await registerPet(formData, token);
      reset();
      toast("success", "Mascota registrada con éxito!", {
        duration: 2000,
        onAutoClose: () => router.push(`/dashboard/clients/${clientId}`),
        onDismiss: () => router.push(`/dashboard/clients/${clientId}`),
      });
    } catch {
      toast("error", "Hubo un error al registrar la mascota.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="flex flex-col items-center space-y-4 w-80">
          <h1 className="text-3xl font-bold self-start">
            Registro de Mascota (Admin)
          </h1>
          <p className="text-gray-600 self-start">
            Ingresa los datos de la mascota
          </p>
          <div className="w-full flex flex-col items-center">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              Imagen (Opcional)
            </h3>
            <FormImgUploader
              prevClassName="rounded"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="md:w-2/3 w-80">
          <form
            id="petForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormInput
              register={register("name")}
              error={errors.name?.message}
              label="Nombre"
              placeholder="Luna"
              name="name"
            />
            <FormInput
              register={register("dateOfBirth")}
              error={errors.dateOfBirth?.message}
              label="Fecha de nacimiento"
              type="date"
              name="dateOfBirth"
              max={new Date().toISOString().split("T")[0]}
            />
            <FormSelect
              label="Especie"
              name="speciesId"
              disabled={isGettingSpecies}
              onChange={handleSpeciesChange}
              register={register("speciesId")}
              error={errors.speciesId?.message}
              placeholder={
                isGettingSpecies
                  ? "Cargando Especies..."
                  : "Seleccionar Especie"
              }
              options={species?.data.map((s) => ({
                value: s.id.toString(),
                label: s.name,
              }))}
            />
            <FormSelect
              label="Raza"
              name="raceId"
              disabled={isGettingRaces || !selectedSpeciesId || !species}
              register={register("raceId")}
              onChange={handleRaceChange}
              error={errors.raceId?.message}
              placeholder={
                !species || !selectedSpeciesId
                  ? "Selecciona una especie"
                  : isGettingRaces
                  ? "Cargando Razas..."
                  : "Seleccionar Raza"
              }
              options={races?.data?.map((r) => ({
                value: r.id.toString(),
                label: r.name,
              }))}
            />
            <FormInput
              id="weight"
              type="number"
              step={0.1}
              min="0"
              onKeyDown={blockExtraKeysNumber}
              register={register("weight")}
              error={errors.weight?.message}
              label="Peso (kg)"
              name="weight"
            />
            <PetSexSelector
              error={errors.sex?.message}
              selected={selectedSex}
              onChange={onSexChange}
            />
            <div className="flex justify-start gap-4 mt-16">
              <Button type="button" variant="outline">
                <Link href={`/dashboard/clients/${clientId}`}>Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Mascota"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
