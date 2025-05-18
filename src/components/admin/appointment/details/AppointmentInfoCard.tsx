"use client"

import { Calendar, Clock, Stethoscope } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatTimeUTC } from "@/lib/utils"
import { StatusBadge } from "@/components/admin/appointment/StatusBadge"
import { Appointment } from "@/lib/appointment/IAppointment"

interface AppointmentInfoCardProps {
  appointment: Appointment | null
}

export const AppointmentInfoCard = ({
  appointment
}: AppointmentInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between pb-4">
        <div>
          <CardTitle>Información de la Cita</CardTitle>
          <CardDescription>Detalles generales y servicios</CardDescription>
        </div>
        <div className="sm:mt-0 mt-2">
          <StatusBadge status={appointment?.status || "PENDING"} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Servicios solicitados</h3>
          <div className="grid grid-cols-1 gap-2">
            {appointment?.services && appointment.services.length > 0 ? (
              appointment.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center p-3 bg-muted/40 rounded-lg"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{service.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin servicios asignados
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">
                {appointment?.designatedDate
                  ? formatDate(appointment.designatedDate)
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hora</p>
              <p className="font-medium">
                {appointment?.designatedDate
                  ? formatTimeUTC(appointment.designatedDate)
                  : ""}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-medium mb-2">Notas adicionales</h3>
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            {appointment?.details || "Sin notas adicionales"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}