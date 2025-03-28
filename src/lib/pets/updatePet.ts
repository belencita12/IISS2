
import { PET_API } from "@/lib/urls";  

export const updatePet = async (petId: number, petData: FormData, token: string) => {
    try {
        const response = await fetch(`${PET_API}/${petId}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: petData,
    });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en registerPet:", error);
        throw error;
    }
};
