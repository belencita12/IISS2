"use client";

import { AppointmentData } from "@/lib/appointment/IAppointment";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AppointmentCardProps {
  appointment: AppointmentData;
  token: string;
  onChange?: () => void;
  isProcessing?: boolean;
  setIsProcessing?: (value: boolean) => void;
  onOpenModal?: (
    appointment: AppointmentData,
    action: "complete" | "cancel"
  ) => void;
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

  const a = useTranslations("AppointmentDetail");
  const b = useTranslations("Button");
  const e = useTranslations("Error");


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
          Servicio{appointment.services?.length !== 1 ? "s" : ""}:{" "}
          {appointment.services?.map((s) => s.name).join(", ") ||
            e("noSpecified")}
        </h3>

        <p>{a("owner")}: {appointment.pet?.owner?.name ?? e("notFound")}</p>
        <p>{a("race")}: {appointment.pet?.race ?? e("noSpecified")}</p>
        <p>{a("details")}: {appointment.details ?? e("noSpecified")}</p>
        <p className="text-sm text-gray-500 font-semibold">
          {a("status")}: {statusTranslations[appointment.status] ?? appointment.status}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between h-full gap-2">
        <p className="text-black text-lg font-bold text-right">
          {appointment.designatedDate
            ? formatDate(appointment.designatedDate)
            : ""}
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
              { b("finish")}
            </Button>
            <Button
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal?.(appointment, "cancel");
              }}
              className="px-3 py-1 bg-black text-white rounded border border-gray-300 hover:bg-gray-800"
            >
              { b("cancel")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
