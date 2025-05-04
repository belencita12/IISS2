"use client";

import { useEffect, useState } from "react";
import { getAvailability } from "@/lib/appointment/service";
import { AvailabilitySlot } from "@/lib/appointment/IAppointment";
import { toast } from "@/lib/toast";

type Props = {
  token: string;
  employeeId: string;
  date: string;
  onSelectTime: (time: string) => void;
};

export const AvailabilityPicker = ({ token, employeeId, date, onSelectTime }: Props) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId || !date) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        console.log("Fetching availability with date:", date);
        const data = await getAvailability(token, employeeId, date);
        setSlots(data);
      } catch (error) {
        toast("error", error instanceof Error ? error.message : "Error al cargar disponibilidad");
      //  console.error("Error al cargar disponibilidad", error);
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

  if (!employeeId || !date) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Seleccionar horario disponible</h3>

      {loading ? (
        <p className="text-gray-500">Cargando horarios...</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {slots
            .filter((slot) => !slot.isOcuppy)
            .map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => handleSelect(slot.time)}
                className={`p-2 rounded-md border text-sm ${
                  selectedTime === slot.time
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                {slot.time}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
