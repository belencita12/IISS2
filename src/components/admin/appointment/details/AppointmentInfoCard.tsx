"use client"

import { Calendar, Clock, Stethoscope, CalendarClock, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatTimeUTC } from "@/lib/utils"
import { StatusBadge } from "@/components/admin/appointment/StatusBadge"
import type { Appointment } from "@/lib/appointment/IAppointment"

interface AppointmentInfoCardProps {
  appointment: Appointment | null
}

export const AppointmentInfoCard = ({ appointment }: AppointmentInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base">Información de la Cita</CardTitle>
          </div>
          <StatusBadge status={appointment?.status || "PENDING"} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Servicios solicitados */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Programación
            </h3>
            <div className="space-y-2">
              <div className="flex flex-col space-y-2">
                {/* Fecha */}
                <div className="flex items-center min-h-14 p-2 bg-muted/40 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full mr-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium text-sm break-words">
                      {appointment?.designatedDate ? formatDate(appointment.designatedDate) : "No asignada"}
                    </p>
                  </div>
                </div>
                {/* Hora */}
                <div className="flex items-center h-14 p-2 bg-muted/40 rounded-lg overflow-hidden">
                  <div className="bg-primary/10 p-2 rounded-full mr-2 flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium text-sm truncate">
                      {appointment?.designatedDate ? formatTimeUTC(appointment.designatedDate) : "No asignada"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Programación */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Servicios solicitados
            </h3>
            {appointment?.services && appointment.services.length > 0 ? (
              <div className="space-y-2">
                {appointment.services.map((service) => (
                  <div key={service.id} className="flex items-center min-h-14 p-2 bg-muted/40 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm break-words">{service.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin servicios asignados</p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Notas adicionales
          </h3>
          <div className="bg-muted/50 rounded-lg p-3 text-sm break-words">
            {appointment?.details || "Sin notas adicionales"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
