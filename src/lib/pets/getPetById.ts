import { PET_API } from "../urls";
import { PetData } from "./IPet";

export async function getPetById(id: number, token: string) {
    try {
        const res = await fetch(`${PET_API}/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if(res.status === 404) return null;
        const data = await res.json();
        return data as PetData;
        } catch (error) {
        console.error(error);
        return null;        
    }
}