"use client";

import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import { VaccineRegistryFilters } from "@/hooks/vaccine-registry/useVaccineRegistryList";

interface Props {
  label: string;
  fromKey: string;
  toKey: string;
  filters: VaccineRegistryFilters;
  setFilters: React.Dispatch<React.SetStateAction<VaccineRegistryFilters>>;
}


export default function VaccineRegistryDateFilter({
  label,
  fromKey,
  toKey,
  filters,
  setFilters,
}: Props) {
  const [fromDate, setFromDate] = useState<string>((filters[fromKey] as string) ?? "");
  const [toDate, setToDate] = useState<string>((filters[toKey] as string) ?? "");

  const debouncedFrom: string = useDebounce(fromDate, 500);
  const debouncedTo: string = useDebounce(toDate, 500);

  const prevDebounced = useRef({ from: "", to: "" });

  const adjustEndDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const adjustedTo = adjustEndDate(debouncedTo);

    // Solo actualizar si algo cambió
    if (
      prevDebounced.current.from !== debouncedFrom ||
      prevDebounced.current.to !== adjustedTo
    ) {
      prevDebounced.current = { from: debouncedFrom, to: adjustedTo };
      setFilters((prev) => ({
        ...prev,
        [fromKey]: debouncedFrom || undefined,
        [toKey]: adjustedTo || undefined,
      }));
    }
  }, [debouncedFrom, debouncedTo, fromKey, toKey, setFilters]);

  const isInvalidRange = fromDate && toDate && toDate < fromDate;
  const errorMessage = isInvalidRange
    ? "La fecha hasta no puede ser menor que la fecha desde."
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="space-y-2">
        <Label htmlFor={`${fromKey}`}>Desde ({label})</Label>
        <input
          id={`${fromKey}`}
          type="date"
          value={fromDate}
          onChange={(e) => {
            const value = e.target.value;
            setFromDate(value);
            if (toDate && value > toDate) {
              setToDate("");
            }
          }}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${toKey}`}>Hasta ({label})</Label>
        <input
          id={`${toKey}`}
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate || undefined}
          className={clsx(
            "w-full border px-3 py-2 rounded",
            errorMessage && "border-red-500"
          )}
        />
        {errorMessage && (
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
