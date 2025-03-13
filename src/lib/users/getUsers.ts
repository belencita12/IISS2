import { BASE_API_URL } from "../env";

export const fetchUsers = async (query: string, filterType: string, token: string | null) => {
    if (!token) return [];

    try {
        const response = await fetch(`${BASE_API_URL}/user?page=1&${filterType}=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener los usuarios");

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error en obtener filtrado de usuario", error);
        return [];
    }
};
