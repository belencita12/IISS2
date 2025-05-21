"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, {
    type Column,
    type TableAction,
    type PaginationInfo,
} from "@/components/global/GenericTable";
import VaccineTableSkeleton from "../vaccine/skeleton/VaccineTableSkeleton";
import { useRouter } from "next/navigation";
import {
    getManufacturers,
    deleteManufacturer,
} from "@/lib/vaccine-manufacturer/getVaccineManufacturerById";
import SearchBar from "@/components/global/SearchBar";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { useTranslations } from "next-intl";
import ManufacturerFormModal from "@/components/admin/vaccine-manufacturer/VaccineManufacturerFormModal"

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
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            pageSize: 4,
        },
    });

    const mf = useTranslations("ManufacturerTable");
    const b = useTranslations("Button");
    const e = useTranslations("Error");
    const s = useTranslations("Success");
    const m = useTranslations("ModalConfirmation");
    const ph = useTranslations("Placeholder");

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [manufacturerToDelete, setManufacturerToDelete] =
        useState<Manufacturer | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedManufacturer, setSelectedManufacturer] =
        useState<Manufacturer | null>(null);

    const loadManufacturers = useCallback(
        async (page = 1, query = "") => {
            if (!token) return;
            setLoading(true);
            try {
                const results = await getManufacturers(token, page, query);
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
        [token]
    );

    useEffect(() => {
        if (token && searchQuery === "") {
            loadManufacturers(data.pagination.currentPage);
        }
    }, [token, data.pagination.currentPage, searchQuery, loadManufacturers]);

    useEffect(() => {
        if (token && searchQuery !== "") {
            loadManufacturers(1, searchQuery);
        }
    }, [token, searchQuery, loadManufacturers]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handlePageChange = (page: number) =>
        setData((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, currentPage: page },
        }));

    const handleAddManufacturer = () => {
        setSelectedManufacturer(null);
        setIsFormModalOpen(true);
    };

    const handleEditManufacturer = (manufacturer: Manufacturer) => {
        setSelectedManufacturer(manufacturer);
        setIsFormModalOpen(true);
    };

    const columns: Column<Manufacturer>[] = [
        { header: mf("name"), accessor: "name" },
    ];

    const actions: TableAction<Manufacturer>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            onClick: (manufacturer) =>
                router.push(
                    `/dashboard/vaccine/manufacturer/${manufacturer.id}`
                ),
            label: b("seeDetails"),
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            onClick: handleEditManufacturer,
            label: b("edit"),
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: (manufacturer) => {
                setManufacturerToDelete(manufacturer);
                setIsDeleteModalOpen(true);
            },
            label: b("delete"),
        },
    ];

    const handleConfirmDelete = async () => {
        if (!manufacturerToDelete) return;
        try {
            await deleteManufacturer(token, manufacturerToDelete.id);
            toast("success", "Fabricante eliminado exitosamente");

            const currentPage = data.pagination.currentPage;
            const isLastItemOnPage = data.manufacturers.length === 1;
            const newPage =
                isLastItemOnPage && currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            await loadManufacturers(newPage, searchQuery);
        } catch (error) {
            if (error instanceof Error) {
                toast("error", error.message);
            }
        } finally {
            setIsDeleteModalOpen(false);
            setManufacturerToDelete(null);
        }
    };

    return (
        <div className="p-4 mx-auto">
            <SearchBar
                onSearch={handleSearch}
                placeholder={ph("getBy", {field : "nombre"})}
                debounceDelay={400}
            />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{mf("titleManufacturers")}</h2>
                <Button
                    className="border border-gray-300 hover:bg-gray-800"
                    onClick={handleAddManufacturer}
                >
                    {b("add")}
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
                emptyMessage={e("notFoundField", {field: "fabricantes"})}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={m("titleDelete", {field : "fabricante"})}
                message={m("deleteMessage", {field : manufacturerToDelete?.name ?? ""})}
                confirmText={b("delete")}
                cancelText={b("cancel")}
                variant="danger"
            />

            <ManufacturerFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSuccess={() =>
                    loadManufacturers(data.pagination.currentPage, searchQuery)
                }
                initialData={selectedManufacturer}
                token={token}
            />
        </div>
    );
}
