"use client"

import { PawPrint, Calendar, Weight, CircleDot, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calcularEdad } from "@/lib/utils"
import Image from "next/image"
import type { Appointment } from "@/lib/appointment/IAppointment"
import type { PetData } from "@/lib/pets/IPet"
import { PetInfoCardSkeleton } from "../Skeleton/PetInfoCardSkeleton"
import NotImageNicoPets from "../../../../../public/NotImageNicoPets.png"

interface PetDetailsCardProps {
  appointment: Appointment | null
  petDetails: PetData | null
  petLoading: boolean
}

export const PetInfoCard = ({ appointment, petDetails, petLoading }: PetDetailsCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Datos de la Mascota</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {petLoading ? (
          <PetInfoCardSkeleton />
        ) : (
          <div className="flex flex-col xl:flex-row xl:flex-wrap items-center gap-4 xl:gap-6 w-full">
            {/* Imagen */}
            <div className="w-full xl:w-auto flex justify-center xl:justify-start">
              <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden">
                <Image
                  src={petDetails?.profileImg?.originalUrl || NotImageNicoPets}
                  alt={`Foto de ${appointment?.pet.name || "Mascota sin nombre"}`}
                  fill
                  className="object-cover rounded-full"
                  quality={90}
                  priority
                />
              </div>
            </div>
            {/* Datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6 flex-1">
              {[
                { icon: Info,     label: "Nombre", value: appointment?.pet.name || "Sin nombre" },
                { icon: PawPrint, label: "Especie", value: petDetails?.species?.name || "Sin especie" },
                { icon: PawPrint, label: "Raza",    value: petDetails?.race?.name || appointment?.pet.race || "Sin raza" },
                { icon: Calendar, label: "Edad",    value: petDetails?.dateOfBirth ? calcularEdad(petDetails.dateOfBirth) : "Sin datos" },
                { icon: Weight,   label: "Peso",    value: petDetails?.weight ? `${petDetails.weight} kg` : "Sin registro" },
                { icon: CircleDot,label: "Género",  value: petDetails?.sex === "M" ? "Macho" : petDetails?.sex === "F" ? "Hembra" : "Sin registro" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 w-full min-w-0">
                  <div className="bg-muted rounded-full p-2 flex-shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="font-medium text-sm break-words whitespace-normal">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}