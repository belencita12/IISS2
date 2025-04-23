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

  useEffect(() => {
    if (token) loadVaccines(data.pagination.currentPage);
  }, [token, data.pagination.currentPage, loadVaccines]);

  const handleConfirmDelete = async () => {
    if (!vaccineToDelete || !token) return;

    try {
      await deleteVaccineById(vaccineToDelete.id, token);
      toast("success", "Vacuna eliminada con éxito");

      const currentPage = data.pagination.currentPage;
      const isLastItemOnPage = data.vaccines.length === 1;
      const newPage = isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadVaccines(newPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al eliminar vacuna";
      toast("error", message);
    } finally {
      setIsDeleteModalOpen(false);
      setVaccineToDelete(null);
    }
  };

  const columns: Column<IVaccine>[] = [
    { header: "Nombre", accessor: "name" },
    { header: "Fabricante", accessor: (vaccine) => vaccine.manufacturer.name },
    { header: "Especie", accessor: (vaccine) => vaccine.species.name },
  ];

  const actions: TableAction<IVaccine>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (vaccine) => router.push(`/dashboard/vaccine/${vaccine.id}`),
      label: "Ver detalles",
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (vaccine) => router.push(`/dashboard/vaccine/edit/${vaccine.id}`),
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (vaccine) => {
        setVaccineToDelete(vaccine);
        setIsDeleteModalOpen(true);
      },
      label: "Eliminar",
    },
  ];

  return (
    <div className="p-4 mx-auto">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar por nombre"
        debounceDelay={400}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Vacunas</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="px-6"
            onClick={() => router.push("/dashboard/vaccine/manufacturer")}
          >
            Fabricantes de Vacunas
          </Button>
          <Button
            variant="outline"
            className="px-6"
            onClick={() => router.push("/dashboard/vaccine/new")}
          >
            Agregar nueva vacuna
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
        emptyMessage="No se encontraron vacunas"
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro de eliminar esta vacuna?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
