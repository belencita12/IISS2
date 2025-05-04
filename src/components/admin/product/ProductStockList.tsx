"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { StockDetailsData, StockData } from "@/lib/stock/IStock";
import { Eye } from "lucide-react";

interface Row {
  id: number;
  name: string;
  address: string;
  amount: number;
}

interface StockListProps {
  stockDetails: StockDetailsData[];
  stocks: StockData[];
  isLoading: boolean;
}

export default function ProductStockList({
  stockDetails,
  stocks,
  isLoading,
}: StockListProps) {
  const router = useRouter();

  const rows: Row[] = stockDetails
    .map((detail) => {
      const stock = stocks.find((s) => s.id === detail.stockId);
      if (!stock) return null;
      return {
        id: stock.id,
        name: stock.name,
        address: stock.address,
        amount: detail.amount,
      };
    })
    .filter((r): r is Row => r !== null);

  const columns: Column<Row>[] = [
    { header: "Nombre", accessor: "name", className: "text-left" },
    { header: "Dirección", accessor: "address", className: "text-left" },
    {
      header: "Cantidad",
      accessor: (item) => `${item.amount} Unids.`,
      className: "text-right",
    },
  ];

  const actions: TableAction<Row>[] = [
    {
      icon: <Eye size={16} />,
      onClick: (item) => router.push(`/dashboard/stock/${item.id}`),
      label: "Ver detalles",
    },
  ];

  return (
    <GenericTable
      data={rows}
      columns={columns}
      actions={actions}
      actionsTitle="Acciones"
      isLoading={isLoading}
      emptyMessage="No disponible en ninguna sucursal"
      className="w-full table-auto"
    />
  );
}
