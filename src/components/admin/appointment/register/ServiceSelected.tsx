import { ServiceType } from "@/lib/appointment/IAppointment";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

type ServiceSelectedProps = {
  service: ServiceType;
   onRemove?: () => void;
};

export default function ServiceSelected({ service, onRemove}: ServiceSelectedProps) {
  const t = useTranslations();
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p>{t("appointmentForm.selectedService.service", {service: service.name })} </p>
          <p>{t("appointmentForm.selectedService.price", {price : service.price.toLocaleString()})} </p>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            type="button"
            className="hover:text-ellipsis transition"
            aria-label="Eliminar servicio"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
