"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Petemoss } from "next/font/google";
import { useParams } from "next/navigation";

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

const especies: Species[] = [
  { id:1, name: "Perro"}
]

const razas: Race[] = [
  {id: 1, name: "Labrador"}
]



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
  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState({
    ...pet,
  });

  const visitasVisibles = showAll ? visitas : visitas.slice(0, 4);
  const visitasProgramadasVisibles = showAllProg ? visitasProgramadas : visitasProgramadas.slice(0, 4);

  const PetTest: Pet = {
    id:1, name: "raul", weight: 32, sex: "M", profileImg: null,
    dateOfBirth: "2024-04-23T00:00:00.000Z", species: especies[0], race: razas[0]
  }
  
  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEzLCJ1c2VybmFtZSI6Im1hdGlhc0A2MTQzMGI4YS04ZjRlLTRjNWEtYTczZi1lN2IzZDQ1NzRlMTUiLCJlbWFpbCI6ImdlbmFyby5icnVuYWdhQGZpdW5pLmVkdS5weSIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNzQxMDM5ODY5LCJleHAiOjE3NDE2NDQ2Njl9.m1ud5FxTppatNV4F9S5JzVJ1sYSG1B6nnAFgGTrIGpc";
    fetch("https://iiss2-backend-production.up.railway.app/pet/1", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPet(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleChange = (e:any) => {
    setEditedPet({ ...editedPet, [e.target.name]: e.target.value });
  };

  /*
  const handleSave = async () => {
    try {
      await fetch(`https://iiss2-backend-production.up.railway.app/pet`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPet),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar los datos de la mascota", error);
    }
  };*/

  const handleSave = () => {
    /*
    PetTest.name = editedPet.name;
    PetTest.dateOfBirth = editedPet.dateOfBirth;
    PetTest.weight = editedPet.weight;
    PetTest.race = { name: editedPet.race };
    PetTest.species = { name: editedPet.species };
    PetTest.sex = editedPet.sex;*/
    setIsEditing(false);
  };
  

  return (
    <div className="flex-col">
      {pet ? (
        <div className="flex justify-center bg-gray-500 p-5">
          <div className=" flex-col justify-center items-center p-3 pr-8">
            <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">              
              {pet.profileImg ? (
                <Image
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
                {isEditing ? (
                  <input
                    type="text"
                    name={name}
                    value={editedPet[name]}
                    onChange={handleChange}
                    className="text-black w-full border border-gray-300 rounded p-1"
                  />
                ) : (
                  <p className="text-xl">{name === "dateOfBirth" ? convertirFecha(pet[name]) : name === "race" || name === "species" ? pet[name]?.name : pet[name]}</p>
                )}
              </div>
            ))}
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="p-1">Guardar</Button>
                <Button onClick={() => setIsEditing(false)} className="p-1">Cancelar</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="p-1">Editar</Button>
            )}
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