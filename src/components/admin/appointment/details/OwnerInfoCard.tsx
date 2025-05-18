"use client";

import { User, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Appointment } from "@/lib/appointment/IAppointment";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { PetData } from "@/lib/pets/IPet";

interface OwnerDetailsCardProps {
  appointment: Appointment | null;
  ownerDetails: IUserProfile | null;
  ownerLoading: boolean;
  petDetails: PetData | null;
}

export const OwnerDetailsCard = ({
  appointment,
  ownerDetails,
  ownerLoading,
  petDetails,
}: OwnerDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Datos del Propietario</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {ownerLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-muted-foreground">
              Cargando datos del propietario...
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
              <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center relative">
                {ownerDetails?.image?.originalUrl ? (
                  <Image
                    src={ownerDetails.image.originalUrl || "/NotImageNicoPets.png"}
                    alt={`Foto de ${ownerDetails.fullName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>

            {/* Datos del propietario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex items-start gap-3 min-w-0">
                <div className="bg-muted rounded-full p-2 flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="break-all">
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">
                    {ownerDetails?.fullName ||
                      petDetails?.owner?.name ||
                      appointment?.pet.owner.name ||
                      "Sin registro"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <div className="bg-muted rounded-full p-2 flex-shrink-0">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="break-all">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">
                    {ownerDetails?.phoneNumber || "Sin registro"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <div className="bg-muted rounded-full p-2 flex-shrink-0">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="break-all">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">
                    {ownerDetails?.email || "Sin registro"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <div className="bg-muted rounded-full p-2 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="break-all">
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">
                    {ownerDetails?.adress || "Sin registro"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};