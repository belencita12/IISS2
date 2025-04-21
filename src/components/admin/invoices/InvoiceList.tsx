"use client";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { INVOICE_API } from "@/lib/urls";
import { Invoice } from "@/lib/invoices/IInvoice";
import { useEffect } from "react";
import GenericTable, { Column } from "@/components/global/GenericTable";
import InvoiceTableSkeleton from "./skeleton/InvoiceTableSkeleton";

interface InvoiceListProps {
  token: string;
}

const InvoiceList = ({ token }: InvoiceListProps) => {
  const {
    data: invoices,
    loading,
    error,
    pagination,
    setPage,
  } = usePaginatedFetch<Invoice>(INVOICE_API, token, {
    autoFetch: true,
    initialPage: 1,
    size: 7, // Cantidad por página
  });

  useEffect(() => {
   
  }, []);

  const columns: Column<Invoice>[] = [
    { header: "Nro Factura", accessor: "invoiceNumber" },
    { header: "Cliente", accessor: "clientName" },
    { header: "RUC", accessor: "ruc" },
    { header: "Fecha", accessor: "issueDate" },
    { header: "Tipo", accessor: (i) => (i.type === "CASH" ? "Contado" : "Crédito") },
    { header: "Total", accessor: (i) => `${i.total.toLocaleString()} Gs.` },
   
  ];
  
  if (loading) return <InvoiceTableSkeleton />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <GenericTable
      data={invoices}
      columns={columns}
      pagination={pagination}
      onPageChange={setPage}
      isLoading={loading}
      emptyMessage="No se encontraron facturas"
    />
  );
}

export default InvoiceList;