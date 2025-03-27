"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getSpecies, getRacesBySpecies } from "@/lib/pets/getRacesAndSpecies";
import SearchBar from "@/components/global/SearchBar";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, {
    Column,
    TableAction,
    PaginationInfo,
} from "@/components/global/GenericTable";
import RaceTableSkeleton from "./skelenton/RaceTableSkeleton";
import { useRouter } from "next/navigation";
import { getRaces } from "@/lib/pets/getRaces";

export interface RaceWithSpecies {
    id: number;
    name: string;
    speciesName: string;
}

interface RaceListProps {
    token: string | null;
}

export default function RaceList({ token }: RaceListProps) {
    const router = useRouter();
    const [data, setData] = useState<{ races: RaceWithSpecies[]; pagination: PaginationInfo }>({
        races: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
    });
    const [loading, setLoading] = useState(false);
    const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);
    const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);

    const loadRaces = useCallback(
        async (page: number = 1, query: string = "") => {
            if (!token) return;
            setLoading(true);
    
            try {
                if (!species.length) {
                    const speciesData = await getSpecies(token);
                    setSpecies(speciesData);
                }
    
                let races = [];
                if (selectedSpecies !== null) {
                    races = await getRacesBySpecies(selectedSpecies, token);
                } else {
                    races = await getRaces(token);
                }

                if (query) {
                    races = races.filter((race: any) =>
                        race.name.toLowerCase().includes(query.toLowerCase())
                    );
                }

                setData({
                    races: races.map((race: any) => ({
                        ...race,
                        speciesName: species.find((s) => s.id === race.speciesId)?.name || "Desconocida",
                    })),
                    pagination: { currentPage: page, totalPages: 1, totalItems: races.length, pageSize: 10 },
                });
            } catch (error) {
                toast("error", "Error al cargar razas");
                console.error("Error cargando razas:", error);
            } finally {
                setLoading(false);
            }
        },
        [token, species, selectedSpecies]
    );

    const handleSearch = (query: string) => loadRaces(1, query);

    

    useEffect(() => {
        if (token) loadRaces(data.pagination.currentPage);
    }, [token, data.pagination.currentPage, loadRaces]);
    

    const handlePageChange = (page: number) =>
        setData((prev) => ({ ...prev, pagination: { ...prev.pagination, currentPage: page } }));

    const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSpecies(Number(event.target.value) || null);
    };

    const columns: Column<RaceWithSpecies>[] = [
        { header: "Nombre", accessor: "name" },
        { header: "Especie", accessor: "speciesName" },
    ];

    const actions: TableAction<RaceWithSpecies>[] = [
        {
            icon: <Pencil className="w-4 h-4" />,
            onClick: (race) => console.log("Editar:", race),
            label: "Editar",
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: (race) => console.log("Eliminar:", race),
            label: "Eliminar",
        },
    ];

    return (
        <div className="p-4 mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="Buscar raza..." manualSearch={true} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Razas</h2>
                <Button variant="outline" className="px-6" onClick={() => router.push("/dashboard/races/register")}>Agregar</Button>
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Filtrar por especie:</label>
                <select className="border p-2 w-full" onChange={handleSpeciesChange}>
                    <option value="">Todas</option>
                    {species.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
            <GenericTable
                data={data.races}
                columns={columns}
                actions={actions}
                pagination={data.pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<RaceTableSkeleton />}
                emptyMessage="No se encontraron razas"
            />
        </div>
    );
}
