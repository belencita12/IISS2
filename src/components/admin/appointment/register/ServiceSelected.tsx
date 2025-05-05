import { ServiceType } from "@/lib/appointment/IAppointment";

type ServiceSelectedProps = {
  service: ServiceType;
};

export default function ServiceSelected({ service }: ServiceSelectedProps) {
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p><strong>Servicio:</strong> {service.name}</p>
      <p><strong>Precio:</strong> {service.price.toLocaleString()} Gs.</p>
    </div>
  );
}
