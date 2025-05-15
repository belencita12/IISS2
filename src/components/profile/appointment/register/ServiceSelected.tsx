import { ServiceType } from "@/lib/appointment/IAppointment";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ServiceSelectedProps = {
  service: ServiceType;
  onRemove: () => void;
};

export default function ServiceSelected({ service, onRemove }: ServiceSelectedProps) {
  return (
    <div className="flex justify-between items-center p-3 border rounded-md bg-slate-50 text-black text-sm">
      <div>
        <p>
          <strong>{service.name}</strong> - {service.durationMin} min
        </p>
        <p className="text-xs text-gray-600">{service.description}</p>
        <p className="mt-1">
          <strong>S/. {service.price.toFixed(2)}</strong>
        </p>
      </div>
      <Button 
        variant="ghost" 
        className="h-8 w-8 p-0" 
        onClick={onRemove}
        type="button"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Eliminar servicio</span>
      </Button>
    </div>
  );
}