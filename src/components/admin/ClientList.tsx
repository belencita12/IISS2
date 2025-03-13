"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchUsers } from "@/lib/users/getUsers";
import { SearchBar } from "./SearchBar";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/lib/toast"; 


type User = {
    id: number;
    fullName: string;
    email: string;
    petCount: number;
};

interface ClientListProps {
    token: string | null;
}

const ClientList: React.FC<ClientListProps> = ({ token }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query: string, filterType: string) => {
        setLoading(true);
        const results = await fetchUsers(query, filterType, token);
        if (results.length === 0) {
            toast("info", "No se ha encontrado el cliente!");
        }
        setUsers(results);
        setLoading(false);
    };

    return (
        <div className="p-4 mx-auto">
            <SearchBar onSearch={handleSearch} />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Clientes</h2>
                <Button variant="outline" className="px-6">Agregar</Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Cant. de Mascotas</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.petCount}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button size="icon" variant="ghost">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No se encontraron clientes</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ClientList;
