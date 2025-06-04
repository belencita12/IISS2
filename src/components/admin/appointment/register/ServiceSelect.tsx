"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ServiceType } from "@/lib/appointment/IAppointment";
import { SERVICE_TYPE } from "@/lib/urls";
import { useFetch } from "@/hooks/api";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/global/SearchBar";

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
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [open, setOpen] = useState(false);
  const { data, get, loading} = useFetch<ServiceResponse>("", token);
  const t = useTranslations();

  const fetchServices = (query: string = "") => {
  setServices([]); 
  const params = new URLSearchParams({ page: "1", size: "100" });
  if (query.trim()) {
    params.append("name", query.trim());
  }
  get(undefined, `${SERVICE_TYPE}?${params.toString()}`);
};
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchServices(search);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  const handleSelect = (serviceId: string) => {
    const selected = services.find((s) => s.id === Number(serviceId));
    if (selected) {
      setSelectedService(selected);
      onSelectService(selected);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      setSearch("");
      fetchServices("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select onValueChange={handleSelect} open={open} onOpenChange={handleOpenChange}>
          <SelectTrigger className="w-full">
            {selectedService ? (
              <div>
                <span className="text-muted-foreground">{t("appointmentForm.serviceSelect.otherService")}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{t("appointmentForm.serviceSelect.selectOneService")}</span>
            )}
          </SelectTrigger>

          <SelectContent>
            <div className="px-2 pt-2">
              <SearchBar
                onSearch={(query) => setSearch(query)}
                placeholder={t("search.searchByName")}
                defaultQuery={search}
              />
              
            </div>
            {services.length > 0 ? (
              services.map((service) => (
                <SelectItem key={service.id} value={String(service.id)}>
                  {service.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                {loading ? t("button.loading") : t("error.notFoundServices")}
              </div>
            )}
          </SelectContent>
        </Select>

        {userRole !== "USER" && (
          <Link
            href={"/dashboard/settings/service-types/register"}
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
