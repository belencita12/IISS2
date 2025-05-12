import React from "react";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { InvoiceDetail } from "@/lib/invoices/IInvoice";

interface Props {
  details: InvoiceDetail[];
}

export default function InvoiceDetailTable({ details }: Props) {
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
      className: "text-right min-w-[80px]",
    },
    {
      header: "Precio Unitario",
      accessor: (item) => formatNumber(item.unitCost),
      className: "text-right min-w-[80px]",
    },
    {
      header: "IVA",
      accessor: (item) => {
        const iva = item.product.iva;
        return iva ? `${iva < 1 ? iva * 100 : iva}%` : "0%";
      },
      className: "text-right min-w-[80px]",
    },
    {
      header: "Sub. Total",
      accessor: (item) => formatNumber(item.quantity * item.unitCost),
      className: "text-right min-w-[80px]",
    },
  ];

  return (
    <div className="space-y-4">
      <GenericTable
        data={details}
        columns={columns}
        className="table-auto w-full"
      />
    </div>
  );
}