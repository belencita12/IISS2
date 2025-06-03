import { CLIENT_API } from "../urls";

export const fetchUsers = async (page: number, query: string, token: string | null, from?: string, to?: string) => {
    try {
        let url = query
            ? `${CLIENT_API}?page=${page}&query=${encodeURIComponent(query)}`
            : `${CLIENT_API}?page=${page}&size=7`;
        if (from) url += `&from=${encodeURIComponent(from)}`;
        if (to) url += `&to=${encodeURIComponent(to)}`;

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener los usuarios");

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};