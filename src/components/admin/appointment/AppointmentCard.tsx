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

const AppointmentCard = ({
  appointment,
  isProcessing = false,
  onOpenModal,
}: AppointmentCardProps) => {
  const router = useRouter();

  const t = useTranslations();

  const statusTranslations: Record<string, string> = {
    PENDING: t("appointmentStatus.pending"),
    COMPLETED: t("appointmentStatus.completed"),
    CANCELLED: t("appointmentStatus.cancelled"),
  };


  const handleViewDetail = () => {
    if (isProcessing) return;
    if (appointment.id) {
      router.push(`/dashboard/appointment/${appointment.id}`);
    }
  };

  return (
    <div
      data-testid="appointment-card"
      onClick={handleViewDetail}
      className={`cursor-pointer border p-4 rounded-lg flex justify-between items-start bg-white shadow transition-transform duration-300 hover:shadow-md ${
        isProcessing ? "opacity-50 pointer-events-none" : "hover:-translate-y-1"
      }`}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">
          {t("appointmentDetails.service")}{appointment.services?.length !== 1 ? "s" : ""}:{" "}
          {appointment.services?.map((s) => s.name).join(", ") ||
            t("error.noSpecified")}
        </h3>

        <p>{t("appointmentDetails.petDetails.owner")}: {appointment.pet?.owner?.name ?? t("error.notFound")}</p>
        <p>{t("appointmentDetails.petDetails.race")}: {appointment.pet?.race ?? t("error.noSpecified")}</p>
        <p>{t("appointmentDetails.details")}: {appointment.details ?? t("error.noSpecified")}</p>
        <p>Veterinario: {appointment.employee?.name}</p>
        <p className="text-sm text-gray-500 font-semibold">
          {t("appointmentDetails.status")}: {statusTranslations[appointment.status] ?? appointment.status}
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
              { t("button.finish")}
            </Button>
            <Button
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal?.(appointment, "cancel");
              }}
              className="px-3 py-1 bg-black text-white rounded border border-gray-300 hover:bg-gray-800"
            >
              { t("button.cancel")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
