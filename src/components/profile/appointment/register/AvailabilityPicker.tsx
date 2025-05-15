"use client";

import { useEffect, useState } from "react";
import { getAvailability } from "@/lib/appointment/service";
import { AvailabilitySlot } from "@/lib/appointment/IAppointment";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

type AvailabilityPickerProps = {
  token: string;
  employeeId: string;
  date: string;
  serviceDuration: number;
  onSelectTime: (time: string) => void;
};

export function AvailabilityPicker({
  token,
  employeeId,
  date,
  serviceDuration,
  onSelectTime,
}: AvailabilityPickerProps) {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!employeeId || !date) return;
      
      setLoading(true);
      try {
        const slots = await getAvailability(token, employeeId, date);
        setAvailabilitySlots(slots);
        setSelectedTime(null); // Reset selected time when data changes
      } catch (error) {
        toast("error", "Error al obtener disponibilidad");
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [token, employeeId, date]);

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
  };

  if (loading) {
    return <div className="text-center py-4">Cargando disponibilidad...</div>;
  }

  if (!availabilitySlots.length) {
    return (
      <div className="text-center py-4 text-amber-600">
        No hay horarios disponibles para esta fecha. Por favor, seleccione otra fecha.
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Seleccione un horario:</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {availabilitySlots.map((slot) => (
          <Button
            key={slot.time}
            type="button"
            variant={selectedTime === slot.time ? "default" : "outline"}
            disabled={slot.isOcuppy}
            className={`${
              slot.isOcuppy ? "bg-gray-100 text-gray-400" : ""
            } ${selectedTime === slot.time ? "bg-black text-white" : ""}`}
            onClick={() => handleSelectTime(slot.time)}
          >
            {slot.time}
          </Button>
        ))}
      </div>
      {serviceDuration > 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Duración estimada: {serviceDuration} minutos
        </p>
      )}
    </div>
  );
}