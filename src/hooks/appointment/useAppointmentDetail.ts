import { useEffect, useMemo } from "react"
import { useFetch } from "@/hooks/api/useFetch"
import type { AppointmentData } from "@/lib/appointment/IAppointment"
import type { PetData } from "@/lib/pets/IPet"
import type { EmployeeData } from "@/lib/employee/IEmployee"
import { APPOINTMENT_API, PET_API, CLIENT_API, EMPLOYEE_API } from "@/lib/urls"
import type { IUserProfile } from "@/lib/client/IUserProfile"

export const useAppointmentDetail = (token: string | null, appointmentId: string) => {
  // Hook para cargar los datos de la cita principal
  const {
    data: appointment,
    loading: appointmentLoading,
    error: appointmentError,
    execute: executeAppointmentFetch,
  } = useFetch<AppointmentData>(`${APPOINTMENT_API}/${appointmentId}`, token, { immediate: true })

  // URLs dinámicas basadas en el appointment data
  const petUrl = useMemo(
    () => (appointment?.pet?.id ? `${PET_API}/${appointment.pet.id}` : null),
    [appointment?.pet?.id],
  )

  const ownerUrl = useMemo(
    () => (appointment?.pet?.owner?.id ? `${CLIENT_API}/${appointment.pet.owner.id}` : null),
    [appointment?.pet?.owner?.id],
  )

  const employeeUrl = useMemo(
    () => (appointment?.employee?.id ? `${EMPLOYEE_API}/${appointment.employee.id}` : null),
    [appointment?.employee?.id],
  )

  // Hooks con URLs dinámicas - se configuran para NO ejecutarse automáticamente
  const {
    data: petDetails,
    loading: petLoading,
    error: petError,
    execute: executePetFetch,
  } = useFetch<PetData>("", token, {
    immediate: false,
  })

  const {
    data: ownerDetails,
    loading: ownerLoading,
    error: ownerError,
    execute: executeOwnerFetch,
  } = useFetch<IUserProfile>("", token, {
    immediate: false,
  })

  const {
    data: employeeDetails,
    loading: employeeLoading,
    error: employeeError,
    execute: executeEmployeeFetch,
  } = useFetch<EmployeeData>("", token, {
    immediate: false,
  })

  // Effect para ejecutar las llamadas cuando tengamos las URLs
  useEffect(() => {
    if (petUrl) {
      executePetFetch(undefined, petUrl)
    }
  }, [petUrl])

  useEffect(() => {
    if (ownerUrl) {
      executeOwnerFetch(undefined, ownerUrl)
    }
  }, [ownerUrl])

  useEffect(() => {
    if (employeeUrl) {
      executeEmployeeFetch(undefined, employeeUrl)
    }
  }, [employeeUrl])

  return {
    appointment,
    appointmentLoading,
    appointmentError,
    petDetails,
    petLoading,
    petError,
    ownerDetails,
    ownerLoading,
    ownerError,
    employeeDetails,
    employeeLoading,
    employeeError,
    executeAppointmentFetch,
  }
}