import { ServiceType } from "@/lib/appointment/IAppointment";
import { useTranslations } from "next-intl";

type ServiceSelectedProps = {
  service: ServiceType;
};

export default function ServiceSelected({ service }: ServiceSelectedProps) {
  const a = useTranslations("AppointmentForm");
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p><strong>{a("serviceSelected")}:</strong> {service.name}</p>
      <p><strong>{a("price")}:</strong> {service.price.toLocaleString()} Gs.</p>
    </div>
  );
}
