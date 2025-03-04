const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getPetsByUserId = async (userId: number, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/pet?page=1&size=4&userId=${userId}`, {
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