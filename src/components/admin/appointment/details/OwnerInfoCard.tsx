"use client"
import type React from "react"
import { User, Phone, MapPin, Briefcase, UserCircle, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { Appointment } from "@/lib/appointment/IAppointment"
import type { IUserProfile } from "@/lib/client/IUserProfile"
import type { PetData } from "@/lib/pets/IPet"
import { OwnerInfoCardSkeleton } from "../skeleton/OwnerInfoCardSkeleton"
import { Separator } from "@/components/ui/separator"

interface OwnerDetailsCardProps {
  appointment: Appointment | null
  ownerDetails: IUserProfile | null
  ownerLoading: boolean
  petDetails: PetData | null
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg">
    <div className="bg-muted rounded-full p-2 flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-sm break-words leading-relaxed">{value || "Sin registro"}</p>
    </div>
  </div>
)

export const OwnerInfoCard = ({ appointment, ownerDetails, ownerLoading, petDetails }: OwnerDetailsCardProps) => {
  const ownerName = ownerDetails?.fullName || petDetails?.owner?.name || appointment?.pet.owner.name || "Sin registro"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Datos del Propietario</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {ownerLoading ? (
          <OwnerInfoCardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Foto e información principal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden relative flex items-center justify-center shadow-sm border border-muted flex-shrink-0">
                {ownerDetails?.image?.originalUrl ? (
                  <Image
                    src={ownerDetails.image.originalUrl || "/placeholder.svg"}
                    alt={`Foto de ${ownerName}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 96px, 100vw"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                <h3 className="text-base font-medium break-words">{ownerName}</h3>
              </div>
            </div>

            <Separator className="my-2 h-[0.5px] bg-gray-200" />

            {/* Información de contacto con filas correctamente alineadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={ownerDetails?.email || ""} />
              <InfoItem icon={Phone} label="Teléfono" value={ownerDetails?.phoneNumber || ""} />
              <InfoItem icon={MapPin} label="Dirección" value={ownerDetails?.adress || ""} />
              <InfoItem icon={Briefcase} label="RUC" value={ownerDetails?.ruc || ""} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
