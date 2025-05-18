"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetch } from "@/hooks/api/useFetch"
import type { AppointmentData } from "@/lib/appointment/IAppointment"
import { APPOINTMENT_API } from "@/lib/urls"
import { toast } from "@/lib/toast"
import { formatDate, formatTimeUTC } from "@/lib/utils"

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
}

const statusLabels = {
  PENDING: "Pendiente",
  IN_PROGRESS: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
}

interface AppointmentDetailProps {
  token: string | null
  appointmentId: string
}

const AppointmentDetail = ({ token, appointmentId }: AppointmentDetailProps) => {
  const router = useRouter()

  const {
    data: appointment,
    loading,
    error,
  } = useFetch<AppointmentData>(`${APPOINTMENT_API}/${appointmentId}`, token, { immediate: true })

  useEffect(() => {
    if (error) {
      toast("error", error.message || "Error al cargar la cita")
    }
  }, [error])

  if (loading) {
    return <AppointmentDetailSkeleton />
  }

  if (!appointment && !loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Cita no encontrada</h2>
        <Button onClick={() => router.push("/dashboard/appointment")}>Volver a citas</Button>
      </div>
    )
  }

  // Format date and time using utils functions
  const displayDate = appointment?.designatedDate ? formatDate(appointment.designatedDate) : ""
  const displayTime = appointment?.designatedDate ? formatTimeUTC(appointment.designatedDate) : ""

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalle de la Cita</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main appointment information */}
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{appointment?.service || "Consulta de rutina y vacunación"}</h2>
                <p className="text-sm text-muted-foreground">Información general de la cita</p>
              </div>
              <Badge className={statusColors[appointment?.status || "PENDING"]}>
                {statusLabels[appointment?.status || "PENDING"]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Fecha designada</p>
                  <p className="text-muted-foreground">{displayDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Hora</p>
                  <p className="text-muted-foreground">{displayTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Ubicación</p>
                  <p className="text-muted-foreground">Consultorio 3</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-medium mb-2">Notas</h3>
              <p className="text-sm text-muted-foreground">
                {appointment?.details ||
                  "Revisar estado general y aplicar vacuna antirrábica anual. El paciente mostró síntomas de alergia en la última visita."}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Datos de la Mascota</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{appointment?.pet.name || "Sin nombre"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Especie</p>
                <p className="font-medium">{appointment?.pet.race || "Sin especie"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Raza</p>
                <p className="font-medium">{appointment?.pet.race || "Sin raza"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Edad</p>
                <p className="font-medium">3 años</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="font-medium">28.5 kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">Macho</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Datos del Propietario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{appointment?.pet.owner.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium"></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium"></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Personal Asignado</h2>
            <p className="text-sm text-muted-foreground mb-4">Empleados encargados de la cita</p>

            <div className="space-y-4">
              {appointment?.employees && appointment.employees.length > 0 ? (
                appointment.employees.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-3">
                    <Avatar>
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">
                       
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    </Avatar>
                    <div>
                      <p className="font-medium">Dra. Laura Martinez</p>
                      <p className="text-sm text-muted-foreground">Veterinaria</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    </Avatar>
                    <div>
                      <p className="font-medium">Juan Pérez</p>
                      <p className="text-sm text-muted-foreground">Asistente</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Historial de la Cita</h2>
            <div className="relative pl-6 space-y-6">
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-4 h-4 rounded-full bg-green-500"></div>
                <p className="font-medium">Cita creada</p>
                <p className="text-sm text-muted-foreground flex justify-between">
                  <span>10/5/2025</span>
                  <span>Recepción</span>
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-4 h-4 rounded-full bg-green-500"></div>
                <p className="font-medium">Confirmada por teléfono</p>
                <p className="text-sm text-muted-foreground flex justify-between">
                  <span>12/5/2025</span>
                  <span>Juan Pérez</span>
                </p>
              </div>

              <div className="absolute left-[-22px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Confirmation Modal 
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title="Confirmar Finalización"
        message="¿Estás seguro de que quieres finalizar esta cita?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        isLoading={isProcessing}
      />


      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Motivo de cancelación" size="md">
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded"
          placeholder="Escribe una razón para cancelar la cita"
          value={cancelDescription}
          onChange={(e) => setCancelDescription(e.target.value)}
        />
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmAction}
            disabled={isProcessing || !cancelDescription.trim()}
          >
            {isProcessing ? "Cancelando..." : "Confirmar"}
          </Button>
        </div>
      </Modal>*/}
    </div>
  )
}

const AppointmentDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-7 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="w-full">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="w-full">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="w-full">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>

            <Skeleton className="h-px w-full my-6" />

            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Skeleton className="h-9 w-40" />
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-full">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-4" />

            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-6 pl-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="relative">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetail
