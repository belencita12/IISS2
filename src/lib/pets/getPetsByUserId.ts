import env from "@/lib/env";
import urls from "@/lib/urls";

export const getPetsByUserId = async (userId: number, token: string) => {
    try {
        const response = await fetch(`${env.BASE_URL}${urls.PETS}?page=1&size=4&userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener las mascotas");

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error en obtener mascotas por usuario", error);
        throw error;
    }
};