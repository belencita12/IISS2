"use client";

import { Card } from "@/components/global/Card";
import { MovementData } from "@/lib/movements/IMovements";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  movement: MovementData;
  token: string;
}

export default function MovementCard({ movement }: Props) {

const t = useTranslations();

  return (
    <Card
      title={
        movement.type === "INBOUND"
          ? t("movement.type.inbound")
          : movement.type === "OUTBOUND"
          ? t("movement.type.outbound")
          : t("movement.type.transfer")
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
          <p>{t("movement.card.originStock", {origin: movement.originStock?.name || "—"})}</p>
          <p>{t("movement.card.destinationStock", {destination: movement.destinationStock?.name || "—"})}</p>
          <div>
            <p>
              <strong>
                {movement.manager?.fullName ?? t("error.noAsigned")} –{" "}
                {movement.manager?.ruc ?? "—"}
              </strong>
            </p>
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col items-end text-right md:w-1/2">
          <span className="text-base md:text-lg font-semibold text-black">
            {formatDate(movement.dateMovement)}
          </span>
          <p className="mt-1 text-sm text-gray-700">{movement.description}</p>
        </div>
      </div>
    </Card>
  );
}
