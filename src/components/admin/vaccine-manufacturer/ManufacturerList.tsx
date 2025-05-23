"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, {
  Column,
  TableAction,
  PaginationInfo,
} from "@/components/global/GenericTable";
import VaccineTableSkeleton from "../vaccine/skeleton/VaccineTableSkeleton";
import { useRouter } from "next/navigation";
import {
  getManufacturers,
  deleteManufacturer,
} from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import SearchBar from "@/components/global/SearchBar";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";

interface Manufacturer {
  id: number;
  name: string;
}

interface ManufacturerListProps {
  token: string;
}

export default function ManufacturerList({ token }: ManufacturerListProps) {
  const router = useRouter();
  const [data, setData] = useState<{
    manufacturers: Manufacturer[];
    pagination: PaginationInfo;
  }>({
    manufacturers: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 4,
    },
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] =
    useState<Manufacturer | null>(null);

  // ✅ Función reutilizable para cargar fabricantes con query
  const loadManufacturers = useCallback(
    async (page: number = 1, query: string = "") => {
      if (!token) return;
      setLoading(true);
      try {
        const results = await getManufacturers(token, page, query);
        if (!Array.isArray(results.data)) {
          throw new Error("La respuesta de la API no es un array");
        }
        setData({
          manufacturers: results.data,
          pagination: {
            currentPage: results.currentPage || 1,
            totalPages: results.totalPages || 1,
            totalItems: results.total || 0,
            pageSize: results.size || 4,
          },
        });
      } catch (error) {
        toast("error", "Error al cargar fabricantes");
        console.error("Error cargando fabricantes:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ✅ Cargar fabricantes cuando cambia la página o cuando se borra la búsqueda
  useEffect(() => {
    if (token && searchQuery === "") {
      loadManufacturers(data.pagination.currentPage);
    }
  }, [token, data.pagination.currentPage, searchQuery, loadManufacturers]);

  // ✅ Cargar cuando se hace una búsqueda nueva
  useEffect(() => {
    if (token && searchQuery !== "") {
      loadManufacturers(1, searchQuery);
    }
  }, [token, searchQuery, loadManufacturers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) =>
    setData((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, currentPage: page },
    }));

  const columns: Column<Manufacturer>[] = [
    { header: "Nombre", accessor: "name" },
  ];

  const actions: TableAction<Manufacturer>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (manufacturer) =>
        router.push(`/dashboard/vaccine/manufacturer/${manufacturer.id}`),
      label: "Ver detalles",
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (manufacturer) =>
        router.push(
          `/dashboard/vaccine/manufacturer/edit/${manufacturer.id}`
        ),
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (manufacturer) => {
        setManufacturerToDelete(manufacturer);
        setIsDeleteModalOpen(true);
      },
      label: "Eliminar",
    },
  ];

  const handleConfirmDelete = async () => {
    if (!manufacturerToDelete) return;
    try {
      await deleteManufacturer(token, manufacturerToDelete.id);
      toast("success", "Fabricante eliminado exitosamente");

      const currentPage = data.pagination.currentPage;
      const isLastItemOnPage = data.manufacturers.length === 1;
      const newPage =
        isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage;

      await loadManufacturers(newPage, searchQuery);
    } catch (error) {
      console.error("Error al eliminar fabricante:", error);
      toast("error", "Error al eliminar fabricante");
    } finally {
      setIsDeleteModalOpen(false);
      setManufacturerToDelete(null);
    }
  };

  return (
    <div className="p-4 mx-auto">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar por nombre..."
        debounceDelay={400}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Fabricantes de Vacunas</h2>
        <Button
          variant="outline"
          className="px-6"
          onClick={() => router.push("/dashboard/vaccine/manufacturer/new")}
        >
          Agregar
        </Button>
      </div>
      <GenericTable
        data={data.manufacturers}
        columns={columns}
        actions={actions}
        pagination={data.pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        skeleton={<VaccineTableSkeleton />}
        emptyMessage="No se encontraron fabricantes"
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro de eliminar este fabricante?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
