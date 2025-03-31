import React from "react";
import { Card } from "@/components/ui/card";
import { StockDetailsData, StockData } from "@/lib/stock/IStock";

interface StockListProps {
  stockDetails: StockDetailsData[];
  stocks: StockData[];
  isLoading: boolean;
}

const ProductStockList: React.FC<StockListProps> = ({ 
  stockDetails, 
  stocks, 
  isLoading 
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (stockDetails.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No disponible en ninguna sucursal
      </div>
    );
  }

// Agrupar detalles por stockId y sumar las cantidades
const groupedDetails = Object.values(
  stockDetails.reduce((acc, detail) => {
    // Si ya existe una entrada para este stockId en el acumulador
    if (acc[detail.stockId]) {
      // Sumar la cantidad del detalle actual al total acumulado
      acc[detail.stockId].amount += detail.amount;
    } else {
      // Si no existe, se agrega el detalle al acumulador
      acc[detail.stockId] = { ...detail };
    }
    return acc; 
  }, {} as Record<string, StockDetailsData>) 
);

  return (
    <div className="w-full mx-auto">
      {groupedDetails.map((detail, index) => {
        const matchedStock = stocks.find((s) => s.id === detail.stockId);
        return matchedStock ? (
          <Card 
            key={`${matchedStock.id}-${index}`} 
            className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex p-3 justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{matchedStock.name}</h3>
                <p className="text-sm text-gray-500">{matchedStock.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{detail.amount} Unids.</p>
              </div>
            </div>
          </Card>
        ) : null;
      })}
    </div>
  );
};

export default ProductStockList;
