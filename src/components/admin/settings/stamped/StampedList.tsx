"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Stamped} from "@/lib/stamped/IStamped";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { StampedFilters } from "./StampedFilters";
import { toast } from "@/lib/toast";
import { normalizeText } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { deleteStamped } from "@/lib/stamped/stampedService";
import { Pencil } from "lucide-react";
import GenericPagination from "@/components/global/GenericPagination";
import { useStampedList } from "@/hooks/stamped/useStampedList";
import { PaginationResponse } from "@/lib/types";
import { StampedForm } from "./StampedForm";


interface StampedListProps {
  token: string;
}

export function StampedList({ token }: StampedListProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [selectedStamped, setSelectedStamped] = useState<Stamped | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const debouncedSearch = useDebounce(query, 300);

  const {
    getStampedList,
    isLoading,
  } = useStampedList(token);

  const [data, setData] = useState<PaginationResponse<Stamped> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stockId, setStockId] = useState<number|undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const result = await getStampedList({
            page: currentPage,
            size: 10,
            fromDate,
            toDate,
            stockId: stockId,
            stamped: debouncedSearch ? normalizeText(debouncedSearch) : undefined,
            includeDeleted: isActive === false,
          });
          let filteredData = result.data;
          if(isActive === true){
            filteredData = filteredData.filter((s) => s.isActive === true);
          }else if(isActive === false){
            filteredData = filteredData.filter((s) => s.isActive === false);
          }
          result.data = filteredData;
          setData(result);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          toast("error", error.message);
        } else {
          const errorMessage = t("error.notGetData");
          setError(errorMessage);
          toast("error", errorMessage);
        }
      }
    };

    if (token) {
      fetchData();
    }
  }, [currentPage, debouncedSearch, fromDate, toDate, isActive, token, stockId]);

  if (error) {
    toast("error", error || t("error.loading"));
  }

  const handleEdit = (stamped: Stamped) => {
    if (!stamped.isActive) {
      toast("error", "El depósito está inactivo");
      return;
    }
    setSelectedStamped(stamped);
    setIsFormModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStamped) return;

    try {
      await deleteStamped(selectedStamped.id, token);
      toast("success", t("success.successDeleteStamped"));
      // Refrescar datos
      const result = await getStampedList({
        page: currentPage,
        size: 10,
        stamped: debouncedSearch ? normalizeText(debouncedSearch) : undefined,
        fromDate,
        toDate,
        includeDeleted: isActive === false,
      });
      setData(result);
    } catch (error: unknown) {
      
      if (error instanceof Error) {
        toast("error", error.message);
      }
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedStamped(null);
    }
  };

  const handleFormSuccess = async () => {
    setIsFormModalOpen(false);
    setSelectedStamped(null);
    const result = await getStampedList({
      page: currentPage,
      size: 10,
      stamped: debouncedSearch ? normalizeText(debouncedSearch) : undefined,
      fromDate,
      toDate,
      includeDeleted: isActive === false,
    });
    setData(result);
  };

  const columns: Column<Stamped>[] = [
    {
      header: t("stamped.table.stampedNumber"),
      accessor: "stampedNum",
    },
    {
      header: t("stamped.table.stock"),
      accessor: (stamped) => stamped.stock.name,
    },
    {
      header: t("stamped.table.address"),
      accessor: (stamped) => stamped.stock.address,
    },
    {
      header: t("stamped.date.from"),
      accessor: (stamped) => new Date(stamped.fromDate).toLocaleDateString('es-ES'),
    },
    {
      header: t("stamped.date.to"),
      accessor: (stamped) => new Date(stamped.toDate).toLocaleDateString('es-ES'),
    },
    {
      header: t("stamped.table.numberRange"),
      accessor: (stamped) => `${stamped.fromNum} - ${stamped.toNum}`,
    },
    {
      header: t("stamped.table.status"),
      accessor: (stamped) => (
        <span className={stamped.isActive ? "text-green-600" : "text-red-600"}>
          {stamped.isActive ? t("stamped.status.active") : t("stamped.status.inactive")}
        </span>
      ),
    },
  ];

  const actions: TableAction<Stamped>[] = [
    {
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
      label: "Editar",
      show: (stamped) => stamped.isActive && stamped.currentNum <= stamped.fromNum
    },
  ];
  const hasFilters =
    !!fromDate || !!toDate || !!stockId || !!query;

  const resetFilters = () => {
    setQuery("");
    setFromDate(undefined);
    setToDate(undefined);
    setStockId(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">

      <StampedFilters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        stockId={stockId}
        setStockId={setStockId}
        stampedNumber={query}
        setStampedNumber={(value) => {
          setQuery(value || "");
          setCurrentPage(1);
        }}
        token={token}
        onResetFilters={resetFilters}
        hasFilters={hasFilters}
      />


      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("stamped.table.title")}</h1>
        <Button variant="outline" className="px-6" onClick={() => {
          setSelectedStamped(null);
          setIsFormModalOpen(true);
        }}>
          {t("button.add")}
        </Button>
      </div>

      <GenericTable
        data={data?.data || []}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        emptyMessage={t("stamped.table.emptyMessage")}
      />

      {data && data.totalPages > 1 && (
        <GenericPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          handlePreviousPage={() => {
            if (data.currentPage > 1) {
              setCurrentPage(data.currentPage - 1);
            }
          }}
          handleNextPage={() => {
            if (data.currentPage < data.totalPages) {
              setCurrentPage(data.currentPage + 1);
            }
          }}
          handlePageChange={setCurrentPage}
        />
      )}

      <StampedForm
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedStamped(null);
        }}
        token={token}
        onSuccess={handleFormSuccess}
        defaultValues={selectedStamped}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("confirmationModal.stamped.titleDelete")}
        message={t("confirmationModal.stamped.messageDelete", {stamped :  selectedStamped?.stampedNum ?? ""})}
        confirmText={t("button.delete")}
        cancelText={t("button.cancel")}
        variant="danger"
      />
    </div>
  );
} 