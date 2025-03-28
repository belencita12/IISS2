"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPositionById } from "@/lib/work-position/getPositionById";
import { Position } from "@/lib/work-position/IPosition";
import { toast } from "@/lib/toast";

const WEEKDAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function PositionDetail({ token }: { token: string }) {
  const { id } = useParams();
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await getPositionById(Number(id), token);
        setPosition(response);
      } catch (error) {
        toast("error", "Error al cargar los detalles del puesto");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <p className="p-4">Cargando detalles...</p>;
  if (!position) return <p className="p-4 text-red-500">No se encontró el puesto</p>;

  return (
    <div className="px-8 py-6 w-full">
      <h1 className="text-4xl font-bold mb-10">{position.name}</h1>

      <h2 className="text-2xl font-semibold mb-4">Turnos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Día de la semana</th>
              <th className="p-3">Inicio</th>
              <th className="p-3">Fin</th>
            </tr>
          </thead>
          <tbody>
            {position.shifts?.map((shift) => (
              <tr key={shift.id} className="border-b">
                <td className="p-3">
                  {Array.isArray(shift.weekDay)
                    ? shift.weekDay.map((day) => WEEKDAYS[day]).join(", ")
                    : WEEKDAYS[shift.weekDay]}
                </td>
                <td className="p-3">{shift.startTime}</td>
                <td className="p-3">{shift.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
