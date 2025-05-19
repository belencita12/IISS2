
import { PET_API} from "@/lib/urls";  

export const registerPet = async (petData: FormData, token: string) => {
    try {
        const response = await fetch(PET_API, { 
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: petData,
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        throw error;
    }
};
