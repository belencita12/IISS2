"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceType } from "@/lib/appointment/IAppointment";
import { SERVICE_TYPE} from "@/lib/urls";
import { useFetch } from "@/hooks/api";

type ServiceSelectProps = {
  onSelectService: (service: ServiceType) => void;
  token: string;
};

type ServiceResponse = {
  data: ServiceType[];
};

export default function ServiceSelect({
  onSelectService,
  token,
}: ServiceSelectProps) {
  const [services, setServices] = useState<ServiceType[]>([]);

  const { data, get } = useFetch<ServiceResponse>("", token);

  useEffect(() => {
    get(undefined, `${SERVICE_TYPE}?page=1&size=100`);
  }, []);

  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  const handleSelect = (serviceId: string) => {
    const selectedService = services.find((s) => s.id === Number(serviceId));
    if (selectedService) {
      onSelectService(selectedService);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un servicio" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={String(service.id)}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Link
          href={"/dashboard/service/register"}
          target="_blank"
          className="flex items-center justify-center rounded-md border border-muted bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
