"use client";
import { useState } from "react";
import InvoiceTable from "./InvoiceTable";
import InvoiceNumericFilter from "./filters/InvoiceNumericFilter";
import InvoiceDateFilter from "./filters/InvoiceDateFilter";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { INVOICE_API } from "@/lib/urls";
import { Invoice } from "@/lib/invoices/IInvoice";
import { toast } from "@/lib/toast";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";

interface InvoiceListProps {
  token: string;
}

const InvoiceList = ({ token }: InvoiceListProps) => {
  const [filters, setFilters] = useState<GetInvoiceQueryParams>({
    page: 1,
    fromTotal: undefined,
    toTotal: undefined,
  });

  const {
    data,
    loading: isLoading,
    error,
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
    setPage,
    search,
  } = usePaginatedFetch<Invoice>(INVOICE_API, token, {
    initialPage: 1,
    size: 7,
    autoFetch: true,
    extraParams:{
      fromTotal: filters?.fromTotal ? Number(filters?.fromTotal) : undefined,
      toTotal: filters?.toTotal ? Number(filters?.toTotal) : undefined,
      fromIssueDate: filters?.fromIssueDate,
      toIssueDate: filters?.toIssueDate,
    },
  });

  // Actualiza los resultados al cambiar los filtros
  const handleFilterChange = (updatedFilters: GetInvoiceQueryParams) => {
    const { page, size, ...safeFilters } = updatedFilters; 
    setFilters((prev) => ({
      ...prev,
      ...safeFilters,
      page: 1, 
    }));
    search(safeFilters as Record<string, unknown>);
  };

  if (error) toast("error", error.message || "Error al cargar las facturas");

  return (
    <div className="p-4 mx-auto">
       <div className="max-w-6xl mx-auto p-4 space-y-6">
      <InvoiceNumericFilter filters={filters} setFilters={handleFilterChange} />
      <InvoiceDateFilter filters={filters} setFilters={handleFilterChange} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Facturas</h2>
      </div>

      <InvoiceTable
        emptyMessage="No se encontraron facturas"
        onPageChange={setPage}
        token={token}
        isLoading={isLoading}
        data={data || []}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          pageSize: pagination.pageSize,
        }}
      />
    </div>
  );
};

export default InvoiceList;
