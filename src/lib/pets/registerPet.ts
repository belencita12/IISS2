import { PetData } from "./IPet";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const registerPet = async (petData: PetData, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/pet`, {
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
