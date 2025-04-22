"use client";

import { Label } from "@/components/ui/label";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  filters: GetInvoiceQueryParams;
  setFilters: (val: GetInvoiceQueryParams) => void;
}

export default function InvoiceDateFilter({ filters, setFilters }: Props) {
  const [startDate, setStartDate] = useState(filters.fromIssueDate ?? "");
  const [endDate, setEndDate] = useState(filters.toIssueDate ?? "");

  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const adjustEndDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // suma un día
    return date.toISOString().split("T")[0]; // solo YYYY-MM-DD
  };
  

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
          className="w-full border px-3 py-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">Fecha hasta</Label>
        <input
          id="endDate"
          type="date"
          className="w-full border px-3 py-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
}
