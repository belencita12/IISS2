import React from "react";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="mb-4 p-7 border border-gray-700 shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-3">
          <h2 className="text-xl font-bold">{providerName || "Proveedor"}</h2>
          <p className="text-sm text-gray-500">
            Costo Total: {total?.toLocaleString() || 0} Gs.
          </p>
          <p className="text-sm text-gray-500">
            Costo IVA Total: {ivaTotal?.toLocaleString() || 0} Gs.
          </p>
        </div>
        <span className="text-base font-bold text-black">{date}</span>
      </div>
    </Card>
  );
};

export default PurchaseProviderCard;
