import type { ServiceType } from "@/lib/appointment/IAppointment";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

type ServiceSelectedProps = {
  service: ServiceType;
  onRemove?: () => void;
};

export default function ServiceSelected({ service, onRemove }: ServiceSelectedProps) {
  const a = useTranslations("AppointmentForm");

  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70">
            {a("serviceSelected")}: {service.name}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
            {a("price")}: {service.price.toLocaleString()} Gs.
          </p>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            type="button"
            className="hover:text-myPink-focus transition"
            aria-label="Eliminar servicio"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
