"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import VaccineTableSkeleton from "./skeleton/VaccineTableSkeleton";
import SearchBar from "@/components/global/SearchBar";
import { useVaccineList } from "@/hooks/vaccine/useVaccineList";
import { IVaccine } from "@/lib/vaccine/IVaccine";
import { deleteVaccineById } from "@/lib/vaccine/deleteVaccineById";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";

interface VaccineListProps {
  token: string | null;
}

export default function VaccineList({ token }: VaccineListProps) {
  const router = useRouter();
  const {
    data,
    loading,
    handleSearch,
    handlePageChange,
    loadVaccines,
  } = useVaccineList(token);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vaccineToDelete, setVaccineToDelete] = useState<IVaccine | null>(null);

  const v = useTranslations("VaccuneTable");
  const b = useTranslations("Button");
  const s = useTranslations("Success");
  const e = useTranslations("Error");
  const m = useTranslations("ModalConfirmation");
  const ph = useTranslations("Placeholder");

  useEffect(() => {
    if (token) loadVaccines(data.pagination.currentPage);
  }, [token, data.pagination.currentPage, loadVaccines]);

  const handleConfirmDelete = async () => {
    if (!vaccineToDelete || !token) return;

    try {
      await deleteVaccineById(vaccineToDelete.id, token);
      toast("success", s("successDelete", { field : vaccineToDelete.name }));

      const currentPage = data.pagination.currentPage;
      const isLastItemOnPage = data.vaccines.length === 1;
      const newPage = isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadVaccines(newPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : e("noDelete", {field: vaccineToDelete.name});
      toast("error", message);
    } finally {
      setIsDeleteModalOpen(false);
      setVaccineToDelete(null);
    }
  };

  const columns: Column<IVaccine>[] = [
    { header: v("name"), accessor: "name" },
    { header: v("manufacturer"), accessor: (vaccine) => vaccine.manufacturer.name },
    { header: v("specie"), accessor: (vaccine) => vaccine.species.name },
  ];

  const actions: TableAction<IVaccine>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (vaccine) => router.push(`/dashboard/vaccine/${vaccine.id}`),
      label: b("seeDetails"),
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (vaccine) => router.push(`/dashboard/vaccine/edit/${vaccine.id}`),
      label: b("edit"),
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (vaccine) => {
        setVaccineToDelete(vaccine);
        setIsDeleteModalOpen(true);
      },
      label: b("delete"),
    },
  ];

  return (
    <div className="p-4 mx-auto">
      <SearchBar
        onSearch={handleSearch}
        placeholder={ph("getBy", {field: "nombre"})}
        debounceDelay={400}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{v("vaccineTitle")}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="px-6"
            onClick={() => router.push("/dashboard/vaccine/manufacturer")}
          >
            {v("manufacturersVaccine")}
          </Button>
          <Button
            variant="outline"
            className="px-6"
            onClick={() => router.push("/dashboard/vaccine/new")}
          >
            {b("add")}
          </Button>
        </div>
      </div>
      <GenericTable
        data={data.vaccines}
        columns={columns}
        actions={actions}
        pagination={data.pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        skeleton={<VaccineTableSkeleton />}
        emptyMessage={v("emptyMessage")}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={m("titleDelete", { field: "vacuna"})}
        message={m("deleteMessage", { field: vaccineToDelete?.name ?? "" })}
        confirmText={b("delete")}
        cancelText={b("cancel")}
        variant="danger"
      />
    </div>
  );
}
