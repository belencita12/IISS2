"use client"

import { User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { Appointment } from "@/lib/appointment/IAppointment";

interface EmployeeCardProps {
  appointment: Appointment | null;
  employeeDetails: EmployeeData | null;
  employeeLoading: boolean;
}

export const EmployeeCard = ({
  appointment,
  employeeDetails,
  employeeLoading,
}: EmployeeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Empleado Asignado</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {employeeLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-muted-foreground">
              Cargando datos del empleado...
            </div>
          </div>
        ) : appointment?.employee ? (
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
              {employeeDetails?.image?.originalUrl ? (
                <Image
                  src={
                    employeeDetails.image.originalUrl || "/NotImageNicoPets.png"
                  }
                  alt={`Foto de ${employeeDetails.fullName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">
                {employeeDetails?.fullName || appointment.employee.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {employeeDetails?.position?.name || "Sin puesto"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-muted/30 rounded-lg">
            <div className="flex justify-center mb-2">
              <User className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground">
              No hay empleado asignado a esta cita
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};