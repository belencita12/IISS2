import React from "react";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { InvoiceDetail } from "@/lib/invoices/IInvoice";
import { useTranslations } from "next-intl";

interface Props {
  details: InvoiceDetail[];
}

export default function InvoiceDetailTable({ details }: Props) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("es-PY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + t("invoices.gs");

    const t = useTranslations();

  const columns: Column<InvoiceDetail>[] = [
    {
      header: t("invoices.table.product"),
      accessor: (item) => item.product.name,
      className: "text-left",
    },
    {
      header: t("invoices.table.quantity"),
      accessor: "quantity",
      className: "text-right min-w-[80px]",
    },
    {
      header: t("invoices.table.unitCost"),
      accessor: (item) => formatNumber(item.unitCost),
      className: "text-right min-w-[80px]",
    },
    {
      header: t("invoices.table.iva"),
      accessor: (item) => {
        const iva = item.product.iva;
        return iva ? `${iva < 1 ? iva * 100 : iva}%` : "0%";
      },
      className: "text-right min-w-[80px]",
    },
    {
      header: t("invoices.table.subTotal"),
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
