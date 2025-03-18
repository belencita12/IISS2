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
import SearchBar from "./SearchBar";

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
    const [searchQuery, setSearchQuery] = useState("");

    const loadVaccines = useCallback(
        async (page: number = 1) => {
            if (!token) return;
            setLoading(true);

            try {
                const results = await getVaccines(token, page);
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
        [token]
    );

    useEffect(() => {
        if (token) loadVaccines(data.pagination.currentPage);
    }, [token, data.pagination.currentPage, loadVaccines]);

    const handleSearch = (query: string) => {
        setSearchQuery(query); // Actualiza el estado de la búsqueda
    };

    const handlePageChange = (page: number) =>
        setData((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, currentPage: page },
        }));

    // Filtrar las vacunas en el frontend
    const filteredVaccines = data.vaccines.filter((vaccine) => {
        const searchText = searchQuery.toLowerCase();
        return (
            vaccine.name.toLowerCase().includes(searchText) ||
            vaccine.manufacturer.name.toLowerCase().includes(searchText) ||
            vaccine.species.name.toLowerCase().includes(searchText)
        );
    });

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
            onClick: (vaccine) => console.log("Editar:", vaccine),
            label: "Editar",
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: (vaccine) => console.log("Eliminar:", vaccine),
            label: "Eliminar",
        },
    ];

    return (
        <div className="p-4 mx-auto">
            <SearchBar onSearch={handleSearch} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Vacunas</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="px-6"
                        onClick={() => router.push("/dashboard/vaccine/manufacturer")} //aca falta agregar un listado de manufacturers, pero la idea está
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
                data={filteredVaccines}
                columns={columns}
                actions={actions}
                pagination={data.pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<VaccineTableSkeleton />}
                emptyMessage="No se encontraron vacunas"
            />
        </div>
    );
}