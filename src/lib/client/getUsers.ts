import { CLIENT_API } from "../urls";

export const fetchUsers = async (page: number, query: string, token: string | null) => {
    if (!token) return { data: [], currentPage: 1, totalPages: 1, total: 0, size: 10 };

    try {
        const url = query
            ? `${CLIENT_API}?page=${page}&query=${encodeURIComponent(query)}&role=USER`
            : `${CLIENT_API}?page=${page}&role=USER`;

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener los usuarios");

        const data = await response.json();
        console.log("Respuesta del backend:", data);
        return {
            data: data.data || [], // Si `data.data` no está definido, devuelve un array vacío
            currentPage: data.currentPage || 1,
            totalPages: data.totalPages || 1,
            total: data.total || 0,
            size: data.size || 10,
        };
    } catch (error) {
        console.error("Error en obtener filtrado de usuario", error);
        return { data: [], currentPage: 1, totalPages: 1, total: 0, size: 10 };
    }
};