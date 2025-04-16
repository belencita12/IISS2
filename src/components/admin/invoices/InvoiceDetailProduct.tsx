import React from "react";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { InvoiceDetail } from "@/lib/invoices/IInvoice";

interface Props {
  details: InvoiceDetail[];
  totalItems: number;
  totalAmount: number;
  totalPayed: number;
  totalVat: number;
}

export default function InvoiceDetailProduct({ details, totalItems, totalAmount, totalPayed, totalVat }: Props) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("es-PY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + " Gs";

  const columns: Column<InvoiceDetail>[] = [
    {
      header: "Nombre",
      accessor: (item) => item.product.name,
      className: "text-left",
    },
    {
      header: "Cantidad",
      accessor: "quantity",
      className: "text-right min-w-[60px]",
    },
    {
      header: "Precio Unitario",
      accessor: (item) => formatNumber(item.unitCost),
      className: "text-right min-w-[120px]",
    },
    {
      header: "Sub. Total",
      accessor: (item) => formatNumber(item.quantity * item.unitCost),
      className: "text-right min-w-[120px]",
    },
  ];

  if (details.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-600">No hay detalles asociados a esta factura</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GenericTable
        data={details}
        columns={columns}
        className="table-auto w-full"
      />

      <div className="flex justify-end flex-col items-end space-y-1 text-sm pr-4">
        <p><strong>IVA:</strong> {formatNumber(totalVat)}</p>
        <p><strong>Total:</strong> {formatNumber(totalAmount)}</p>
        <p><strong>Pagado:</strong> {formatNumber(totalPayed)}</p>
      </div>
    </div>
  );
}