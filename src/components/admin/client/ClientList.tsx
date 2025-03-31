"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fetchUsers } from "@/lib/client/getUsers";
import SearchBar from "./SearchBar";
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



interface ClientListProps {
    token: string | null;
}

export default function ClientList({ token }: ClientListProps) {
    const router = useRouter();
    const [data, setData] = useState<{
        users: IUserProfile[];
        pagination: PaginationInfo;
    }>({
        users: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 4 },
    });
    const [loading, setLoading] = useState(false);

    const loadUsers = useCallback(
        async (page: number = 1, query: string = "") => {
            if (!token) return;
            setLoading(true);

            try {
                const results = await fetchUsers(page, query, token);
                if (!results.data.length && query)
                    toast("info", "No se ha encontrado el cliente!");
                console.log(results.data);

                setData({
                    users: results.data,
                    pagination: {
                        currentPage: results.currentPage,
                        totalPages: results.totalPages,
                        totalItems: results.total,
                        pageSize: results.size,
                    },
                });
            } catch (error) {
                toast("error", "Error al cargar clientes");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        if (token) loadUsers(data.pagination.currentPage);
    }, [token, data.pagination.currentPage, loadUsers]);

    const handleSearch = (query: string) => loadUsers(1, query);
    const handlePageChange = (page: number) =>
        setData((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, currentPage: page },
        }));

    const columns: Column<IUserProfile>[] = [
        { header: "Nombre", accessor: "fullName" },
        { header: "Email", accessor: "email" },
        { header: "Dirección", accessor: "adress" },
        { header: "Teléfono", accessor: "phoneNumber" },
        { header: "RUC", accessor: "ruc" },

    ];

    const actions: TableAction<IUserProfile>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            onClick: (user) => router.push(`/dashboard/clients/${user.id}`),
            label: "Ver detalles",
        },
        {
            icon: <Pencil className="w-4 h-4" />,
            onClick: (user) => console.log("Editar:", user),
            label: "Editar",
        },
        {
            icon: <Trash className="w-4 h-4" />,
            onClick: (user) => console.log("Eliminar:", user),
            label: "Eliminar",
        },
    ];

    return (
        <div className="p-4 mx-auto">
            <SearchBar onSearch={handleSearch} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Clientes</h2>
                <Button variant="outline" className="px-6" onClick={() => router.push("/dashboard/clients/register")}>
                    Agregar
                </Button>
            </div>
            <GenericTable
                data={data.users}
                columns={columns}
                actions={actions}
                pagination={data.pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<ClientTableSkeleton />}
                emptyMessage="No se encontraron clientes"
            />
        </div>
    );
}


