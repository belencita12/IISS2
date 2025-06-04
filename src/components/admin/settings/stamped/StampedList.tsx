"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Stamped, StampedQueryParams } from "@/lib/stamped/IStamped";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { StampedFilters } from "./StampedFilters";
import { toast } from "@/lib/toast";
import { normalizeText } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/global/SearchBar";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { deleteStamped } from "@/lib/stamped/stampedService";
import { Eye, Pencil, Trash2 } from "lucide-react";
import GenericPagination from "@/components/global/GenericPagination";
import { useStampedList } from "@/hooks/stamped/useStampedList";
import { PaginationResponse } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StampedForm } from "./StampedForm";

interface StampedListProps {
  token: string;
}

export function StampedList({ token }: StampedListProps) {
  const t = useTranslations("Stamped");
  const ph = useTranslations("Placeholder");
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
          const errorMessage = "Error al obtener los timbrados";
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

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const handleView = (stamped: Stamped) => {
    // TODO: Implementar vista detallada
    console.log("Ver timbrado:", stamped);
  };

  const handleEdit = (stamped: Stamped) => {
   // setSelectedStamped(stamped);
   // setIsFormModalOpen(true);
  };

  const handleDelete = (stamped: Stamped) => {
    setSelectedStamped(stamped);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStamped) return;

    try {
      await deleteStamped(selectedStamped.id, token);
      toast("success", t("success.delete"));
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
    } catch (error) {
      console.error("Error al eliminar timbrado:", error);
      if (error instanceof Error) {
        toast("error", error.message);
      } else {
        toast("error", t("error.delete"));
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
      header: "Número",
      accessor: "stampedNum",
    },
    {
      header: "Depósito",
      accessor: (stamped) => stamped.stock.name,
    },
    {
      header: "Dirección",
      accessor: (stamped) => stamped.stock.address,
    },
    {
      header: "Fecha desde",
      accessor: (stamped) => new Date(stamped.fromDate).toLocaleDateString('es-ES'),
    },
    {
      header: "Fecha hasta",
      accessor: (stamped) => new Date(stamped.toDate).toLocaleDateString('es-ES'),
    },
    {
      header: "Rango numérico",
      accessor: (stamped) => `${stamped.fromNum} - ${stamped.toNum}`,
    },
    {
      header: "Estado",
      accessor: (stamped) => (
        <span className={stamped.isActive ? "text-green-600" : "text-red-600"}>
          {stamped.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const actions: TableAction<Stamped>[] = [
    // {
    //   icon: <Eye className="h-4 w-4" />,
    //   onClick: handleView,
    //   label: "Ver",
    // },
    {
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
      label: "Editar",
    },
    // {
    //   icon: <Trash2 className="h-4 w-4 text-red-500" />,
    //   onClick: handleDelete,
    //   label: "Eliminar",
    // },
  ];

  return (
    <div className="space-y-4">

      <StampedFilters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        isActive={isActive}
        setIsActive={(value) => {
          setIsActive(value);
          setCurrentPage(1);
        }}
        stockId={stockId}
        setStockId={(value) => {
          setStockId(value);
          setCurrentPage(1);
        }}
        stampedNumber={query}
        setStampedNumber={(value) => {
          setQuery(value || "");
          setCurrentPage(1);
        }}
        token={token}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Timbrado</h1>
        <Button variant="outline" className="px-6" onClick={() => {
          setSelectedStamped(null);
          setIsFormModalOpen(true);
        }}>
          Agregar
        </Button>
      </div>

      <GenericTable
        data={data?.data || []}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        emptyMessage="No hay timbrados disponibles"
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
        title={t("deleteTitle")}
        message={t("deleteMessage", { number: selectedStamped?.stampedNum || "" })}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="danger"
      />
    </div>
  );
} 