"use client";
import { Invoice } from "@/lib/invoices/IInvoice";
import GenericTable, { Column, TableAction, GenericTableProps } from "@/components/global/GenericTable";
import InvoiceTableSkeleton from "./skeleton/InvoiceTableSkeleton";
import { Eye} from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";

 export type InvoiceTableProps = Omit<
   GenericTableProps<Invoice>,
   "actions" | "columns"
 > & {
   token: string;

 };

 const InvoiceTable = ({ ...props }: InvoiceTableProps) => {
  
 const router = useRouter();
 const t = useTranslations();


  const actions: TableAction<Invoice>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (invoice) => {
        if (!invoice.id || isNaN(Number(invoice.id))) {
          toast("error", t("error.notGetData"));
          return;
        }
        router.push(`/dashboard/invoices/${invoice.id}`);
      },
      label: t("button.seeDetails"),
    },
    

  ];

  const columns: Column<Invoice>[] = [
    { header: t("invoices.table.invoiceNumber"), accessor: "invoiceNumber" },
    { header: t("invoices.table.client"), accessor: "clientName" },
    { header: t("invoices.table.ruc"), accessor: "ruc" },
    { header: t("invoices.table.date"), accessor: (i) => formatDate(i.issueDate) },
    { header: t("invoices.table.type"), accessor: (i) => (i.type === "CASH" ? t("invoices.type.cash") : t("invoices.type.credit")) },
    { header: t("invoices.table.total"), accessor: (i) => `${i.total.toLocaleString()} ${t("invoices.gs")}` },
    { header: t("invoices.table.totalPayed"), accessor: (i) => `${i.totalPayed.toLocaleString()} ${t("invoices.gs")}` },
  ];

 


  return (
    <>
      <GenericTable
        {...props}
        skeleton={<InvoiceTableSkeleton />}
        columns={columns}
        actions={actions}

      />
    </>
  );
};

export default InvoiceTable;
