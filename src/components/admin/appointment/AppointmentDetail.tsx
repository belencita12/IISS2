"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AppointmentDetailSkeleton } from "@/components/admin/appointment/skeleton/AppointmentDetailSkeleton"
import { useAppointmentDetail } from "@/hooks/appointment/useAppointmentDetail"
import { AppointmentInfoCard } from "@/components/admin/appointment/details/AppointmentInfoCard"
import { PetDetailsCard } from "@/components/admin/appointment/details/PetInfoCard"
import { OwnerDetailsCard } from "@/components/admin/appointment/details/OwnerInfoCard"
import { EmployeeCard } from "@/components/admin/appointment/details/EmployeeInfoCard"
import { Appointment } from "@/lib/appointment/IAppointment"
import { EmployeeData } from "@/lib/employee/IEmployee"
import { PetData } from "@/lib/pets/IPet"
import { IUserProfile } from "@/lib/client/IUserProfile"
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
    appointment: Appointment | null
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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <Button variant="outline" className="border-black border-solid" onClick={() => router.back()}>
          Volver
        </Button>
        <div className="order-2 sm:order-none mx-auto sm:mx-0">
          <h1 className="text-2xl font-bold text-center sm:text-left">Detalle de la Cita</h1>
        </div>
        <div className="hidden sm:block order-3 w-[72px]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentInfoCard appointment={appointment} />
          <PetDetailsCard 
            appointment={appointment} 
            petDetails={petDetails} 
            petLoading={petLoading} 
          />
          <OwnerDetailsCard 
            appointment={appointment} 
            ownerDetails={ownerDetails} 
            ownerLoading={ownerLoading} 
            petDetails={petDetails}
          />
        </div>

        <div className="space-y-6">
          <EmployeeCard 
            appointment={appointment} 
            employeeDetails={employeeDetails} 
            employeeLoading={employeeLoading} 
          />
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetail