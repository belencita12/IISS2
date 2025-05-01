"use client";

import { AppointmentData } from "@/lib/appointment/IAppointment";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { completeAppointment, cancelAppointment } from "@/lib/appointment/service";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AppointmentCardProps {
  appointment: AppointmentData;
  token: string;
  onChange?: () => void;
}

const AppointmentCard = ({ appointment, token, onChange }: AppointmentCardProps) => {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleViewDetail = () => {
    if (appointment.id) {
      router.push(`/dashboard/appointment/${appointment.id}`);
    }
  };

  const handleStatusChange = async (action: "complete" | "cancel") => {
    if (action === "complete") setIsCompleting(true);
    if (action === "cancel") setIsCancelling(true);

    try {
      if (action === "complete") {
        await completeAppointment(appointment.id, token);
      } else {
        await cancelAppointment(appointment.id, token);
      }

      toast("success", `Cita ${action === "complete" ? "finalizada" : "cancelada"} con éxito`);
      onChange?.();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast("error", error.message);
      } else {
        toast("error", "Ocurrió un error");
      }
    } finally {
      setIsCompleting(false);
      setIsCancelling(false);
    }
  };

  return (
    <div
      onClick={handleViewDetail}
      className="cursor-pointer border p-4 rounded-lg flex justify-between items-start bg-white shadow hover:-translate-y-1 transition-transform duration-300 hover:shadow-md"
    >
      <div>
        <h3 className="font-bold text-lg">
          Servicio de {appointment.service ?? "Servicio no especificado"}
        </h3>
        <p>Dueño: {appointment.pet?.owner?.name ?? "Dueño desconocido"}</p>
        <p>Animal: {appointment.pet?.race ?? "Especie no especificada"}</p>
        <p>Detalles: {appointment.details ?? "Detalles no especificados"}</p>

        {appointment.status === "PENDING" && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange("complete");
              }}
              disabled={isCompleting || isCancelling}
              className="px-3 py-1 bg-white text-black rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              {isCompleting ? "Finalizando..." : "Finalizar"}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange("cancel");
              }}
              disabled={isCancelling || isCompleting}
              className="px-3 py-1 bg-black text-white rounded border border-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              {isCancelling ? "Cancelando..." : "Cancelar"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-black text-lg font-bold">
          {appointment.designatedDate ? formatDate(appointment.designatedDate) : ""}
        </p>
        <p className="text-sm text-gray-500">{appointment.status}</p>
      </div>
    </div>
  );
};

export default AppointmentCard;
