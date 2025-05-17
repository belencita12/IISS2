"use client";

import { useEffect, useState } from "react";
import { getAvailability } from "@/lib/appointment/service";
import type { AvailabilitySlot } from "@/lib/appointment/IAppointment";
import { toast } from "@/lib/toast";
import { isToday, set, parseISO, addMinutes } from "date-fns";
import { Clock } from "lucide-react";

type Props = {
  token: string;
  employeeId: string;
  date: string;
  onSelectTime: (time: string) => void;
  serviceDuration: number; // duración del servicio en minutos
};

export const AvailabilityPicker = ({
  token,
  employeeId,
  date,
  onSelectTime,
  serviceDuration,
}: Props) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId || !date) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const data = await getAvailability(token, employeeId, date);
        setSlots(data);
      } catch (error) {
        toast(
          "error",
          error instanceof Error
            ? error.message
            : "Error al cargar disponibilidad"
        );
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [employeeId, date, token]);

  const handleSelect = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
  };

  const now = new Date();
  const selectedDate = parseISO(date);
  const isTodaySelected = isToday(selectedDate);

  const isSlotValid = (slot: AvailabilitySlot, index: number): boolean => {
    if (slot.isOcuppy) return false;

    const [startHour, startMinute] = slot.time.split(":").map(Number);
    const slotStart = set(selectedDate, {
      hours: startHour,
      minutes: startMinute,
      seconds: 0,
      milliseconds: 0,
    });

    if (isTodaySelected && slotStart.getTime() <= now.getTime()) {
      return false;
    }

    const slotEnd = addMinutes(slotStart, serviceDuration);

    // Definimos los bloques de trabajo
    const workPeriods = [
      {
        start: set(selectedDate, {
          hours: 8,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
        end: set(selectedDate, {
          hours: 12,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
      },
      {
        start: set(selectedDate, {
          hours: 14,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
        end: set(selectedDate, {
          hours: 18,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
      },
    ];

    // Verifica si el rango de tiempo cae dentro de alguno de los bloques
    const fitsInWorkPeriod = workPeriods.some(
      ({ start, end }) => slotStart >= start && slotEnd <= end
    );

    if (!fitsInWorkPeriod) return false;

    // Verifica que ningún slot intermedio esté ocupado
    for (let i = index; i < slots.length; i++) {
      const currentSlot = slots[i];
      const [hour, minute] = currentSlot.time.split(":").map(Number);
      const currentSlotTime = set(selectedDate, {
        hours: hour,
        minutes: minute,
        seconds: 0,
        milliseconds: 0,
      });

      if (currentSlotTime >= slotEnd) break;

      if (currentSlot.isOcuppy) return false;
    }

    return true;
  };

  if (!employeeId || !date) return null;

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="flex items-center justify-center p-4 bg-myPurple-disabled/30 rounded-md">
          <div className="animate-pulse flex items-center">
            <Clock className="h-4 w-4 mr-2 text-myPurple-primary" />
            <p className="text-myPurple-focus/70">
              Cargando horarios disponibles...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {slots.map((slot, index) =>
            isSlotValid(slot, index) ? (
              <button
                key={slot.time}
                type="button"
                onClick={() => handleSelect(slot.time)}
                className={`p-2 rounded-md border text-sm transition-all duration-200 ${
                  selectedTime === slot.time
                    ? "bg-myPurple-tertiary text-black border-myPurple-tertiary shadow-md"
                    : "bg-white border-myPurple-tertiary text-myPurple-focus hover:bg-myPurple-disabled hover:shadow-sm"
                }`}
              >
                {slot.time}
              </button>
            ) : null
          )}
        </div>
      )}
      {slots.length > 0 &&
        !slots.some((slot, index) => isSlotValid(slot, index)) && (
          <div className="p-3 bg-myPink-disabled/30 border border-myPink-tertiary rounded-md">
            <p className="text-myPink-focus text-sm flex items-center">
              <Clock className="h-4 w-4 mr-2 text-myPink-primary" />
              No hay horarios disponibles para esta fecha
            </p>
          </div>
        )}
    </div>
  );
};