"use client"

import { User } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { EmployeeData } from "@/lib/employee/IEmployee"
import type { AppointmentData } from "@/lib/appointment/IAppointment"
import { EmployeeInfoCardSkeleton } from "../Skeleton/EmployeeInfoCardSkeleton"
import NotImageNicoPets from "../../../../../public/NotImageNicoPets.png";

interface EmployeeCardProps {
  appointment: AppointmentData | null
  employeeDetails: EmployeeData | null
  employeeLoading: boolean
}

export const EmployeeInfoCard = ({ appointment, employeeDetails, employeeLoading }: EmployeeCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Empleado Asignado</CardTitle>
        </div>

        {employeeLoading ? (
          <EmployeeInfoCardSkeleton />
        ) : appointment?.employee ? (
          <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors mt-2">
            <div className="relative w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-muted shadow-sm">            
              <Image
                src={employeeDetails?.image?.originalUrl ?? NotImageNicoPets.src}
                alt={`Foto de ${employeeDetails?.fullName || "empleado"}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div>
              <p className="text-base font-medium break-words">
                {employeeDetails?.fullName || appointment?.employee?.name || ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {employeeDetails?.position?.name || "Sin puesto asignado"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-lg mt-2">
            <div className="flex justify-center mb-3">
              <div className="bg-muted/60 p-4 rounded-full">
                <User className="h-10 w-10 text-muted-foreground opacity-70" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">No hay empleado asignado a esta cita</p>
          </div>
        )}
      </CardHeader>
    </Card>
  )
}