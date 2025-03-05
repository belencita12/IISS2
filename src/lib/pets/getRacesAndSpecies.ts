const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getSpecies = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/species?page=1`, {
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
        const response = await fetch(`${BASE_URL}/race?page=1&speciesId=${speciesId}`, {
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
