"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import PetVaccinationTable from "../pet/PetVaccinationTable";
import { PetData } from "@/lib/pets/IPet";
import { getPetById } from "@/lib/pets/getPetById";
import { updatePet } from "@/lib/pets/updatePet";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { getAppointmentByPetId } from "@/lib/appointment/getAppointmentByPetId";
import { Appointment } from "@/lib/appointment/IAppointment";

interface EditablePet {
  name: string;
  dateOfBirth: string;
  weight: number;
  sex: string;
  raceId: number;
  speciesId: number;
}

interface Props {
  token: string;
}

function calcularEdad(fechaNacimiento: string): string {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses = 0;

  const agediff = hoy.getUTCFullYear() - nacimiento.getUTCFullYear();
  let edad = agediff;
  const mesNacimiento = nacimiento.getUTCMonth();
  const diaNacimiento = nacimiento.getUTCDate();
  const mesActual = hoy.getUTCMonth();
  const diaActual = hoy.getUTCDate();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
    edad--;
  }

  if (edad < 1) {
    if (agediff > 0) {
      meses = 12 + mesActual - mesNacimiento;
    } else {
      meses = mesActual - mesNacimiento;
    }
    if (meses === 1) {
      return `${meses} Mes`;
    } else {
      return `${meses} Meses`;
    }
  }

  if (edad === 1) {
    return `${edad} Año`;
  }
  return `${edad} Años`;
}

export default function PetDetails({ token }: Props) {
  const { id } = useParams();

  const [pet, setPet] = useState<PetData | null | undefined>(undefined);
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPet, setEditedPet] = useState<EditablePet | null>(null);

  // Citas
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true); 
  const [errorAppointments, setErrorAppointments] = useState<string | null>(null);

  // Actualiza el estado 'editedPet' cuando 'pet' cambia o cuando se entra a modo edición
  useEffect(() => {
    if (pet) {
      setEditedPet({
        name: pet.name,
        dateOfBirth: pet.dateOfBirth,
        weight: pet.weight,
        sex: pet.sex,
        raceId: pet.race?.id || 0,
        speciesId: pet.species?.id || 0,
      });
    }
  }, [pet]);

  useEffect(() => {
    if (isEditingName && pet) {
      setEditedPet({
        name: pet.name || "",
        dateOfBirth: pet.dateOfBirth || "",
        weight: pet.weight || 0,
        raceId: pet.race?.id || 0,
        speciesId: pet.species?.id || 0,
        sex: pet.sex || "",
      });
    }
  }, [isEditingName, pet]);

  // Se utiliza getPetById para obtener los detalles de la mascota
  useEffect(() => {
    setPet(undefined);
    getPetById(Number(id), token)
      .then((data) => {
        setPet(data);
      })
      .catch(() => {
        toast("error", "Error al obtener la mascota.");
        setPet(null);
      });
  }, [id, token]);

  // Obtener citas de la mascota
  useEffect(() => {
    if (!pet?.id || !token) return;
    setLoadingAppointments(true);
    getAppointmentByPetId(pet.id, token)
      .then(data => {
        setAppointments(data);
        setErrorAppointments(null);
      })
      .catch(() => setErrorAppointments("No se pudieron cargar las citas"))
      .finally(() => setLoadingAppointments(false));
  }, [pet?.id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPet((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  // Se utiliza updatePet para actualizar el nombre de la mascota
  const handleSave = async () => {
    if (!editedPet || !pet || !editedPet.name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (pet.id === undefined) {
      setError("No se puede actualizar, la mascota no tiene ID.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", editedPet.name);
      const updatedPet = await updatePet(pet.id, formData, token);
      if (!updatedPet || !updatedPet.id) {
        throw new Error("Respuesta inválida de la API");
      }
      setPet(updatedPet);
      setIsEditingName(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al guardar los cambios");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-col">
      {pet === undefined ? (
        <p className="text-center text-gray-600">Cargando mascota...</p>
      ) : pet === null ? (
        <></>
      ) : (
        <>
          <div className="flex justify-center bg-gray-500 p-5">
            <div className="flex-col justify-center items-center p-3 pr-8">
              <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
                {pet.profileImg?.originalUrl || pet.profileImg?.previewUrl ? (
                  <Image
                    src={pet.profileImg.originalUrl || pet.profileImg.previewUrl}
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
                <p className="flex justify-center font-bold text-xl">{calcularEdad(pet.dateOfBirth)}</p>
              </div>
            </div>

            <div className="flex-col justify-start text-white text-xs">
              {[
                { label: "Nombre", name: "name" },
                { label: "Fecha de Nacimiento", name: "dateOfBirth" },
                { label: "Peso", name: "weight" },
                { label: "Raza", name: "race" },
                { label: "Especie", name: "species" },
                { label: "Género", name: "sex" },
              ].map(({ label, name }) => (
                <div key={name} className="p-1 pb-3">
                  <p>{label}</p>
                  {isEditingName && name === "name" ? (
                    <>
                      <input
                        type="text"
                        name={name}
                        value={editedPet ? editedPet[name as keyof EditablePet] : ""}
                        onChange={handleChange}
                        className="text-black w-full border border-gray-300 rounded p-1"
                      />
                      {error && name === "name" && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xl">
                      {name === "dateOfBirth"
                        ? formatDate(pet.dateOfBirth)
                        : name === "race"
                        ? pet.race?.name
                        : name === "species"
                        ? pet.species?.name
                        : name === "weight"
                        ? `${pet.weight} kg`
                        : String(pet[name as keyof PetData])}
                    </p>
                  )}
                </div>
              ))}
              {isEditingName ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`p-1 pl-3 pr-3 ${isSaving ? "cursor-not-allowed" : ""}`}
                  >
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button onClick={() => setIsEditingName(false)} className="p-1 pl-3 pr-3">
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditingName(true)} className="p-1 pl-3 pr-3">
                  Editar
                </Button>
              )}
            </div>
          </div>
          <div className="flex-col md:px-28 md:py-10 bg-white">
            {/* Lista unificada de citas */}
            <h2 className="text-2xl font-bold mb-3">Citas</h2>
            {loadingAppointments ? (
              <p>Cargando citas...</p>
            ) : errorAppointments ? (
              <p className="text-red-500">{errorAppointments}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1">Detalle</th>
                      <th className="px-2 py-1">Fecha</th>
                      <th className="px-2 py-1">Empleados</th>
                      <th className="px-2 py-1">Estado</th>
                      <th className="px-2 py-1">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">Sin citas registradas</td>
                      </tr>
                    )}
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="px-2 py-1">{a.details}</td>
                        <td className="px-2 py-1">{formatDate(a.designatedDate)}</td>
                        <td className="px-2 py-1">{a.employees.map(e => e.name).join(", ") || "Sin asignar"}</td>
                        <td className="px-2 py-1">{a.status}</td>
                        <td className="px-2 py-1 space-x-2">
                          <Button variant="outline" size="sm">Detalle</Button>
                          {a.status !== "CANCELLED" && (
                            <Button variant="destructive" size="sm">Cancelar cita</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Control de Vacunas */}
            <h2 className="text-2xl font-bold mb-3 mt-10">Control de Vacunas</h2>
            <PetVaccinationTable Id={Number(id)} token={token} petId={Number(pet.id)} />
          </div>
        </>
      )}
    </div>
  );
}