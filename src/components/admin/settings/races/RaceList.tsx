"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Race, Species } from "@/lib/pets/IPet";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";
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
import { SpeciesFilter } from "@/components/admin/settings/pets/filter/SpeciesFilter";
import { useTranslations } from "next-intl";

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

    const t = useTranslations();
    

    useEffect(() => {
        if (token && species.length === 0) {
            getSpecies(token)
                .then(setSpecies)
                .catch((error: unknown) => {
                    if (error instanceof Error) {
                        toast("error", error.message);
                    }
                });
        }
    }, [token, species.length]);

    const loadRaces = useCallback(async (pageSize = pagination.pageSize, page = 1, query = searchQuery, includeDeleted = showDeleted) => {
        if (!token) return;
        setLoading(true);
        try {
            // Construir los parámetros de consulta
            const queryParams = `page=${page}&size=${pageSize}&includeDeleted=${includeDeleted.toString()}` + 
                                (selectedSpecies !== null ? `&speciesId=${selectedSpecies}` : '') +
                                (query.trim() ? `&name=${query.trim()}` : '');

            // Llamar a getAllRaces con los parámetros de consulta
            const racesData = await getAllRaces(token, queryParams);

            setRaces(racesData.data);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalItems: racesData.size,
                totalPages: racesData.totalPages,
            }));
        } catch (error: unknown) {
            if (error instanceof Error) toast("error", error.message);
        } finally {
            setLoading(false);
        }
    }, [token, selectedSpecies]);

    const { patch: restoreRace} = useFetch<Race, null>(
       "",
        token
    );

    useEffect(() => {
        if (token) loadRaces(pagination.pageSize, pagination.currentPage, searchQuery, showDeleted);
    }, [token, pagination.currentPage, searchQuery, showDeleted, loadRaces]);

    const confirmDelete = (race: Race) => {
        setSelectedRace(race);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedRace) return;

        const success = await deleteRaceByID(token || "", selectedRace.id);
        if (success) {
            toast("success", t("success.successDeleteRace"));
            loadRaces(pagination.pageSize, pagination.currentPage, searchQuery, showDeleted);
        } else {
            toast("error", t("error.errorDeleteRace"));
        }

        setIsModalOpen(false);
        setSelectedRace(null);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadRaces(pagination.pageSize, 1, query, showDeleted);
    };
    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, currentPage: page }));

    const handleSpeciesFilter = (speciesId: number | null) => {
        setSelectedSpecies(speciesId);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

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
            toast("error", error?.message || t("error.errorRestoreRace"));
            setIsRestoring(false);
            return;
        }

        toast("success", t("success.successRestoreRace"));
        loadRaces(pagination.pageSize, pagination.currentPage, "", showDeleted);
        setIsRestoring(false);
    };

    const columns: Column<Race>[] = [
        { header: t("races.table.name"), accessor: "name" },
        {
            header: t("races.table.specie"),
            accessor: (race) => race.species?.name || t("error.noSpecified"),
        },
    ];

    const actions: TableAction<Race>[] = [
        ...(showDeleted ? [{
            icon: <Undo2 className={`w-4 h-4 ${isRestoring ? 'opacity-50' : ''}`} />,
            label: isRestoring ? t("button.restoring") : t("button.restore"),
            onClick: (race: Race) => {
                if (!isRestoring) {
                    handleRestore(race);
                }
            },
        }] : [
            { icon: <Pencil className="w-4 h-4" />, onClick: openEditRaceModal, label: t("button.edit") },
            { icon: <Trash className="w-4 h-4" />, onClick: confirmDelete, label:t("button.delete") },
        ]),
    ];

    return (
        <div className="p-4 mx-auto">
            <div className="flex flex-col items-start gap-4 mb-4">
                <SearchBar 
                    onSearch={handleSearch} 
                    placeholder={t("search.searchByName")}  
                />
                <div className="w-48">
                    <SpeciesFilter
                        token={token as string}
                        onSelectSpecies={handleSpeciesFilter}
                        selectedSpeciesId={selectedSpecies}
                    />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:gap-0 gap-4 my-4">
                <h2 className="text-3xl font-bold">{showDeleted ? t("races.table.titleDeleted") : t("races.table.title")}</h2>
                <div className="flex gap-2">
                    <Button 
                        variant={showDeleted ? "secondary" : "outline"}
                        onClick={toggleDeletedRaces}
                        disabled={isRestoring}
                    >
                        {showDeleted ? t("button.seeActive") : t("button.seeDeleted")}
                    </Button>
                    <Button variant="default" className="px-6" disabled={isRestoring} onClick={openRaceModal}>
                        {t("button.add")}
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
                emptyMessage={t("races.table.emptyMessage")}
            />

                <Modal isOpen={isRaceModalOpen} onClose={closeRaceModal} title={editingRace ? t("races.table.titleEdit"): t("races.table.titleRegister")}>
                <RaceForm 
                    token={token || ""} 
                    isOpen={isRaceModalOpen} 
                    onClose={() => setIsRaceModalOpen(false)} 
                    onSuccess={() => {
                        loadRaces(pagination.pageSize, pagination.currentPage, searchQuery, showDeleted);
                    }}
                    initialData={editingRace}
                    />
                </Modal>


            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={t("confirmationModal.races.titleDelete")}
                message={t("confirmationModal.races.messageDelete", {race : selectedRace?.name ?? ""})}
                confirmText={t("button.delete")}
                cancelText={t("button.cancel")}
                variant="danger"
            />
        </div>
    );
}