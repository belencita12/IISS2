import { PET_API} from "@/lib/urls";  

export const getPetsByUserId = async (userId: number, token: string) => {
    try {
        const response = await fetch(`${PET_API}?page=1&size=4&userId=${userId}`, {
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