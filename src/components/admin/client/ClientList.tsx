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
    const t = useTranslations();

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
                const results = await fetchUsers(page, query, token, from, to);
                if (!results.data.length && query)
                    toast("info", t("error.notFoundClients"));

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
                if (error instanceof Error) toast("error", error.message);
            } finally {
                setLoading(false);
            }
        },
        [token, from, to]
    );

    useEffect(() => {
        if (token) loadUsers(data.pagination.currentPage);
    }, [token, data.pagination.currentPage, loadUsers, from, to]);

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
            toast("error", t("error.errorLimitDate"));
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
            toast("success", t("success.successDeleteClient", {client : clientToDelete.fullName}));
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            loadUsers(data.pagination.currentPage);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast("error", error.message);
            } else {
                toast("error", t("error.errorDelete", {field: clientToDelete.fullName}));
            }
        }
    };

    const columns: Column<IUserProfile>[] = [
        { header: t("client.details.fullName"), accessor: "fullName" },
        { header: t("client.details.email"), accessor: "email" },
        { header: t("client.details.ruc"), accessor: "ruc" },
        { header: t("client.details.address"), accessor: "adress" },
        { header: t("client.details.phone"), accessor: "phoneNumber" },
    ];

    const actions: TableAction<IUserProfile>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            onClick: (user) => router.push(`/dashboard/clients/${user.id}`),
            label: t("button.seeDetails"),
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            onClick: (user) => router.push(`/dashboard/clients/${user.id}/edit`),
            label: t("button.edit"),
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: handleDeleteClick,
            label: t("button.delete"),
        },
    ];

    return (
        <div className="p-4 mx-auto">
            <SearchBar
                onSearch={handleSearch}
                placeholder={t("search.searchByNameOrRucOrEmail")}
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
                <h2 className="text-3xl font-bold text-gray-800">{t("client.table.title")}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={isGettingReport}
                        className="px-6"
                        onClick={() => router.push("/dashboard/clients/register")}
                    >
                        {t("button.add")}
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
                emptyMessage={t("client.table.emptyMessage")}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t("confirmationModal.client.titleDelete")}
                message={t("confirmationModal.client.messageDelete", {client: clientToDelete?.fullName ?? ""})}
                confirmText={t("button.delete")}
                cancelText={t("button.cancel")}
                variant="danger"
            />
        </div>
    );
}