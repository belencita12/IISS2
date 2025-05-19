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

 const i = useTranslations("InvoiceTable");
 const e = useTranslations("Error");
 const b = useTranslations("Button");

  const actions: TableAction<Invoice>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (invoice) => {
        if (!invoice.id || isNaN(Number(invoice.id))) {
          toast("error", e("notGetData"));
          return;
        }
        router.push(`/dashboard/invoices/${invoice.id}`);
      },
      label: b("seeDetails"),
    },
    

  ];

  const columns: Column<Invoice>[] = [
    { header: i("invoiceNumber"), accessor: "invoiceNumber" },
    { header: i("client"), accessor: "clientName" },
    { header: i("ruc"), accessor: "ruc" },
    { header: i("date"), accessor: (i) => formatDate(i.issueDate) },
    { header: i("type"), accessor: (i) => (i.type === "CASH" ? "Contado" : "Crédito") },
    { header: i("total"), accessor: (i) => `${i.total.toLocaleString()} Gs.` },
    { header: i("totalPayed"), accessor: (i) => `${i.totalPayed.toLocaleString()} Gs.` },
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
