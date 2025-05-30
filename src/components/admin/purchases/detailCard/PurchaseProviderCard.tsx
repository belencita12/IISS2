import React from "react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * Componente para mostrar la información del proveedor y un resumen de la compra.
 * Muestra el nombre del proveedor, costos totales, IVA y fecha de la compra.
 */
interface PurchaseProviderCardProps {
  providerName?: string;
  total?: number;
  ivaTotal?: number;
  date?: string;
}

const PurchaseProviderCard: React.FC<PurchaseProviderCardProps> = ({
  providerName,
  total,
  ivaTotal,
  date,
}) => {

  const p = useTranslations("PurchaseDetail");

  return (
    <Card className="mb-4 p-4 sm:p-6 lg:p-7 border-border/100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-2">
        
        <div className="flex-shrink-0 order-1 sm:order-2">
          <span className="text-sm sm:text-base font-bold text-gray-500 block text-left sm:text-right">
            {date ? formatDate(date) : ""}
          </span>
        </div>
        
        <div className="space-y-2 sm:space-y-3 flex-1 order-2 sm:order-1">
          <h2 className="text-lg sm:text-xl font-bold">
            {providerName || "Proveedor"}
          </h2>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm text-gray-500">
              {p("totalCost")}: {total?.toLocaleString() || 0} {p("gs")}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {p("totalCostIva")}: {ivaTotal?.toLocaleString() || 0} {p("gs")}
            </p>
          </div>
        </div>
        
      </div>
    </Card>
  );
};

export default PurchaseProviderCard;