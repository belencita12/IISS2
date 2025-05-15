"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceType } from "@/lib/appointment/IAppointment";
import { SERVICE_TYPE } from "@/lib/urls";
import { useFetch } from "@/hooks/api";
import { Checkbox } from "@/components/ui/checkbox";

type ServiceSelectProps = {
  token: string;
  userRole: string;
  onSelectService: (service: ServiceType) => void;
  selectedServiceIds: number[];
};

type ServiceResponse = {
  data: ServiceType[];
};

export default function ServiceSelect({ 
  token, 
  userRole, 
  onSelectService,
  selectedServiceIds
}: ServiceSelectProps) {
  const [services, setServices] = useState<ServiceType[]>([]);
  const { data, get } = useFetch<ServiceResponse>("", token);

  useEffect(() => {
    get(undefined, `${SERVICE_TYPE}?page=1&size=100`);
  }, []);

  useEffect(() => {
    if (data?.data) {
      // Para usuarios normales, solo mostrar servicios públicos
      if (userRole === "CLIENT") {
        setServices(data.data.filter((service) => service.isPublic));
      } else {
        // Para admin y empleados, mostrar todos los servicios
        setServices(data.data);
      }
    }
  }, [data, userRole]);

  return (
    <div className="max-h-60 overflow-y-auto border rounded-md p-2">
      {services.map((service) => (
        <div key={service.id} className="flex items-center space-x-2 py-2 border-b last:border-0">
          <Checkbox 
            id={`service-${service.id}`} 
            checked={service.id ? selectedServiceIds.includes(service.id) : false}
            onCheckedChange={() => onSelectService(service)}
          />
          <label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                {service.description} - {service.durationMin} min
              </p>
              <p className="text-sm">
                <span className="font-medium">S/. {service.price.toFixed(2)}</span>
              </p>
            </div>
          </label>
        </div>
      ))}
      {services.length === 0 && (
        <div className="py-2 text-center text-gray-500">No hay servicios disponibles</div>
      )}
    </div>
  );
}