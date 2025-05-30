"use client";

import { Label } from "@/components/ui/label";
import { AppointmentQueryParams } from "@/lib/appointment/IAppointment";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  filters: AppointmentQueryParams;
  setFilters: (val: AppointmentQueryParams) => void;
}

export default function AppointmentDateFilter({ filters, setFilters }: Props) {
  const [startDate, setStartDate] = useState(filters.fromDesignatedDate ?? "");
  const [endDate, setEndDate] = useState(filters.toDesignatedDate ?? "");

  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const f = useTranslations("Filters");

  const adjustEndDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    date.setDate(date.getDate());

    /*const adjustedFrom =
      debouncedFrom && !isNaN(new Date(debouncedFrom).getTime())
        ? (() => {
            const date = new Date(debouncedFrom);
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0, 0); 
            return date.toISOString();
          })()
        : undefined;*/


    return date.toISOString().split("T")[0];
  };

  const isEndDateBeforeStart =
    startDate && endDate && endDate < startDate;

  const endDateError = isEndDateBeforeStart
    ? f("errorDate")
    : null;

  useEffect(() => {
    if (
      filters.fromDesignatedDate !== debouncedStartDate ||
      filters.toDesignatedDate !== debouncedEndDate
    ) {
      setFilters({
        ...filters,
        fromDesignatedDate: debouncedStartDate || undefined,
        toDesignatedDate: adjustEndDate(debouncedEndDate) || undefined,
      });
    }
  }, [debouncedStartDate, debouncedEndDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startDate">{f("fromDate")}</Label>
        <input
          id="startDate"
          type="date"
          className={clsx(
            "w-full border px-3 py-2 rounded",
          )}
          min="1900-01-01"
          max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() + 5); return d.toISOString().split('T')[0]; })()}
          value={startDate || ""}
          onChange={(e) => {
            const value = e.target.value;
            setStartDate(value);
            if (endDate && value > endDate) {
              setEndDate("");
            }
          }}
          onBlur={(e) => {
            const min = "1900-01-01";
            const max = (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 5); return d.toISOString().split('T')[0]; })();
            let value = e.target.value;
            if (value && (value < min || value > max)) {
              value = value < min ? min : max;
              setStartDate(value);
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">{f("toDate")}</Label>
        <input
          id="endDate"
          type="date"
          className={clsx(
            "w-full border px-3 py-2 rounded",
            endDateError && "border-red-500"
          )}
          min={startDate || "1900-01-01"}
          max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() + 5); return d.toISOString().split('T')[0]; })()}
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={(e) => {
            const min = startDate || "1900-01-01";
            const max = (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 5); return d.toISOString().split('T')[0]; })();
            let value = e.target.value;
            if (value && (value < min || value > max)) {
              value = value < min ? min : max;
              setEndDate(value);
            }
          }}
        />
        {endDateError && (
          <p className="text-red-600 text-sm mt-1">{endDateError}</p>
        )}
      </div>
    </div>
  );
}
