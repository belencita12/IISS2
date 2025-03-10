import { PetData } from "./IPet";
import { PET_API} from "@/lib/urls";  

export const registerPet = async (petData: PetData, token: string) => {
    try {
        const response = await fetch(PET_API, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(petData),
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en registerPet:", error);
        throw error;
    }
};
