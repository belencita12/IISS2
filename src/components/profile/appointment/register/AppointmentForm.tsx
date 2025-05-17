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
import PetSelect from "./PetSelect"
import PetSelected from "./PetSelected"
import ServiceSelect from "./ServiceSelect"
import ServiceSelected from "./ServiceSelected"
import EmployeeSelect from "./EmployeeSelect"
import EmployeeSelected from "./EmployeeSelected"
import { AvailabilityPicker } from "./AvailabilityPicker"
import { Calendar, Clock, FileText, PawPrint, Stethoscope, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AppointmentFormProps = {
  token: string
  clientId: number
  userRole: string
}

export const AppointmentForm = ({ token, clientId, userRole }: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    setValue,
    watch,
  } = useForm<AppointmentRegister>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      designatedDate: "",
      designatedTime: "",
      details: "",
      serviceId: 0,
      petId: 0,
      employeesId: [],
    },
  })

  const router = useRouter()

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null)
  const [showTimeError, setShowTimeError] = useState(false)

  const selectedDate = watch("designatedDate")
  const selectedTime = watch("designatedTime")
  const formattedDate = typeof selectedDate === "string" && selectedDate.trim() !== "" ? selectedDate.trim() : null

  const onSubmit = async (data: AppointmentRegister) => {
    // Solo mostrar error de horario si hay empleado y fecha seleccionados pero no horario
    if (selectedEmployee && formattedDate && !selectedTime) {
      setShowTimeError(true)
      return
    }
    setShowTimeError(false)

    try {
      await createAppointment(token, data)
      toast("success", "Cita registrada con éxito")
      router.push("/user-profile")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar la cita"
      toast("error", errorMessage)
    }
  }

  const handleSelectEmployee = (employee: EmployeeData) => {
    if (employee.id) {
      setValue("employeesId", [employee.id], { shouldValidate: true })
      setSelectedEmployee(employee)
      setShowTimeError(false)
    }
  }

  const handleSelectService = (service: ServiceType) => {
    if (service.id) {
      setValue("serviceId", service.id, { shouldValidate: true })
      setSelectedService(service)
    }
  }

  const handleSelectPet = (pet: PetData) => {
    if (pet.id) {
      setValue("petId", pet.id, { shouldValidate: true })
      setSelectedPet(pet)
    }
  }

  const handleSelectTime = (time: string) => {
    setValue("designatedTime", time, { shouldValidate: true })
    setShowTimeError(false)
  }

  // Determinar si debemos mostrar el error de horario
  const shouldShowTimeError =
    showTimeError || (errors.designatedTime && isSubmitted && selectedEmployee && formattedDate)

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="from-myPurple-primary to-myPink-primary text-white text-center py-6">
          <CardTitle className="text-3xl font-bold text-myPurple-focus">Agendar Cita</CardTitle>
          <CardDescription className="text-myPurple-focus/70 text-sm mt-2">
            Ingresa los datos para agendar tu cita veterinaria
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sección de Mascota */}
              <div className="space-y-4 bg-white p-4 rounded-lg border border-myPurple-tertiary/30 shadow-sm">
                <div className="flex items-center gap-2 text-myPurple-focus border-b border-myPurple-tertiary/30 pb-2 mb-3">
                  <PawPrint className="w-5 h-5" />
                  <h3 className="font-medium">Mascota</h3>
                </div>
                <div>
                  <PetSelect clientId={clientId} token={token} onSelectPet={handleSelectPet} />
                  <input type="hidden" {...register("petId")} />
                  {errors.petId && <p className="text-myPink-focus text-sm mt-1">{errors.petId.message}</p>}
                  {selectedPet && <PetSelected pet={selectedPet} />}
                </div>
              </div>

              {/* Sección de Servicio */}
              <div className="space-y-4 bg-white p-4 rounded-lg border border-myPurple-tertiary/30 shadow-sm">
                <div className="flex items-center gap-2 text-myPurple-focus border-b border-myPurple-tertiary/30 pb-2 mb-3">
                  <User className="w-5 h-5" />
                  <h3 className="font-medium">Servicio</h3>
                </div>
                <div>
                  <ServiceSelect token={token} userRole={userRole} onSelectService={handleSelectService} />
                  <input type="hidden" {...register("serviceId")} />
                  {errors.serviceId && <p className="text-myPink-focus text-sm mt-1">{errors.serviceId.message}</p>}
                  {selectedService && <ServiceSelected service={selectedService} />}
                </div>
              </div>
            </div>

            {/* Sección de Empleado y Fecha en la misma fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sección de Veterinario */}
              <div className="bg-white p-4 rounded-lg border border-myPurple-tertiary/30 shadow-sm">
                <div className="flex items-center gap-2 text-myPurple-focus border-b border-myPurple-tertiary/30 pb-2 mb-3">
                  <Stethoscope className="w-5 h-5" />
                  <h3 className="font-medium">Empleado</h3>
                </div>
                <div>
                  <EmployeeSelect token={token} onSelectEmployee={handleSelectEmployee} />
                  <input type="hidden" {...register("employeesId")} />
                  {errors.employeesId && <p className="text-myPink-focus text-sm mt-1">{errors.employeesId.message}</p>}
                  {selectedEmployee && <EmployeeSelected employee={selectedEmployee} />}
                </div>
              </div>

              {/* Sección de Fecha */}
              <div className="bg-white p-4 rounded-lg border border-myPurple-tertiary/30 shadow-sm">
                <div className="flex items-center gap-2 text-myPurple-focus border-b border-myPurple-tertiary/30 pb-2 mb-3">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-medium">Fecha</h3>
                </div>
                <div>
                  <input
                    type="date"
                    {...register("designatedDate")}
                    className="w-full border border-myPurple-tertiary rounded-md p-2 focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.designatedDate && (
                    <p className="text-myPink-focus text-sm mt-1">{errors.designatedDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Horario (aparece solo cuando hay empleado y fecha seleccionados) */}
            {selectedEmployee && formattedDate && (
              <div className="bg-white p-4 rounded-lg border border-myPurple-tertiary/30 shadow-sm">
                <div className="flex items-center gap-2 text-myPurple-focus border-b border-myPurple-tertiary/30 pb-2 mb-3">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-medium">Horario Disponible</h3>
                </div>
                <div>
                  <AvailabilityPicker
                    token={token}
                    employeeId={String(selectedEmployee.id)}
                    date={formattedDate}
                    serviceDuration={selectedService?.durationMin || 0}
                    onSelectTime={handleSelectTime}
                  />
                  {shouldShowTimeError && (
                    <p className="text-myPink-focus text-sm mt-1">
                      {errors.designatedTime?.message || "Seleccione un horario"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sección de Detalles */}
            <div className="bg-white p-4 rounded-lg border border-myPurple-tertiary/30 shadow-sm">
              <div className="flex items-center gap-2 text-myPurple-focus border-b border-myPurple-tertiary/30 pb-2 mb-3">
                <FileText className="w-5 h-5" />
                <h3 className="font-medium">Detalles de la Cita</h3>
              </div>
              <div>
                <textarea
                  {...register("details")}
                  className="w-full border border-myPurple-tertiary rounded-md p-3 focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200"
                  rows={4}
                  placeholder="Describe los síntomas o motivo de la consulta"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-myPurple-tertiary/30">
              <Button
                type="button"
                variant="outline"
                className="border-myPurple-tertiary text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus transition-all duration-200"
                onClick={() => router.push("/user-profile")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Agendando..." : "Agendar Cita"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}