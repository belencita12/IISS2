"use client";

import { AppointmentData } from "@/lib/appointment/IAppointment";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppointmentCardProps {
  appointment: AppointmentData;
  token: string;
  onChange?: () => void;
  isProcessing?: boolean;
  setIsProcessing?: (value: boolean) => void;
  onOpenModal?: (appointment: AppointmentData, action: "complete" | "cancel") => void;
}

const statusTranslations: Record<string, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Finalizada",
  CANCELLED: "Cancelada",
};

const AppointmentCard = ({
  appointment,
  isProcessing = false,
  onOpenModal,
}: AppointmentCardProps) => {
  const router = useRouter();

  const handleViewDetail = () => {
    if (isProcessing) return;
    if (appointment.id) {
      router.push(`/dashboard/appointment/${appointment.id}`);
    }
  };

  return (
    <div
      onClick={handleViewDetail}
      className={`cursor-pointer border p-4 rounded-lg flex justify-between items-start bg-white shadow transition-transform duration-300 hover:shadow-md ${
        isProcessing ? "opacity-50 pointer-events-none" : "hover:-translate-y-1"
      }`}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">
          Servicio de{" "}
          {appointment.services?.length
            ? appointment.services.map((s) => s.name).join(", ")
            : "Servicio no especificado"}
        </h3>
        <p>Dueño: {appointment.pet?.owner?.name ?? "Dueño desconocido"}</p>
        <p>Animal: {appointment.pet?.race ?? "Especie no especificada"}</p>
        <p>Detalles: {appointment.details ?? "Detalles no especificados"}</p>
        <p className="text-sm text-gray-500 font-semibold">
          Estado: {statusTranslations[appointment.status] ?? appointment.status}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between h-full gap-2">
        <p className="text-black text-lg font-bold text-right">
          {appointment.designatedDate ? formatDate(appointment.designatedDate) : ""}
        </p>

        {appointment.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal?.(appointment, "complete");
              }}
              className="px-3 py-1 bg-white text-black rounded border border-gray-300 hover:bg-gray-100"
            >
              { "Finalizar"}
            </Button>
            <Button
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal?.(appointment, "cancel");
              }}
              className="px-3 py-1 bg-black text-white rounded border border-gray-300 hover:bg-gray-800"
            >
              { "Cancelar"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
