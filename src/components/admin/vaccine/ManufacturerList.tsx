"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import VaccineTableSkeleton from "./skeleton/VaccineTableSkeleton"; // O VaccineTableSkeleton si lo reusas
import { useRouter } from "next/navigation";
import { getManufacturers } from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import SearchBar from "./SearchBar";

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
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 4 },
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadManufacturers = useCallback(
    async (page: number = 1) => {
      if (!token) return;
      setLoading(true);
      try {
        // Ahora se envían token, página y query de búsqueda
        const results = await getManufacturers(token, page, searchQuery);
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
    [token, searchQuery]
  );

  useEffect(() => {
    if (token) loadManufacturers(data.pagination.currentPage);
  }, [token, data.pagination.currentPage, loadManufacturers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reinicia a la página 1 con el nuevo query
    loadManufacturers(1);
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
      onClick: (manufacturer) => router.push(`/dashboard/vaccine/manufacturer/${manufacturer.id}`),
      label: "Ver detalles",
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (manufacturer) => router.push(`/dashboard/vaccine/manufacturer/edit/${manufacturer.id}`),
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: (manufacturer) => console.log("Eliminar:", manufacturer),
      label: "Eliminar",
    },
  ];

  return (
    <div className="p-4 mx-auto">
      <SearchBar onSearch={handleSearch} />
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
    </div>
  );
}
