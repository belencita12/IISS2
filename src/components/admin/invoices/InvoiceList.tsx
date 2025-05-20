"use client";
import { useState } from "react";
import InvoiceTable from "./InvoiceTable";
import InvoiceNumericFilter from "./filters/InvoiceNumericFilter";
import InvoiceDateFilter from "./filters/InvoiceDateFilter";
import SearchBar from "@/components/global/SearchBar";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { INVOICE_API } from "@/lib/urls";
import { Invoice } from "@/lib/invoices/IInvoice";
import { toast } from "@/lib/toast";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";
import { useTranslations } from "next-intl";
import ExportButton from "@/components/global/ExportButton";
import { downloadFromBlob } from "@/lib/utils";
import { getInvoiceReport } from "@/lib/invoices/getInvoiceReport";

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
    extraParams: {
      fromTotal: filters?.fromTotal ? Number(filters?.fromTotal) : undefined,
      toTotal: filters?.toTotal ? Number(filters?.toTotal) : undefined,
      fromIssueDate: filters?.fromIssueDate,
      toIssueDate: filters?.toIssueDate,
      search: filters?.search,
    },
  });

  const i = useTranslations("InvoiceTable");
  const ph = useTranslations("Placeholder");
  const e = useTranslations("Error");

  const handleFilterChange = (updatedFilters: GetInvoiceQueryParams) => {
    const { page, size, ...safeFilters } = updatedFilters;
    setFilters((prev) => ({
      ...prev,
      ...safeFilters,
      page: 1,
    }));
    search(safeFilters as Record<string, unknown>);
  };

  if (error instanceof Error) toast("error", error.message);

  const [isGettingReport, setIsGettingReport] = useState(false);
  
  const handleGetInvoiceReport = async () => {
    const from = filters.fromIssueDate;
    const to = filters.toIssueDate;

    if (!from || !to) {
      toast("error", e("errorLimitDate"));
      return;
    }

    setIsGettingReport(true);
    const result = await getInvoiceReport({
      token,
      from,
      to,
      Cliend: undefined,
    });

    if (!(result instanceof Blob)) {
      toast("error", result.message);
    } else {
      downloadFromBlob(result);
    }

    setIsGettingReport(false);
  };

  return (
    <div className="p-4 mx-auto">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <SearchBar
          placeholder={ph("getBy", {field: "RUC"})}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, search: value }));
            search({ search: value });
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvoiceNumericFilter
            filters={filters}
            setFilters={handleFilterChange}
          />
          <InvoiceDateFilter
            filters={filters}
            setFilters={handleFilterChange}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{i("title")}</h2>
        <ExportButton
          handleGetReport={handleGetInvoiceReport}
          isLoading={isGettingReport}
        />
      </div>

      <InvoiceTable
        emptyMessage={i("emptyMessage")}
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
