"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Species } from "@/lib/pets/IPet";
import { getAllSpecies } from "@/lib/pets/getRacesAndSpecies";
import {deleteSpeciesById} from "@/lib/pets/species/deleteSpecieById";
import SearchBar from "@/components/global/SearchBar";
import { Pencil, Trash, Undo2} from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import SpeciesTableSkeleton from "./skeleton/SpecieTableSkeleton";
import SpeciesFormModal from "./SpeciesFormModal";
import { useFetch } from "@/hooks/api";
import { SPECIES_API } from "@/lib/urls";
import { useTranslations } from "next-intl";
import { UnknownKeysParam } from "zod";

interface SpeciesListProps {
    token: string | null;
}

export default function SpeciesList({ token }: SpeciesListProps) {
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10,
    });
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [speciesToEdit, setSpeciesToEdit] = useState<Species | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showDeleted, setShowDeleted] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const t = useTranslations();

    const loadSpecies = useCallback(async (page = 1, query = "", includeDeleted = showDeleted) => {
        if (!token) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({page: page.toString()});
            
            if(query.trim() !== "") {
                params.append("name", query.trim());
            }
            params.append("includeDeleted",  includeDeleted.toString())
            
            const response = await getAllSpecies(token, params.toString());

            setSpeciesList(response.data);
            setPagination(prev => ({
                ...prev,
                currentPage: response.currentPage,
                totalItems: response.totalPages,
                totalPages: response.totalPages,
                pageSize: pagination.pageSize,
            }));
        } catch (error : unknown){
            if (error instanceof Error) toast("error", error.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const { patch: restoreSpecie} = useFetch<Species, null>(
       "",
        token
    );
    useEffect(() => {
        if (token) loadSpecies(pagination.currentPage);
    }, [token, pagination.currentPage, loadSpecies]);

    const confirmDelete = (species: Species) => {
        setSelectedSpecies(species);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedSpecies) return;

        const success = await deleteSpeciesById(token || "", selectedSpecies.id);
        if (success) {
            toast("success", t("success.successDeleteSpecie"));
            loadSpecies(pagination.currentPage);
        } else {
            toast("error", t("error.errorDeleteSpecie"));
        }

        setIsModalOpen(false);
        setSelectedSpecies(null);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadSpecies(1, query, showDeleted);
    }
    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        loadSpecies(page, searchQuery, showDeleted);
    };
    const handleRestore = async (specie: Species) => {
        setIsRestoring(true)
        const { ok, error } = await restoreSpecie(null, `${SPECIES_API}/restore/${specie.id}`);

        if (!ok) {
            return toast("error", error?.message || t("error.errorRestoreSpecie"));
        }

        toast("success", t("success.successRestoreSpecie"));
        loadSpecies(pagination.currentPage, searchQuery, showDeleted);
        setIsRestoring(false);
    };

    const toggleDeletedSpecies =  () => {
        setShowDeleted(!showDeleted);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadSpecies(1, searchQuery, !showDeleted);
    }

    const columns: Column<Species>[] = [{ header: t("species.table.name"), accessor: "name" }];

    const actions: TableAction<Species>[] = [
    ...(showDeleted
      ? [
          {
            icon: <Undo2 className={`w-4 h-4 ${isRestoring ? 'opacity-50' : ''}`} />,
            label: isRestoring ? t("button.restoring") : t("button.restore"),
            onClick: (specie: Species) => {
              if (!isRestoring) {
                handleRestore(specie);
              }
            },
          },
        ]
      : [
        { icon: <Pencil className="w-4 h-4" />, onClick: (s: Species) => {
            setSpeciesToEdit(s);
            setIsFormOpen(true);
        }, label: t("button.edit") },
        { icon: <Trash className="w-4 h-4" />, onClick: confirmDelete, label: t("button.delete") },
        ]),
    ];

    return (
        <div className="mx-auto p-4">
            <div className="flex items-center gap-4 mb-4">
                <SearchBar 
                    onSearch={handleSearch} 
                    placeholder={t("search.searchByName")} 
                />
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{showDeleted ? t("species.table.titleDeleted") : t("species.table.title")}</h2>
                <div className="flex gap-2">
                    <Button 
                        variant={showDeleted ? "secondary" : "outline"}
                        onClick={toggleDeletedSpecies}
                        disabled={isRestoring}
                    >
                        {showDeleted ? t("button.seeActive") : t("button.seeDeleted")}
                    </Button>
                    <Button variant="default" className="px-6" disabled={isRestoring} onClick={() => {
                        setSpeciesToEdit(null);
                        setIsFormOpen(true);}}>
                        {t("button.add")}
                    </Button>
                </div>
            </div>

            <GenericTable
                data={speciesList}
                columns={columns}
                actions={actions}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<SpeciesTableSkeleton />}
                emptyMessage={t("species.table.emptyMessage")}
            />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={t("confirmationModal.species.titleDelete")}
                message={t("confirmationModal.species.messageDelete", {specie: selectedSpecies?.name ?? ""})}
                confirmText={t("button.delete")}
                cancelText={t("button.cancel")}
                variant="danger"
            />

            <SpeciesFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                token={token || ""}
                onSuccess={() => loadSpecies(pagination.currentPage)}
                defaultValues={speciesToEdit}
            />

        </div>
    );
}
