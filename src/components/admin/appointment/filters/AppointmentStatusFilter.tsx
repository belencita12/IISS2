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

  return (
    <div className="space-y-2">
      <Label>Estado de la cita</Label>
      <Select
        value={filters.status ?? "ALL"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="max-w-full ">
          <SelectValue placeholder="Seleccione estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="PENDING">Pendiente</SelectItem>
          <SelectItem value="COMPLETED">Finalizada</SelectItem>
          <SelectItem value="CANCELLED">Cancelada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppointmentStatusFilter;
