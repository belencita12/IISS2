"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Race, Species } from "@/lib/pets/IPet";
import { getSpecies, getRacesBySpecies } from "@/lib/pets/getRacesAndSpecies";
import { getRaces } from "@/lib/pets/getRaces";
import { deleteRaceByID } from "@/lib/pets/deleteRaceByID";
import SearchBar from "@/components/global/SearchBar";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { Modal } from "@/components/global/Modal";
import RaceTableSkeleton from "./skeleton/RaceTableSkeleton";
import { RaceForm } from "./register/RaceForm";

interface RaceListProps {
    token: string | null;
}

export default function RaceList({ token }: RaceListProps) {
    const [races, setRaces] = useState<Race[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10,
    });
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRaceModalOpen, setIsRaceModalOpen] = useState(false);
    const [editingRace, setEditingRace] = useState<Race | null>(null);
    const [loading, setLoading] = useState(false);
    const [species, setSpecies] = useState<Species[]>([]);
    const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);
    

    useEffect(() => {
        if (token && species.length === 0) {
            getSpecies(token)
                .then(setSpecies)
                .catch(() => toast("error", "Error al cargar especies"));
        }
    }, [token, species.length]);

    const loadRaces = useCallback(async (page = 1, query = "") => {
        if (!token) return;
        setLoading(true);
        try {
            const racesData = selectedSpecies !== null
                ? await getRacesBySpecies(selectedSpecies, token)
                : await getRaces(token);

            const filteredRaces = query
                ? racesData.filter((race: Race) => race.name.toLowerCase().includes(query.toLowerCase()))
                : racesData;

            setRaces(filteredRaces);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalItems: filteredRaces.length,
                totalPages: Math.ceil(filteredRaces.length / prev.pageSize),
            }));
        } catch (error: unknown) {
            toast("error", error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setLoading(false);
        }
    }, [token, selectedSpecies]);

    useEffect(() => {
        if (token) loadRaces(pagination.currentPage);
    }, [token, pagination.currentPage, loadRaces]);

    const confirmDelete = (race: Race) => {
        setSelectedRace(race);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedRace) return;

        const success = await deleteRaceByID(token || "", selectedRace.id);
        if (success) {
            toast("success", "Raza eliminada correctamente.");
            loadRaces(pagination.currentPage);
        } else {
            toast("error", "No se pudo eliminar la raza.");
        }

        setIsModalOpen(false);
        setSelectedRace(null);
    };

    const handleSearch = (query: string) => loadRaces(1, query);
    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, currentPage: page }));
    const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setSelectedSpecies(Number(event.target.value) || null);

    const openRaceModal = () => {
        setEditingRace(null);
        setIsRaceModalOpen(true);
    };
    
    const openEditRaceModal = (race: Race) => {
        setEditingRace(race);
        setIsRaceModalOpen(true);
    };
    const closeRaceModal = (shouldRefresh = true) => {
        setIsRaceModalOpen(false);
        if (shouldRefresh) {
            loadRaces(pagination.currentPage);
        }
    };
    
    
    const columns: Column<Race>[] = [
        { header: "Nombre", accessor: "name" },
        {
            header: "Especie",
            accessor: (race) => species.find(s => s.id === race.speciesId)?.name || "Desconocida",
        },
    ];

    const actions: TableAction<Race>[] = [
        { icon: <Pencil className="w-4 h-4" />, onClick: openEditRaceModal, label: "Editar" },
        { icon: <Trash className="w-4 h-4" />, onClick: confirmDelete, label: "Eliminar" },
    ];

    return (
        <div className="p-4 mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <SearchBar onSearch={handleSearch} placeholder="Buscar raza..." manualSearch={true} />
                <div className="flex items-center gap-2">
                    <label className="font-semibold">Filtrar por especie:</label>
                    <select className="border p-2" onChange={handleSpeciesChange}>
                        <option value="">Todas</option>
                        {species.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Razas</h2>
                <Button variant="outline" className="px-6" onClick={openRaceModal}>
                    Agregar
                </Button>
            </div>

            <GenericTable
                data={races}
                columns={columns}
                actions={actions}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<RaceTableSkeleton />}
                emptyMessage="No se encontraron razas"
            />

                <Modal isOpen={isRaceModalOpen} onClose={closeRaceModal} title={editingRace ? "Editar Raza" : "Agregar Raza"}>
                    <RaceForm 
                        token={token || ""} 
                        isOpen={isRaceModalOpen} 
                        onClose={() => closeRaceModal(true)} // Ahora pasa true solo si se necesita actualizar
                        initialData={editingRace} 
                    />
                </Modal>


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