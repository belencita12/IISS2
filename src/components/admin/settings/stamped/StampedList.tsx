"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Stamped } from "@/lib/stamped/IStamped";
import { StampedTable } from "./StampedTable";
import { StampedFilters } from "./StampedFilters";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { STAMPED_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import { normalizeText } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/global/SearchBar";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { deleteStamped } from "@/lib/stamped/stampedService";

interface StampedListProps {
  token: string;
}

export function StampedList({ token }: StampedListProps) {
  const t = useTranslations("Stamped");
  const ph = useTranslations("Placeholder");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [selectedStamped, setSelectedStamped] = useState<Stamped | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: stampedData,
    loading,
    error,
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
    setPage,
    refresh,
    search,
  } = usePaginatedFetch<Stamped>(STAMPED_API, token, {
    initialPage: 1,
    size: 10,
    autoFetch: true,
    extraParams: {
      search: debouncedSearch ? normalizeText(debouncedSearch) : undefined,
      fromDate,
      toDate,
      isActive,
    },
  });

  if (error) {
    toast("error", error.message || t("error.loading"));
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleView = (stamped: Stamped) => {
    // TODO: Implementar vista detallada
    console.log("Ver timbrado:", stamped);
  };

  const handleEdit = (stamped: Stamped) => {
    // TODO: Implementar edición
    console.log("Editar timbrado:", stamped);
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
      refresh();
    } catch (error) {
      toast("error", t("error.delete"));
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedStamped(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="w-full sm:w-[70%]">
          <SearchBar
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={ph("getBy", {field: "número o depósito"})}
          />
        </div>
      </div>

      <StampedFilters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        isActive={isActive}
        setIsActive={setIsActive}
      />

      <div className="flex justify-end">
        <Button variant="outline" className="px-6">
          Agregar
        </Button>
      </div>

      <StampedTable
        stampedData={stampedData || []}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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