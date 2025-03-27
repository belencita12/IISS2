"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getSpecies, getRacesBySpecies} from "@/lib/pets/getRacesAndSpecies";
import { getRaces } from "@/lib/pets/getRaces";
import { deleteRaceByID } from "@/lib/pets/deleteRaceByID";
import SearchBar from "@/components/global/SearchBar";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import RaceTableSkeleton from "./skelenton/RaceTableSkeleton";
import { useRouter } from "next/navigation";


export interface RaceWithSpecies {
    id: number;
    name: string;
    speciesName: string;
    speciesId: number; 
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
    const [selectedRace, setSelectedRace] = useState<RaceWithSpecies | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);
    const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);

    const loadRaces = useCallback(async (page: number = 1, query: string = "") => {
        if (!token) return;
        setLoading(true);

        try {
            if (species.length === 0) {
                const speciesData = await getSpecies(token);
                setSpecies(speciesData);
            }

            const races = selectedSpecies !== null
                ? await getRacesBySpecies(selectedSpecies, token)
                : await getRaces(token);

            const filteredRaces = query
                ? races.filter((race: RaceWithSpecies) =>
                      race.name.toLowerCase().includes(query.toLowerCase())
                  )
                : races;

            setData({
                races: filteredRaces.map((race: RaceWithSpecies) => ({
                    ...race,
                    speciesName: species.find((s) => s.id === race.speciesId)?.name || "Desconocida",
                })),
                pagination: { currentPage: page, totalPages: 1, totalItems: filteredRaces.length, pageSize: 10 },
            });
        } catch (error) {
            toast("error", "Error al cargar razas");
            console.error("Error cargando razas:", error);
        } finally {
            setLoading(false);
        }
    }, [token, species, selectedSpecies]);

    useEffect(() => {
        if (token) loadRaces(data.pagination.currentPage);
    }, [token, data.pagination.currentPage, loadRaces]);

    const confirmDelete = (race: RaceWithSpecies) => {
          setSelectedRace(race);
          setIsModalOpen(true);
        };
        
    const handleDelete = async () => {
        if (!selectedRace) return;
          
        const success = selectedRace.id !== undefined 
            ? await deleteRaceByID(token || "", selectedRace.id) 
            : false;
        
        if (success) {
            toast("success", "Raza eliminada correctamente.");
            loadRaces(data.pagination.currentPage);
          } else {
            toast("error", "No se pudo eliminar la raza.");
          }
        
          setIsModalOpen(false);
          setSelectedRace(null);
        };

    const handleSearch = (query: string) => loadRaces(1, query);
    const handlePageChange = (page: number) => setData((prev) => ({ ...prev, pagination: { ...prev.pagination, currentPage: page } }));
    const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedSpecies(Number(event.target.value) || null);

    const columns: Column<RaceWithSpecies>[] = [
        { header: "Nombre", accessor: "name" },
        { header: "Especie", accessor: "speciesName" },
    ];

    const actions: TableAction<RaceWithSpecies>[] = [
        { icon: <Pencil className="w-4 h-4" />, onClick: (race) => console.log("Editar:", race), label: "Editar" },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: confirmDelete, 
            label: "Eliminar",
          },
    ];

    return (
        <div className="p-4 mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <SearchBar onSearch={handleSearch} placeholder="Buscar raza..." manualSearch={true} />
                <div className="flex items-center gap-2">
                    <label className="font-semibold">Filtrar por especie:</label>
                    <select className="border p-2" onChange={handleSpeciesChange}>
                        <option value="">Todas</option>
                        {species.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Razas</h2>
                <Button variant="outline" className="px-6" onClick={() => router.push("/dashboard/races/register")}>
                    Agregar
                </Button>
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
             <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Raza"
                message={`¿Seguro que quieres eliminar la raza ${selectedRace?.name}?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}
