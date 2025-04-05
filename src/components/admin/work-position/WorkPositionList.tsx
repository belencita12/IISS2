"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import WorkPositionTableSkeleton from "./skeleton/WorkPositionTableSkeleton";
import { useRouter } from "next/navigation";
import { getWorkPositions } from "@/lib/work-position/getAllPositions";
import { deleteWorkPosition } from "@/lib/work-position/deletePosition";
import SearchBar from "@/components/global/SearchBar";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { Position } from "@/lib/work-position/IPosition";

interface Props {
  token: string;
}

export default function WorkPositionList({ token }: Props) {
  const router = useRouter();
  const [data, setData] = useState<{
    positions: Position[];
    pagination: PaginationInfo;
  }>({
    positions: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
  });

  const [filteredData, setFilteredData] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);
  const [lastSearch, setLastSearch] = useState("");


  const handleConfirmDelete = async () => {
    if (!positionToDelete) return;
    try {
      if (!positionToDelete.id) return;
      await deleteWorkPosition(token, positionToDelete.id);
      toast("success", "Puesto eliminado exitosamente");

      const currentPage = data.pagination.currentPage;
      const isLastItemOnPage = data.positions.length === 1;
      const newPage = isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage;

      await loadWorkPositions(newPage);
    } catch (error) {
      toast("error", "Error al eliminar el puesto");
    } finally {
      setIsDeleteModalOpen(false);
      setPositionToDelete(null);
    }
  };

  const loadWorkPositions = useCallback(
    async (page: number = 1, filters = {}) => {
      setLoading(true);
      try {
        const result = await getWorkPositions(token, page, data.pagination.pageSize, filters);
        setData({
          positions: result.data,
          pagination: {
            currentPage: result.currentPage || 1,
            totalPages: result.totalPages || 1,
            totalItems: result.total || 0,
            pageSize: result.size || 10,
          },
        });
        setFilteredData(result.data);
      } catch (error) {
        toast("error", "Error al cargar puestos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [token, data.pagination.pageSize]
  );


  useEffect(() => {
    loadWorkPositions(data.pagination.currentPage);
  }, [loadWorkPositions, data.pagination.currentPage]);


  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setLastSearch(query);
    try {
      const result = await getWorkPositions(token, 1, data.pagination.pageSize, {
        name: query,
      });

      setData({
        positions: result.data,
        pagination: {
          currentPage: result.currentPage || 1,
          totalPages: result.totalPages || 1,
          totalItems: result.total || 0,
          pageSize: result.size || 10,
        },
      });

      setFilteredData(result.data);
    } catch (error) {
      toast("error", "Error al buscar puestos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token, data.pagination.pageSize]);




  const handlePageChange = (page: number) => {
    loadWorkPositions(page, { name: lastSearch }); // usamos el filtro actual
  };


  const columns: Column<Position>[] = [
    { header: "Nombre", accessor: "name" }
  ];
  

  const actions: TableAction<Position>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (p) => router.push(`/dashboard/settings/positions/${p.id}`),
      label: "Ver detalles",
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (p) => router.push(`/dashboard/settings/positions/update/${p.id}`),
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (p) => {
        setPositionToDelete(p);
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
        <h2 className="text-3xl font-bold">Puestos de trabajo</h2>
        <Button onClick={() => router.push("/dashboard/settings/positions/register")}>
          Agregar nuevo puesto
        </Button>
      </div>

      <GenericTable
        data={filteredData} 
        columns={columns}
        actions={actions}
        pagination={data.pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        skeleton={<WorkPositionTableSkeleton />}
        emptyMessage="No se encontraron puestos"
      />


      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro de eliminar este puesto?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
