"use client";

import { useEffect, useState } from "react";
import { UserPlus, Check } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ServiceType } from "@/lib/appointment/IAppointment";
import { SERVICE_TYPE } from "@/lib/urls";
import { useFetch } from "@/hooks/api";

type ServiceSelectProps = {
  onSelectServices: (services: ServiceType[]) => void;
  selectedServices: ServiceType[];
  token: string;
  userRole?: string;
};

type ServiceResponse = {
  data: ServiceType[];
};

export default function ServiceSelect({
  onSelectServices,
  selectedServices,
  token,
  userRole,
}: ServiceSelectProps) {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [open, setOpen] = useState(false);

  const { data, get } = useFetch<ServiceResponse>("", token);

  useEffect(() => {
    get(undefined, `${SERVICE_TYPE}?page=1&size=100`);
  }, []);

  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  // Check if a service is selected
  const isSelected = (serviceId: number | undefined) => {
    if (serviceId === undefined) return false;
    return selectedServices.some(s => s.id === serviceId);
  };

  // Toggle service selection
  const toggleService = (service: ServiceType) => {
    if (!service.id) return;
    
    const isCurrentlySelected = isSelected(service.id);
    let newSelectedServices: ServiceType[];
    
    if (isCurrentlySelected) {
      // Remove service if already selected
      newSelectedServices = selectedServices.filter(s => s.id !== service.id);
    } else {
      // Add service if not selected
      newSelectedServices = [...selectedServices, service];
    }
    
    onSelectServices(newSelectedServices);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              aria-expanded={open}
            >
              {selectedServices.length === 0 
                ? "Seleccionar servicios" 
                : `${selectedServices.length} servicio${selectedServices.length > 1 ? 's' : ''} seleccionado${selectedServices.length > 1 ? 's' : ''}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar servicio..." />
              <CommandList>
                <CommandEmpty>No se encontraron servicios.</CommandEmpty>
                <CommandGroup>
                  {services.map((service) => (
                    <CommandItem
                      key={service.id}
                      value={service.name}
                      onSelect={() => toggleService(service)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{service.name}</span>
                      {isSelected(service.id) && <Check className="h-4 w-4 text-green-600" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {userRole !== "USER" && (
          <Link
            href={"/dashboard/service/register"}
            target="_blank"
            className="flex items-center justify-center rounded-md border border-muted bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
