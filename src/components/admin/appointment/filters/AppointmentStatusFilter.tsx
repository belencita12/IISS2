"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AppointmentQueryParams } from "@/lib/appointment/IAppointment";
import { useTranslations } from "next-intl";

interface AppointmentStatusFilterProps {
  filters: AppointmentQueryParams;
  setFilters: (filters: AppointmentQueryParams) => void;
}

const AppointmentStatusFilter: React.FC<AppointmentStatusFilterProps> = ({
  filters,
  setFilters,
}) => {
  const handleChange = (value: string) => {
    setFilters({
      ...filters,
      status: value === "ALL" ? undefined : (value as AppointmentQueryParams["status"]),
    });
  };

  const f = useTranslations("Filters")
  return (
    <div className="space-y-2">
      <Label>{f("statusAppointment")}</Label>
      <Select
        value={filters.status ?? "ALL"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="max-w-full ">
          <SelectValue placeholder="Seleccione estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{f("all")}</SelectItem>
          <SelectItem value="PENDING">{f("pending")}</SelectItem>
          <SelectItem value="COMPLETED">{f("finished")}</SelectItem>
          <SelectItem value="CANCELLED">{f("cancelled")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppointmentStatusFilter;
