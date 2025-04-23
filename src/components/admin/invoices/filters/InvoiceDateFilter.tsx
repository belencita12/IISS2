"use client";

import { Label } from "@/components/ui/label";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import clsx from "clsx";
import { Input } from "@/components/ui/input";

interface Props {
  filters: GetInvoiceQueryParams;
  setFilters: (val: GetInvoiceQueryParams) => void;
}

export default function InvoiceDateFilter({ filters, setFilters }: Props) {
  const [startDate, setStartDate] = useState(filters.fromIssueDate ?? "");
  const [endDate, setEndDate] = useState(filters.toIssueDate ?? "");

  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const today = new Date().toISOString().split("T")[0];

  const adjustEndDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const isStartDateInFuture =
  startDate && startDate > today;

  const isEndDateBeforeStart =
    startDate && endDate && endDate < startDate;

  const startDateError = isStartDateInFuture
    ? "La fecha no puede ser posterior a la actual."
    : null;

  const endDateError = isEndDateBeforeStart
    ? "La fecha hasta no puede ser menor que la fecha desde."
    : null;

  useEffect(() => {
    if (
      filters.fromIssueDate !== debouncedStartDate ||
      filters.toIssueDate !== debouncedEndDate
    ) {
      setFilters({
        ...filters,
        fromIssueDate: debouncedStartDate || undefined,
        toIssueDate: adjustEndDate(debouncedEndDate) || undefined,
      });
    }
  }, [debouncedStartDate, debouncedEndDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
  <Label htmlFor="startDate">Fecha desde</Label>
  <input
    id="startDate"
    type="date"
    className={clsx(
      "w-full border px-3 py-2 rounded",
      startDateError && "border-red-500"
    )}
    value={startDate}
    max={today}
    onChange={(e) => {
      const value = e.target.value;
      setStartDate(value);

      if (endDate && value > endDate) {
        setEndDate("");
      }
    }}
  />
  {startDateError && (
    <p className="text-red-600 text-sm mt-1">{startDateError}</p>
  )}
</div>

<div className="space-y-2">
  <Label htmlFor="endDate">Fecha hasta</Label>
  <input
    id="endDate"
    type="date"
    className={clsx(
      "w-full border px-3 py-2 rounded",
      endDateError && "border-red-500"
    )}
    value={endDate}
    min={startDate || undefined}
    max={today}
    onChange={(e) => setEndDate(e.target.value)}
  />
  {endDateError && (
    <p className="text-red-600 text-sm mt-1">{endDateError}</p>
  )}
</div>

</div>
  );
}
