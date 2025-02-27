import { PetData } from "../pets/IPet";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerPet = async (petData: PetData) => {
    try {
        const response = await fetch(`${API_URL}/pet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(petData),
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en registerPet:", error);
        throw error;
    }
};

