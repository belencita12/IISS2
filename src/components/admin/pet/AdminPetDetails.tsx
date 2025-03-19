"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, LoaderCircleIcon, X } from "lucide-react";
import { useParams } from "next/navigation";
import PetVaccinationTable from "@/components/petUI/PetVaccinationTable";
import { PetData, Race, Species } from "@/lib/pets/IPet";
import { getPetById } from "@/lib/pets/getPetById";
import { toast } from "@/lib/toast";
import { ValidatedInput } from "@/components/global/ValidatedInput";
import { getClientById } from "@/lib/client/getClientById";
import { ClientData } from "@/lib/admin/client/IClient";
import { fetchUsers } from "@/lib/client/getUsers";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRacesBySpecies, getSpecies } from "@/lib/pets/getRacesAndSpecies";
import { updatePet } from "@/lib/pets/updatePet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const petFormSchema = z.object({
  userId: z.number().min(1, "El correo del usuario no está comprobado"),
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
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface AdminPetDetailsProps {
  token: string;
}

interface Visita {
  id: number;
  fecha: string;
  description: string;
  costo: number;
}

interface Visita_Programada {
  id: number;
  date: string;
  description: string;
}

const visitas: Visita[] = [
  { id: 1, fecha: "2024-12-20", description: "Chequeo general", costo: 30000 },
  { id: 2, fecha: "2024-10-15", description: "Vacunación anual", costo: 50000 },
  { id: 3, fecha: "2024-09-10", description: "Desparasitación", costo: 35000 },
  { id: 4, fecha: "2024-05-05", description: "Consulta por tos", costo: 40000 },
  { id: 5, fecha: "2024-02-01", description: "Revisión de piel", costo: 60000 },
];

const visitasProgramadas: Visita_Programada[] = [
  { id: 1, date: "2025-01-10", description: "Chequeo rutinario" },
  { id: 2, date: "2025-03-05", description: "Vacunación de refuerzo" },
];

// Calcula la diferencia de años y meses entre la fecha de nacimiento y la fecha actual
function calculateAge(dateOfBirth: string): string {
  const birthdate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getUTCFullYear() - birthdate.getUTCFullYear();
  let months = today.getUTCMonth() - birthdate.getUTCMonth();

  if (today.getUTCDate() < birthdate.getUTCDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return years === 1 ? `${years} Año` : `${years} Años`;
  } else {
    return months === 1 ? `${months} Mes` : `${months} Meses`;
  }
}

// Convierte una fecha en formato ISO a una fecha en formato local
function convertDate(date: string): string {
  if (!date) return "";

  const dateObj = new Date(date);

  const dateFormat: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return dateObj.toLocaleDateString("es-ES", dateFormat);
}

