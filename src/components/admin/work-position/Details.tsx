"use client";

import { Position } from "@/lib/work-position/IPosition";
import { WEEKDAYS } from "@/constants/workPositions.constants";

interface Props {
  position: Position;
}

export default function PositionDetail({ position }: Props) {
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
