"use client";

import { ReactNode } from "react";
import { IReceipt } from "@/lib/receipts/IReceipt";
import GenericTable, { Column } from "@/components/global/GenericTable";
import { Eye } from "lucide-react";
import ReceiptListSkeleton from "./skeleton/ReceiptListSkeleton";
import DateFilter from "../../purchases/filters/PurchaseDateFilter";
import { useGetReceipts } from "@/hooks/receipts/useGetReceipts";
import ReceiptFilters from "./filter/ReceiptFilters";
import GenericPagination from "@/components/global/GenericPagination";
import { formatDate } from "@/lib/utils";

type ReceiptListProps = {
  token: string;
};

export default function ReceiptList({ token }: ReceiptListProps) {
  const { data, isLoading, query, setQuery } = useGetReceipts({ token });

  const handleChange = (
    field: keyof typeof query,
    value: string | number | undefined
  ) => {
    setQuery((prev) => ({
      ...prev,
      [field]: value === "" || value === undefined ? undefined : value,
    }));
  };
  const handlePageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  const columns: Column<IReceipt>[] = [
    {
      header: "Número de recibo",
      accessor: (row: IReceipt): string => row.receiptNumber,
    },
    {
      header: "Total",
      accessor: (row: IReceipt): string => 
        row.total.toLocaleString("es-PY", { style: "currency", currency: "PYG" }),
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
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 p-5">
        <div className="flex-1">
          <ReceiptFilters filters={query} setFilters={setQuery} />
        </div>
        <div className="flex-1">
          <DateFilter
            from={query.fromIssueDate}
            to={query.toIssueDate}
            setDateFrom={(date) => handleChange("fromIssueDate", date)}
            setDateTo={(date) => handleChange("toIssueDate", date)}
          />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 pt-4">Recibos</h2>
      {isLoading && <ReceiptListSkeleton />}
      {!isLoading && data?.data && data.data.length === 0 && (
        <p className="text-center p-4">No se encontraron recibos</p>
      )}
      {data?.data && data.data.length > 0 && (
        <GenericTable
          columns={columns}
          data={data.data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      )}
      {data && data.totalPage > 1 && (
        <GenericPagination
          currentPage={data.currentPage}
          totalPages={data.totalPage}
          handlePreviousPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
          }
          handleNextPage={() =>
            setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
          }
          handlePageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
