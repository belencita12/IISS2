"use client";

import { PawPrint, Calendar, Weight, CircleDot, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calcularEdad } from "@/lib/utils";
import Image from "next/image";
import { Appointment } from "@/lib/appointment/IAppointment";
import { PetData } from "@/lib/pets/IPet";

interface PetDetailsCardProps {
  appointment: Appointment | null;
  petDetails: PetData | null;
  petLoading: boolean;
}

export const PetDetailsCard = ({
  appointment,
  petDetails,
  petLoading,
}: PetDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-primary" />
          <CardTitle>Datos de la Mascota</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {petLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-muted-foreground">
              Cargando datos de la mascota...
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sección de la imagen */}
            <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
              <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center relative">
                {petDetails?.profileImg?.originalUrl ? (
                  <Image
                    src={
                      petDetails.profileImg.originalUrl ||
                      "/NotImageNicoPets.png"
                    }
                    alt={`Foto de ${appointment?.pet.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <PawPrint className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>
            {/* Sección de los datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 flex-grow">
              {[
                {
                  icon: Info,
                  label: "Nombre",
                  value: appointment?.pet.name || "Sin nombre",
                },
                {
                  icon: PawPrint,
                  label: "Especie",
                  value: petDetails?.species?.name || "Sin especie",
                },
                {
                  icon: PawPrint,
                  label: "Raza",
                  value:
                    petDetails?.race?.name ||
                    appointment?.pet.race ||
                    "Sin raza",
                },
                {
                  icon: Calendar,
                  label: "Edad",
                  value: petDetails?.dateOfBirth
                    ? calcularEdad(petDetails.dateOfBirth)
                    : "Sin datos",
                },
                {
                  icon: Weight,
                  label: "Peso",
                  value: petDetails?.weight
                    ? `${petDetails.weight} kg`
                    : "Sin registro",
                },
                {
                  icon: CircleDot,
                  label: "Género",
                  value:
                    petDetails?.sex === "M"
                      ? "Macho"
                      : petDetails?.sex === "F"
                      ? "Hembra"
                      : "Sin registro",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 min-w-0">
                  <div className="bg-muted rounded-full p-2 flex-shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="break-words">
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};