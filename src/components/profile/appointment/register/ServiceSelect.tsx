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
import type { ServiceType } from "@/lib/appointment/IAppointment";
import { SERVICE_TYPE } from "@/lib/urls";
import { useFetch } from "@/hooks/api";

type ServiceSelectProps = {
  onSelectService: (service: ServiceType) => void;
  token: string;
  userRole?: string;
};

type ServiceResponse = {
  data: ServiceType[];
};

export default function ServiceSelect({
  onSelectService,
  token,
  userRole,
}: ServiceSelectProps) {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedServiceName, setSelectedServiceName] = useState<string>("");

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
      setSelectedServiceName(selectedService.name);
      onSelectService(selectedService);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-full border-myPurple-tertiary focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200">
            {selectedServiceName ? (
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-start">
                {selectedServiceName}
              </div>
            ) : (
              <SelectValue placeholder="Selecciona un servicio" />
            )}
          </SelectTrigger>
          <SelectContent className="border-myPurple-tertiary">
            {services.map((service) => (
              <SelectItem
                key={service.id}
                value={String(service.id)}
                className="focus:bg-myPurple-disabled/50"
              >
                <div className="flex flex-col py-1">
                  <p className="font-medium">{service.name}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {userRole !== "USER" && (
          <Link
            href={"/dashboard/service/register"}
            target="_blank"
            className="flex items-center justify-center rounded-md border border-myPurple-tertiary bg-white p-2 text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus focus:outline-none focus:ring-2 focus:ring-myPurple-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}