"use client";

import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import { VaccineRegistryFilters } from "@/hooks/vaccine-registry/useVaccineRegistryList";
import { XCircle } from "lucide-react";

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
  const [fromDate, setFromDate] = useState<string>(
    (filters[fromKey] as string) ?? ""
  );
  const [toDate, setToDate] = useState<string>(
    (filters[toKey] as string) ?? ""
  );

  const debouncedFrom: string = useDebounce(fromDate, 1000);
  const debouncedTo: string = useDebounce(toDate, 1000);

  const prevDebounced = useRef({ from: "", to: "" });

  const adjustEndDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  };

  useEffect(() => {
    const adjustedFrom =
      debouncedFrom && !isNaN(new Date(debouncedFrom).getTime())
        ? new Date(debouncedFrom).toISOString()
        : undefined;

    const adjustedTo =
      debouncedTo && !isNaN(new Date(debouncedTo).getTime())
        ? adjustEndDate(debouncedTo)
        : undefined;

    const prevFrom = prevDebounced.current.from;
    const prevTo = prevDebounced.current.to;

    if (prevFrom !== adjustedFrom || prevTo !== adjustedTo) {
      prevDebounced.current = {
        from: adjustedFrom ?? "",
        to: adjustedTo ?? "",
      };

      setFilters((prev) => {
        const updated: VaccineRegistryFilters = { ...prev };

        if (adjustedFrom) {
          updated[fromKey] = adjustedFrom;
        } else {
          delete updated[fromKey];
        }

        if (adjustedTo) {
          updated[toKey] = adjustedTo;
        } else {
          delete updated[toKey];
        }

        return updated;
      });
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
        <div className="relative">
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
            className="w-full border px-3 py-2 rounded pr-10"
          />
          {fromDate && (
            <button
              type="button"
              onClick={() => setFromDate("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Borrar"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${toKey}`}>Hasta ({label})</Label>
        <div className="relative">
          <input
            id={`${toKey}`}
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
            className={clsx(
              "w-full border px-3 py-2 rounded pr-10",
              errorMessage && "border-red-500"
            )}
          />
          {toDate && (
            <button
              type="button"
              onClick={() => setToDate("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Borrar"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
        {errorMessage && (
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
