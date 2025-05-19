"use client";

import Image from "next/image";
import { calcularEdad } from "@/lib/utils";
import PetVaccinationTable from "@/components/pet/PetVaccinationTable";
import AddToHistoryButton from "@/components/admin/vaccine-registry/AddToHistoryButton";
import { PetData } from "@/lib/pets/IPet";
import VisitList from "./VisitList";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
//import { VisitList } from "@/components/pet/"; // si lo vas a usar

interface Props {
  token: string;
  pet: PetData;
  clientId: number;
}

export default function PetDetailView({ token, pet, clientId }: Props) {
const p = useTranslations("PetDetail");
const e = useTranslations("Error");
const b = useTranslations("Button");

  const router = useRouter();

  if (!pet.id) {
    return <p className="text-center mt-10">{e("noGetData")}</p>;
  }

  return (
    <div className="py-4 space-y-10">
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
            <strong>{p("race")}:</strong> {pet.race?.name || "No especificada"}
          </p>
          <p>
            <strong>{p("sex")}:</strong>{" "}
            {pet.sex === "M"
              ? p("male")
              : pet.sex === "F"
              ? p("female")
              : e("noSpecified")}
          </p>
          <p>
            <strong>{p("weight")}:</strong> {pet.weight || 0} kg
          </p>
          <p>
            <strong>{p("age")}:</strong>{" "}
            {pet.dateOfBirth
              ? calcularEdad(pet.dateOfBirth)
              : e("noSpecified")}
          </p>
        </div>
      </section>

      {/* Historial de vacunación */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {p("vaccuneHistory")}
          </h2>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-black border-solid"
              onClick={() => router.back()}
            >
              {b("toReturn")}
            </Button>
            <AddToHistoryButton />
          </div>
        </div>
        <PetVaccinationTable Id={clientId} token={token} petId={pet.id} />
      </section>

      {/* Visitas realizadas (estructura inicial) */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {p("visit")}
        </h2>
        <VisitList token={token} petId={pet.id} />
      </section>
    </div>
  );
}
