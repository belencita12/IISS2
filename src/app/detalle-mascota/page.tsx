"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  weight: number;
  sex: string;
  profileImg: string | null;
  dateOfBirth: string;
  species: Species;
  race: Race;
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

interface Species {
  id: number;
  name: string;
}

interface Race {
  id: number;
  name: string;
}

const visitas: Visita[] = [
  { id: 1, fecha: "2024-12-20", descripcion: "Chequeo general", costo: 30000 },
  { id: 2, fecha: "2024-10-15", descripcion: "Vacunación anual", costo: 50000},
  { id: 3, fecha: "2024-09-10", descripcion: "Desparasitación", costo: 35000},
  { id: 4, fecha: "2024-05-05", descripcion: "Consulta por tos", costo: 40000},
  { id: 5, fecha: "2024-02-01", descripcion: "Revisión de piel", costo: 60000},
]

const visitasProgramadas: Visita_Programada[] = [
  { id: 1, fecha: "2025-01-10", descripcion: "Chequeo rutinario" },
  { id: 2, fecha: "2025-03-05", descripcion: "Vacunación de refuerzo" },
];

function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getUTCFullYear() - nacimiento.getUTCFullYear();
  const mesNacimiento = nacimiento.getUTCMonth();
  const diaNacimiento = nacimiento.getUTCDate();
  const mesActual = hoy.getUTCMonth();
  const diaActual = hoy.getUTCDate();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
  }
  return edad;
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

  

export default function DetallesMascota() {
  const [showAll, setShowAll] = useState(false);
  const [showAllProg, setShowAllProg] = useState(false);
  const [data, setData] = useState(null);
  const [pet, setPet] = useState<Pet | null>(null);

  const visitasVisibles = showAll ? visitas : visitas.slice(0, 4);
  const visitasProgramadasVisibles = showAllProg ? visitasProgramadas : visitasProgramadas.slice(0, 4);

  useEffect(() => {
    fetch("https://actual-maribeth-fiuni-9898c42e.koyeb.app/pet?page=1")
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setPet(data.data[0]);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="flex-col">
      {pet ? (
        <div className="flex justify-center bg-gray-500 p-5">
          <div className=" flex-col justify-center items-center p-3 pr-8">
            <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
              {pet.profileImg ? (
                <img
                  src={pet.profileImg}
                  alt={pet.name}
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
              <p className="flex justify-center font-bold text-xl">{calcularEdad(pet.dateOfBirth)} Años</p>
            </div>
          </div>
          <div className="flex-col justify-start text-white text-xs">
                <div className="p-1 pb-3">
                    <p>Nombre</p><p className="text-xl">{pet.name}</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Fecha de Nacimiento</p><p className="text-xl">{convertirFecha(pet.dateOfBirth)}</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Peso</p><p className="text-xl">{pet.weight} Kg</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Raza</p><p className="text-xl">{pet.race.name}</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Especie</p><p className="text-xl">{pet.species.name}</p>
                </div>
                <div className="p-1 pb-4">
                    <p>Genero</p><p className="text-xl">{pet.sex}</p>
                </div>
            </div>
        </div>
      ) : (<p className="text-center text-gray-600">Cargando mascota...</p>)}

      <div className="flex-col p-7 bg-white">
        <div className="flex justify-center">
          <div className="flex-col justify-center items-center w-[80%] pb-7 pt-7">
            <h2 className="text-2xl font-bold mb-3">Últimas visitas</h2>
            <ul className="w-full">
              {visitasVisibles.map((visita) => (
                <li key={visita.id} className="mb-2 border border-gray-400 p-2 rounded">
                  <div className="flex justify-between">
                    <p className="text-base">{visita.descripcion}</p>
                    <p className="text-sm text-gray-600">{convertirFecha(visita.fecha)}</p>                    
                  </div>
                  <p className="text-base text-left">{visita.costo} Gs</p>
                </li>
              ))}
            </ul>
            {visitas.length > 4 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="mt-3 bg-gray-400 text-white rounded-lg p-2 pr-5 pl-5">
                  {showAll ? "Ver menos" : "Ver más"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex-col justify-center items-center w-[70%] pb-7 pt-7">
            <h2 className="text-2xl font-bold mb-3">Visitas programadas</h2>
            <ul className="w-full grid grid-cols-2 gap-4">
              
              {visitasProgramadasVisibles.map((visita) => (
                <li key={visita.id} className="border border-gray-400 p-2 rounded flex">
                  <AlertCircle className="w-5 h-5" />
                  <div className="ml-3">
                    <p className="text-base">{visita.descripcion}</p>
                    <p className="text-sm text-gray-600">{convertirFecha(visita.fecha)}</p>
                    <Button>Añadir Recordatorio</Button>  
                  </div>            
                </li>
              ))}
            </ul>
            {visitasProgramadas.length > 4 && (
              <Button onClick={() => setShowAllProg(!showAllProg)}
                className="mt-3 text-blue-500 hover:underline">
                {showAllProg ? "Ver menos" : "Ver más"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}