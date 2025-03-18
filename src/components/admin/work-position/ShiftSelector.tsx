"use client";

import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDayText, getDayValue, getAvailableDays } from "@/lib/work-position/utils/shifts";
import { Shift } from "@/lib/work-position/IPosition";

interface ShiftSelectorProps {
  index: number;
  shift: Shift;
  shifts: Shift[];
  control: any;
  onSelectDay: (value: string, index: number) => void;
}

export function ShiftSelector({index, shift,shifts,control, onSelectDay}: ShiftSelectorProps) {
  return (
    <Controller
      name={`shifts.${index}.weekDay`}
      control={control}
      render={() => (
        <Select
          onValueChange={(value) => onSelectDay(value, index)}
          value={getDayValue(shift.weekDay)}
        >
          <SelectTrigger className="w-full p-2 rounded-md border">
            <SelectValue placeholder="Seleccionar día">
              {getDayText(shift.weekDay)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekdays">Lunes a Viernes</SelectItem>
            <SelectItem value="weekdays_saturday">Lunes a Sábado</SelectItem>
            {getAvailableDays(shifts, index).map((day) => (
              <SelectItem key={day} value={String(day)}>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][day - 1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}