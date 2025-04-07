"use client";

import { Card } from "@/components/global/Card";
import { MovementData } from "@/lib/movements/IMovements";

interface Props {
  movement: MovementData;
  token: string;
}

export default function MovementCard({ movement }: Props) {
  const fecha = new Date(movement.dateMovement).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Card
      title={
        movement.type === "INBOUND"
          ? "Movimiento Entrante"
          : movement.type === "OUTBOUND"
          ? "Movimiento Saliente"
          : "Transferencia entre Depósitos"
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
          <div>
            <p>
              <strong>
                {movement.manager?.fullName ?? "Encargado desconocido"} –{" "}
                {movement.manager?.ruc ?? "—"}
              </strong>
            </p>
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
