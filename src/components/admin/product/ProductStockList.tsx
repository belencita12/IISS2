"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { StockDetailsData, StockData } from "@/lib/stock/IStock";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

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
    { header: t("stock.details.name"), accessor: "name", className: "text-left" },
    { header: t("stock.details.address"), accessor: "address", className: "text-left" },
    {
      header: t("stock.details.quantity"),
      accessor: (item) => t("stock.details.uds", {quantity: item.amount}),
      className: "text-right",
    },
  ];

  const actions: TableAction<Row>[] = [
    {
      icon: <Eye size={16} />,
      onClick: (item) => router.push(`/dashboard/stock/${item.id}`),
      label: t("button.seeDetails"),
    },
  ];

  return (
    <GenericTable
      data={rows}
      columns={columns}
      actions={actions}
      actionsTitle={t("stock.table.actions")}
      isLoading={isLoading}
      emptyMessage={t("stock.table.emptyMessage")}
      className="w-full table-auto"
    />
  );
}
