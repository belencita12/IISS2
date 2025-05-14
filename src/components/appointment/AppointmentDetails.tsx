"use client"

import { useEffect, useState } from "react"
import { getAppointmentById } from "@/lib/appointment/getAppointmentById"
import type { AppointmentData } from "@/lib/appointment/IAppointment"
import { formatDate, formatTimeUTC } from "@/lib/utils"

interface AppointmentDetailsProps {
  token: string
  appointmentId: string
}

export default function AppointmentDetails({ token, appointmentId }: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentById(appointmentId, token)
        setAppointment(data)
      } catch (err) {
        setError("Error al cargar los detalles de la cita")
        console.error("Error fetching appointment:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [appointmentId, token])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-myPurple-secondary animate-pulse">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-myPink-focus p-4 bg-myPink-disabled rounded-md">{error}</div>
  }

  if (!appointment) {
    return (
      <div className="text-center text-myPurple-focus p-4 bg-myPurple-disabled/20 rounded-md">
        No se encontró la cita
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-white to-myPurple-disabled/20 rounded-lg shadow-md border border-myPurple-tertiary/30">
      <h2 className="text-2xl font-bold mb-6 text-myPurple-focus">Detalle de la cita</h2>

      <div className="space-y-4">
        <div className="border-b border-myPurple-tertiary/30 pb-4">
          <p className="font-semibold text-myPink-focus">Servicio</p>
          <p className="text-myPurple-primary">{appointment.service}</p>
        </div>

        <div className="border-b border-myPurple-tertiary/30 pb-4">
          <p className="font-semibold text-myPink-focus">Fecha designada</p>
          <p className="text-myPurple-primary">
            {formatDate(appointment.designatedDate)}, {formatTimeUTC(appointment.designatedDate)}
          </p>
        </div>

        <div className="border-b border-myPurple-tertiary/30 pb-4">
          <p className="font-semibold text-myPink-focus">Estado</p>
          <div className="mt-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-white ${
                appointment.status === "PENDING"
                  ? "bg-myPurple-secondary"
                  : appointment.status === "IN_PROGRESS"
                    ? "bg-myPink-secondary"
                    : appointment.status === "COMPLETED"
                      ? "bg-myPurple-focus"
                      : "bg-myPink-focus"
              }`}
            >
              {{
                PENDING: "Pendiente",
                IN_PROGRESS: "En Progreso",
                COMPLETED: "Completado",
                CANCELLED: "Cancelado",
              }[appointment.status] || "Desconocido"}
            </span>
          </div>
        </div>

        <div className="border-b border-myPurple-tertiary/30 pb-4">
          <p className="font-semibold text-myPink-focus">Detalles</p>
          <p className="text-myPurple-primary">{appointment.details ? appointment.details : "Sin Detalles"}</p>
        </div>

        <div className="border-b border-myPurple-tertiary/30 pb-4">
          <p className="font-semibold text-myPink-focus mb-2">Mascota</p>
          <div className="ml-4 p-3 bg-white/50 rounded-md">
            <p className="text-myPurple-primary">
              Nombre: <span className="font-medium">{appointment.pet.name}</span>
            </p>
            <p className="text-myPurple-primary">
              Raza: <span className="font-medium">{appointment.pet.race}</span>
            </p>
            <p className="text-myPurple-primary">
              Dueño: <span className="font-medium">{appointment.pet.owner.name}</span>
            </p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-myPink-focus mb-2">Empleados encargados</p>
          <ul className="ml-4 space-y-2">
            {appointment.employees.map((emp) => (
              <li key={emp.id} className="text-myPurple-primary flex items-center">
                <span className="h-2 w-2 rounded-full bg-myPink-tertiary mr-2"></span>
                {emp.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
