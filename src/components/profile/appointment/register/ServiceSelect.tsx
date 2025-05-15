"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceType } from "@/lib/appointment/IAppointment";
import { SERVICE_TYPE } from "@/lib/urls";
import { useFetch } from "@/hooks/api";

type ServiceSelectProps = {
  token: string;
  userRole: string;
  onSelectService: (service: ServiceType) => void;
  selectedServiceIds: number[];
  className?: string;
};

type ServiceResponse = {
  data: ServiceType[];
};

export default function ServiceSelect({ 
  token, 
  userRole, 
  onSelectService,
  selectedServiceIds,
  className
}: ServiceSelectProps) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const { data, get } = useFetch<ServiceResponse>("", token);

  // Fetch services on component mount
  useEffect(() => {
    get(undefined, `${SERVICE_TYPE}?page=1&size=100`);
  }, []);

  // Filter services based on user role
  useEffect(() => {
    if (data?.data) {
      // For regular users, only show public services
      if (userRole === "CLIENT") {
        setServices(data.data.filter((service) => service.isPublic));
      } else {
        // For admin and employees, show all services
        setServices(data.data);
      }
    }
  }, [data, userRole]);

  // Calculate total selected services info
  const selectedServices = services.filter(
    (service) => service.id && selectedServiceIds.includes(service.id)
  );
  
  const totalSelectedCount = selectedServices.length;
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  // Toggle service selection
  const toggleService = (service: ServiceType) => {
    onSelectService(service);
  };

  return (
    <div className={cn("w-full relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto py-3 px-4 text-left"
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">Seleccionar Servicios</span>
              {totalSelectedCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {totalSelectedCount} {totalSelectedCount === 1 ? "servicio" : "servicios"} seleccionados - S/. {totalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="py-1">
            <div className="max-h-[300px] overflow-auto">
              {services.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No hay servicios disponibles
                </div>
              ) : (
                services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-2 w-full px-3 py-2 hover:bg-slate-50 cursor-pointer"
                    onClick={() => toggleService(service)}
                  >
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={service.id ? selectedServiceIds.includes(service.id) : false}
                      onCheckedChange={() => toggleService(service)}
                      className="h-4 w-4 mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-muted-foreground">{service.durationMin} min</span>
                        <span className="font-medium">S/. {service.price.toFixed(2)}</span>
                      </div>
                    </div>
                    {service.id && selectedServiceIds.includes(service.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}