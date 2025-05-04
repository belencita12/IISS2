"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { PetData, Race, Species } from "@/lib/pets/IPet";
import { getPetById } from "@/lib/pets/getPetById";
import { toast } from "@/lib/toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRacesBySpecies, getSpecies } from "@/lib/pets/getRacesAndSpecies";
import { updatePet } from "@/lib/pets/updatePet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notFound } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const petFormSchema = z.object({
  petName: z.string().min(1, "El nombre es obligatorio"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  breed: z.string().min(1, "La raza es obligatoria"),
  animalType: z.string().min(1, "Debes seleccionar un tipo de animal"),
  gender: z.string().min(1, "Debes seleccionar un género"),
  weight: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(parseFloat(String(val))) && parseFloat(String(val)) > 0,
      {
        message: "El peso debe ser un número válido mayor a 0",
      }
    )
    .transform((val) => parseFloat(String(val))),
  imageFile: z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Solo se permiten imágenes en formato JPG, PNG o WEBP",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "La imagen no debe superar 1MB",
    })
    .optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface AdminPetDetailsProps {
  token: string;
}

// Calcula la diferencia de años, meses y días entre la fecha de nacimiento y la fecha actual
function calculateAge(dateOfBirth: string): string {
  const birthdate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getUTCFullYear() - birthdate.getUTCFullYear();
  let months = today.getUTCMonth() - birthdate.getUTCMonth();
  let days = today.getUTCDate() - birthdate.getUTCDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), 0);
    days += lastMonth.getUTCDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let ageString = "";
  if (years > 0) {
    ageString += years === 1 ? `${years} Año` : `${years} Años`;
  }
  if (months > 0) {
    if (ageString) ageString += " ";
    ageString += months === 1 ? `${months} Mes` : `${months} Meses`;
  }
  if (days > 0) {
    if (ageString) ageString += " ";
    ageString += days === 1 ? `${days} Día` : `${days} Días`;
  }

  return ageString || "0 Días";
}

