"use client";

import { useEffect, useState } from "react";
import { getAppointmentById } from "@/lib/appointment/getAppointmentById";
import type { AppointmentData } from "@/lib/appointment/IAppointment";
import { formatDate, formatTimeUTC } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AppointmentDetailsProps {
  token: string;
  appointmentId: string;
}

export default function AppointmentDetails({
  token,
  appointmentId,
}: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentById(appointmentId, token);
        setAppointment(data);
      } catch (err) {
        setError("Error al cargar los detalles de la cita");
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[150px]">
        <p className="text-myPurple-focus animate-pulse text-lg font-medium">
          Cargando...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-myPink-disabled text-myPink-focus border border-myPink-tertiary/50 p-4 rounded-md shadow-sm text-center">
        {error}
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-myPurple-disabled text-myPurple-focus border border-myPurple-tertiary/50 p-4 rounded-md shadow-sm text-center">
        No se encontró la cita
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg border border-myPurple-tertiary/30 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-myPurple-focus mb-6">
        Detalle de la Cita
      </h2>

      <div className="space-y-5">
        
        <div className="border-b border-myPurple-tertiary/30 pb-3">
          <p className="text-myPink-focus font-semibold mb-2">{`${(appointment.service || (appointment.services?.length !== undefined? appointment.services.length === 1 : false) )? "Servicio" : "Servicios"}`}</p>
          <ul className="ml-2 space-y-2">
            {appointment.services ? appointment.services.map((serv) => (
              <li key={serv.id} className="flex items-center text-myPurple-primary text-sm">
                <span className="w-2 h-2 rounded-full bg-myPink-tertiary mr-2"></span>
                {serv.name}
              </li>
            )) : appointment.service ? 
            (<li className="flex items-center text-myPurple-primary text-sm">
                <span className="w-2 h-2 rounded-full bg-myPink-tertiary mr-2"></span>
                {appointment.service}
              </li>)  
            : 
            (
              <li className="text-myPurple-primary text-sm">No hay Servicios </li>
            )}
          </ul>
        </div>

        <DetailSection
          title="Fecha Designada"
          value={`${formatDate(appointment.designatedDate)}, ${formatTimeUTC(
            appointment.designatedDate
          )}`}
        />

        <div className="border-b border-myPurple-tertiary/30 pb-3">
          <p className="text-myPink-focus font-semibold mb-1">Estado</p>
          <span className="inline-block bg-myPink-primary text-white px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide shadow-sm">
            {{
              PENDING: "Pendiente",
              IN_PROGRESS: "En Progreso",
              COMPLETED: "Completado",
              CANCELLED: "Cancelado",
            }[appointment.status] || "Desconocido"}
          </span>
        </div>

        <DetailSection
          title="Detalles"
          value={appointment.details || "Sin detalles"}
        />

        <div className="border-b border-myPurple-tertiary/30 pb-3">
          <p className="text-myPink-focus font-semibold mb-2">Mascota</p>
          <div className="ml-2 p-4 bg-myPurple-disabled/40 rounded-md shadow-sm space-y-1">
            <p className="text-myPurple-primary">
              Nombre:{" "}
              <span className="font-medium">{appointment.pet.name}</span>
            </p>
            <p className="text-myPurple-primary">
              Raza: <span className="font-medium">{appointment.pet.race}</span>
            </p>
            <p className="text-myPurple-primary">
              Dueño:{" "}
              <span className="font-medium">{appointment.pet.owner.name}</span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-myPink-focus font-semibold mb-2">
            Empleados encargados
          </p>
          <ul className="ml-2 space-y-2">
            {appointment.employees ? appointment.employees.map((emp) => (
              <li key={emp.id} className="flex items-center text-myPurple-primary text-sm">
                <span className="w-2 h-2 rounded-full bg-myPink-tertiary mr-2"></span>
                {emp.name}
              </li>
            )) : appointment.employee ? 
            (<li className="flex items-center text-myPurple-primary text-sm">
                <span className="w-2 h-2 rounded-full bg-myPink-tertiary mr-2"></span>
                {appointment.employee.name}
              </li>)  
            : 
            (
              <li className="text-myPurple-primary text-sm">No hay empleados asignados</li>
            )}
          </ul>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-md bg-myPink-primary text-white font-semibold shadow-md hover:bg-myPink-hover focus:outline-none focus:ring-2 focus:ring-myPink-focus transition duration-200"
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-b border-myPurple-tertiary/30 pb-3">
      <p className="text-myPink-focus font-semibold">{title}</p>
      <p className="text-myPurple-primary">{value}</p>
    </div>
  );
}
