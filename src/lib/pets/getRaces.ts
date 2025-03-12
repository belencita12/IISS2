import { RACE_API } from "@/lib/urls";

export const getRaces = async (token: string) => {
    try {
        const response = await fetch(`${RACE_API}?page=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener razas");

        const data = await response.json();
        return data?.data || [];
    } catch (error) {
        console.error("Error en getRaces:", error);
        throw error;
    }
};