import { PET_API} from "@/lib/urls";  
import { PetDataResponse } from "./IPet";

export const getPetsByUserId = async (userId: number, token: string) => {
    try {
        const response = await fetch(`${PET_API}?page=4&userId=${userId}`, {
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


export const getPetsByUserIdFull = async (userId: number, token: string,page=1) => {
    try {
        const response = await fetch(`${PET_API}?page=${page}&userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener las mascotas");

        const data = await response.json();
        return data as PetDataResponse;
    } catch (error) {
        console.error("Error en obtener mascotas por usuario", error);
        throw error;
    }
};