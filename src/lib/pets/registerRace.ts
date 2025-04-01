import { RACE_API } from "../urls";

export const registerRace = async (raceData: { name: string; speciesId: number }, token: string) => {
    try {
        const response = await fetch(RACE_API, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json", // 📌 Especificar JSON
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(raceData), // 📌 Enviar JSON en lugar de FormData
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en registerRace:", error);
        throw error;
    }
};
