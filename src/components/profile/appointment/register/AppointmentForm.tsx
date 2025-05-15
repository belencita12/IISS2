"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { appointmentSchema } from "@/lib/appointment/appointmentSchema"
import type { AppointmentRegister, ServiceType } from "@/lib/appointment/IAppointment"
import type { EmployeeData } from "@/lib/employee/IEmployee"
import type { PetData } from "@/lib/pets/IPet"
import { createAppointment } from "@/lib/appointment/service"
import { toast } from "@/lib/toast"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MessageSquare, Stethoscope, PawPrint } from "lucide-react"
import PetSelect from "./PetSelect"
import PetSelected from "./PetSelected"
import ServiceSelect from "./ServiceSelect"
import ServiceSelected from "./ServiceSelected"
import EmployeeSelect from "./EmployeeSelect"
import EmployeeSelected from "./EmployeeSelected"
import { AvailabilityPicker } from "./AvailabilityPicker"

type AppointmentFormProps = {
  token: string
  clientId: number
  userRole: string
}

export const AppointmentForm = ({ token, clientId, userRole }: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentRegister>({
    resolver: zodResolver(appointmentSchema),
  })

  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null)

  const selectedDate = watch("designatedDate")
  const formattedDate = typeof selectedDate === "string" && selectedDate.trim() !== "" ? selectedDate.trim() : null

  const onSubmit = async (data: AppointmentRegister) => {
    setIsSubmitting(true)
    try {
      await createAppointment(token, data)
      toast("success", "Cita registrada con éxito")
      router.push("/user-profile")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar la cita"
      toast("error", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectEmployee = (employee: EmployeeData) => {
    if (employee.id) {
      setValue("employeesId", [employee.id])
      setSelectedEmployee(employee)
    }
  }

  const handleSelectService = (service: ServiceType) => {
    if (service.id) {
      setValue("serviceId", service.id)
      setSelectedService(service)
    }
  }

  const handleSelectPet = (pet: PetData) => {
    if (pet.id) {
      setValue("petId", pet.id)
      setSelectedPet(pet)
    }
  }

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-myPurple-primary mb-2">Registro de Cita</h1>
        <p className="text-gray-600 mb-8">Ingresa los datos para agendar tu cita</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-white rounded-xl border border-myPurple-tertiary/30 p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-base font-medium text-gray-700 mb-1">
                <PawPrint className="h-5 w-5 text-myPurple-primary mr-2" />
                Mascota
              </label>
              <PetSelect clientId={clientId} token={token} onSelectPet={handleSelectPet} />
              <input type="hidden" {...register("petId")} />
              {errors.petId && <p className="text-red-500 text-sm mt-1">{errors.petId.message}</p>}
              {selectedPet && <PetSelected pet={selectedPet} />}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-base font-medium text-gray-700 mb-1">
                <Stethoscope className="h-5 w-5 text-myPink-primary mr-2" />
                Servicio
              </label>
              <ServiceSelect token={token} userRole={userRole} onSelectService={handleSelectService} />
              <input type="hidden" {...register("serviceId")} />
              {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
              {selectedService && <ServiceSelected service={selectedService} />}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center text-base font-medium text-gray-700 mb-1">
                <span className="h-5 w-5 flex items-center justify-center bg-myPurple-secondary text-white rounded-full text-xs mr-2">
                  V
                </span>
                Veterinario
              </label>
              <EmployeeSelect token={token} onSelectEmployee={handleSelectEmployee} />
              <input type="hidden" {...register("employeesId")} />
              {errors.employeesId && <p className="text-red-500 text-sm mt-1">{errors.employeesId.message}</p>}
              {selectedEmployee && <EmployeeSelected employee={selectedEmployee} />}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-base font-medium text-gray-700 mb-1">
                <Calendar className="h-5 w-5 text-myPink-secondary mr-2" />
                Fecha
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("designatedDate")}
                  className="w-full border border-myPurple-tertiary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-myPurple-focus"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.designatedDate && <p className="text-red-500 text-sm mt-1">{errors.designatedDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-base font-medium text-gray-700 mb-1">
                <Clock className="h-5 w-5 text-myPink-tertiary mr-2" />
                Hora
              </label>
              {selectedEmployee && formattedDate ? (
                <AvailabilityPicker
                  token={token}
                  employeeId={String(selectedEmployee.id)}
                  date={formattedDate}
                  serviceDuration={selectedService?.durationMin || 0}
                  onSelectTime={(time) => setValue("designatedTime", time)}
                />
              ) : (
                <div className="p-3 border border-myPurple-tertiary rounded-lg bg-gray-50 text-gray-500">
                  Selecciona un veterinario y una fecha primero
                </div>
              )}
              {errors.designatedTime && <p className="text-red-500 text-sm mt-1">{errors.designatedTime.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-base font-medium text-gray-700 mb-1">
              <MessageSquare className="h-5 w-5 text-myPurple-primary mr-2" />
              Detalles
            </label>
            <textarea
              {...register("details")}
              className="w-full border border-myPurple-tertiary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-myPurple-focus"
              rows={4}
              placeholder="Describe el motivo de la consulta o cualquier detalle importante"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="border-myPink-primary text-myPink-primary hover:bg-myPink-disabled hover:text-myPink-hover rounded-lg px-6 py-2.5"
              onClick={() => router.push("/user-profile")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-myPurple-primary text-white hover:bg-myPurple-hover disabled:bg-myPurple-disabled rounded-lg px-6 py-2.5"
              disabled={!selectedEmployee || !selectedService || !selectedPet || !formattedDate || isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar Cita"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
