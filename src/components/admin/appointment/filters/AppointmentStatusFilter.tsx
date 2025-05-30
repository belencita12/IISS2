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

  const t = useTranslations();
  return (
    <div className="space-y-2">
      <Label>{t("filters.appointmentStatus")}</Label>
      <Select
        value={filters.status ?? "ALL"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="max-w-full ">
          <SelectValue placeholder={t("placeholder.select")}/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("filters.all")}</SelectItem>
          <SelectItem value="PENDING">{t("appointmentStatus.pending")}</SelectItem>
          <SelectItem value="COMPLETED">{t("appointmentStatus.completed")}</SelectItem>
          <SelectItem value="CANCELLED">{t("appointmentStatus.cancelled")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppointmentStatusFilter;
