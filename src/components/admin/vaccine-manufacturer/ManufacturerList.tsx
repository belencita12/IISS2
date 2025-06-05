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

    const t = useTranslations();
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
                    throw new Error(t("error.apiResponseIsNotArray"));
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
            } catch (error: unknown) {
                if (error instanceof Error) toast("error", error.message);
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
        { header: t("manufacturer.table.name"), accessor: "name" },
    ];

    const actions: TableAction<Manufacturer>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            onClick: (manufacturer) =>
                router.push(
                    `/dashboard/vaccine/manufacturer/${manufacturer.id}`
                ),
            label: t("button.seeDetails"),
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            onClick: handleEditManufacturer,
            label: t("button.edit"),
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: (manufacturer) => {
                setManufacturerToDelete(manufacturer);
                setIsDeleteModalOpen(true);
            },
            label: t("button.delete"),
        },
    ];

    const handleConfirmDelete = async () => {
        if (!manufacturerToDelete) return;
        try {
            await deleteManufacturer(token, manufacturerToDelete.id);
            toast("success", t("success.successDeleteManufacturer"));

            const currentPage = data.pagination.currentPage;
            const isLastItemOnPage = data.manufacturers.length === 1;
            const newPage =
                isLastItemOnPage && currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            await loadManufacturers(newPage, searchQuery);
        } catch (error: unknown) {
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
                placeholder={t("search.searchByName")}
                debounceDelay={400}
            />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{t("manufacturer.table.title")}</h2>
                <Button
                    className="border border-gray-300 hover:bg-gray-800"
                    onClick={handleAddManufacturer}
                >
                    {t("button.add")}
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
                emptyMessage={t("manufacturer.table.emptyMessage")}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t("confirmationModal.manufacturer.titleDelete")}
                message={t("confirmationModal.manufacturer.messageDelete", { manufacturer: manufacturerToDelete?.name ?? "" })}
                confirmText={t("button.delete")}
                cancelText={t("button.cancel")}
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
