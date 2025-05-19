"use client";

import { useEffect, useState, ReactNode } from "react";
import { getReceipts } from "@/lib/receipts/getReceipts";
import { IReceipt, IReceiptResponse } from "@/lib/receipts/IReceipt";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { Eye, Receipt } from "lucide-react";
import ReceiptListSkeleton from "./skeleton/ReceiptListSkeleton";

type ReceiptListProps = {
  token: string;
};

export default function ReceiptList({ token }: ReceiptListProps) {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response: IReceiptResponse = await getReceipts(token);
        setReceipts(response.data);
      } catch (error) {
        setReceipts([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [token]);

  const columns: Column<IReceipt>[] = [
    {
      header: "Número de recibo",
      accessor: (row: IReceipt): string => row.receiptNumber,
    },
    {
      header: "Total",
      accessor: (row: IReceipt): string => 
        row.total.toLocaleString("es-PY", { style: "currency", currency: "PYG" }),
    },
    {
      header: "Fecha de emisión",
      accessor: (row: IReceipt): string => {
        const [year, month, day] = row.issueDate.split("-");
        return `${day.padStart(2, '0')} - ${month.padStart(2, '0')} - ${year}`;
      },
    },
    {
      header: "Métodos de pagos",
      accessor: (row: IReceipt): string => 
        row.paymentMethods
          .map(
            (pm) =>
              `${pm.method} (${pm.amount.toLocaleString("es-PY", {
                style: "currency",
                currency: "PYG",
              })})`
          )
          .join(", "),
    },
    {
      header: "Acciones",
      accessor: (row: IReceipt): ReactNode => (
        <button
          onClick={() => window.location.href = `./receipts/${row.id}`}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Ver detalle"
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </button>
      ),
    },
  ];

  if (loading) return <ReceiptListSkeleton />;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 pt-4">Recibos</h2>
      <GenericTable columns={columns} data={receipts} />
    </div>
  );
}