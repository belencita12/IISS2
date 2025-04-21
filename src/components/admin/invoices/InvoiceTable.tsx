"use client";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { INVOICE_API } from "@/lib/urls";
import { Invoice } from "@/lib/invoices/IInvoice";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import InvoiceTableSkeleton from "./skeleton/InvoiceTableSkeleton";
import { Eye } from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface InvoiceTableProps {
  token: string;
}

const InvoiceTable = ({ token }: InvoiceTableProps) => {
  const {
    data: invoices,
    loading,
    error,
    pagination,
    setPage,
  } = usePaginatedFetch<Invoice>(INVOICE_API, token, {
    autoFetch: true,
    initialPage: 1,
    size: 7,
  });

  const router = useRouter();

  const columns: Column<Invoice>[] = [
    { header: "Nro Factura", accessor: "invoiceNumber" },
    { header: "Cliente", accessor: "clientName" },
    { header: "RUC", accessor: "ruc" },
    { header: "Fecha", accessor: (i) => formatDate(i.issueDate) },
    { header: "Tipo", accessor: (i) => (i.type === "CASH" ? "Contado" : "Crédito") },
    { header: "Total", accessor: (i) => `${i.total.toLocaleString()} Gs.` },
    { header: "Pagado", accessor: (i) => `${i.totalPayed.toLocaleString()} Gs.` },
  ];

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
      label: "Ver detalles",
    },
  ];

  if (loading) return <InvoiceTableSkeleton />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <GenericTable
        data={invoices}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={loading}
        emptyMessage="No se encontraron facturas"
      />
    </>
  );
};

export default InvoiceTable;
