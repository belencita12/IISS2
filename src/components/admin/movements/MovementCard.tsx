"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/global/Card";
import { MovementData } from "@/lib/movements/IMovements";
import { getEmployeeByID } from "@/lib/employee/getEmployeeByID";
import { EmployeeData } from "@/lib/employee/IEmployee";

interface Props {
  movement: MovementData;
  token: string;
}

export default function MovementCard({ movement, token }: Props) {
  const [manager, setManager] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (movement.managerId) {
      getEmployeeByID(token, movement.managerId)
        .then((res) => {
          if (isMounted) setManager(res);
        })
        .catch((err) => console.error("Error cargando encargado:", err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [movement.managerId, token]);

  const fecha = new Date(movement.dateMovement).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Mostrar esqueleto o nada mientras se carga el encargado
  if (isLoading) {
    return (
      <div className="w-full h-[150px] rounded-lg border bg-gray-100 animate-pulse" />
    );
  }

  return (
    <Card
      title={
        movement.type === "INBOUND"
          ? "Transferencia"
          : "Vencimiento de Productos"
      }
      description=""
      alt="Movimiento"
      layout="horizontal"
      imagePosition="left"
      bgColor="bg-white"
      textColor="text-black"
      showButton={false}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        {/* Columna 1 */}
        <div className="text-sm text-gray-700 space-y-1 md:w-1/2">
          <p>Depósito Origen: {movement.originStock?.name || "—"}</p>
          <p>Depósito Destino: {movement.destinationStock?.name || "—"}</p>
          <div className="">
            <strong>
              {manager?.fullName ?? "Encargado desconocido"} –{" "}
              {manager?.ruc ?? "—"}
            </strong>
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col items-end text-right md:w-1/2">
          <span className="text-base md:text-lg font-semibold text-black">
            {fecha}
          </span>
          <p className="mt-1 text-sm text-gray-700">{movement.description}</p>
        </div>
      </div>
    </Card>
  );
}
