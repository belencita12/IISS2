"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Species } from "@/lib/pets/IPet";
import { getSpecies } from "@/lib/pets/getRacesAndSpecies";
import {deleteSpeciesById} from "@/lib/pets/species/deleteSpecieById";
import SearchBar from "@/components/global/SearchBar";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { useRouter } from "next/navigation";
import SpeciesTableSkeleton from "./skeleton/SpecieTableSkeleton";
import SpeciesFormModal from "./SpeciesFormModal";

interface SpeciesListProps {
    token: string | null;
}

export default function SpeciesList({ token }: SpeciesListProps) {
    const router = useRouter();
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10,
    });
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [speciesToEdit, setSpeciesToEdit] = useState<Species | null>(null);


    const loadSpecies = useCallback(async (page = 1, query = "") => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getSpecies(token);
            

            setSpeciesList(data);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalItems: data.length,
                totalPages: Math.ceil(data.length / prev.pageSize),
            }));
        } catch {
            toast("error", "Error al cargar especies");
        } finally {
            setLoading(false);
        }
    }, [token]);

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
            toast("success", "Especie eliminada correctamente.");
            loadSpecies(pagination.currentPage);
        } else {
            toast("error", "No se pudo eliminar la especie.");
        }

        setIsModalOpen(false);
        setSelectedSpecies(null);
    };

    const handleSearch = (query: string) => loadSpecies(1, query);
    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, currentPage: page }));

    const columns: Column<Species>[] = [{ header: "Nombre", accessor: "name" }];

    const actions: TableAction<Species>[] = [
        { icon: <Pencil className="w-4 h-4" />, onClick: (s) => {
            setSpeciesToEdit(s);
            setIsFormOpen(true);
        }, label: "Editar" },
        { icon: <Trash className="w-4 h-4" />, onClick: confirmDelete, label: "Eliminar" },
    ];

    return (
        <div className="w-4/5 mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
                <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Buscar especie..." 
                />
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Especies</h2>
                <Button variant="outline" className="px-6" onClick={() => {
                    setSpeciesToEdit(null);
                    setIsFormOpen(true);}}>
                    Agregar
                </Button>
            </div>

            <GenericTable
                data={speciesList}
                columns={columns}
                actions={actions}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<SpeciesTableSkeleton />}
                emptyMessage="No se encontraron especies"
            />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Especie"
                message={`¿Seguro que quieres eliminar la especie ${selectedSpecies?.name}?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
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
