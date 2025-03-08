import env from "@/lib/env";
import urls from "@/lib/urls";

export const getSpecies = async (token: string) => {
    try {
        const response = await fetch(`${env.BASE_URL}${urls.SPECIES}?page=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener especies");

        const data = await response.json();
        return data?.data || [];
    } catch (error) {
        console.error("Error en getSpecies:", error);
        throw error;
    }
};

export const getRacesBySpecies = async (speciesId: number, token: string) => {
    try {
        const response = await fetch(`${env.BASE_URL}${urls.RACES}?page=1&speciesId=${speciesId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener razas");

        const data = await response.json();
        return data?.data || [];
    } catch (error) {
        console.error("Error en getRacesBySpecies:", error);
        throw error;
    }
};