// Formatea un número a un string con separadores de miles
function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDateToInput(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminPetDetails({ token }: AdminPetDetailsProps) {
  type validationState = "NOTHING" | "LOADING" | "VALID" | "INVALID";

  const { id } = useParams();

  const [showAll, setShowAll] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);

  const [pet, setPet] = useState<PetData | null | undefined>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [species, setSpecies] = useState<Species[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [isPetEditable, setIsPetEditable] = useState<boolean>(false);

  const [emailQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatingState, setValidatingState] =
    useState<validationState>("NOTHING");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      userId: 0,
      petName: "",
      birthDate: "",
      breed: "",
      animalType: "",
      gender: "",
    },
  });

  const visitasVisibles = showAll ? visitas : visitas.slice(0, 4);
  const visitasProgramadasVisibles = showAllProg
    ? visitasProgramadas
    : visitasProgramadas.slice(0, 4);

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

  // Obtiene el usuario a partir del correo
  const handleUserValidation = async (userEmail: string) => {
    setValidatingState("LOADING");

    if (!userEmail || !userEmail.includes("@") || !token) {
      setValidatingState("INVALID");
      return;
    }

    try {
      const userData = await fetchUsers(1, `${userEmail}`, token);

      if (userData.total === 0) {
        setValidatingState("INVALID");
        return;
      }

      setValue("userId", userData.data[0].id);
      setValidatingState("VALID");
    } catch {
      toast("error", "Error al obtener el usuario.");
      setValidatingState("INVALID");
    }
  };

  // Renderizado condicional basado en el estado de validación
  const renderValidationIcon = () => {
    switch (validatingState) {
      case "LOADING":
        return (
          <LoaderCircleIcon className="lucide lucide-loader-circle animate-spin" />
        );
      case "VALID":
        return <Check className="lucide lucide-check text-green-500" />;
      case "INVALID":
        return <X className="lucide lucide-x text-red-500" />;
      default:
        return null;
    }
  };

  // Efectúa una petición a la API para obtener los datos de la mascota cada que los valores de id y token cambien
  const onSubmit = async (data: PetFormValues) => {
    if (!token) {
      toast("error", "Debes estar autenticado para editar una mascota.");
      return;
    }
    const formData = new FormData();
    Object.entries({
      name: data.petName,
      userId: data.userId.toString(),
      speciesId: data.animalType,
      raceId: data.breed,
      weight: data.weight.toString(),
      sex: data.gender,
      dateOfBirth: new Date(data.birthDate).toISOString(),
    }).forEach(([key, value]) => formData.append(key, value));
    setIsSubmitting(true);
    try {
      await updatePet(Number(id), formData, token);

      toast("success", "Los datos de la mascota se actualizaron con éxito!", {
        duration: 2000,
      });
    } catch {
      toast("error", "Hubo un error al actualizar los datos de la mascota.");
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

  // Obtiene los datos de la mascota y su dueño
  useEffect(() => {
    setPet(undefined);
    if (!id || !token) return;

    const fetchPetAndClient = async () => {
      try {
        const petData = await getPetById(Number(id), token);
        setPet(petData);

        if (petData) {
          const clientData = await getClientById(petData.userId, token);
          if (clientData) {
            setClient(clientData);
          } else {
            toast("error", "No se encontró el dueño de la mascota");
          }
        } else {
          toast("error", "No se encontró la mascota");
        }
      } catch (error) {
        toast("error", "No se pudo obtener los datos de la mascota");
      }
    };

    fetchPetAndClient();
  }, [id, token]);

  return (
    <div className="flex-col">
      {pet === undefined ? (
        <p className="text-center text-gray-600">Cargando mascota...</p>
      ) : pet === null ? (
        <>
          <p className="text-center mt-4 p-10">Mascota no registrada.</p>
          <p className="text-center">Error 404</p>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-center bg-gray-500 p-5 gap-6">
            <div className="flex flex-col justify-center items-center p-3">
              <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
                {pet.profileImg ? (
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
              <div className="flex-col p-2 text-black">
                <p className="flex justify-center font-bold">{pet.name}</p>
                <p className="flex justify-center font-bold text-xl">
                  {calculateAge(pet.dateOfBirth)}
                </p>
              </div>
            </div>

            <div className="flex-col justify-start items-start text-xs">
              {isPetEditable ? (
                <>
                  <form
                    id="petForm"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-col space-y-4"
                  >
                    <div>
                      <Label className="text-white">Correo del usuario</Label>
                      <div className="flex flex-col justify-between items-start gap-1">
                        <div className="flex flex-col sm:flex-row justify-start items-start gap-4 w-full">
                          <div className="flex-grow w-full">
                            <ValidatedInput
                              type="email"
                              id="searchUser"
                              placeholder="Ej: ejemplo@gmail.com"
                              value={emailQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-start items-center gap-2">
                            <Button
                              variant={"secondary"}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleUserValidation(emailQuery);
                              }}
                            >
                              Comprobar usuario
                            </Button>
                            {renderValidationIcon()}
                          </div>
                        </div>
                        {errors.userId && (
                          <p className="text-red-950 mt-1">
                            {errors.userId.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Nombre</Label>
                      <Input
                        id="petName"
                        {...register("petName")}
                        placeholder="Ej. Luna"
                      />
                      {errors.petName && (
                        <p className="text-red-950 mt-1">
                          {errors.petName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-white">Fecha de nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...register("birthDate")}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {errors.birthDate && (
                        <p className="text-red-950 mt-1">
                          {errors.birthDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-white">Especie</Label>
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
                        <p className="text-red-950 mt-1">
                          {errors.animalType.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-white">Raza</Label>
                      <Select
                        defaultValue={watch("breed")}
                        onValueChange={(value) => setValue("breed", value)}
                      >
                        <SelectTrigger id="breed" className="bg-white">
                          <SelectValue placeholder={"Seleccionar"} />
                        </SelectTrigger>
                        <SelectContent>
                          {races.map((race) => (
                            <SelectItem
                              key={race.id}
                              value={race.id.toString()}
                            >
                              {race.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.breed && (
                        <p className="text-red-950 mt-1">
                          {errors.breed.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-white">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step={0.1}
                        min="0"
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e")
                            e.preventDefault();
                        }}
                        {...register("weight")}
                      />
                      {errors.weight && (
                        <p className="text-red-950 mt-1">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-white">Género</Label>
                      <div className="flex gap-4">
                        <Button
                          id="genderFemale"
                          type="button"
                          variant={
                            watch("gender") === "F" ? "default" : "outline"
                          }
                          onClick={() => setValue("gender", "F")}
                        >
                          Hembra
                        </Button>
                        <Button
                          id="genderMale"
                          type="button"
                          variant={
                            watch("gender") === "M" ? "default" : "outline"
                          }
                          onClick={() => setValue("gender", "M")}
                        >
                          Macho
                        </Button>
                      </div>
                      {errors.gender && (
                        <p className="text-red-950 mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                    <hr />
                    <div className="flex gap-4">
                      <Button
                        variant={"secondary"}
                        onClick={() => setIsPetEditable(false)}
                        disabled={isSubmitting}
                        className="p-1 pl-3 pr-3"
                      >
                        Cancelar
                      </Button>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col justify-start gap-4">
                  <div className="flex flex-col justify-start items-start space-y-4 text-white">
                    <div>
                      <Label>Dueño</Label>
                      {client ? (
                        <>
                          <p className="text-xl">
                            {client?.fullName}
                            {" ("}
                            {client?.email}
                            {")"}
                          </p>
                        </>
                      ) : (
                        <p>Cargando...</p>
                      )}
                    </div>
                    <div>
                      <Label>Nombre</Label>
                      <p className="text-xl">{pet.name}</p>
                    </div>
                    <div>
                      <Label>Fecha de nacimiento</Label>
                      <p className="text-xl">{convertDate(pet.dateOfBirth)}</p>
                    </div>
                    <div>
                      <Label>Especie</Label>
                      <p className="text-xl">{pet.species.name}</p>
                    </div>
                    <div>
                      <Label>Raza</Label>
                      <p className="text-xl">{pet.race.name}</p>
                    </div>
                    <div>
                      <Label>Peso (kg)</Label>
                      <p className="text-xl">{formatNumber(pet.weight)}</p>
                    </div>
                    <div>
                      <Label>Género</Label>
                      <p className="text-xl">
                        {pet.sex === "F" ? "Hembra" : "Macho"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setIsPetEditable(true);
                        setValue("petName", pet.name);
                        setValue(
                          "birthDate",
                          formatDateToInput(pet.dateOfBirth)
                        );
                        setValue("animalType", pet.species.id.toString());
                        setValue("gender", pet.sex);
                        setValue("weight", pet.weight);
                      }}
                      className="p-1 pl-3 pr-3"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-col md:px-28 md:py-10 bg-white">
            <div className="flex justify-center">
              <div className="flex-col justify-center items-center w-full pb-7 pt-7">
                <h2 className="text-2xl font-bold mb-3">Últimas visitas</h2>
                <ul className="w-full">
                  {visitasVisibles.map((visita) => (
                    <li
                      key={visita.id}
                      className="mb-2 border border-gray-400 p-2 rounded"
                    >
                      <div className="flex justify-between">
                        <p className="text-base">{visita.description}</p>
                        <p className="text-sm text-gray-600">
                          {convertDate(visita.fecha)}
                        </p>
                      </div>
                      <p className="text-base text-left">
                        {formatNumber(visita.costo)} Gs
                      </p>
                    </li>
                  ))}
                </ul>
                {visitas.length > 4 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="mt-3 bg-gray-400 rounded-lg p-2 pr-5 pl-5"
                    >
                      {showAll ? "Ver menos" : "Ver más"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-14">
              <div className="flex-col justify-center items-center w-full">
                <h2 className="text-2xl font-bold mb-3">Visitas programadas</h2>
                <ul className="w-full grid grid-cols-2 gap-4">
                  {visitasProgramadasVisibles.map((visita) => (
                    <li
                      key={visita.id}
                      className="border border-gray-400 p-2 rounded flex"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <div className="ml-3">
                        <p className="text-base">{visita.description}</p>
                        <p className="text-sm text-gray-600">
                          {convertDate(visita.date)}
                        </p>
                        <Button>Añadir Recordatorio</Button>
                      </div>
                    </li>
                  ))}
                </ul>
                {visitasProgramadas.length > 4 && (
                  <Button
                    onClick={() => setShowAllProg(!showAllProg)}
                    className="mt-3 text-blue-500 hover:underline"
                  >
                    {showAllProg ? "Ver menos" : "Ver más"}
                  </Button>
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Control de Vacunas</h2>
            <PetVaccinationTable token={token} petId={Number(pet.id)} />
          </div>
        </>
      )}
    </div>
  );
}
