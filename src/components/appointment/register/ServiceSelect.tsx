"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import SearchBar from "@/components/global/SearchBar";
import type { ServiceType } from "@/lib/appointment/IAppointment";
import { useFetch } from "@/hooks/api";
import { SERVICE_TYPE } from "@/lib/urls";
import { toast } from "@/lib/toast";

type ServiceSelectProps = {
  onSelectService: (service: ServiceType) => void;
  token: string;
  userRole?: string;
};

interface ServiceTypeApiResponse {
  data: ServiceType[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
}

export default function ServiceSelect({
  onSelectService,
  token,
  userRole,
}: ServiceSelectProps) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { data, loading: isLoading, get } = useFetch<ServiceTypeApiResponse>(SERVICE_TYPE, token);

  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  const fetchServices = async (search?: string) => {
    try {
      const url = search 
        ? `${SERVICE_TYPE}?page=1&name=${encodeURIComponent(search)}` 
        : `${SERVICE_TYPE}?page=1`;
      
      await get(undefined, url);
    } catch (err) {
      toast("error", "Error al cargar servicios");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchServices(query);
  };

  const handleSelectService = (service: ServiceType) => {
    setSelectedService(service);
    onSelectService(service);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-2 w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full h-11 justify-between border-myPurple-tertiary focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200"
            >
              {selectedService ? (
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-start">
                  Selecciona otro servicio
                </div>
              ) : (
                <span>Selecciona al menos un servicio</span>
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 shadow-lg border-myPurple-tertiary/30 w-[var(--radix-popover-trigger-width)] max-w-[95vw]"
            align="start"
            side="bottom"
            sideOffset={5}
            avoidCollisions={false}
          >
            <Command>
              <div className="flex items-center border-b px-2 pt-2 sticky top-0 bg-white z-10">
                <div className="w-full pb-2">
                  <SearchBar
                    onSearch={handleSearchChange}
                    placeholder="Buscar por nombre..."
                    debounceDelay={500}
                    defaultQuery={searchQuery}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Cargando servicios...
                </div>
              ) : (
                <>
                  <CommandEmpty>No se encontraron servicios</CommandEmpty>
                  <CommandGroup>
                    <CommandList className="max-h-[250px] overflow-y-auto">
                      {services.map((service) => (
                        <CommandItem
                          key={service.id}
                          value={service.name}
                          onSelect={() => handleSelectService(service)}
                          className="px-4 py-2 cursor-pointer hover:bg-myPurple-disabled/50"
                        >
                          <div className="flex items-center w-full">
                            <span className="font-medium truncate">{service.name}</span>
                            {selectedService?.id === service.id && (
                              <Check className="ml-auto h-4 w-4 text-myPurple-primary" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </>
              )}
            </Command>
          </PopoverContent>
        </Popover>

        {userRole !== "USER" && (
          <Link
            href={"/dashboard/service/register"}
            target="_blank"
            className="flex items-center justify-center rounded-md border border-myPurple-tertiary bg-white p-2 text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus focus:outline-none focus:ring-2 focus:ring-myPurple-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors duration-200 flex-shrink-0"
          >
            <UserPlus className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}