function formatDateToInput(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PetUpdateForm({ token }: AdminPetDetailsProps) {
  const params = useParams();
  const id = params?.id as string;
  const petId = params?.petId as string;

  const router = useRouter();
  const [pet, setPet] = useState<PetData | null | undefined>(undefined);
  const [species, setSpecies] = useState<Species[]>([]);
  const [races, setRaces] = useState<Race[]>([]);

  const [isCancelling, setIsCancelling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      petName: "",
      birthDate: "",
      breed: "",
      animalType: "",
      gender: "",
    },
  });

  // Obtiene las especies
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

  // Obtiene las razas a partir de las especies
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
    
    if (!token) {
      toast("error", "Debes estar autenticado para editar una mascota.");
      return;
    }

    const formData = new FormData();
    Object.entries({
      name: data.petName,
      speciesId: data.animalType,
      raceId: data.breed,
      weight: data.weight.toString(),
      sex: data.gender,
      dateOfBirth: new Date(data.birthDate).toISOString(),
    }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    if (data.imageFile) {
      formData.append("profileImg", data.imageFile);
    }
    
    setIsSubmitting(true);
    try {
      const response = await updatePet(Number(petId), formData, token);
      toast("success", "Mascota actualizada correctamente");
      router.back();
    } catch (error) {
      toast("error", "Error al actualizar la mascota");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualiza las razas al cambiar la especie
  useEffect(() => {
    const speciesId = watch("animalType");
    if (speciesId) {
      handleSpeciesChange(speciesId).then(() => {
        if (pet) {
          setValue("breed", pet.race.id.toString());
        }
      });
    }
  }, [watch("animalType")]);

  useEffect(()=>{
    if(pet === null){
      throw notFound()
    }
  },[pet])

  // Obtiene los datos de la mascota y su dueño
  useEffect(() => {
    setPet(undefined);
    if (!petId || !token) {
      toast("error", "Faltan datos");
      return;
    }

    const fetchPetAndClient = async () => {
      try {
        const petData = await getPetById(Number(petId), token);

        if (petData) {
          setPet(petData);

          setValue("petName", petData.name);
          setValue("birthDate", formatDateToInput(petData.dateOfBirth));
          setValue("animalType", petData.species.id.toString());
          setValue("breed", petData.race.id.toString());
          setValue("gender", petData.sex);
          setValue("weight", petData.weight);

        } else {
          setPet(null);
        }
      } catch (error) {
        toast("error", "No se pudo obtener los datos de la mascota");
      }
    };

    fetchPetAndClient();
  }, [id, petId, token, setValue]);

  return (
    <div className="flex-col">
      <h1 className="text-2xl font-bold my-3 text-center">Editar mascota del cliente</h1>
      {pet === undefined ? (
        <p className="text-center text-gray-600 pt-10">Cargando mascota...</p>
      ) : pet === null ? (
        <>
          <p className="text-center mt-4 p-10">Mascota no registrada.</p>
          <p className="text-center">Error 404</p>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-center p-5 gap-6">
            <div className="flex flex-col justify-center items-center p-3">
              <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={pet.name}
                    width={100}
                    height={100}
                    className="object-cover object-center w-full h-full"
                  />
                ) : pet.profileImg ? (
                  <Image
                    src={pet.profileImg.originalUrl}
                    alt={pet.name}
                    width={100}
                    height={100}
                    className="object-cover object-center w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 mx-auto flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center mt-4">
                <Label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium text-center cursor-pointer">
                  <Input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {previewImage ? "Cambiar imagen" : "Cambiar imagen de la mascota"}
                </Label>
                {errors.imageFile && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.imageFile.message}
                  </p>
                )}
              </div>
              <div className="flex-col p-2 text-black">
                <p className="flex justify-center font-bold">{pet.name}</p>
                <p className="flex justify-center font-bold text-xl">
                  {calculateAge(pet.dateOfBirth)}
                </p>
              </div>
            </div>

            <div className="flex-col justify-start items-start text-xs">
              <form
                id="petForm"
                onSubmit={handleSubmit(onSubmit)}
                className="flex-col space-y-4"
              >
                <div>
                  <Label className="">Nombre</Label>
                  <Input
                    id="petName"
                    {...register("petName")}
                    placeholder="Ej. Luna"
                  />
                  {errors.petName && (
                    <p className="text-red-500 mt-1">
                      {errors.petName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="">Fecha de nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 mt-1">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="">Especie</Label>
                  <Select
                    defaultValue={watch("animalType")}
                    onValueChange={(value) => {
                      setValue("animalType", value);
                      handleSpeciesChange(value);
                    }}
                  >
                    <SelectTrigger id="animalType" className="bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
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
                    <p className="text-red-500 mt-1">
                      {errors.animalType.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="">Raza</Label>
                  <Select
                    defaultValue={watch("breed")}
                    onValueChange={(value) => setValue("breed", value)}
                  >
                    <SelectTrigger id="breed" className="bg-white">
                      <SelectValue placeholder={"Seleccionar"} />
                    </SelectTrigger>
                    <SelectContent>
                      {races.map((race) => (
                        <SelectItem key={race.id} value={race.id.toString()}>
                          {race.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.breed && (
                    <p className="text-red-500 mt-1">{errors.breed.message}</p>
                  )}
                </div>
                <div>
                  <Label className="">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step={0.1}
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    {...register("weight")}
                  />
                  {errors.weight && (
                    <p className="text-red-500 mt-1">{errors.weight.message}</p>
                  )}
                </div>
                <div>
                  <Label className="">Género</Label>
                  <div className="flex gap-4">
                    <Button
                      id="genderFemale"
                      type="button"
                      variant={watch("gender") === "F" ? "default" : "outline"}
                      onClick={() => setValue("gender", "F")}
                    >
                      Hembra
                    </Button>
                    <Button
                      id="genderMale"
                      type="button"
                      variant={watch("gender") === "M" ? "default" : "outline"}
                      onClick={() => setValue("gender", "M")}
                    >
                      Macho
                    </Button>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 mt-1">{errors.gender.message}</p>
                  )}
                </div>
                <hr />
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={"secondary"}
                    disabled={isCancelling || isSubmitting}
                    className="p-1 pl-3 pr-3"
                    onClick={() => {
                      setIsCancelling(true)
                      router.back()
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button 
                    type="submit" 
                    disabled={isCancelling || isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
