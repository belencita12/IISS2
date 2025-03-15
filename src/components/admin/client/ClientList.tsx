"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchUsers } from "@/lib/client/getUsers";
import { SearchBar } from "./SearchBar";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import ClientTableSkeleton from "./skeleton/ClientTableSkeleton";

type User = {
    id: number;
    fullName: string;
    email: string;
    petCount?: number; // No está en la API, pero se agrega opcionalmente
};

interface ClientListProps {
    token: string | null;
}

const ClientList: React.FC<ClientListProps> = ({ token }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 4,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);

    // Cargar usuarios cuando el token cambie o cuando se cambie la página
    useEffect(() => {
        if (token) {
            loadUsers(pagination.currentPage);
        }
    }, [token, pagination.currentPage]);

    const loadUsers = async (page: number, query: string = "") => {
        if (!token) return;
        setLoading(true);

        try {
            const results = await fetchUsers(page, query, token);

            // Verificar si no hay resultados y hay una consulta
            if (results.data.length === 0 && query) {
                toast("info", "No se ha encontrado el cliente!");
            }

            // Actualizar el estado de los usuarios y la paginación
            setUsers(results.data.map((user: User) => ({ ...user, petCount: user.petCount ?? 0 })));
            setPagination({
                currentPage: results.currentPage,
                totalPages: results.totalPages,
                totalItems: results.total,
                pageSize: results.size,
            });
        } catch (error) {
            toast("error", "Error al cargar clientes");
            console.error("Error cargando usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        // Reiniciar la paginación a la primera página al realizar una búsqueda
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        loadUsers(1, query);
    };

    const handlePageChange = (page: number) => {
        // Cambiar la página actual y cargar los datos
        setPagination((prev) => ({ ...prev, currentPage: page }));
    };

    const columns: Column<User>[] = [
        { header: "Nombre", accessor: "fullName" },
        { header: "Email", accessor: "email" },
        { header: "Mascotas", accessor: "petCount", className: "text-center" },
    ];

    const actions: TableAction<User>[] = [
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
                <Button variant="outline" className="px-6">Agregar</Button>
            </div>

            <GenericTable
                data={users}
                columns={columns}
                actions={actions}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
                skeleton={<ClientTableSkeleton />}
                emptyMessage="No se encontraron clientes"
            />
        </div>
    );
};

export default ClientList;