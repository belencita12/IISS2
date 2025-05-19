import { PET_API } from "../urls";
import { PetData } from "./IPet";

export async function getPetById(id: number, token: string) {
    try {
        const res = await fetch(`${PET_API}/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (res.status === 404) return null;
        
        const data = await res.json();
        
        // Verificar si el objeto está vacío o si faltan datos esenciales
        if (!data || !data.id || !data.name) {
            return null;
        }
        return data as PetData;
    } catch (error) {
        return null;        
    }
}