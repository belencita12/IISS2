import React from "react";
import { Card } from "@/components/ui/card";

interface PurchaseProviderProps {
  providerName?: string;
  total?: number;
  ivaTotal?: number;
  date?: string;
  itemCount?: number;
}

const PurchaseProvider: React.FC<PurchaseProviderProps> = ({
  providerName,
  total,
  ivaTotal,
  date,
  itemCount,
}) => {
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const displayDate = date ? formatDate(date) : "N/A";

  return (
    <Card className="mb-4 p-5 border border-black">
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
        <span className="text-base font-bold text-black">{displayDate}</span>
      </div>
    </Card>
  );
};

export default PurchaseProvider;
