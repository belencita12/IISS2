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
import VaccineTableSkeleton from "./skeleton/VaccineTableSkeleton";
import { useRouter } from "next/navigation";
import { getVaccines } from "@/lib/vaccine/getVaccines";
import SearchBar from "@/components/global/SearchBar";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";

interface Vaccine {
  id: number;
  name: string;
  manufacturer: { id: number; name: string };
  species: { id: number; name: string };
}

interface VaccineListProps {
  token: string | null;
}

export default function VaccineList({ token }: VaccineListProps) {
  const router = useRouter();
  const [data, setData] = useState<{
    vaccines: Vaccine[];
    pagination: PaginationInfo;
  }>({
    vaccines: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 4 },
  });
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vaccineToDelete, setVaccineToDelete] = useState<Vaccine | null>(null);

  const handleConfirmDelete = async () => {
    if (!vaccineToDelete) return;
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine/${vaccineToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!res.ok) throw new Error("Error al eliminar la vacuna");
  
      toast("success", "Vacuna eliminada exitosamente");
  
      const currentPage = data.pagination.currentPage;
      const isLastItemOnPage = data.vaccines.length === 1;
      const newPage = isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage;
  
      await loadVaccines(newPage);
    } catch (error) {
      console.error("Error al eliminar vacuna:", error);
      toast("error", "Error al eliminar vacuna");
    } finally {
      setIsDeleteModalOpen(false);
      setVaccineToDelete(null);
    }
  };
  
  
  
  const loadVaccines = useCallback(
    async (page: number = 1, filters = {}) => {
      if (!token) return;
      setLoading(true);
  
      try {
        const results = await getVaccines(token, page, filters);
  
        if (!Array.isArray(results.data)) {
          throw new Error("La respuesta de la API no es un array");
        }
  
        setData({
          vaccines: results.data,
          pagination: {
            currentPage: results.currentPage || 1,
            totalPages: results.totalPages || 1,
            totalItems: results.total || 0,
            pageSize: results.size || 4,
          },
        });
  
      } catch (error) {
        toast("error", "Error al cargar vacunas");
        console.error("Error cargando vacunas:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, data.pagination.pageSize]
  );
  

  useEffect(() => {
    if (token) {
      loadVaccines(data.pagination.currentPage);
    }
  }, [token, data.pagination.currentPage, loadVaccines]);


  const [lastSearch, setLastSearch] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    if (!token) return;
  
    setLoading(true);
    setLastSearch(query);
  
    try {
      const result = await getVaccines(token, 1, {
        name: query,
      });
  
      setData({
        vaccines: result.data,
        pagination: {
          currentPage: result.currentPage || 1,
          totalPages: result.totalPages || 1,
          totalItems: result.total || 0,
          pageSize: result.size || 4,
        },
      });
  
    } catch (error) {
      toast("error", "Error al buscar vacunas");
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  }, [token, data.pagination.pageSize]);
  


  const handlePageChange = (page: number) => {
    loadVaccines(page, { name: lastSearch });
    
  };
  
  const sortedVaccines = [...data.vaccines].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  

  const columns: Column<Vaccine>[] = [
    { header: "Nombre", accessor: "name" },
    { header: "Fabricante", accessor: (vaccine) => vaccine.manufacturer.name },
    { header: "Especie", accessor: (vaccine) => vaccine.species.name },
  ];

  const actions: TableAction<Vaccine>[] = [
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
        placeholder="Buscar por nombre, fabricante o especie"
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
        data={sortedVaccines} 
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
