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
import { CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"

type AppointmentFormProps = {
  token: string
  clientId: number
  userRole: string
}

export const AppointmentForm = ({ token, clientId, userRole }: AppointmentFormProps) => {
  const router = useRouter()

  // Initialize the form with default values that match your zod schema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null)

  const selectedDate = watch("designatedDate")
  const formattedDate = typeof selectedDate === "string" && selectedDate.trim() !== "" ? selectedDate.trim() : null

  const onSubmit = async (data: AppointmentRegister) => {
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
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <CardContent className="relative">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Columna izquierda - Título y descripción */}
          <div className="w-full md:w-1/3 flex flex-col justify-start">
            <CardTitle className="text-3xl font-bold text-myPurple-focus">Registro de Cita</CardTitle>
            <CardDescription className="text-myPurple-focus/70 mt-4">
              Ingresa los datos para agendar tu cita
            </CardDescription>

            {/* Panel de selecciones */}
            <div className="mt-8">
              {(selectedPet || selectedService || selectedEmployee) && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-myPurple-tertiary/30">
                  <div className="bg-gradient-to-r from-myPurple-primary to-myPink-primary p-3">
                    <h3 className="text-white font-medium flex items-center">
                      <span className="h-5 w-5 flex items-center justify-center bg-white text-myPurple-primary rounded-full text-xs mr-2">
                        ✓
                      </span>
                      Resumen de tu cita
                    </h3>
                  </div>

                  <div className="p-4 space-y-3">
                    {selectedPet && (
                      <div className="bg-gradient-to-r from-myPurple-disabled/30 to-myPurple-disabled/10 rounded-lg overflow-hidden">
                        <PetSelected pet={selectedPet} />
                      </div>
                    )}

                    {selectedService && (
                      <div className="bg-gradient-to-r from-myPink-disabled/30 to-myPink-disabled/10 rounded-lg overflow-hidden">
                        <ServiceSelected service={selectedService} />
                      </div>
                    )}

                    {selectedEmployee && (
                      <div className="bg-gradient-to-r from-myPurple-secondary/30 to-myPurple-secondary/10 rounded-lg overflow-hidden">
                        <EmployeeSelected employee={selectedEmployee} />
                      </div>
                    )}

                    {selectedDate && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-myPink-secondary/30 to-myPink-secondary/10 rounded-lg">
                        <div className="bg-white p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-myPink-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-myPurple-focus">Fecha seleccionada</p>
                          <p className="text-gray-600">
                            {new Date(selectedDate).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {watch("designatedTime") && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-myPink-tertiary/30 to-myPink-tertiary/10 rounded-lg">
                        <div className="bg-white p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-myPink-tertiary" />
                        </div>
                        <div>
                          <p className="font-medium text-myPurple-focus">Hora seleccionada</p>
                          <p className="text-gray-600">{watch("designatedTime")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="w-full md:w-2/3">
            <form id="appointmentForm" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="flex items-center text-base font-medium text-myPurple-focus">
                    <PawPrint className="h-5 w-5 text-myPurple-primary mr-2" />
                    Mascota
                  </label>
                  <PetSelect clientId={clientId} token={token} onSelectPet={handleSelectPet} />
                  {/* Hidden input for form state */}
                  <input type="hidden" {...register("petId")} />
                  {errors.petId && <p className="text-myPink-focus text-sm">{errors.petId.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-base font-medium text-myPurple-focus">
                    <Stethoscope className="h-5 w-5 text-myPink-primary mr-2" />
                    Servicio
                  </label>
                  <ServiceSelect token={token} userRole={userRole} onSelectService={handleSelectService} />
                  {/* Hidden input for form state */}
                  <input type="hidden" {...register("serviceId")} />
                  {errors.serviceId && <p className="text-myPink-focus text-sm">{errors.serviceId.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-base font-medium text-myPurple-focus">
                    <span className="h-5 w-5 flex items-center justify-center bg-myPurple-secondary text-white rounded-full text-xs mr-2">
                      V
                    </span>
                    Veterinario
                  </label>
                  <EmployeeSelect token={token} onSelectEmployee={handleSelectEmployee} />
                  {/* Hidden input for form state */}
                  <input type="hidden" {...register("employeesId")} />
                  {errors.employeesId && <p className="text-myPink-focus text-sm">{errors.employeesId.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-base font-medium text-myPurple-focus">
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
                  {errors.designatedDate && (
                    <p className="text-myPink-focus text-sm">{errors.designatedDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-base font-medium text-myPurple-focus">
                    <Clock className="h-5 w-5 text-myPink-tertiary mr-2" />
                    Hora
                  </label>
                  {selectedEmployee && formattedDate ? (
                    <AvailabilityPicker
                      token={token}
                      employeeId={String(selectedEmployee.id)}
                      date={formattedDate}
                      serviceDuration={selectedService?.durationMin || 0}
                      onSelectTime={handleSelectTime}
                    />
                  ) : (
                    <div className="p-3 border border-myPurple-tertiary rounded-lg bg-gray-50 text-gray-500">
                      Selecciona un veterinario y una fecha primero
                    </div>
                  )}
                  {/* Hidden input for form state */}
                  <input type="hidden" {...register("designatedTime")} />
                  {errors.designatedTime && (
                    <p className="text-myPink-focus text-sm">{errors.designatedTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-base font-medium text-myPurple-focus">
                    <MessageSquare className="h-5 w-5 text-myPurple-primary mr-2" />
                    Detalles
                  </label>
                  <textarea
                    {...register("details")}
                    className="w-full border border-myPurple-tertiary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-myPurple-focus"
                    rows={4}
                    placeholder="Describe el motivo de la consulta o cualquier detalle importante"
                  />
                  {errors.details && <p className="text-myPink-focus text-sm">{errors.details.message}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative flex justify-end gap-4 pt-4 border-t border-myPurple-tertiary/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/user-profile")}
          disabled={isSubmitting}
          className="border-myPink-primary text-myPink-primary hover:bg-myPink-disabled hover:text-myPink-hover"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="appointmentForm"
          className="bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrar Cita"}
        </Button>
      </CardFooter>
    </div>
  )
}
