"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import PetVaccinationTable from "../pet/PetVaccinationTable";
import { PetData } from "@/lib/pets/IPet";
import { getPetById } from "@/lib/pets/getPetById";
import { updatePet } from "@/lib/pets/updatePet";
//import { notFound } from "next/navigation";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

interface EditablePet {
  name: string;
  dateOfBirth: string;
  weight: number;
  sex: string;
  raceId: number;
  speciesId: number;
}

interface Visita {
  id: number;
  fecha: string;
  descripcion: string;
  costo: number;
}

interface Visita_Programada {
  id: number;
  fecha: string;
  descripcion: string;
}

interface Props {
  token: string;
}

const visitas: Visita[] = [
  { id: 1, fecha: "2024-12-20", descripcion: "Chequeo general", costo: 30000 },
  { id: 2, fecha: "2024-10-15", descripcion: "Vacunación anual", costo: 50000 },
  { id: 3, fecha: "2024-09-10", descripcion: "Desparasitación", costo: 35000 },
  { id: 4, fecha: "2024-05-05", descripcion: "Consulta por tos", costo: 40000 },
  { id: 5, fecha: "2024-02-01", descripcion: "Revisión de piel", costo: 60000 },
];

const visitasProgramadas: Visita_Programada[] = [
  { id: 1, fecha: "2025-01-10", descripcion: "Chequeo rutinario" },
  { id: 2, fecha: "2025-03-05", descripcion: "Vacunación de refuerzo" },
];

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

function convertirFecha(fecha: string): string {
  console.log(fecha);
  const meses: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const fechaObj = new Date(fecha);
  const dia = fechaObj.getUTCDate();
  const mes = meses[fechaObj.getUTCMonth()];
  const año = fechaObj.getUTCFullYear();

  return `${dia} de ${mes} ${año}`;
}

function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function PetDetails({ token }: Props) {
  const { id } = useParams();

  const [showAll, setShowAll] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);
  const [pet, setPet] = useState<PetData | null | undefined>(undefined);
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPet, setEditedPet] = useState<EditablePet | null>(null);

  const visitasVisibles = showAll ? visitas : visitas.slice(0, 4);
  const visitasProgramadasVisibles = showAllProg ? visitasProgramadas : visitasProgramadas.slice(0, 4);

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
      .catch((error) => {
        //console.error("Error al obtener la mascota:", error);
        toast("error", "Error al obtener la mascota.");
        setPet(null);
      });
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPet((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  // Se utiliza updatePet para actualizar el nombre de la mascota
  const handleSave = async () => {
    // Validaciones iniciales
    if (!editedPet || !pet || !editedPet.name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
  
    // Verificación de que pet.id no sea undefined
    if (pet.id === undefined) {
      setError("No se puede actualizar, la mascota no tiene ID.");
      return;
    }
  
    setIsSaving(true);
    setError(null);
  
    try {
      // Se crea un FormData con el nuevo nombre
      const formData = new FormData();
      formData.append("name", editedPet.name);
  
      // Aquí pet.id ya es un number, no un number | undefined
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
        <>
          {/*  <p className="text-center mt-4 p-10">Mascota no registrada.</p>
          <p className="text-center">Error 404</p> */}
        </>
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
            <div className="flex justify-center">
              <div className="flex-col justify-center items-center w-full pb-7 pt-7">
                <h2 className="text-2xl font-bold mb-3">Últimas visitas</h2>
                <ul className="w-full">
                  {visitasVisibles.map((visita) => (
                    <li key={visita.id} className="mb-2 border border-gray-400 p-2 rounded">
                      <div className="flex justify-between">
                        <p className="text-base">{visita.descripcion}</p>
                        <p className="text-sm text-gray-600">{formatDate(visita.fecha)}</p>
                      </div>
                      <p className="text-base text-left">{formatNumber(visita.costo)} Gs</p>
                    </li>
                  ))}
                </ul>
                {visitas.length > 4 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="mt-3 bg-gray-400 text-white rounded-lg p-2 pr-5 pl-5"
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
                    <li key={visita.id} className="border border-gray-400 p-2 rounded flex">
                      <AlertCircle className="w-5 h-5" />
                      <div className="ml-3">
                        <p className="text-base">{visita.descripcion}</p>
                        <p className="text-sm text-gray-600">{formatDate(visita.fecha)}</p>
                        <Button>Añadir Recordatorio</Button>
                      </div>
                    </li>
                  ))}
                </ul>
                {visitasProgramadas.length > 4 && (
                  <Button onClick={() => setShowAllProg(!showAllProg)} className="mt-3 text-blue-500 hover:underline">
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