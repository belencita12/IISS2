"use client";

import Image from "next/image";
import { calcularEdad } from "@/lib/utils";
import PetVaccinationTable from "@/components/pet/PetVaccinationTable";
import AddToHistoryButton from "@/components/admin/vaccine-registry/AddToHistoryButton";
import { PetData } from "@/lib/pets/IPet";
import VisitList from "./VisitList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
//import { VisitList } from "@/components/pet/"; // si lo vas a usar

interface Props {
  token: string;
  pet: PetData;
  clientId: number;
}

export default function PetDetailView({ token, pet, clientId }: Props) {
  const router = useRouter();

  if (!pet.id) {
    return <p className="text-center mt-10">ID de mascota no válido.</p>;
  }

  return (
    <div className="py-4 space-y-10">
      <div className="mx-auto px-1 md:px-24 mb-6 mt-6">
        <Button 
          variant="outline" 
          className="border-black border-solid"
          onClick={() => router.back()}
        >
          Volver
        </Button>
      </div>

      {/* Datos generales de la mascota */}
      <section className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
        <Image
          src={pet.profileImg?.originalUrl || "/imagen-mascota/default.jpg"}
          alt={pet.name}
          width={250}
          height={250}
          className="rounded-full object-cover w-[250px] h-[250px]"
        />
        <div className="space-y-2 text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
          <p>
            <strong>Raza:</strong> {pet.race?.name || "No especificada"}
          </p>
          <p>
            <strong>Sexo:</strong>{" "}
            {pet.sex === "M"
              ? "Macho"
              : pet.sex === "F"
              ? "Hembra"
              : "No especificado"}
          </p>
          <p>
            <strong>Peso:</strong> {pet.weight || 0} kg
          </p>
          <p>
            <strong>Edad:</strong>{" "}
            {pet.dateOfBirth
              ? calcularEdad(pet.dateOfBirth)
              : "No especificada"}
          </p>
        </div>
      </section>

      {/* Historial de vacunación */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Historial de vacunación
          </h2>
          <div className="flex gap-3">
            <AddToHistoryButton />
          </div>
        </div>
        <PetVaccinationTable Id={clientId} token={token} petId={pet.id} />
      </section>

      {/* Visitas realizadas (estructura inicial) */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Visitas realizadas
        </h2>
        <VisitList token={token} petId={pet.id} />
      </section>
    </div>
  );
}
