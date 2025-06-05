"use client";

import { useState } from "react";
import { ReactNode } from "react";
import { IReceipt } from "@/lib/receipts/IReceipt";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { Eye } from "lucide-react";
import ReceiptListSkeleton from "./skeleton/ReceiptListSkeleton";
import DateFilter from "../../purchases/filters/PurchaseDateFilter";
import ReceiptFilters from "./filter/ReceiptFilters";
import { formatDate } from "@/lib/utils";
import { ReceiptFiltersParams } from "@/lib/receipts/IReceipt";
import { RECEIPT_API } from "@/lib/urls";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { Button } from "@/components/ui/button";
type ReceiptListProps = {
  token: string;
};

export default function ReceiptList({ token }: ReceiptListProps) {
  const [isFiltering, setIsFiltering] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [filters, setFilters] = useState<ReceiptFiltersParams>({
    page: 1,
    size: 7,
    fromIssueDate: undefined,
    toIssueDate: undefined,
  });

  const {
    data,
    loading: isLoading,
    pagination = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 7,
    },
    setPage,
    search,
  } = usePaginatedFetch<IReceipt>(RECEIPT_API, token, {
    initialPage: 1,
    size: 7,
    autoFetch: true,
    extraParams: {
      fromIssueDate: filters.fromIssueDate,
      toIssueDate: filters.toIssueDate,
      searchTerm: filters.searchTerm,
      fromTotal: filters.fromTotal,
      toTotal: filters.toTotal,
    },
  });

  const handleFilterChange = (updatedFilters: ReceiptFiltersParams) => {
    const { page, size, ...safeFilters } = updatedFilters;
    setFilters((prev) => ({
      ...prev,
      ...safeFilters,
      page: 1,
    }));
    search(safeFilters as Record<string, unknown>);
  };

  const columns: Column<IReceipt>[] = [
    {
      header: "Número de recibo",
      accessor: (row: IReceipt): string => row.receiptNumber,
    },
    {
      header: "Total",
      accessor: (row: IReceipt): string =>
        row.total.toLocaleString("es-PY", {
          style: "currency",
          currency: "PYG",
        }),
    },
    {
      header: "Fecha de emisión",
      accessor: (row: IReceipt): string => formatDate(row.issueDate),
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
          onClick={() => (window.location.href = `./receipts/${row.id}`)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Ver detalle"
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </button>
      ),
    },
  ];

  const hasActiveFilters = !!(
    filters.fromTotal ||
    filters.toTotal ||
    filters.fromIssueDate ||
    filters.toIssueDate ||
    filters.receiptNumber ||
    filters.searchTerm
  );

  const resetFilters = () => {
    setIsFiltering(true)
    setFilters({
      page: 1,
      size: 7,
      fromIssueDate: undefined,
      toIssueDate: undefined,
      fromTotal: undefined,
      toTotal: undefined
    })
    
    setResetCounter((prev) => prev + 1);
    setIsFiltering(false)
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 p-5">
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
            variant="ghost"
            size="sm"
            onClick={() => resetFilters()}
            className="text-sm h-8 px-2 text-gray-600 mr-[10px]"
            disabled={isFiltering}
            >
            Limpiar filtros
            </Button>
          </div>
        )}
        <div className="flex-1">
          <ReceiptFilters filters={filters} setFilters={handleFilterChange} reset={resetCounter} />
        </div>
        <div className="flex-1">
          <DateFilter
            from={filters.fromIssueDate}
            to={filters.toIssueDate}
            setDateFrom={(date) =>
              handleFilterChange({ ...filters, fromIssueDate: date })
            }
            setDateTo={(date) =>
              handleFilterChange({ ...filters, toIssueDate: date })
            }
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4 pt-4">Recibos</h2>

      {isLoading && <ReceiptListSkeleton />}

      {!isLoading && data?.length === 0 && (
        <p className="text-center p-4">No se encontraron recibos</p>
      )}

      {!isLoading && data && data.length > 0 && (
        <GenericTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            pageSize: pagination.pageSize,
          }}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
