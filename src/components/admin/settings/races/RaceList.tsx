"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Race, Species } from "@/lib/pets/IPet";
import { getSpecies, getRacesBySpecies } from "@/lib/pets/getRacesAndSpecies";
import { getAllRaces } from "@/lib/pets/getRaces";
import { deleteRaceByID } from "@/lib/pets/deleteRaceByID";
import SearchBar from "@/components/global/SearchBar";
import { Pencil, Trash, Undo2 } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { Modal } from "@/components/global/Modal";
import RaceTableSkeleton from "./skeleton/RaceTableSkeleton";
import { RaceForm } from "./register/RaceForm";
import { useFetch } from "@/hooks/api";
import { RACE_API } from "@/lib/urls";

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
    const [showDeleted, setShowDeleted] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    

    useEffect(() => {
        if (token && species.length === 0) {
            getSpecies(token)
                .then(setSpecies)
                .catch(() => toast("error", "Error al cargar especies"));
        }
    }, [token, species.length]);

    const loadRaces = useCallback(async (pageSize = pagination.pageSize, page = 1, query = "", includeDeleted = showDeleted) => {
        if (!token) return;
        setLoading(true);
        try {
            const racesData = selectedSpecies !== null
                ? await getRacesBySpecies(selectedSpecies, token, includeDeleted)
                : await getAllRaces(token, `page=${page}&size=${pageSize}&includeDeleted=${includeDeleted.toString()}`);

            // Verifica si racesData es un objeto y tiene la propiedad data
            const filteredRaces = Array.isArray(racesData)
            ? query
                ? racesData.filter((race: Race) => race.name.toLowerCase().includes(query.toLowerCase()))
                : racesData
            : query
                ? racesData.data.filter((race: Race) => race.name.toLowerCase().includes(query.toLowerCase()))
                : racesData.data;

            console.log("Raza: ", racesData)

            const totalItems = Array.isArray(racesData) ? racesData.length : racesData.data.length;
            const totalPages = Math.ceil(totalItems / pagination.pageSize);

            setRaces(filteredRaces);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalItems: totalItems,
                totalPages: totalPages,
            }));
        } catch (error: unknown) {
            toast("error", error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setLoading(false);
        }
    }, [token, selectedSpecies]);

    const { patch: restoreRace} = useFetch<Race, null>(
       "",
        token
    );

    useEffect(() => {
        if (token) loadRaces(pagination.pageSize, pagination.currentPage);
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
            loadRaces(pagination.pageSize, pagination.currentPage, "", showDeleted);
        } else {
            toast("error", "No se pudo eliminar la raza.");
        }

        setIsModalOpen(false);
        setSelectedRace(null);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        loadRaces(pagination.pageSize, 1, query, showDeleted);
    };
    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, currentPage: page }));
    const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setSelectedSpecies(Number(event.target.value) || null);

    const toggleDeletedRaces = () => {
        setShowDeleted(!showDeleted);
        loadRaces(pagination.pageSize, 1, searchQuery, !showDeleted);
    };

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
            loadRaces(pagination.pageSize, pagination.currentPage);
        }
    };
    
    
    const handleRestore = async (race: Race) => {
        setIsRestoring(true);
        const { ok, error } = await restoreRace(null, `${RACE_API}/restore/${race.id}`);

        if (!ok) {
            toast("error", error?.message || "Error al restaurar la raza");
            setIsRestoring(false);
            return;
        }

        toast("success", "Raza restaurada con éxito");
        loadRaces(pagination.pageSize, pagination.currentPage, "", showDeleted);
        setIsRestoring(false);
    };

    const columns: Column<Race>[] = [
        { header: "Nombre", accessor: "name" },
        {
            header: "Especie",
            accessor: (race) => species.find(s => s.id === race.speciesId)?.name || "Desconocida",
        },
    ];

    const actions: TableAction<Race>[] = [
        ...(showDeleted ? [{
            icon: <Undo2 className={`w-4 h-4 ${isRestoring ? 'opacity-50' : ''}`} />,
            label: isRestoring ? "Restaurando..." : "Restaurar",
            onClick: (race: Race) => {
                if (!isRestoring) {
                    handleRestore(race);
                }
            },
        }] : [
            { icon: <Pencil className="w-4 h-4" />, onClick: openEditRaceModal, label: "Editar" },
            { icon: <Trash className="w-4 h-4" />, onClick: confirmDelete, label: "Eliminar" },
        ]),
    ];

    return (
        <div className="p-4 mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Buscar raza..."  
                />
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
                <h2 className="text-3xl font-bold">{showDeleted ? "Razas eliminadas" : "Razas"}</h2>
                <div className="flex gap-2">
                    <Button 
                        variant={showDeleted ? "secondary" : "outline"}
                        onClick={toggleDeletedRaces}
                        disabled={isRestoring}
                    >
                        {showDeleted ? "Ver activos" : "Ver eliminados"}
                    </Button>
                    <Button variant="default" className="px-6" disabled={isRestoring} onClick={openRaceModal}>
                        Agregar
                    </Button>
                </div>
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
                    onClose={() => setIsRaceModalOpen(false)} 
                    onSuccess={() => {
                        loadRaces(pagination.pageSize, pagination.currentPage);
                    }}
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