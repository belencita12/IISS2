"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AppointmentDetailSkeleton } from "@/components/admin/appointment/Skeleton/AppointmentDetailSkeleton"
import { useAppointmentDetail } from "@/hooks/appointment/useAppointmentDetail"
import { AppointmentInfoCard } from "@/components/admin/appointment/details/AppointmentInfoCard"
import { PetInfoCard } from "@/components/admin/appointment/details/PetInfoCard"
import { OwnerInfoCard } from "@/components/admin/appointment/details/OwnerInfoCard"
import { EmployeeInfoCard } from "@/components/admin/appointment/details/EmployeeInfoCard"
import type { AppointmentData } from "@/lib/appointment/IAppointment"
import type { EmployeeData } from "@/lib/employee/IEmployee"
import type { PetData } from "@/lib/pets/IPet"
import type { IUserProfile } from "@/lib/client/IUserProfile"
import { toast } from "@/lib/toast"

interface AppointmentDetailProps {
  token: string | null
  appointmentId: string
}

export const AppointmentDetail = ({ token, appointmentId }: AppointmentDetailProps) => {
  const router = useRouter()

  const {
    appointment,
    appointmentLoading,
    petDetails,
    petLoading,
    ownerDetails,
    ownerLoading,
    employeeDetails,
    employeeLoading,
  } = useAppointmentDetail(token, appointmentId) as {
    appointment: AppointmentData | null
    appointmentLoading: boolean
    petDetails: PetData | null
    petLoading: boolean
    ownerDetails: IUserProfile | null
    ownerLoading: boolean
    employeeDetails: EmployeeData | null
    employeeLoading: boolean
  }

  useEffect(() => {
    if (!appointment && !appointmentLoading) {
      toast("error", "No hay detalles para esta cita")
    }
  }, [appointment, appointmentLoading, router])

  if (appointmentLoading) {
    return <AppointmentDetailSkeleton />
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <Button
          variant="outline"
          className="border-black border-solid self-start"
          onClick={() => router.back()}
        >
          Volver
        </Button>
        <div className="order-2 sm:order-none mx-auto sm:mx-0">
          <h1 className="text-2xl font-bold text-center sm:text-left">Detalle de la Cita</h1>
        </div>
        <div className="hidden sm:block order-3 w-[72px]"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AppointmentInfoCard appointment={appointment} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OwnerInfoCard
            appointment={appointment}
            ownerDetails={ownerDetails}
            ownerLoading={ownerLoading}
            petDetails={petDetails}
          />
          
          <div className="grid grid-cols-1 gap-6">
            <PetInfoCard 
              appointment={appointment} 
              petDetails={petDetails} 
              petLoading={petLoading} 
            />
            <EmployeeInfoCard
              appointment={appointment}
              employeeDetails={employeeDetails}
              employeeLoading={employeeLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetail