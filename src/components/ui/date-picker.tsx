"use client";

import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { format, Locale } from "date-fns";
import { es } from "date-fns/locale";
import clsx from "clsx";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  locale?: Locale;
  label?: string;
  error?: string;
  min?: string;
  max?: string;
}

export function DatePicker({
  date,
  setDate,
  locale = es,
  label,
  error,
  min,
  max,
}: DatePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setDate(undefined);
      return;
    }
    setDate(new Date(value));
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          type="date"
          value={date ? format(date, "dd-MM-yyyy") : ""}
          onChange={handleDateChange}
          className={clsx(
            "w-full border px-3 py-2 rounded pr-10",
            error && "border-red-500"
          )}
          min={min}
          max={max}
          placeholder={label ? label : "Selecciona una fecha"}
          title={label ? label : "Selecciona una fecha"}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
} 