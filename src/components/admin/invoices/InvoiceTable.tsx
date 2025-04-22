"use client";
import { Invoice } from "@/lib/invoices/IInvoice";
import GenericTable, { Column, TableAction, GenericTableProps } from "@/components/global/GenericTable";
import InvoiceTableSkeleton from "./skeleton/InvoiceTableSkeleton";
import { Eye} from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";


 export type InvoiceTableProps = Omit<
   GenericTableProps<Invoice>,
   "actions" | "columns"
 > & {
   token: string;

 };

 const InvoiceTable = ({ ...props }: InvoiceTableProps) => {
  
 const router = useRouter();

  const actions: TableAction<Invoice>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (invoice) => {
        if (!invoice.id || isNaN(Number(invoice.id))) {
          toast("error", "ID de la factura inválido");
          return;
        }
        toast("info", "Cargando detalles de la factura...");
        router.push(`/dashboard/invoices/${invoice.id}`);
      },
      label: "Ver detalle",
    },
    

  ];

  const columns: Column<Invoice>[] = [
    { header: "Nro Factura", accessor: "invoiceNumber" },
    { header: "Cliente", accessor: "clientName" },
    { header: "RUC", accessor: "ruc" },
    { header: "Fecha", accessor: (i) => formatDate(i.issueDate) },
    { header: "Tipo", accessor: (i) => (i.type === "CASH" ? "Contado" : "Crédito") },
    { header: "Total", accessor: (i) => `${i.total.toLocaleString()} Gs.` },
    { header: "Pagado", accessor: (i) => `${i.totalPayed.toLocaleString()} Gs.` },
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
