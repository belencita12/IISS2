import type { ServiceType } from "@/lib/appointment/IAppointment";
import { useTranslations } from "next-intl";

type ServiceSelectedProps = {
  service: ServiceType;
};

export default function ServiceSelected({ service }: ServiceSelectedProps) {
  const a = useTranslations("AppointmentForm");
  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70 mt-1">
            {a("serviceSelected")}: {service.name}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
            {a("price")}: {service.price.toLocaleString()} Gs.
          </p>
        </div>
      </div>
    </div>
  );
}