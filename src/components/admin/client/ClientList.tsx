"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fetchUsers } from "@/lib/client/getUsers";
import { deleteClient } from "@/lib/client/deleteClient";
import SearchBar from "@/components/global/SearchBar";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, {
    Column,
    TableAction,
    PaginationInfo,
} from "@/components/global/GenericTable";
import ClientTableSkeleton from "./skeleton/ClientTableSkeleton";
import { useRouter } from "next/navigation";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { useTranslations } from "next-intl";
import DateFilter from "./filter/ClientDateFilter";
import { getClientReport } from "@/lib/client/getClientReport";
import { downloadFromBlob } from "@/lib/utils";
import ExportButton from "@/components/global/ExportButton";

interface ClientListProps {
    token: string;
}

export default function ClientList({ token }: ClientListProps) {
    const c = useTranslations("ClientList");
    const b = useTranslations("Button");
    const e = useTranslations("Error");
    const m = useTranslations("ModalConfirmation");
    const p = useTranslations("Placeholder")

    const router = useRouter();
    const [data, setData] = useState<{
        users: IUserProfile[];
        pagination: PaginationInfo;
    }>({
        users: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 4 },
    });
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<IUserProfile[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<IUserProfile | null>(null);
    const [from, setFrom] = useState<string | undefined>();
    const [to, setTo] = useState<string | undefined>();
    const [isGettingReport, setIsGettingReport] = useState(false);
    const loadUsers = useCallback(
        async (page: number = 1, query: string = "") => {
            if (!token) return;
            setLoading(true);

            try {
                const results = await fetchUsers(page, query, token);
                if (!results.data.length && query)
                    toast("info", e("notFound"));

                setData({
                    users: results.data,
                    pagination: {
                        currentPage: results.currentPage,
                        totalPages: results.totalPages,
                        totalItems: results.total,
                        pageSize: results.size,
                    },
                });
                setFilteredData(results.data);
            } catch (error: unknown) {
                toast("error", error instanceof Error ? error.message : e("errorLoad", {field: "clientes"}));
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        if (token) loadUsers(data.pagination.currentPage);
    }, [token, data.pagination.currentPage, loadUsers]);

    const handleSearch = useCallback(
        (query: string) => {
            loadUsers(data.pagination.currentPage, query);
        },
        [data.pagination.currentPage, loadUsers]
    );

    const handlePageChange = (page: number) =>
        setData((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, currentPage: page },
        }));

    const handleDeleteClick = (user: IUserProfile) => {
        setClientToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleGetClientReport = async () => {
        if (!from || !to) {
            toast("error", "Se necesitan fechas limites para generar el reporte");
        } else {
            setIsGettingReport(true);
            const result = await getClientReport({
                token,
                from,
                to,
            });
            if (!(result instanceof Blob)) toast("error", result.message);
            else downloadFromBlob(result);
            setIsGettingReport(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;
        try {
            await deleteClient(token, clientToDelete.id);
            toast("success", e("successDelete", {field: "cliente"}));
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            loadUsers(data.pagination.currentPage);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast("error", error.message);
            } else {
                toast("error", e("noDelete", {field: "cliente"}));
            }
        }
    };

    const columns: Column<IUserProfile>[] = [
        { header: c("fullName"), accessor: "fullName" },
        { header: c("email"), accessor: "email" },
        { header: c("ruc"), accessor: "ruc" },
        { header: c("address"), accessor: "adress" },
        { header: c("phone"), accessor: "phoneNumber" },
    ];

    const actions: TableAction<IUserProfile>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            onClick: (user) => router.push(`/dashboard/clients/${user.id}`),
            label: b("seeDetails"),
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            onClick: (user) => router.push(`/dashboard/clients/${user.id}/edit`),
            label: b("edit"),
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: handleDeleteClick,
            label: b("delete"),
        },
    ];

    return (
        <div className="p-4 mx-auto">
            <SearchBar
                onSearch={handleSearch}
                placeholder={p("getBy", {field: "nombre, correo o ruc"})}
                debounceDelay={400}
            />
            <div className="p-2 mb-2">
                <DateFilter
                    to={to}
                    from={from}
                    setDateTo={setTo}
                    setDateFrom={setFrom}
                />
            </div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{c("title")}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={isGettingReport}
                        className="px-6"
                        onClick={() => router.push("/dashboard/clients/register")}
                    >
                        {b("add")}
                    </Button>
                    <ExportButton
                        handleGetReport={handleGetClientReport}
                        isLoading={isGettingReport}
                    />
                </div>
            </div>

            <GenericTable
                data={filteredData}
                columns={columns}
                actions={actions}
                pagination={data.pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<ClientTableSkeleton />}
                emptyMessage={e("notFoundField", {field: "clientes"})}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={m("titleDelete", {field: "cliente"})}
                message={`¿Seguro que quieres eliminar a ${clientToDelete?.fullName}?`}
                confirmText={b("delete")}
                cancelText={b("cancel")}
                variant="danger"
            />
        </div>
    );
}