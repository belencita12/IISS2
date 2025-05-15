"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Race, Species } from "@/lib/pets/IPet";
import { getRacesBySpecies, getSpecies } from "@/lib/pets/getRacesAndSpecies";
import { registerPet } from "@/lib/pets/registerPet";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { image } from "@/lib/schemas";
import { PawPrint, Upload, Info, Calendar, Weight } from "lucide-react";
import { mapToFormData } from "@/lib/utils";

const petFormSchema = z.object({
  petName: z.string().min(1, "El nombre es obligatorio"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  breed: z.string().min(1, "La raza es obligatoria"),
  animalType: z.string().min(1, "Debes seleccionar un tipo de animal"),
  gender: z.string().min(1, "Debes seleccionar un género"),
  weight: z.coerce
    .number()
    .positive("El peso debe ser un número mayor a 0")
    .min(0.1, "El peso debe ser al menos 0.1 kg"),
  imageFile: image(),
});
type PetFormValues = z.infer<typeof petFormSchema>;
interface PetFormProps {
  clientId?: number;
  token: string;
}

export default function PetForm({ clientId, token }: PetFormProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
       petName: "",
       birthDate: "",
       breed: "",
       animalType: "",
       gender: "",
       imageFile: undefined,
     },
   });
  useEffect(() => {
    if (!token) return;
    const fetchSpecies = async () => {
      try {
        const speciesData = await getSpecies(token);
        setSpecies(speciesData);
      } catch {
        toast("error", "Error al obtener las especies.");
      }
    };
    fetchSpecies();
  }, [token]);

  const handleSpeciesChange = async (speciesId: string) => {
    setRaces([]);
    if (!speciesId || !token) return;
    try {
      const racesData = await getRacesBySpecies(parseInt(speciesId), token);
      setRaces(racesData);
    } catch {
      toast("error", "Error al obtener las razas.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewImage(null);
    const file = event.target.files?.[0];
    if (!file) {
      setValue("imageFile", undefined);
      return;
    }
    setValue("imageFile", file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };
 const onSubmit = async (data: PetFormValues) => {
    const formData = mapToFormData({
      ...data,
      clientId: String(clientId),
      dateOfBirth: new Date(data.birthDate),
    });
    try {
      await registerPet(formData, token);
      reset();
      toast("success", "Mascota registrada con éxito!")
      router.push(`user-profile`)
     
    } catch {
      toast("error", "Hubo un error al registrar la mascota.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="absolute inset-0 from-myPurple-disabled/20 to-myPink-disabled/10 pointer-events-none" />
      <CardHeader className="relative pb-2">
        <CardTitle className="text-3xl font-bold text-myPurple-focus">
          Registro de Mascota
        </CardTitle>
        <CardDescription className="text-myPurple-focus/70 ml-6">
          Ingresa los datos de la mascota
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-myPink-disabled to-myPurple-disabled border-2 border-dashed border-myPurple-secondary flex items-center justify-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    className="w-full h-full object-cover"
                    alt="Vista previa de la mascota"
                    fill
                    priority
                  />
                ) : (
                  <div className="text-center p-6">
                    <PawPrint className="w-16 h-16 mx-auto mb-2 text-myPurple-primary" />
                    <p className="text-myPurple-focus font-medium">
                      Imagen de tu mascota
                    </p>
                    <p className="text-sm text-myPurple-focus/70 mt-1">
                      Opcional
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full max-w-xs border-myPurple-secondary text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus transition-all duration-200"
                onClick={() =>
                  document.getElementById("pet-image-upload")?.click()
                }
              >
                <Upload className="w-4 h-4 mr-2" />
                {previewImage ? "Cambiar imagen" : "Subir imagen"}
                <Input
                  id="pet-image-upload"
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </Button>
              {errors.imageFile && (
                <p className="text-myPink-focus text-sm">
                  {errors.imageFile.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <form
              id="petForm"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="flex items-center text-myPurple-focus">
                    <Info className="w-4 h-4 mr-2 text-myPurple-primary" />
                    Nombre
                  </Label>
                  <Input
                    id="petName"
                    {...register("petName")}
                    placeholder="Ej. Luna"
                    className="border-myPurple-tertiary focus-visible:ring-myPurple-primary"
                  />
                  {errors.petName && (
                    <p className="text-myPink-focus text-sm">
                      {errors.petName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-myPurple-focus">
                    <Calendar className="w-4 h-4 mr-2 text-myPurple-primary" />
                    Fecha de nacimiento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    max={new Date().toISOString().split("T")[0]}
                    className="border-myPurple-tertiary focus-visible:ring-myPurple-primary"
                  />
                  {errors.birthDate && (
                    <p className="text-myPink-focus text-sm">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-myPurple-focus">
                    <PawPrint className="w-4 h-4 mr-2 text-myPurple-primary" />
                    Animal
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("animalType", value);
                      handleSpeciesChange(value);
                    }}
                  >
                    <SelectTrigger
                      id="animalType"
                      className="border-myPurple-tertiary focus:ring-myPurple-primary"
                    >
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="border-myPurple-tertiary">
                      {species.map((specie) => (
                        <SelectItem
                          key={specie.id}
                          value={specie.id.toString()}
                        >
                          {specie.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.animalType && (
                    <p className="text-myPink-focus text-sm">
                      {errors.animalType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-myPurple-focus">
                    <PawPrint className="w-4 h-4 mr-2 text-myPurple-primary" />
                    Raza
                  </Label>
                  <Select onValueChange={(value) => setValue("breed", value)}>
                    <SelectTrigger
                      id="breed"
                      className="border-myPurple-tertiary focus:ring-myPurple-primary"
                    >
                      <SelectValue
                        placeholder={
                          races.length > 0
                            ? "Seleccionar"
                            : "Selecciona una especie primero"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="border-myPurple-tertiary">
                      {races.map((race) => (
                        <SelectItem key={race.id} value={race.id.toString()}>
                          {race.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.breed && (
                    <p className="text-myPink-focus text-sm">
                      {errors.breed.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-myPurple-focus">
                    <Weight className="w-4 h-4 mr-2 text-myPurple-primary" />
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step={0.1}
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    {...register("weight")}
                    className="border-myPurple-tertiary focus-visible:ring-myPurple-primary"
                  />
                  {errors.weight && (
                    <p className="text-myPink-focus text-sm">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-myPurple-focus">
                    Género
                  </Label>
                  <div className="flex gap-4">
                    <Button
                      id="genderFemale"
                      type="button"
                      variant={watch("gender") === "F" ? "default" : "outline"}
                      onClick={() => setValue("gender", "F")}
                      className={
                        watch("gender") === "F"
                          ? "bg-myPink-primary hover:bg-myPink-hover text-white w-full transition-all duration-200"
                          : "border-myPink-tertiary text-myPink-primary hover:bg-myPink-disabled hover:text-myPink-focus w-full transition-all duration-200"
                      }
                    >
                      Hembra
                    </Button>
                    <Button
                      id="genderMale"
                      type="button"
                      variant={watch("gender") === "M" ? "default" : "outline"}
                      onClick={() => setValue("gender", "M")}
                      className={
                        watch("gender") === "M"
                          ? "bg-myPurple-primary hover:bg-myPurple-hover text-white w-full transition-all duration-200"
                          : "border-myPurple-tertiary text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus w-full transition-all duration-200"
                      }
                    >
                      Macho
                    </Button>
                  </div>
                  {errors.gender && (
                    <p className="text-myPink-focus text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative flex justify-end gap-4 pt-4 border-t border-myPurple-tertiary/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/user-profile")}
          className="border-myPurple-tertiary text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus transition-all duration-200"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="petForm"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white transition-all duration-200"
        >
          {isSubmitting ? "Registrando..." : "Registrar Mascota"}
        </Button>
      </CardFooter>
    </div>
  );
}
